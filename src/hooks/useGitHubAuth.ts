'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  checkAuthStatus,
  logout as logoutAPI,
  type GitHubUser,
} from '@/lib/github/client';

export interface UseGitHubAuthReturn {
  isAuthenticated: boolean;
  user: GitHubUser | null;
  isLoading: boolean;
  error: string | null;
  login: () => void;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * GitHub 认证状态管理 Hook
 *
 * @example
 * ```tsx
 * const { isAuthenticated, user, login, logout } = useGitHubAuth();
 *
 * if (!isAuthenticated) {
 *   return <button onClick={login}>Login with GitHub</button>;
 * }
 *
 * return (
 *   <div>
 *     <p>Welcome, {user?.name || user?.login}!</p>
 *     <button onClick={logout}>Logout</button>
 *   </div>
 * );
 * ```
 */
export function useGitHubAuth(): UseGitHubAuthReturn {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  /**
   * 刷新认证状态
   */
  const fetchStatus = useCallback(async () => {
    const id = ++requestId.current;
    return checkAuthStatus().then((status) => {
      if (id !== requestId.current) return;
      setIsAuthenticated(status.authenticated);
      setUser(status.user);
      setError(null);
    }).catch((err: unknown) => {
      if (id !== requestId.current) return;
      console.error('Failed to check auth status:', err);
      setError(err instanceof Error ? err.message : 'Failed to check auth status');
      setIsAuthenticated(false);
      setUser(null);
    }).finally(() => {
      if (id === requestId.current) setIsLoading(false);
    });
  }, []);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    await fetchStatus();
  }, [fetchStatus]);

  /**
   * 登录
   */
  const login = useCallback(() => {
    // 保存当前 URL 用于登录后返回
    const currentUrl = window.location.pathname + window.location.search;
    sessionStorage.setItem('github_auth_return_url', currentUrl);

    // 跳转到 GitHub OAuth
    window.location.href = '/api/auth/github';
  }, []);

  /**
   * 登出
   */
  const logout = useCallback(async () => {
    try {
      await logoutAPI();
      requestId.current += 1;
      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Failed to logout:', err);
      setError(err instanceof Error ? err.message : 'Failed to logout');
      throw err;
    }
  }, []);

  /**
   * 初始化：检查认证状态
   */
  useEffect(() => {
    void fetchStatus();

    // 检查是否从 OAuth 回调返回
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('github_auth') === 'success') {
      // 清除 URL 参数
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);

      // 尝试返回到之前的页面
      const returnUrl = sessionStorage.getItem('github_auth_return_url');
      if (returnUrl && returnUrl !== newUrl) {
        sessionStorage.removeItem('github_auth_return_url');
        window.location.href = returnUrl;
      }
    }
    return () => { requestId.current += 1; };
  }, [fetchStatus]);

  return {
    isAuthenticated,
    user,
    isLoading,
    error,
    login,
    logout,
    refresh,
  };
}
