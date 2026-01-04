'use client';

import React, { useState } from 'react';
import { GitBranch, Github, Loader2 } from 'lucide-react';
import { useGitHubAuth } from '@/hooks/useGitHubAuth';
import { forkRepository, createPullRequest } from '@/lib/github/client';

export interface ContributeButtonProps {
  /**
   * 按钮大小
   */
  size?: 'sm' | 'md' | 'lg';
  /**
   * 按钮样式
   */
  variant?: 'default' | 'minimal';
}

/**
 * 贡献按钮组件
 * 处理 GitHub 登录、Fork 和 PR 创建流程
 */
export function ContributeButton({
  size = 'md',
  variant = 'default',
}: ContributeButtonProps) {
  const { isAuthenticated, user, login, isLoading: authLoading } = useGitHubAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    // 如果未登录，跳转到 GitHub 登录
    if (!isAuthenticated) {
      login();
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // 1. Fork 仓库
      const forkResult = await forkRepository();

      if (!forkResult.success) {
        throw new Error(forkResult.message || 'Failed to fork repository');
      }

      // 2. 创建 Pull Request
      const prResult = await createPullRequest({
        title: `Contribution from ${user?.login || 'visitor'}`,
        body: `Hi! I'd like to contribute to this project.\n\nThis PR was created via the Digital Desktop showcase.`,
      });

      if (!prResult.success) {
        throw new Error(prResult.message || 'Failed to create pull request');
      }

      // 显示成功消息
      setShowSuccess(true);

      // 3 秒后打开 PR 页面
      if (prResult.pr?.url) {
        setTimeout(() => {
          window.open(prResult.pr!.url, '_blank');
        }, 1000);
      }

      // 5 秒后隐藏成功消息
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
    } catch (err) {
      console.error('Contribution error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create contribution');
    } finally {
      setIsProcessing(false);
    }
  };

  const isLoading = authLoading || isProcessing;

  // Minimal variant - 只显示图标
  if (variant === 'minimal') {
    return (
      <button
        onClick={handleClick}
        disabled={isLoading}
        className="p-1 hover:bg-[#444444] rounded transition-colors"
        title={isAuthenticated ? 'Create Pull Request' : 'Login with GitHub'}
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin text-[#9b9a97]" />
        ) : showSuccess ? (
          <GitBranch size={14} className="text-green-400" />
        ) : (
          <Github size={14} className="text-[#9b9a97]" />
        )}
      </button>
    );
  }

  // Default variant - 完整按钮
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isLoading}
        className={`
          ${sizeClasses[size]}
          flex items-center gap-2
          bg-[#0969da] hover:bg-[#0860ca]
          disabled:bg-[#444444] disabled:cursor-not-allowed
          text-white font-medium rounded
          transition-all duration-200
          ${showSuccess ? 'bg-green-600 hover:bg-green-700' : ''}
        `}
      >
        {isLoading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Processing...</span>
          </>
        ) : showSuccess ? (
          <>
            <GitBranch size={16} />
            <span>PR Created!</span>
          </>
        ) : isAuthenticated ? (
          <>
            <GitBranch size={16} />
            <span>Create PR</span>
          </>
        ) : (
          <>
            <Github size={16} />
            <span>Login to Contribute</span>
          </>
        )}
      </button>

      {error && (
        <p className="text-red-400 text-xs max-w-xs text-right">{error}</p>
      )}

      {isAuthenticated && user && !showSuccess && !error && (
        <p className="text-[#666666] text-xs">Logged in as {user.login}</p>
      )}
    </div>
  );
}
