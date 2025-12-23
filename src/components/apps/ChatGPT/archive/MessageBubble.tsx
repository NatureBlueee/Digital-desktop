'use client';

import React from 'react';
import { User, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Message, MessageRole } from '@/types/chatgpt-archive';
import { MarkdownRenderer } from './MarkdownRenderer';
import { AssetCard } from './AssetCard';
import { format } from 'date-fns';

interface MessageBubbleProps {
  message: Message;
  className?: string;
  showTimestamp?: boolean;
}

/**
 * MessageBubble - 消息气泡组件
 *
 * 按角色（user/assistant/system）显示不同样式的消息
 */
export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  className,
  showTimestamp = false,
}) => {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className={cn('flex justify-center my-4', className)}>
        <div className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-500 italic">
          {message.content_md}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex gap-4 py-6 px-4 md:px-6',
        isUser ? 'bg-white' : 'bg-gray-50/50',
        className
      )}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-gray-700' : 'bg-emerald-600'
          )}
        >
          {isUser ? (
            <User size={18} className="text-white" />
          ) : (
            <Bot size={18} className="text-white" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-3">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-900">
            {isUser ? 'You' : 'ChatGPT'}
          </span>
          {showTimestamp && message.created_at && (
            <span className="text-xs text-gray-400">
              {formatTimestamp(message.created_at)}
            </span>
          )}
        </div>

        {/* Message content */}
        <div className="text-gray-700">
          <MarkdownRenderer content={message.content_md} />
        </div>

        {/* Assets */}
        {message.assets && message.assets.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-4">
            {message.assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 格式化时间戳
 */
function formatTimestamp(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isThisYear = date.getFullYear() === now.getFullYear();

    if (isToday) {
      return format(date, 'HH:mm');
    }
    if (isThisYear) {
      return format(date, 'MMM d, HH:mm');
    }
    return format(date, 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export default MessageBubble;
