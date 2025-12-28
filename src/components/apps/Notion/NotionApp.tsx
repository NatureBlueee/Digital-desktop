/**
 * NotionApp Component
 *
 * 使用 react-notion-x 渲染 Notion 页面
 * 通过 API 获取 recordMap 数据
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { ExtendedRecordMap } from 'notion-types';

// 动态导入 NotionRenderer 以避免 SSR 问题
const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
);

// react-notion-x 所需的 CSS
import 'react-notion-x/src/styles.css';

// ============================================================
// Types
// ============================================================

interface NotionAppProps {
  windowId: string;
}

interface NotionState {
  isLoading: boolean;
  error: string | null;
  recordMap: ExtendedRecordMap | null;
  currentPageId: string | null;
  pageHistory: string[];
}

// ============================================================
// Component
// ============================================================

export function NotionApp({ windowId }: NotionAppProps) {
  const [state, setState] = useState<NotionState>({
    isLoading: true,
    error: null,
    recordMap: null,
    currentPageId: null,
    pageHistory: [],
  });

  // 获取根页面
  const loadRootPage = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch('/api/notion/root');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch root page');
      }

      if (!data.configured) {
        throw new Error('Notion is not configured');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        recordMap: data.recordMap,
        currentPageId: data.pageId,
        pageHistory: [data.pageId],
      }));
    } catch (error) {
      console.error('Error loading Notion page:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  // 加载指定页面
  const loadPage = useCallback(async (pageId: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`/api/notion/page/${pageId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch page');
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        recordMap: data.recordMap,
        currentPageId: pageId,
        pageHistory: [...prev.pageHistory, pageId],
      }));
    } catch (error) {
      console.error('Error loading Notion page:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  // 返回上一页
  const goBack = useCallback(() => {
    if (state.pageHistory.length > 1) {
      const newHistory = [...state.pageHistory];
      newHistory.pop();
      const prevPageId = newHistory[newHistory.length - 1];
      loadPage(prevPageId);
      setState(prev => ({ ...prev, pageHistory: newHistory }));
    }
  }, [state.pageHistory, loadPage]);

  // 处理页面内链接点击
  const handleMapPageUrl = useCallback((pageId: string) => {
    // 返回站内链接格式，实际导航由 onClick 处理
    return `#${pageId}`;
  }, []);

  // 初始加载
  useEffect(() => {
    loadRootPage();
  }, [loadRootPage]);

  // Loading 状态
  if (state.isLoading) {
    return (
      <div className="h-full flex flex-col bg-white">
        <NotionTitleBar
          canGoBack={false}
          onGoBack={goBack}
          onRefresh={loadRootPage}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            <span className="text-gray-500">Loading Notion...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error 状态
  if (state.error) {
    return (
      <div className="h-full flex flex-col bg-white">
        <NotionTitleBar
          canGoBack={state.pageHistory.length > 1}
          onGoBack={goBack}
          onRefresh={loadRootPage}
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center p-8 max-w-md">
            <div className="text-4xl mb-4">⚠️</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Unable to load Notion
            </h2>
            <p className="text-gray-500 mb-4">{state.error}</p>
            <button
              onClick={loadRootPage}
              className="px-4 py-2 bg-gray-900 text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 成功渲染
  if (!state.recordMap) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <NotionTitleBar
        canGoBack={state.pageHistory.length > 1}
        onGoBack={goBack}
        onRefresh={loadRootPage}
      />
      <div className="flex-1 overflow-auto notion-app-container">
        <NotionRenderer
          recordMap={state.recordMap}
          fullPage={true}
          darkMode={false}
          mapPageUrl={handleMapPageUrl}
          components={{
            // 自定义链接处理
            PageLink: ({ href, children, ...props }: { href?: string; children?: React.ReactNode; [key: string]: unknown }) => {
              const pageId = href?.replace('#', '');
              return (
                <a
                  {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                  href={href}
                  onClick={(e) => {
                    e.preventDefault();
                    if (pageId) {
                      loadPage(pageId);
                    }
                  }}
                  className="notion-page-link cursor-pointer"
                >
                  {children}
                </a>
              );
            },
          }}
        />
      </div>
    </div>
  );
}

// ============================================================
// Title Bar Component
// ============================================================

interface NotionTitleBarProps {
  canGoBack: boolean;
  onGoBack: () => void;
  onRefresh: () => void;
}

function NotionTitleBar({ canGoBack, onGoBack, onRefresh }: NotionTitleBarProps) {
  return (
    <div className="h-11 bg-white border-b border-gray-200 flex items-center px-3 gap-2 shrink-0 drag-handle">
      {/* Window controls placeholder */}
      <div className="flex items-center gap-1.5 mr-3">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
      </div>

      {/* Navigation */}
      <button
        onClick={onGoBack}
        disabled={!canGoBack}
        className={`p-1.5 rounded transition-colors ${
          canGoBack
            ? 'hover:bg-gray-100 text-gray-600'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="Go back"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={onRefresh}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-600 transition-colors"
        title="Refresh"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2 ml-4">
        <img src="/icons/notion.png" alt="Notion" className="w-5 h-5" />
        <span className="text-sm font-medium text-gray-700">Notion</span>
      </div>
    </div>
  );
}

export default NotionApp;
