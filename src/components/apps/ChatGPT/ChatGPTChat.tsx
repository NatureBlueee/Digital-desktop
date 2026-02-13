/**
 * ChatGPT 聊天区组件
 * 显示选中对话的消息列表
 */

import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChatGPTMessage, ChatGPTEmptyState, Message } from './ChatGPTMessage';
import {
  ChatGPTLogo,
  ChevronDownIcon,
  AttachIcon,
  VoiceIcon,
  SidebarToggleIcon
} from './icons';

// 对话数据类型（包含消息）
export interface ConversationWithMessages {
  id: string;
  title: string;
  messages: Message[];
}

interface ChatGPTChatProps {
  conversation?: ConversationWithMessages;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const ChatGPTChat: React.FC<ChatGPTChatProps> = ({
  conversation,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 滚动到底部
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation?.messages]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--chatgpt-bg-primary)] relative overflow-hidden">
      {/* 顶部工具栏 */}
      <div className="flex items-center justify-between px-4 py-3 h-14 border-b border-[var(--chatgpt-border-light)]">
        <div className="flex items-center gap-2">
          {/* 侧边栏收起时显示展开按钮 */}
          {isSidebarCollapsed && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-[var(--chatgpt-bg-hover)] transition-colors mr-2"
              title="展开侧边栏"
            >
              <SidebarToggleIcon size={20} className="text-[var(--chatgpt-text-secondary)]" />
            </button>
          )}

          {/* 模型选择器（仅视觉） */}
          <button className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-[var(--chatgpt-bg-hover)] transition-colors">
            <span className="text-[var(--chatgpt-text-primary)] font-medium">ChatGPT</span>
            <span className="text-[var(--chatgpt-text-tertiary)] text-sm">4o</span>
            <ChevronDownIcon size={14} className="text-[var(--chatgpt-text-tertiary)]" />
          </button>
        </div>
      </div>

      {/* 主内容区 */}
      {conversation && conversation.messages.length > 0 ? (
        // 有对话内容时显示消息列表
        <div className="flex-1 overflow-y-auto chatgpt-scrollbar">
          <div className="py-4">
            {conversation.messages.map((message, index) => (
              <ChatGPTMessage
                key={message.id}
                message={message}
                isLast={index === conversation.messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      ) : (
        // 无对话时显示空白状态
        <ChatGPTEmptyState />
      )}

      {/* 底部输入区域（仅视觉展示，不可用） */}
      <div className="p-4 pb-6">
        <div className="max-w-3xl mx-auto">
          <div
            className={cn(
              "relative rounded-3xl",
              "bg-[var(--chatgpt-input-bg)]",
              "border border-transparent",
              "focus-within:border-[var(--chatgpt-border)]",
              "transition-colors"
            )}
          >
            {/* 输入框 */}
            <div className="px-4 py-3">
              <textarea
                rows={1}
                placeholder="发送消息"
                disabled
                className={cn(
                  "w-full bg-transparent resize-none outline-none",
                  "text-[var(--chatgpt-text-primary)]",
                  "placeholder:text-[var(--chatgpt-input-placeholder)]",
                  "text-base leading-6",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              />
            </div>

            {/* 底部工具栏 */}
            <div className="flex items-center justify-between px-3 pb-3">
              {/* 左侧按钮 */}
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="p-2 rounded-lg text-[var(--chatgpt-text-tertiary)] hover:bg-[var(--chatgpt-bg-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="添加附件"
                >
                  <AttachIcon size={20} />
                </button>
              </div>

              {/* 右侧按钮 */}
              <div className="flex items-center gap-1">
                <button
                  disabled
                  className="p-2 rounded-lg text-[var(--chatgpt-text-tertiary)] hover:bg-[var(--chatgpt-bg-hover)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="语音输入"
                >
                  <VoiceIcon size={20} />
                </button>
                <button
                  disabled
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    "bg-[var(--chatgpt-text-quaternary)]",
                    "text-[var(--chatgpt-bg-primary)]",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                  title="发送（只读模式）"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4L4 12H9V20H15V12H20L12 4Z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* 底部提示文字 */}
          <p className="text-xs text-center text-[var(--chatgpt-text-tertiary)] mt-3">
            此界面仅用于展示聊天记录，不支持发送消息
          </p>
        </div>
      </div>
    </div>
  );
};
