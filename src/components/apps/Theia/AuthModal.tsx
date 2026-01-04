'use client';

import React, { useState, useEffect } from 'react';
import {
  Github,
  GitFork,
  GitPullRequest,
  CheckCircle2,
  XCircle,
  Loader2,
  ExternalLink,
  LogOut,
} from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import {
  forkRepository,
  checkForkStatus,
  createPullRequest,
  getUserPullRequests,
} from '@/lib/github/client';

export interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * GitHub 认证和贡献流程弹窗
 * 显示登录状态、Fork 状态、PR 状态等
 */
export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { isAuthenticated, user, login, logout } = useGitHubAuth();
  const [hasFork, setHasFork] = useState(false);
  const [forkUrl, setForkUrl] = useState<string | null>(null);
  const [isForking, setIsForking] = useState(false);
  const [isCreatingPR, setIsCreatingPR] = useState(false);
  const [prUrl, setPrUrl] = useState<string | null>(null);
  const [userPRs, setUserPRs] = useState<Array<{
    number: number;
    url: string;
    title: string;
    state: string;
  }>>([]);
  const [error, setError] = useState<string | null>(null);

  // 检查 Fork 状态
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      checkForkStatus().then(status => {
        setHasFork(status.hasFork);
        if (status.fork) {
          setForkUrl(status.fork.url);
        }
      });

      // 获取用户的 PR 列表
      getUserPullRequests().then(result => {
        if (result.authenticated) {
          setUserPRs(result.prs);
          // 如果有 PR，显示第一个
          if (result.prs.length > 0) {
            setPrUrl(result.prs[0].url);
          }
        }
      });
    }
  }, [isAuthenticated, isOpen]);

  const handleFork = async () => {
    setIsForking(true);
    setError(null);

    try {
      const result = await forkRepository();
      if (result.success && result.fork) {
        setHasFork(true);
        setForkUrl(result.fork.url);
      } else {
        setError(result.message || 'Failed to fork repository');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fork repository');
    } finally {
      setIsForking(false);
    }
  };

  const handleCreatePR = async () => {
    setIsCreatingPR(true);
    setError(null);

    try {
      const result = await createPullRequest({
        title: `Contribution from ${user?.login || 'visitor'}`,
        body: `Hi! I'd like to contribute to this project.\n\nThis PR was created via the Digital Desktop showcase.`,
      });

      if (result.success && result.pr) {
        setPrUrl(result.pr.url);
        // 刷新 PR 列表
        const prs = await getUserPullRequests();
        if (prs.authenticated) {
          setUserPRs(prs.prs);
        }
      } else {
        setError(result.message || 'Failed to create pull request');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create pull request');
    } finally {
      setIsCreatingPR(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setHasFork(false);
      setForkUrl(null);
      setPrUrl(null);
      setUserPRs([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to logout');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1e1e1e] border border-[#444444] rounded-lg shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#444444]">
          <h2 className="text-[#cccccc] text-lg font-semibold flex items-center gap-2">
            <Github size={20} />
            GitHub Contribution
          </h2>
          <button
            onClick={onClose}
            className="text-[#9b9a97] hover:text-[#cccccc] transition-colors"
          >
            <XCircle size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {error && (
            <div className="bg-red-900/20 border border-red-500/50 rounded p-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Step 1: Login */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {isAuthenticated ? (
                <CheckCircle2 size={20} className="text-green-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#444444]" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-[#cccccc] font-medium mb-1">
                1. Login with GitHub
              </h3>
              {isAuthenticated && user ? (
                <div className="flex items-center gap-2 text-sm text-[#9b9a97]">
                  <img
                    src={user.avatar_url}
                    alt={user.login}
                    className="w-6 h-6 rounded-full"
                  />
                  <span>{user.name || user.login}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-auto text-red-400 hover:text-red-300 flex items-center gap-1"
                  >
                    <LogOut size={14} />
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={login}
                  className="px-3 py-1.5 bg-[#0969da] hover:bg-[#0860ca] text-white text-sm rounded flex items-center gap-2"
                >
                  <Github size={16} />
                  Login with GitHub
                </button>
              )}
            </div>
          </div>

          {/* Step 2: Fork */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {hasFork ? (
                <CheckCircle2 size={20} className="text-green-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#444444]" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-[#cccccc] font-medium mb-1">
                2. Fork Repository
              </h3>
              {hasFork && forkUrl ? (
                <a
                  href={forkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View your fork
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  onClick={handleFork}
                  disabled={!isAuthenticated || isForking}
                  className="px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] disabled:bg-[#444444] text-white text-sm rounded flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  {isForking ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Forking...
                    </>
                  ) : (
                    <>
                      <GitFork size={16} />
                      Fork Repository
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step 3: Create PR */}
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 mt-1">
              {prUrl ? (
                <CheckCircle2 size={20} className="text-green-400" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-[#444444]" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-[#cccccc] font-medium mb-1">
                3. Create Pull Request
              </h3>
              {prUrl ? (
                <a
                  href={prUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  View your PR
                  <ExternalLink size={14} />
                </a>
              ) : (
                <button
                  onClick={handleCreatePR}
                  disabled={!hasFork || isCreatingPR}
                  className="px-3 py-1.5 bg-[#8250df] hover:bg-[#8957e5] disabled:bg-[#444444] text-white text-sm rounded flex items-center gap-2 disabled:cursor-not-allowed"
                >
                  {isCreatingPR ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <GitPullRequest size={16} />
                      Create Pull Request
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* User's PRs */}
          {userPRs.length > 0 && (
            <div className="pt-3 border-t border-[#444444]">
              <h3 className="text-[#cccccc] font-medium mb-2 text-sm">
                Your Pull Requests
              </h3>
              <div className="space-y-2">
                {userPRs.slice(0, 3).map(pr => (
                  <a
                    key={pr.number}
                    href={pr.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 bg-[#2d2d2d] hover:bg-[#3d3d3d] rounded text-sm transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <GitPullRequest
                        size={14}
                        className={
                          pr.state === 'open'
                            ? 'text-green-400'
                            : pr.state === 'closed'
                            ? 'text-red-400'
                            : 'text-purple-400'
                        }
                      />
                      <span className="text-[#cccccc]">
                        #{pr.number} {pr.title}
                      </span>
                      <span
                        className={`ml-auto text-xs px-2 py-0.5 rounded ${
                          pr.state === 'open'
                            ? 'bg-green-900/30 text-green-400'
                            : pr.state === 'closed'
                            ? 'bg-red-900/30 text-red-400'
                            : 'bg-purple-900/30 text-purple-400'
                        }`}
                      >
                        {pr.state}
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#444444] bg-[#252526]">
          <p className="text-[#9b9a97] text-xs text-center">
            Edit code in the IDE, then create a PR to contribute your changes
          </p>
        </div>
      </div>
    </div>
  );
}
