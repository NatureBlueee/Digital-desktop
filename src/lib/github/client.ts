/**
 * GitHub API Client
 * 前端调用 GitHub 相关 API 的工具函数
 */

export interface GitHubUser {
  login: string;
  avatar_url: string;
  name: string | null;
}

export interface AuthStatus {
  authenticated: boolean;
  user: GitHubUser | null;
}

export interface ForkInfo {
  url: string;
  cloneUrl: string;
  sshUrl?: string;
  defaultBranch: string;
  owner: string;
  name: string;
}

export interface ForkStatus {
  authenticated: boolean;
  hasFork: boolean;
  fork?: ForkInfo;
}

export interface CommitResult {
  success: boolean;
  message: string;
  commit?: {
    sha: string;
    url: string;
    message: string;
  };
  filesChanged?: number;
}

export interface PullRequestInfo {
  number: number;
  url: string;
  title: string;
  state: string;
}

export interface PullRequestResult {
  success: boolean;
  message: string;
  pr?: PullRequestInfo;
  isNew?: boolean;
}

/**
 * 检查 GitHub 认证状态
 */
export async function checkAuthStatus(): Promise<AuthStatus> {
  try {
    const response = await fetch('/api/auth/github/status');
    if (!response.ok) {
      throw new Error('Failed to check auth status');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to check auth status:', error);
    return { authenticated: false, user: null };
  }
}

/**
 * 登出 GitHub
 */
export async function logout(): Promise<void> {
  try {
    const response = await fetch('/api/auth/github/logout', {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
  } catch (error) {
    console.error('Failed to logout:', error);
    throw error;
  }
}

/**
 * Fork 仓库
 */
export async function forkRepository(): Promise<{
  success: boolean;
  message: string;
  fork?: ForkInfo;
  isNew?: boolean;
  error?: string;
}> {
  try {
    const response = await fetch('/api/github/fork', {
      method: 'POST',
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.error || 'Failed to fork repository',
        error: error.error,
      };
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fork repository:', error);
    return {
      success: false,
      message: 'Failed to fork repository',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * 检查 Fork 状态
 */
export async function checkForkStatus(): Promise<ForkStatus> {
  try {
    const response = await fetch('/api/github/fork');
    if (!response.ok) {
      throw new Error('Failed to check fork status');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to check fork status:', error);
    return { authenticated: false, hasFork: false };
  }
}

/**
 * 提交文件更改
 */
export async function commitChanges(params: {
  files: Array<{ path: string; content: string }>;
  message: string;
  branch?: string;
}): Promise<CommitResult> {
  try {
    const response = await fetch('/api/github/commit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to commit changes');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to commit changes:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to commit changes',
    };
  }
}

/**
 * 更新单个文件（简化接口）
 */
export async function updateFile(params: {
  path: string;
  content: string;
  message?: string;
  branch?: string;
}): Promise<CommitResult> {
  try {
    const response = await fetch('/api/github/commit', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update file');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to update file:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to update file',
    };
  }
}

/**
 * 创建 Pull Request
 */
export async function createPullRequest(params: {
  title: string;
  body?: string;
  branch?: string;
  baseBranch?: string;
}): Promise<PullRequestResult> {
  try {
    const response = await fetch('/api/github/pr', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to create pull request');
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to create pull request:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to create pull request',
    };
  }
}

/**
 * 获取用户的 Pull Request 列表
 */
export async function getUserPullRequests(): Promise<{
  authenticated: boolean;
  prs: Array<{
    number: number;
    url: string;
    title: string;
    state: string;
    createdAt: string;
    updatedAt: string;
    merged: boolean;
  }>;
}> {
  try {
    const response = await fetch('/api/github/pr');
    if (!response.ok) {
      throw new Error('Failed to fetch pull requests');
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch pull requests:', error);
    return { authenticated: false, prs: [] };
  }
}

/**
 * 开始 GitHub 登录流程
 */
export function startGitHubLogin(state?: string): void {
  const url = state
    ? `/api/auth/github?state=${encodeURIComponent(state)}`
    : '/api/auth/github';
  window.location.href = url;
}
