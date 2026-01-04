import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

/**
 * 提交文件更改到用户的 fork
 * 支持单个文件或批量文件提交
 */
export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated. Please login first.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      files, // Array of { path: string, content: string }
      message,
      branch = 'main',
    } = body;

    if (!files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json(
        { error: 'No files provided' },
        { status: 400 }
      );
    }

    if (!message) {
      return NextResponse.json(
        { error: 'Commit message is required' },
        { status: 400 }
      );
    }

    const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';
    const octokit = new Octokit({ auth: token });

    // 获取当前用户
    const { data: user } = await octokit.users.getAuthenticated();

    // 检查 fork 是否存在
    let forkExists = false;
    try {
      await octokit.repos.get({
        owner: user.login,
        repo,
      });
      forkExists = true;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return NextResponse.json(
          { error: 'Fork not found. Please fork the repository first.' },
          { status: 404 }
        );
      }
      throw error;
    }

    if (!forkExists) {
      return NextResponse.json(
        { error: 'Fork not found. Please fork the repository first.' },
        { status: 404 }
      );
    }

    // 获取当前分支的最新 commit
    const { data: ref } = await octokit.git.getRef({
      owner: user.login,
      repo,
      ref: `heads/${branch}`,
    });

    const latestCommitSha = ref.object.sha;

    // 获取最新 commit 的 tree
    const { data: latestCommit } = await octokit.git.getCommit({
      owner: user.login,
      repo,
      commit_sha: latestCommitSha,
    });

    // 创建新的 blobs 和 tree entries
    const treeEntries = await Promise.all(
      files.map(async (file: { path: string; content: string }) => {
        const { data: blob } = await octokit.git.createBlob({
          owner: user.login,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });

        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );

    // 创建新的 tree
    const { data: newTree } = await octokit.git.createTree({
      owner: user.login,
      repo,
      base_tree: latestCommit.tree.sha,
      tree: treeEntries,
    });

    // 创建新的 commit
    const { data: newCommit } = await octokit.git.createCommit({
      owner: user.login,
      repo,
      message,
      tree: newTree.sha,
      parents: [latestCommitSha],
    });

    // 更新分支引用
    await octokit.git.updateRef({
      owner: user.login,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });

    return NextResponse.json({
      success: true,
      message: 'Changes committed successfully',
      commit: {
        sha: newCommit.sha,
        url: newCommit.html_url,
        message: newCommit.message,
      },
      filesChanged: files.length,
    });
  } catch (error: unknown) {
    console.error('Commit error:', error);

    // 处理速率限制
    if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to commit changes',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 简化的单文件提交 API（兼容旧接口）
 */
export async function PUT(request: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated. Please login first.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const {
      path: filePath,
      content,
      message,
      branch = 'main',
    } = body;

    if (!filePath || !content) {
      return NextResponse.json(
        { error: 'File path and content are required' },
        { status: 400 }
      );
    }

    const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';
    const octokit = new Octokit({ auth: token });

    const { data: user } = await octokit.users.getAuthenticated();

    // 获取文件当前的 SHA（如果存在）
    let sha: string | undefined;
    try {
      const { data: file } = await octokit.repos.getContent({
        owner: user.login,
        repo,
        path: filePath,
        ref: branch,
      });

      if ('sha' in file) {
        sha = file.sha;
      }
    } catch (error: unknown) {
      // 文件不存在，创建新文件
      if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
        throw error;
      }
    }

    // 创建或更新文件
    const { data } = await octokit.repos.createOrUpdateFileContents({
      owner: user.login,
      repo,
      path: filePath,
      message: message || `Update ${filePath}`,
      content: Buffer.from(content).toString('base64'),
      branch,
      ...(sha && { sha }),
    });

    return NextResponse.json({
      success: true,
      message: sha ? 'File updated successfully' : 'File created successfully',
      commit: {
        sha: data.commit.sha,
        url: data.commit.html_url,
        message: data.commit.message,
      },
    });
  } catch (error: unknown) {
    console.error('File update error:', error);

    if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to update file',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
