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

// 动态导入 NotionRenderer 和相关组件
const NotionRenderer = dynamic(
  () => import('react-notion-x').then((m) => m.NotionRenderer),
  { ssr: false }
);

// 动态导入 Collection 组件（用于渲染数据库视图）
const Collection = dynamic(
  () => import('react-notion-x/build/third-party/collection').then((m) => m.Collection),
  { ssr: false }
);

// 动态导入 Code 组件（用于渲染代码块）
const Code = dynamic(
  () => import('react-notion-x/build/third-party/code').then((m) => m.Code),
  { ssr: false }
);

// 动态导入 Modal 组件（用于弹窗）
const Modal = dynamic(
  () => import('react-notion-x/build/third-party/modal').then((m) => m.Modal),
  { ssr: false, loading: () => null }
);

import 'react-notion-x/src/styles.css';
// Prism.js 语法高亮样式
import 'prismjs/themes/prism-tomorrow.css';
// Notion 主题覆盖样式
import '@/styles/notion-theme.css';
// 错误边界
import { NotionErrorBoundary } from './NotionErrorBoundary';

// ============================================================
// Types
// ============================================================

/**
 * 修复 notion-client 返回的数据中可能导致 react-notion-x 崩溃的问题对象
 *
 * 问题根源：Notion API 返回的 select/multi_select 值可能是 {type, option} 格式的对象，
 * 但 react-notion-x 的 getCollectionGroups 函数期望的是字符串值。
 *
 * 参考：node_modules/react-notion-x/build/third-party/collection.js 第 5640 行
 */
const fixRecordMap = (recordMap: ExtendedRecordMap): ExtendedRecordMap => {
  if (!recordMap?.block) return recordMap;

  let fixCount = 0; // 记录修复次数

  try {
    /**
     * 提取对象的实际值
     * 处理 {type, option}, {value}, {option} 等多种格式
     */
    const extractValue = (obj: any): string => {
      if (obj == null) return '';
      if (typeof obj === 'string') return obj;
      if (typeof obj === 'number') return String(obj);
      if (typeof obj === 'boolean') return obj ? 'Yes' : 'No';

      // 处理 {type, option} 格式
      if (obj.option) {
        return obj.option.value || obj.option.name || obj.option.id || String(obj.option);
      }
      // 处理 {value} 格式
      if (obj.value !== undefined) {
        return typeof obj.value === 'string' ? obj.value : extractValue(obj.value);
      }
      // 处理 {name} 格式
      if (obj.name) {
        return obj.name;
      }
      // 处理 {id} 格式
      if (obj.id && typeof obj.id === 'string') {
        return obj.id;
      }

      return '';
    };

    /**
     * 深度修复函数 - 递归处理嵌套对象
     */
    const deepFixValue = (value: any, path: string = ''): any => {
      if (value == null) return value;

      // 处理数组
      if (Array.isArray(value)) {
        return value.map((item, i) => {
          if (item && typeof item === 'object' && !Array.isArray(item)) {
            // 检查是否是需要修复的问题对象
            if ('type' in item && 'option' in item) {
              const extracted = extractValue(item);
              fixCount++;
              console.log(`[修复 ${fixCount}] ${path}[${i}]: {type, option} → "${extracted}"`);
              return extracted;
            }
            if ('option' in item && Object.keys(item).length <= 2) {
              const extracted = extractValue(item);
              fixCount++;
              console.log(`[修复 ${fixCount}] ${path}[${i}]: {option} → "${extracted}"`);
              return extracted;
            }
          }
          return deepFixValue(item, `${path}[${i}]`);
        });
      }

      // 处理对象
      if (typeof value === 'object') {
        const fixed: any = {};
        for (const key in value) {
          fixed[key] = deepFixValue(value[key], `${path}.${key}`);
        }
        return fixed;
      }

      return value;
    };

    /**
     * 专门修复 collection_groups 中的 value 字段
     * 这是导致 "Objects are not valid as a React child" 错误的主要来源
     */
    const fixCollectionGroups = (groups: any[]): any[] => {
      if (!Array.isArray(groups)) return groups;

      return groups.map((group, index) => {
        if (!group || typeof group !== 'object') return group;

        const fixed = { ...group };

        // 修复 value 字段
        if (fixed.value && typeof fixed.value === 'object') {
          const originalValue = fixed.value;

          // value 可能是 { value: "xxx", type: "select" } 或 { type: "select", option: {...} }
          if ('value' in originalValue && typeof originalValue.value !== 'object') {
            // { value: "string", type: "xxx" } 格式 - 提取 value
            fixed.value = { ...originalValue, value: String(originalValue.value) };
          } else if ('option' in originalValue) {
            // { type: "xxx", option: {...} } 格式 - 需要修复
            const extracted = extractValue(originalValue);
            fixCount++;
            console.log(`[修复 ${fixCount}] collection_groups[${index}].value: {type, option} → "${extracted}"`);
            fixed.value = { value: extracted, type: originalValue.type || 'select' };
          }
        }

        return fixed;
      });
    };

    // 1. 修复所有 block 的 properties 和 format
    Object.values(recordMap.block).forEach((block: any) => {
      if (block.value?.properties) {
        block.value.properties = deepFixValue(block.value.properties, 'block.properties');
      }
      if (block.value?.format) {
        block.value.format = deepFixValue(block.value.format, 'block.format');
      }
    });

    // 2. 修复 collection 中的 schema
    if (recordMap.collection) {
      Object.values(recordMap.collection).forEach((collection: any) => {
        if (collection.value?.schema) {
          collection.value.schema = deepFixValue(collection.value.schema, 'collection.schema');
        }
      });
    }

    // 3. 重点修复 collection_view 中的 collection_groups！
    if (recordMap.collection_view) {
      Object.values(recordMap.collection_view).forEach((view: any) => {
        if (view.value?.format) {
          view.value.format = deepFixValue(view.value.format, 'collection_view.format');

          // 特别处理 collection_groups
          if (view.value.format.collection_groups) {
            view.value.format.collection_groups = fixCollectionGroups(
              view.value.format.collection_groups
            );
          }
        }
      });
    }

    // 4. 修复 collection_query 中的数据
    if ((recordMap as any).collection_query) {
      Object.values((recordMap as any).collection_query).forEach((query: any) => {
        if (query && typeof query === 'object') {
          Object.keys(query).forEach(key => {
            if (query[key]?.value) {
              query[key].value = deepFixValue(query[key].value, `collection_query.${key}`);
            }
          });
        }
      });
    }

    if (fixCount > 0) {
      console.log(`✅ RecordMap 修复完成，共修复 ${fixCount} 处问题`);
    } else {
      console.log('ℹ️  RecordMap 无需修复');
    }
  } catch (error) {
    console.warn('❌ Failed to fix recordMap:', error);
  }
  return recordMap;
};

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
// BlockRenderer - 渲染官方 API 返回的 blocks
// ============================================================

