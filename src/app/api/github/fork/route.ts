import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

/**
 * Fork 仓库到用户账户
 * 如果已经 fork 过，返回现有 fork 的信息
 */
export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    return NextResponse.json(
      { error: 'Not authenticated. Please login first.' },
      { status: 401 }
    );
  }

  const owner = process.env.GITHUB_REPO_OWNER || 'NatureBlueee';
  const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';

  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'Repository configuration missing' },
      { status: 500 }
    );
  }

  const octokit = new Octokit({ auth: token });

  try {
    // 获取当前用户信息
    const { data: user } = await octokit.users.getAuthenticated();

    // 检查用户是否已经 fork 过这个仓库
    try {
      const { data: existingFork } = await octokit.repos.get({
        owner: user.login,
        repo,
      });

      // 检查这个仓库是否真的是一个 fork，并且来源是正确的仓库
      if (existingFork.fork && existingFork.parent?.full_name === `${owner}/${repo}`) {
        return NextResponse.json({
          success: true,
          message: 'Fork already exists',
          fork: {
            url: existingFork.html_url,
            cloneUrl: existingFork.clone_url,
            sshUrl: existingFork.ssh_url,
            defaultBranch: existingFork.default_branch,
            owner: user.login,
            name: repo,
          },
          isNew: false,
        });
      }
    } catch (error: unknown) {
      // Fork 不存在，继续创建
      // 404 错误表示仓库不存在，这是预期的
      if (error && typeof error === 'object' && 'status' in error && error.status !== 404) {
        throw error;
      }
    }

    // 创建新的 fork
    const { data: newFork } = await octokit.repos.createFork({
      owner,
      repo,
    });

    // Fork 创建是异步的，可能需要一些时间
    // 等待 fork 完成（轮询检查）
    let forkReady = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!forkReady && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待 1 秒

      try {
        await octokit.repos.get({
          owner: user.login,
          repo,
        });
        forkReady = true;
      } catch {
        attempts++;
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Fork created successfully',
      fork: {
        url: newFork.html_url,
        cloneUrl: newFork.clone_url,
        sshUrl: newFork.ssh_url,
        defaultBranch: newFork.default_branch,
        owner: user.login,
        name: repo,
      },
      isNew: true,
    });
  } catch (error: unknown) {
    console.error('Fork creation error:', error);

    // 处理速率限制错误
    if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to fork repository',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 获取 fork 状态
 * 检查用户是否已经 fork 了仓库
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      hasFork: false,
    });
  }

  const owner = process.env.GITHUB_REPO_OWNER || 'NatureBlueee';
  const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';

  const octokit = new Octokit({ auth: token });

  try {
    const { data: user } = await octokit.users.getAuthenticated();

    try {
      const { data: fork } = await octokit.repos.get({
        owner: user.login,
        repo,
      });

      if (fork.fork && fork.parent?.full_name === `${owner}/${repo}`) {
        return NextResponse.json({
          authenticated: true,
          hasFork: true,
          fork: {
            url: fork.html_url,
            cloneUrl: fork.clone_url,
            defaultBranch: fork.default_branch,
            owner: user.login,
            name: repo,
          },
        });
      }
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'status' in error && error.status === 404) {
        return NextResponse.json({
          authenticated: true,
          hasFork: false,
        });
      }
      throw error;
    }

    return NextResponse.json({
      authenticated: true,
      hasFork: false,
    });
  } catch (error) {
    console.error('Fork status check error:', error);
    return NextResponse.json({
      authenticated: false,
      hasFork: false,
      error: 'Failed to check fork status',
    });
  }
}
