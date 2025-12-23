'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { Minus, Square, X, PanelLeft, Search as SearchIcon } from 'lucide-react';
import {
  ConversationDetail,
  Message,
  PaginatedResponse,
} from '@/types/chatgpt-archive';

import { ArchiveBanner } from './ArchiveBanner';
import { ConversationList } from './ConversationList';
import { ConversationHeader } from './ConversationHeader';
import { MessageTimeline } from './MessageTimeline';
import { SearchPanel } from './SearchPanel';
import { TagFilter } from './TagFilter';

interface ChatGPTArchiveAppProps {
  windowId: string;
}

/**
 * ChatGPTArchiveApp - ChatGPT 只读档案应用
 *
 * 核心功能：
 * - 对话列表浏览
 * - 消息流只读展示
 * - 全文搜索
 * - 标签筛选
 *
 * 只读约束：
 * - 无输入框
 * - 无发送按钮
 * - Archive Banner 明确提示
 */
export const ChatGPTArchiveApp: React.FC<ChatGPTArchiveAppProps> = ({
  windowId,
}) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const containerRef = useRef<HTMLDivElement>(null);

  // UI state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [width, setWidth] = useState(1000);

  // Data state
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [messagesCursor, setMessagesCursor] = useState<string | null>(null);
  const [highlightMessageId, setHighlightMessageId] = useState<string | null>(null);

  // Filter state
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Track window width for responsive behavior
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        if (entry.contentRect.width < 640) {
          setIsSidebarCollapsed(true);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch conversation detail when selected
  useEffect(() => {
    if (!selectedConversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    async function fetchConversation() {
      try {
        const response = await fetch(
          `/api/chatgpt/conversations/${selectedConversationId}`
        );
        const result = await response.json();

        if (result.success) {
          setConversation(result.data);
          // Fetch messages
          fetchMessages(selectedConversationId!, true);
        } else {
          console.error('Failed to fetch conversation:', result.error);
        }
      } catch (err) {
        console.error('Error fetching conversation:', err);
      }
    }

    fetchConversation();
  }, [selectedConversationId]);

  // Fetch messages
  const fetchMessages = useCallback(
    async (convId: string, reset = false) => {
      try {
        setIsLoadingMessages(true);

        const params = new URLSearchParams();
        if (!reset && messagesCursor) {
          params.set('cursor', messagesCursor);
        }
        params.set('limit', '50');

        const response = await fetch(
          `/api/chatgpt/conversations/${convId}/messages?${params}`
        );
        const result = await response.json();

        if (result.success) {
          const data = result.data as PaginatedResponse<Message>;

          if (reset) {
            setMessages(data.data);
          } else {
            setMessages((prev) => [...prev, ...data.data]);
          }

          setHasMoreMessages(data.has_more);
          setMessagesCursor(data.next_cursor);
        }
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [messagesCursor]
  );

  // Load more messages
  const loadMoreMessages = useCallback(() => {
    if (selectedConversationId && messagesCursor && !isLoadingMessages) {
      fetchMessages(selectedConversationId, false);
    }
  }, [selectedConversationId, messagesCursor, isLoadingMessages, fetchMessages]);

  // Handle conversation selection
  const handleSelectConversation = useCallback((id: string) => {
    setSelectedConversationId(id);
    setMessages([]);
    setMessagesCursor(null);
    setHighlightMessageId(null);
  }, []);

  // Handle back to list
  const handleBack = useCallback(() => {
    setSelectedConversationId(null);
    setConversation(null);
    setMessages([]);
    setHighlightMessageId(null);
  }, []);

  // Handle search result click
  const handleSearchResultClick = useCallback(
    (conversationId: string, messageId: string) => {
      setSelectedConversationId(conversationId);
      setHighlightMessageId(messageId);
    },
    []
  );

  // Render sidebar content
  const renderSidebar = () => (
    <nav
      className={cn(
        'flex flex-col h-full bg-[#f9f9f9] transition-all duration-300 ease-in-out relative z-20 border-r border-gray-200',
        isSidebarCollapsed ? 'w-[60px]' : 'w-[280px]'
      )}
    >
      {/* Sidebar header */}
      <div className="px-3 py-3 flex items-center justify-between border-b border-gray-100">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-2 px-2">
            <ChatGPTLogo className="w-6 h-6 text-gray-800" />
            <span className="font-semibold text-gray-800">Archive</span>
          </div>
        )}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PanelLeft size={18} />
        </button>
      </div>

      {/* Search */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-3 border-b border-gray-100">
          <SearchPanel onResultClick={handleSearchResultClick} />
        </div>
      )}

      {/* Tag filter */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-2 border-b border-gray-100">
          <TagFilter selectedTag={selectedTag} onTagSelect={setSelectedTag} />
        </div>
      )}

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {!isSidebarCollapsed && (
          <ConversationList
            onSelectConversation={handleSelectConversation}
            selectedId={selectedConversationId || undefined}
            selectedTag={selectedTag || undefined}
            searchQuery={searchQuery || undefined}
          />
        )}
      </div>

      {/* Archive banner (inline in sidebar) */}
      {!isSidebarCollapsed && (
        <div className="px-3 py-3 border-t border-gray-100">
          <ArchiveBanner variant="inline" />
        </div>
      )}
    </nav>
  );

  // Render main content
  const renderContent = () => {
    if (!selectedConversationId || !conversation) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
          <ChatGPTLogo className="w-16 h-16 mb-4" />
          <h2 className="text-xl font-medium text-gray-600 mb-2">
            ChatGPT Archive
          </h2>
          <p className="text-sm text-center max-w-md">
            Select a conversation from the sidebar to view the chat history.
            This is a read-only archive of past conversations.
          </p>
        </div>
      );
    }

    return (
      <div className="flex-1 flex flex-col min-h-0">
        <ConversationHeader conversation={conversation} onBack={handleBack} />
        <div className="flex-1 overflow-y-auto">
          <MessageTimeline
            messages={messages}
            isLoading={isLoadingMessages}
            hasMore={hasMoreMessages}
            onLoadMore={loadMoreMessages}
            highlightMessageId={highlightMessageId || undefined}
          />
        </div>
      </div>
    );
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white text-[#333] font-sans relative overflow-hidden drag-handle"
    >
      {/* Window controls */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-3 drag-handle">
        <button
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow(windowId);
          }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            maximizeWindow(windowId);
          }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Square size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(windowId);
          }}
          className="p-1 hover:bg-red-100 rounded-md text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {renderSidebar()}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

