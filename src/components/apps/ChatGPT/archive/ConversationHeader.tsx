'use client';

import React from 'react';
import { ArrowLeft, Calendar, MessageSquare, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConversationDetail } from '@/types/chatgpt-archive';
import { format } from 'date-fns';

interface ConversationHeaderProps {
  conversation: ConversationDetail;
  onBack: () => void;
  className?: string;
}

/**
 * ConversationHeader - 对话详情头部
 *
 * 显示对话标题、摘要、标签和元信息
 */
export const ConversationHeader: React.FC<ConversationHeaderProps> = ({
  conversation,
  onBack,
  className,
}) => {
  const createdDate = formatDate(conversation.created_at);
  const updatedDate = formatDate(conversation.updated_at);

  return (
    <div
      className={cn(
        'sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100',
        className
      )}
    >
      <div className="px-4 py-3">
        {/* Back button and title */}
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-1.5 -ml-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {conversation.title}
          </h1>
        </div>

        {/* Summary */}
        {conversation.summary && (
          <p className="text-sm text-gray-500 mb-3 pl-8 line-clamp-2">
            {conversation.summary}
          </p>
        )}

        {/* Metadata row */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pl-8">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            Created {createdDate}
          </span>
          {updatedDate !== createdDate && (
            <span className="flex items-center gap-1">
              Updated {updatedDate}
            </span>
          )}
          <span className="flex items-center gap-1">
            <MessageSquare size={12} />
            {conversation.message_count} messages
          </span>
        </div>

        {/* Tags */}
        {conversation.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pl-8">
            {conversation.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                <Tag size={10} />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * 格式化日期
 */
function formatDate(dateStr: string): string {
  try {
    return format(new Date(dateStr), 'MMM d, yyyy');
  } catch {
    return '';
  }
}

export default ConversationHeader;
