/**
 * NotionAppImproved - 改进版 Notion 应用
 *
 * 功能：
 * - 左侧：页面列表（从 Notion API 获取）
 * - 右侧：页面内容（使用 react-notion-x 渲染）
 * - 支持搜索页面
 * - 支持查看数据库
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { ExtendedRecordMap } from 'notion-types';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import {
  Search,
  FileText,
  Database,
  ChevronRight,
  ChevronDown,
  X,
  Minus,
  Square,
  RefreshCw,
  Home,
  Loader2,
} from 'lucide-react';

// 动态导入 NotionRenderer
const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
);

import 'react-notion-x/src/styles.css';

// ============================================================
// Types
// ============================================================

interface NotionAppProps {
  windowId: string;
}

interface NotionPage {
  id: string;
  title: string;
  icon?: any;
  lastEditedTime: string;
  url: string;
}

interface NotionDatabase {
  id: string;
  title: string;
  icon?: any;
  url: string;
}

// ============================================================
// Component
// ============================================================

export function NotionAppImproved({ windowId }: NotionAppProps) {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

  // State
  const [pages, setPages] = useState<NotionPage[]>([]);
  const [databases, setDatabases] = useState<NotionDatabase[]>([]);
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [recordMap, setRecordMap] = useState<ExtendedRecordMap | null>(null);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'pages' | 'databases'>('pages');
  const [isConfigured, setIsConfigured] = useState(false);

  // 加载页面列表
  useEffect(() => {
    loadPageList();
  }, []);

  const loadPageList = async () => {
    setIsLoadingList(true);
    setError(null);

    try {
      const response = await fetch('/api/notion/pages');
      const result = await response.json();

      if (!result.configured) {
        setError('Notion 未配置。请在 .env.local 中设置 NOTION_API_KEY');
        setIsConfigured(false);
        return;
      }

      if (result.success) {
        setPages(result.data);
        setIsConfigured(true);

        // 自动选择第一个页面
        if (result.data.length > 0 && !selectedPageId) {
          loadPageContent(result.data[0].id);
        }
      } else {
        setError(result.error || '加载页面列表失败');
      }
    } catch (err) {
      console.error('Error loading page list:', err);
      setError('网络错误，请检查 Notion API 配置');
    } finally {
      setIsLoadingList(false);
    }
  };

  // 加载数据库列表
  const loadDatabases = async () => {
    try {
      const response = await fetch('/api/notion/databases');
      const result = await response.json();

      if (result.success) {
        setDatabases(result.data);
      }
    } catch (err) {
      console.error('Error loading databases:', err);
    }
  };

  // 加载页面内容（使用 notion-client 获取 recordMap）
  const loadPageContent = async (pageId: string) => {
    setSelectedPageId(pageId);
    setIsLoadingContent(true);
    setError(null);

    try {
      // 使用原有的 API（notion-client）来获取 recordMap
      const response = await fetch(`/api/notion/page/${pageId}`);
      const result = await response.json();

      if (result.success) {
        setRecordMap(result.recordMap);
      } else {
        setError(result.error || '加载页面内容失败');
      }
    } catch (err) {
      console.error('Error loading page content:', err);
      setError('加载页面失败');
    } finally {
      setIsLoadingContent(false);
    }
  };

  // 筛选页面
  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full w-full bg-white overflow-hidden rounded-lg">
      {/* Title Bar */}
      <div className="flex items-center h-10 bg-white px-3 drag-handle select-none border-b border-gray-200">
        <div className="flex items-center gap-2 flex-1">
          <img
            src="/icons/notion.png"
            className="w-5 h-5"
            alt=""
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
          <span className="text-sm font-medium text-gray-700">Notion 工作区</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => minimizeWindow(windowId)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <button
            onClick={() => maximizeWindow(windowId)}
            className="p-1.5 hover:bg-gray-100 rounded transition-colors"
          >
            <Square size={12} className="text-gray-600" />
          </button>
          <button
            onClick={() => closeWindow(windowId)}
            className="p-1.5 hover:bg-red-100 rounded transition-colors"
          >
            <X size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - Page List */}
        <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setActiveTab('pages');
                if (databases.length === 0) loadDatabases();
              }}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                activeTab === 'pages'
                  ? "bg-white text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <FileText size={14} />
                <span>页面</span>
                {pages.length > 0 && (
                  <span className="px-1.5 py-0.5 bg-gray-200 text-gray-600 text-xs rounded">
                    {pages.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => {
                setActiveTab('databases');
                if (databases.length === 0) loadDatabases();
              }}
              className={cn(
                "flex-1 px-3 py-2 text-sm font-medium transition-colors",
                activeTab === 'databases'
                  ? "bg-white text-gray-900 border-b-2 border-blue-500"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              )}
            >
              <div className="flex items-center justify-center gap-2">
                <Database size={14} />
                <span>数据库</span>
              </div>
            </button>
          </div>

          {/* Search */}
          <div className="p-2">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索页面..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="px-2 pb-2">
            <button
              onClick={loadPageList}
              disabled={isLoadingList}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <RefreshCw size={14} className={cn(isLoadingList && "animate-spin")} />
              <span>刷新列表</span>
            </button>
          </div>

          {/* Page List */}
          <div className="flex-1 overflow-y-auto px-2">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : activeTab === 'pages' ? (
              filteredPages.length > 0 ? (
                <div className="space-y-1">
                  {filteredPages.map(page => (
                    <button
                      key={page.id}
                      onClick={() => loadPageContent(page.id)}
                      className={cn(
                        "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                        selectedPageId === page.id
                          ? "bg-blue-100 text-blue-900"
                          : "hover:bg-gray-100 text-gray-700"
                      )}
                    >
                      {page.icon?.emoji ? (
                        <span className="text-lg">{page.icon.emoji}</span>
                      ) : (
                        <FileText size={16} className="text-gray-400" />
                      )}
                      <span className="flex-1 text-sm truncate">{page.title}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  {searchQuery ? '没有找到匹配的页面' : '没有页面'}
                </div>
              )
            ) : (
              databases.length > 0 ? (
                <div className="space-y-1">
                  {databases.map(db => (
                    <div
                      key={db.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
                    >
                      {db.icon?.emoji ? (
                        <span className="text-lg">{db.icon.emoji}</span>
                      ) : (
                        <Database size={16} className="text-gray-400" />
                      )}
                      <span className="flex-1 text-sm truncate">{db.title}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-500">
                  没有数据库
                </div>
              )
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white overflow-y-auto">
          {!isConfigured ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="mb-4 text-gray-400">
                  <FileText size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Notion 未配置
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  请按照以下步骤配置 Notion 集成：
                </p>
                <div className="text-left bg-gray-50 rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <p>1. 访问 <a href="https://www.notion.so/my-integrations" target="_blank" className="text-blue-600 hover:underline">notion.so/my-integrations</a></p>
                  <p>2. 创建 Integration 并复制 Token</p>
                  <p>3. 在 .env.local 中设置：</p>
                  <pre className="bg-white p-2 rounded border border-gray-200 mt-2">
                    NOTION_API_KEY=secret_xxx
                  </pre>
                  <p className="mt-2">4. 在 Notion 页面中添加集成连接</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="mb-4 text-red-400">
                  <X size={48} className="mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  加载失败
                </h3>
                <p className="text-sm text-gray-600">{error}</p>
                <button
                  onClick={loadPageList}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  重试
                </button>
              </div>
            </div>
          ) : isLoadingContent ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 size={32} className="animate-spin text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-gray-600">加载页面内容...</p>
              </div>
            </div>
          ) : recordMap ? (
            <div className="notion-container p-8">
              <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
                darkMode={false}
                disableHeader={false}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Home size={48} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500">选择一个页面开始查看</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotionAppImproved;
