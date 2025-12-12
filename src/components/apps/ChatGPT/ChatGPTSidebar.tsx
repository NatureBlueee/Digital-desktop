import React from 'react';
import {
  BadgeCheck,
  BookOpen,
  Clock3,
  Folder,
  LayoutGrid,
  PanelLeft,
  Plus,
  Search,
  SquarePen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatGPTConversation } from '@/types';

interface ChatGPTSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  conversations: ChatGPTConversation[];
  activeConversationId: string;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
}

const NavButton: React.FC<{ icon: React.ElementType; label: string; collapsed: boolean; onClick?: () => void; active?: boolean }>
  = ({ icon: Icon, label, collapsed, onClick, active }) => (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 w-full px-3 py-2 rounded-xl text-sm font-medium text-gray-800 hover:bg-gray-200/60 transition-colors group',
        active && 'bg-gray-200/80'
      )}
      title={collapsed ? label : undefined}
    >
      <Icon size={18} className="text-gray-700" />
      {!collapsed && <span className="truncate">{label}</span>}
    </button>
  );

export const ChatGPTSidebar: React.FC<ChatGPTSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  conversations,
  activeConversationId,
  onConversationSelect,
  onNewChat,
}) => {
  const pinned = conversations.filter((item) => item.id !== 'new-conversation').slice(0, 6);

  return (
    <nav
      className={cn(
        'flex flex-col h-full bg-[#f9f9f9] transition-all duration-300 ease-in-out relative z-20 pt-3 border-r border-gray-100',
        isCollapsed ? 'w-[64px]' : 'w-[280px]'
      )}
    >
      <div className="px-3 mb-3 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2 px-2 py-2 rounded-lg">
            <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
              <img src="/icons/chatgpt-icon.svg" alt="ChatGPT" className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">ChatGPT</div>
              <div className="text-xs text-gray-500">同步自网页版导出</div>
            </div>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      <div className="px-3 flex flex-col gap-2">
        <NavButton icon={SquarePen} label="新聊天" collapsed={isCollapsed} onClick={onNewChat} active={activeConversationId === 'new-conversation'} />
        <NavButton icon={Search} label="搜索聊天" collapsed={isCollapsed} />
      </div>

      {!isCollapsed && (
        <div className="mt-4 px-4 space-y-1">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>固定快捷</span>
            <button className="text-[11px] text-gray-400 hover:text-gray-600">管理</button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ShortcutCard icon={LayoutGrid} label="探索 GPTs" />
            <ShortcutCard icon={BadgeCheck} label="工作区" accent />
            <ShortcutCard icon={BookOpen} label="我的库" />
            <ShortcutCard icon={Folder} label="项目" />
          </div>
        </div>
      )}

      {!isCollapsed && (
        <div className="mt-4 px-4 flex-1 overflow-y-auto space-y-4 pb-6">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>近期对话</span>
            <Clock3 size={14} />
          </div>
          <div className="space-y-1">
            {pinned.map((conversation) => (
              <button
                key={conversation.id}
                onClick={() => onConversationSelect(conversation.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-800 hover:bg-gray-200/60 transition-colors text-left truncate',
                  activeConversationId === conversation.id && 'bg-gray-200/80'
                )}
              >
                <span className="w-2 h-2 rounded-full bg-[#10A37F]"></span>
                <span className="truncate flex-1">{conversation.title}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto p-3 border-t border-gray-100 bg-gradient-to-t from-gray-50/80">
        <button
          onClick={onNewChat}
          className={cn(
            'flex items-center gap-3 w-full p-3 rounded-2xl bg-white border border-gray-100 hover:shadow-md transition-shadow',
            isCollapsed && 'justify-center px-0'
          )}
        >
          <div className="w-10 h-10 rounded-full bg-[#10A37F]/10 flex items-center justify-center text-[#10A37F]">
            <Plus size={18} />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col text-left">
              <div className="text-sm font-semibold text-gray-900">开始新对话</div>
              <div className="text-xs text-gray-500">同步后自动出现在这里</div>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};

const ShortcutCard: React.FC<{ icon: React.ElementType; label: string; accent?: boolean }> = ({ icon: Icon, label, accent }) => (
  <button
    className={cn(
      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm border border-gray-100 bg-white hover:shadow-sm transition-shadow',
      accent && 'bg-gradient-to-r from-[#EEF2FF] to-[#E0EAFF] border-none'
    )}
  >
    <Icon size={16} className={accent ? 'text-[#4338CA]' : 'text-gray-700'} />
    <span className="truncate text-gray-800">{label}</span>
  </button>
);