/**
 * ChatGPT Logo SVG
 */
const ChatGPTLogo = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 509.639"
    className={className}
    fill="currentColor"
  >
    <path
      fillRule="nonzero"
      d="M412.037 221.764a90.834 90.834 0 004.648-28.67 90.79 90.79 0 00-12.443-45.87c-16.37-28.496-46.738-46.089-79.605-46.089-6.466 0-12.943.683-19.264 2.04a90.765 90.765 0 00-67.881-30.515h-.576c-.059.002-.149.002-.216.002-39.807 0-75.108 25.686-87.346 63.554-25.626 5.239-47.748 21.31-60.682 44.03a91.873 91.873 0 00-12.407 46.077 91.833 91.833 0 0023.694 61.553 90.802 90.802 0 00-4.649 28.67 90.804 90.804 0 0012.442 45.87c16.369 28.504 46.74 46.087 79.61 46.087a91.81 91.81 0 0019.253-2.04 90.783 90.783 0 0067.887 30.516h.576l.234-.001c39.829 0 75.119-25.686 87.357-63.588 25.626-5.242 47.748-21.312 60.682-44.033a91.718 91.718 0 0012.383-46.035 91.83 91.83 0 00-23.693-61.553l-.004-.005zM275.102 413.161h-.094a68.146 68.146 0 01-43.611-15.8 56.936 56.936 0 002.155-1.221l72.54-41.901a11.799 11.799 0 005.962-10.251V241.651l30.661 17.704c.326.163.55.479.596.84v84.693c-.042 37.653-30.554 68.198-68.21 68.273h.001zm-146.689-62.649a68.128 68.128 0 01-9.152-34.085c0-3.904.341-7.817 1.005-11.663.539.323 1.48.897 2.155 1.285l72.54 41.901a11.832 11.832 0 0011.918-.002l88.563-51.137v35.408a1.1 1.1 0 01-.438.94l-73.33 42.339a68.43 68.43 0 01-34.11 9.12 68.359 68.359 0 01-59.15-34.11l-.001.004zm-19.083-158.36a68.044 68.044 0 0135.538-29.934c0 .625-.036 1.731-.036 2.5v83.801l-.001.07a11.79 11.79 0 005.954 10.242l88.564 51.13-30.661 17.704a1.096 1.096 0 01-1.034.093l-73.337-42.375a68.36 68.36 0 01-34.095-59.143 68.412 68.412 0 019.112-34.085l-.004-.003zm251.907 58.621l-88.563-51.137 30.661-17.697a1.097 1.097 0 011.034-.094l73.337 42.339c21.109 12.195 34.132 34.746 34.132 59.132 0 28.604-17.849 54.199-44.686 64.078v-86.308c.004-.032.004-.065.004-.096 0-4.219-2.261-8.119-5.919-10.217zm30.518-45.93c-.539-.331-1.48-.898-2.155-1.286l-72.54-41.901a11.842 11.842 0 00-5.958-1.611c-2.092 0-4.15.558-5.957 1.611l-88.564 51.137v-35.408l-.001-.061a1.1 1.1 0 01.44-.88l73.33-42.303a68.301 68.301 0 0134.108-9.129c37.704 0 68.281 30.577 68.281 68.281a68.69 68.69 0 01-.984 11.545v.005zm-191.843 63.109l-30.668-17.704a1.09 1.09 0 01-.596-.84v-84.692c.016-37.685 30.593-68.236 68.281-68.236a68.332 68.332 0 0143.689 15.804 63.09 63.09 0 00-2.155 1.222l-72.54 41.9a11.794 11.794 0 00-5.961 10.248v.068l-.05 102.23zm16.655-35.91l39.445-22.782 39.444 22.767v45.55l-39.444 22.767-39.445-22.767v-45.535z"
    />
  </svg>
);

export default ChatGPTArchiveApp;
