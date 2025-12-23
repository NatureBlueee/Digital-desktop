'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message } from '@/types/chatgpt-archive';
import { MessageBubble } from './MessageBubble';

interface MessageTimelineProps {
  messages: Message[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  className?: string;
  highlightMessageId?: string;
}

/**
 * MessageTimeline - 消息流组件
 *
 * 功能：
 * - 显示消息列表
 * - 无限滚动加载
 * - 消息高亮（搜索定位）
 * - 空状态
 *
 * NFR: 1000+ 消息仍可顺畅浏览（通过分页实现）
 */
export const MessageTimeline: React.FC<MessageTimelineProps> = ({
  messages,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  className,
  highlightMessageId,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  // Intersection observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasMore || !onLoadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  // Scroll to highlighted message
  useEffect(() => {
    if (highlightMessageId && highlightRef.current) {
      highlightRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [highlightMessageId]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={cn('flex flex-col items-center justify-center py-16 text-gray-500', className)}>
        <div className="text-lg font-medium mb-2">No messages</div>
        <div className="text-sm">This conversation appears to be empty.</div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={cn('divide-y divide-gray-100', className)}>
      {messages.map((message) => {
        const isHighlighted = message.id === highlightMessageId;
        return (
          <div
            key={message.id}
            ref={isHighlighted ? highlightRef : undefined}
            className={cn(
              isHighlighted && 'bg-yellow-50 ring-2 ring-yellow-200 ring-inset'
            )}
          >
            <MessageBubble message={message} showTimestamp />
          </div>
        );
      })}

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 flex justify-center">
          {isLoading ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 size={20} className="animate-spin" />
              <span>Loading more messages...</span>
            </div>
          ) : (
            <button
              onClick={onLoadMore}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Load more
            </button>
          )}
        </div>
      )}

      {/* Initial loading state */}
      {isLoading && messages.length === 0 && (
        <div className="py-16 flex flex-col items-center justify-center text-gray-500">
          <Loader2 size={32} className="animate-spin mb-4" />
          <span>Loading messages...</span>
        </div>
      )}
    </div>
  );
};

export default MessageTimeline;
