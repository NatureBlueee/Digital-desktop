'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Calendar, Tag, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationListItem, PaginatedResponse } from '@/types/chatgpt-archive';
import { format } from 'date-fns';

interface ConversationListProps {
  onSelectConversation: (id: string) => void;
  selectedId?: string;
  selectedTag?: string;
  searchQuery?: string;
  className?: string;
}

/**
 * ConversationList - 对话列表组件
 *
 * 功能：
 * - 显示公开对话列表
 * - 标签筛选
 * - 标题搜索
 * - 无限滚动分页
 */
export const ConversationList: React.FC<ConversationListProps> = ({
  onSelectConversation,
  selectedId,
  selectedTag,
  searchQuery,
  className,
}) => {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch conversations
  const fetchConversations = useCallback(
    async (cursor?: string, append = false) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();
        if (cursor) params.set('cursor', cursor);
        if (selectedTag) params.set('tag', selectedTag);
        if (searchQuery) params.set('query', searchQuery);
        params.set('limit', '30');

        const response = await fetch(`/api/chatgpt/conversations?${params}`);
        const result = await response.json();

        if (!result.success) {
          throw new Error(result.error || 'Failed to fetch conversations');
        }

        const data = result.data as PaginatedResponse<ConversationListItem>;

        if (append) {
          setConversations((prev) => [...prev, ...data.data]);
        } else {
          setConversations(data.data);
        }

        setHasMore(data.has_more);
        setNextCursor(data.next_cursor);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    },
    [selectedTag, searchQuery]
  );

  // Initial load and reload on filter change
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Load more handler
  const loadMore = useCallback(() => {
    if (nextCursor && !isLoading) {
      fetchConversations(nextCursor, true);
    }
  }, [nextCursor, isLoading, fetchConversations]);

  if (error) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-red-500', className)}>
        <div className="text-sm mb-2">Failed to load conversations</div>
        <button
          onClick={() => fetchConversations()}
          className="text-xs text-blue-500 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isLoading && conversations.length === 0) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-8 text-gray-500', className)}>
        <MessageSquare size={32} className="mb-3 text-gray-300" />
        <div className="text-sm">No conversations found</div>
        {(selectedTag || searchQuery) && (
          <div className="text-xs mt-1">Try adjusting your filters</div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('divide-y divide-gray-100', className)}>
      {conversations.map((conversation) => (
        <ConversationListItemCard
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
        />
      ))}

      {/* Load more */}
      {hasMore && (
        <div className="py-4 flex justify-center">
          {isLoading ? (
            <Loader2 size={20} className="animate-spin text-gray-400" />
          ) : (
            <button
              onClick={loadMore}
              className="text-sm text-gray-500 hover:text-gray-700 hover:underline"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {/* Initial loading */}
      {isLoading && conversations.length === 0 && (
        <div className="py-8 flex justify-center">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
};

/**
 * ConversationListItemCard - 单个对话列表项
 */
interface ItemCardProps {
  conversation: ConversationListItem;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationListItemCard: React.FC<ItemCardProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const formattedDate = formatDate(conversation.updated_at);

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors group',
        isSelected && 'bg-gray-100'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="font-medium text-gray-900 truncate mb-1">
            {conversation.title}
          </div>

          {/* Summary or metadata */}
          {conversation.summary ? (
            <div className="text-sm text-gray-500 line-clamp-2 mb-2">
              {conversation.summary}
            </div>
          ) : null}

          {/* Meta row */}
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare size={12} />
              {conversation.message_count}
            </span>
          </div>

          {/* Tags */}
          {conversation.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {conversation.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                >
                  <Tag size={10} />
                  {tag}
                </span>
              ))}
              {conversation.tags.length > 3 && (
                <span className="text-xs text-gray-400">
                  +{conversation.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Arrow */}
        <ChevronRight
          size={18}
          className="text-gray-300 group-hover:text-gray-400 mt-1"
        />
      </div>
    </button>
  );
};

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (date.getFullYear() === now.getFullYear()) {
      return format(date, 'MMM d');
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export default ConversationList;
