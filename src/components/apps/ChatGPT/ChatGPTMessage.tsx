/**
 * ChatGPT 消息组件
 * 用于显示单条聊天消息（用户或 AI）
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { ChatGPTLogo } from './icons';

// 消息数据类型
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

interface ChatGPTMessageProps {
  message: Message;
  isLast?: boolean;
}

export const ChatGPTMessage: React.FC<ChatGPTMessageProps> = ({ message, isLast = false }) => {
  const isUser = message.role === 'user';

  return (
    <div
      className={cn(
        "w-full py-4",
        isUser ? "bg-transparent" : "bg-transparent"
      )}
    >
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex gap-4">
          {/* 头像 */}
          <div className="flex-shrink-0 mt-1">
            {isUser ? (
              // 用户头像
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
                U
              </div>
            ) : (
              // ChatGPT 头像
              <div className="w-8 h-8 rounded-full overflow-hidden bg-[#10a37f] flex items-center justify-center">
                <ChatGPTLogo size={20} className="text-white" />
              </div>
            )}
          </div>

          {/* 消息内容 */}
          <div className="flex-1 min-w-0">
            {/* 角色名称 */}
            <div className="font-semibold text-[var(--chatgpt-text-primary)] text-sm mb-1">
              {isUser ? '你' : 'ChatGPT'}
            </div>

            {/* 消息文本 */}
            <div
              className={cn(
                "prose prose-sm max-w-none",
                "text-[var(--chatgpt-text-primary)]",
                // 基本样式
                "[&_p]:my-2 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0",
                // 代码块样式
                "[&_pre]:bg-[var(--chatgpt-bg-tertiary)] [&_pre]:rounded-lg [&_pre]:p-4 [&_pre]:overflow-x-auto",
                "[&_code]:bg-[var(--chatgpt-bg-tertiary)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm",
                "[&_pre_code]:bg-transparent [&_pre_code]:p-0",
                // 列表样式
                "[&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6",
                "[&_li]:my-1",
                // 链接样式
                "[&_a]:text-[var(--chatgpt-accent)] [&_a]:underline",
                // 引用样式
                "[&_blockquote]:border-l-4 [&_blockquote]:border-[var(--chatgpt-border)] [&_blockquote]:pl-4 [&_blockquote]:italic"
              )}
            >
              {/* 简单的 Markdown 渲染 - 实际项目中可以使用 react-markdown */}
              {message.content.split('\n').map((line, index) => {
                // 处理代码块
                if (line.startsWith('```')) {
                  return null; // 简化处理，实际项目需要完整的 Markdown 解析
                }
                // 处理内联代码
                if (line.includes('`')) {
                  const parts = line.split(/`([^`]+)`/);
                  return (
                    <p key={index}>
                      {parts.map((part, i) =>
                        i % 2 === 1 ? (
                          <code key={i}>{part}</code>
                        ) : (
                          <span key={i}>{part}</span>
                        )
                      )}
                    </p>
                  );
                }
                // 处理空行
                if (line.trim() === '') {
                  return <br key={index} />;
                }
                // 普通文本
                return <p key={index}>{line}</p>;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 空白状态组件 - 当没有选中对话时显示
export const ChatGPTEmptyState: React.FC = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 pb-20">
      {/* ChatGPT Logo */}
      <div className="mb-8">
        <div className="w-16 h-16 text-[var(--chatgpt-text-primary)]">
          <ChatGPTLogo size={64} className="w-full h-full" />
        </div>
      </div>

      {/* 欢迎文案 */}
      <h1 className="text-2xl font-medium text-[var(--chatgpt-text-primary)] text-center">
        有什么可以帮忙的？
      </h1>
    </div>
  );
};