function BlockRenderer({ block }: { block: any }) {
  const type = block.type;
  const content = block[type];

  switch (type) {
    case 'paragraph':
      return (
        <p className="text-gray-800 leading-relaxed">
          {renderRichText(content?.rich_text)}
        </p>
      );

    case 'heading_1':
      return (
        <h1 className="text-2xl font-bold text-gray-900 mt-6 mb-2">
          {renderRichText(content?.rich_text)}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
          {renderRichText(content?.rich_text)}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 className="text-lg font-medium text-gray-900 mt-3 mb-1">
          {renderRichText(content?.rich_text)}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li className="ml-4 list-disc text-gray-800">
          {renderRichText(content?.rich_text)}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li className="ml-4 list-decimal text-gray-800">
          {renderRichText(content?.rich_text)}
        </li>
      );

    case 'to_do':
      return (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={content?.checked}
            readOnly
            className="rounded"
          />
          <span className={content?.checked ? 'line-through text-gray-500' : 'text-gray-800'}>
            {renderRichText(content?.rich_text)}
          </span>
        </div>
      );

    case 'toggle':
      return (
        <details className="bg-gray-50 rounded p-2">
          <summary className="cursor-pointer font-medium">
            {renderRichText(content?.rich_text)}
          </summary>
        </details>
      );

    case 'code':
      return (
        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
          <code>{renderRichText(content?.rich_text)}</code>
        </pre>
      );

    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-700">
          {renderRichText(content?.rich_text)}
        </blockquote>
      );

    case 'callout':
      return (
        <div className="bg-gray-100 rounded-lg p-4 flex items-start gap-3">
          {content?.icon?.emoji && (
            <span className="text-xl">
              {typeof content.icon.emoji === 'string'
                ? content.icon.emoji
                : content.icon.emoji?.emoji || '💡'}
            </span>
          )}
          <div>{renderRichText(content?.rich_text)}</div>
        </div>
      );

    case 'divider':
      return <hr className="border-gray-200 my-4" />;

    case 'image':
      const imageUrl = content?.file?.url || content?.external?.url;
      return imageUrl ? (
        <figure className="my-4">
          <img src={imageUrl} alt="" className="rounded-lg max-w-full" />
          {content?.caption?.[0]?.plain_text && (
            <figcaption className="text-sm text-gray-500 mt-2 text-center">
              {content.caption[0].plain_text}
            </figcaption>
          )}
        </figure>
      ) : null;

    case 'child_page':
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
          <FileText size={16} className="text-gray-400" />
          <span className="text-gray-800">{content?.title}</span>
        </div>
      );

    case 'child_database':
      return (
        <div className="flex items-center gap-2 p-2 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
          <Database size={16} className="text-gray-400" />
          <span className="text-gray-800">{content?.title}</span>
        </div>
      );

    default:
      // 未知类型显示灰色占位符
      return (
        <div className="text-gray-400 text-sm italic">
          [{type} block]
        </div>
      );
  }
}

