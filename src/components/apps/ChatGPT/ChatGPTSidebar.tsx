/**
 * ChatGPT 侧边栏组件
 * 像素级还原官方 ChatGPT 侧边栏界面
 */

import React from 'react';
import { cn } from '@/lib/utils';
import {
  ChatGPTLogo,
  SidebarToggleIcon,
  NewChatIcon,
  SearchIcon,
  ProjectIcon,
  MoreIcon,
  MoonIcon,
  SunIcon
} from './icons';

// 对话数据类型
export interface Conversation {
  id: string;
  title: string;
  updatedAt: Date;
  projectId?: string;
}

// 项目数据类型
export interface Project {
  id: string;
  name: string;
  color?: string;
}

interface ChatGPTSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  conversations: Conversation[];
  projects?: Project[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

// 辅助函数：按日期分组对话
function groupConversationsByDate(conversations: Conversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

  const groups: { [key: string]: Conversation[] } = {
    '今天': [],
    '昨天': [],
    '过去 7 天': [],
    '过去 30 天': [],
    '更早': [],
  };

  conversations.forEach((conv) => {
    const date = new Date(conv.updatedAt);
    if (date >= today) {
      groups['今天'].push(conv);
    } else if (date >= yesterday) {
      groups['昨天'].push(conv);
    } else if (date >= sevenDaysAgo) {
      groups['过去 7 天'].push(conv);
    } else if (date >= thirtyDaysAgo) {
      groups['过去 30 天'].push(conv);
    } else {
      groups['更早'].push(conv);
    }
  });

  return groups;
}

export const ChatGPTSidebar: React.FC<ChatGPTSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  conversations,
  projects = [],
  activeConversationId,
  onSelectConversation,
  theme = 'light',
  onToggleTheme,
}) => {
  const groupedConversations = groupConversationsByDate(conversations);

  // 收起状态时只显示切换按钮
  if (isCollapsed) {
    return (
      <div className="flex flex-col h-full w-0 overflow-hidden transition-all duration-300">
        {/* 收起状态不显示任何内容 */}
      </div>
    );
  }

  return (
    <nav
      className={cn(
        "flex flex-col h-full transition-all duration-300 ease-in-out relative",
        "w-[260px] bg-[var(--chatgpt-sidebar-bg,#f9f9f9)]"
      )}
      style={{
        backgroundColor: 'var(--chatgpt-sidebar-bg)',
      }}
    >
      {/* 顶部区域：Logo + 新建聊天 + 收起按钮 */}
      <div className="flex items-center justify-between px-3 py-3 h-14">
        {/* 左侧：收起按钮 */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors"
          title="收起侧边栏"
        >
          <SidebarToggleIcon size={20} className="text-[var(--chatgpt-text-secondary)]" />
        </button>

        {/* 右侧：新建聊天按钮 */}
        <button
          className="p-2 rounded-lg hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors"
          title="新建聊天"
        >
          <NewChatIcon size={20} className="text-[var(--chatgpt-text-secondary)]" />
        </button>
      </div>

      {/* 搜索按钮 */}
      <div className="px-3 mb-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[var(--chatgpt-text-secondary)] hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors">
          <SearchIcon size={18} className="shrink-0" />
          <span>搜索</span>
        </button>
      </div>

      {/* 可滚动的对话列表区域 */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden chatgpt-scrollbar px-2">
        {/* 按日期分组的对话列表 */}
        {Object.entries(groupedConversations).map(([groupName, items]) => {
          if (items.length === 0) return null;

          return (
            <div key={groupName} className="mb-4">
              {/* 分组标题 */}
              <div className="px-3 py-2 text-xs font-medium text-[var(--chatgpt-text-tertiary)]">
                {groupName}
              </div>

              {/* 对话列表 */}
              <ul className="space-y-0.5">
                {items.map((conv) => (
                  <li key={conv.id}>
                    <button
                      onClick={() => onSelectConversation(conv.id)}
                      className={cn(
                        "w-full group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors text-left",
                        activeConversationId === conv.id
                          ? "bg-[var(--chatgpt-sidebar-active)]"
                          : "hover:bg-[var(--chatgpt-sidebar-hover)]"
                      )}
                    >
                      {/* 对话标题 */}
                      <span className="flex-1 truncate text-[var(--chatgpt-text-primary)]">
                        {conv.title}
                      </span>

                      {/* Hover 时显示更多按钮 */}
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreIcon size={16} className="text-[var(--chatgpt-text-tertiary)]" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}

        {/* 项目分组（如果有） */}
        {projects.length > 0 && (
          <div className="mb-4 mt-6">
            <div className="px-3 py-2 text-xs font-medium text-[var(--chatgpt-text-tertiary)]">
              项目
            </div>
            <ul className="space-y-0.5">
              {projects.map((project) => (
                <li key={project.id}>
                  <button className="w-full group flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors text-left">
                    <ProjectIcon
                      size={18}
                      className="shrink-0"
                      style={{ color: project.color || 'var(--chatgpt-text-secondary)' }}
                    />
                    <span className="flex-1 truncate text-[var(--chatgpt-text-primary)]">
                      {project.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 底部区域：用户信息 + 主题切换 */}
      <div className="mt-auto border-t border-[var(--chatgpt-border-light)] p-3">
        <div className="flex items-center justify-between">
          {/* 用户信息 */}
          <button className="flex items-center gap-3 flex-1 p-2 rounded-lg hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-medium">
              U
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="text-sm font-medium text-[var(--chatgpt-text-primary)] truncate">
                用户
              </div>
            </div>
          </button>

          {/* 主题切换按钮 */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg hover:bg-[var(--chatgpt-sidebar-hover)] transition-colors"
              title={theme === 'light' ? '切换到深色模式' : '切换到浅色模式'}
            >
              {theme === 'light' ? (
                <MoonIcon size={18} className="text-[var(--chatgpt-text-secondary)]" />
              ) : (
                <SunIcon size={18} className="text-[var(--chatgpt-text-secondary)]" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};
