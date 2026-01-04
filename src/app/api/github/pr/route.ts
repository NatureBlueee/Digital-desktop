import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

/**
 * 创建 Pull Request 从用户的 fork 到原仓库
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
      title,
      body: prBody,
      branch = 'main',
      baseBranch = 'main',
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Pull request title is required' },
        { status: 400 }
      );
    }

    const owner = process.env.GITHUB_REPO_OWNER || 'NatureBlueee';
    const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';

    const octokit = new Octokit({ auth: token });

    // 获取当前用户
    const { data: user } = await octokit.users.getAuthenticated();

    // 检查是否已经有相同的 PR 存在
    const { data: existingPRs } = await octokit.pulls.list({
      owner,
      repo,
      state: 'open',
      head: `${user.login}:${branch}`,
      base: baseBranch,
    });

    if (existingPRs.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Pull request already exists',
        pr: {
          number: existingPRs[0].number,
          url: existingPRs[0].html_url,
          title: existingPRs[0].title,
          state: existingPRs[0].state,
        },
        isNew: false,
      });
    }

    // 创建新的 Pull Request
    const { data: pr } = await octokit.pulls.create({
      owner,
      repo,
      title,
      body: prBody || `This is a contribution from ${user.login}.\n\nThank you for your contribution!`,
      head: `${user.login}:${branch}`,
      base: baseBranch,
    });

    return NextResponse.json({
      success: true,
      message: 'Pull request created successfully',
      pr: {
        number: pr.number,
        url: pr.html_url,
        title: pr.title,
        state: pr.state,
      },
      isNew: true,
    });
  } catch (error: unknown) {
    console.error('Pull request creation error:', error);

    // 处理速率限制
    if (error && typeof error === 'object' && 'status' in error && error.status === 403) {
      return NextResponse.json(
        { error: 'GitHub API rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    // 处理没有更改的情况
    if (
      error &&
      typeof error === 'object' &&
      'message' in error &&
      typeof error.message === 'string' &&
      error.message.includes('No commits between')
    ) {
      return NextResponse.json(
        { error: 'No changes to submit. Please make some changes first.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: 'Failed to create pull request',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * 获取用户的 Pull Request 列表
 */
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('github_token')?.value;

  if (!token) {
    return NextResponse.json({
      authenticated: false,
      prs: [],
    });
  }

  const owner = process.env.GITHUB_REPO_OWNER || 'NatureBlueee';
  const repo = process.env.GITHUB_REPO_NAME || 'Digital-desktop';

  const octokit = new Octokit({ auth: token });

  try {
    const { data: user } = await octokit.users.getAuthenticated();

    // 获取用户创建的所有 PR（包括已关闭的）
    const { data: prs } = await octokit.pulls.list({
      owner,
      repo,
      state: 'all',
      sort: 'created',
      direction: 'desc',
    });

    // 过滤出用户创建的 PR
    const userPRs = prs.filter(pr => pr.user?.login === user.login);

    return NextResponse.json({
      authenticated: true,
      prs: userPRs.map(pr => ({
        number: pr.number,
        url: pr.html_url,
        title: pr.title,
        state: pr.state,
        createdAt: pr.created_at,
        updatedAt: pr.updated_at,
        merged: pr.merged_at !== null,
      })),
    });
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    return NextResponse.json({
      authenticated: false,
      prs: [],
      error: 'Failed to fetch pull requests',
    });
  }
}