// 渲染富文本
function renderRichText(richText: any[]): React.ReactNode {
  if (!richText || richText.length === 0) return null;

  return richText.map((text, index) => {
    let content: React.ReactNode = text.plain_text;

    if (text.annotations?.bold) {
      content = <strong key={index}>{content}</strong>;
    }
    if (text.annotations?.italic) {
      content = <em key={index}>{content}</em>;
    }
    if (text.annotations?.strikethrough) {
      content = <s key={index}>{content}</s>;
    }
    if (text.annotations?.code) {
      content = (
        <code key={index} className="bg-gray-100 px-1 rounded text-sm font-mono">
          {content}
        </code>
      );
    }
    if (text.href) {
      content = (
        <a
          key={index}
          href={text.href}
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {content}
        </a>
      );
    }

    return <span key={index}>{content}</span>;
  });
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

  // 页面内容状态 - 支持两种格式
  const [pageData, setPageData] = useState<{ page: any; blocks: any[] } | null>(null);

  // 加载页面内容（使用 notion-client 获取 recordMap）
  const loadPageContent = async (pageId: string) => {
    setSelectedPageId(pageId);
    setIsLoadingContent(true);
    setError(null);
    setRecordMap(null);
    setPageData(null);

    try {
      // 使用 API 来获取页面内容
      const response = await fetch(`/api/notion/page/${pageId}`);
      const result = await response.json();

      if (result.success) {
        if (result.type === 'official') {
          // 官方 API 返回 page + blocks
          console.log('使用官方 API 数据');
          setPageData({ page: result.page, blocks: result.blocks });
        } else {
          // 非官方 API 返回 recordMap (react-notion-x 格式)
          console.log('使用非官方 API 数据，正在修复格式...');
          const fixedRecordMap = fixRecordMap(result.recordMap);
          console.log('RecordMap 修复完成，blocks 数量:', Object.keys(fixedRecordMap.block || {}).length);
          setRecordMap(fixedRecordMap);
        }
      } else {
        setError(result.message || result.error || '加载页面内容失败');
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
    <div className="notion-frame flex flex-col h-full w-full bg-white overflow-hidden rounded-lg">
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
        <div className="w-64 bg-[#f7f6f3] border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">页面</span>
              {pages.length > 0 && (
                <span className="text-xs text-gray-500">({pages.length})</span>
              )}
            </div>
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
          <div className="flex-1 overflow-y-auto px-2 py-2">
            {isLoadingList ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-gray-400" />
              </div>
            ) : filteredPages.length > 0 ? (
              <div className="space-y-0.5">
                {filteredPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => loadPageContent(page.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-colors text-sm",
                      selectedPageId === page.id
                        ? "bg-white/80 text-gray-900 shadow-sm"
                        : "hover:bg-white/50 text-gray-700"
                    )}
                  >
                    <span className="flex-shrink-0 w-5 text-center">
                      {page.icon?.emoji ? (
                        typeof page.icon.emoji === 'string'
                          ? page.icon.emoji
                          : page.icon.emoji?.emoji || '📄'
                      ) : (
                        <FileText size={14} className="text-gray-400" />
                      )}
                    </span>
                    <span className="flex-1 truncate">{page.title}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-500">
                {searchQuery ? '没有找到匹配的页面' : '没有页面'}
              </div>
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
            <NotionErrorBoundary onReset={() => loadPageContent(selectedPageId!)}>
              <div className="notion-full-page">
                <NotionRenderer
                  recordMap={recordMap}
                  fullPage={true}
                  darkMode={false}
                  disableHeader={false}
                  components={{
                    Collection,
                    Code,
                    Modal,
                  }}
                />
              </div>
            </NotionErrorBoundary>
          ) : pageData ? (
            <div className="p-8 max-w-4xl mx-auto">
              {/* Page Header */}
              <div className="mb-8">
                {pageData.page.icon?.emoji && (
                  <span className="text-6xl mb-4 block">
                    {typeof pageData.page.icon.emoji === 'string'
                      ? pageData.page.icon.emoji
                      : pageData.page.icon.emoji?.emoji || '📄'}
                  </span>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {pageData.page.title}
                </h1>
                {pageData.page.lastEditedTime && (
                  <p className="text-sm text-gray-500">
                    最后编辑于 {new Date(pageData.page.lastEditedTime).toLocaleString('zh-CN')}
                  </p>
                )}
              </div>

              {/* Blocks */}
              <div className="space-y-4">
                {pageData.blocks.map((block: any) => (
                  <BlockRenderer key={block.id} block={block} />
                ))}
              </div>
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
