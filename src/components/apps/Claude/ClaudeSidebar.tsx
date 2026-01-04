import React from 'react';
import { cn } from '@/lib/utils';
import { Star, ChevronUp } from 'lucide-react';
import { useConversations } from './hooks/useClaudeData';
import type { ConversationListItem } from '@/types/claude-archive';

// Custom icons to match Claude's design
const NewChatIcon = ({ className }: { className?: string }) => (
  <div className={cn("w-5 h-5 rounded-md bg-[#D97757] flex items-center justify-center", className)}>
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-white">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  </div>
);

const ChatsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", className)}>
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ProjectsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", className)}>
    <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ArtifactsIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", className)}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="19" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="5" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="19" cy="19" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6.5 6.5L9.5 9.5M14.5 9.5L17.5 6.5M9.5 14.5L6.5 17.5M14.5 14.5L17.5 17.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", className)}>
    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const SidebarToggleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" className={cn("w-5 h-5", className)}>
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M9 3v18" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

interface ClaudeSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeView: 'chat' | 'projects' | 'artifacts' | 'code';
  onViewChange: (view: 'chat' | 'projects' | 'artifacts' | 'code') => void;
  onSelectConversation?: (conversation: ConversationListItem) => void;
  onNewChat?: () => void;
  selectedConversationId?: string;
}

export const ClaudeSidebar: React.FC<ClaudeSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  activeView,
  onViewChange,
  onSelectConversation,
  onNewChat,
  selectedConversationId,
}) => {
  const { conversations, starredConversations, loading } = useConversations();

  const navItems = [
    { id: 'chat', label: 'New chat', icon: NewChatIcon, action: () => { onNewChat?.(); onViewChange('chat'); }, isNewChat: true },
    { id: 'recents', label: 'Chats', icon: ChatsIcon, action: () => onViewChange('chat') },
    { id: 'projects', label: 'Projects', icon: ProjectsIcon, action: () => onViewChange('projects') },
    { id: 'artifacts', label: 'Artifacts', icon: ArtifactsIcon, action: () => onViewChange('artifacts') },
    { id: 'code', label: 'Code', icon: CodeIcon, action: () => onViewChange('code') },
  ];

  // Fallback data
  const fallbackRecentChats = [
    "AI聊天界面美化和API管理工具开发",
    "AI聊天工具皮肤插件和API管理方...",
    "Cambia分析报告",
    "黑客松自我介绍",
    "用Vibe coding建立独立审美的方...",
    "Windows应用移植到macOS",
    "确认关系后的感情变化与困惑"
  ];

  const fallbackStarredChats = ["英语"];

  const displayRecentChats = conversations.length > 0 ? conversations : null;
  const displayStarredChats = starredConversations.length > 0 ? starredConversations : null;

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-[#f5f4ef] transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-[52px]" : "w-[260px]"
      )}
    >
      {/* Header with Claude title and toggle */}
      <div className="p-3 flex items-center justify-between">
        {!isCollapsed && (
          <h1 className="text-xl font-semibold text-gray-900 pl-1">Claude</h1>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#e5e4df] rounded-lg text-gray-500 hover:text-gray-700 transition-colors"
        >
          <SidebarToggleIcon />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col px-2 gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={cn(
              "flex items-center gap-3 px-2 py-2 rounded-lg text-sm transition-colors group",
              activeView === item.id
                ? "bg-[#e5e4df] text-gray-900"
                : "text-gray-600 hover:bg-[#e5e4df] hover:text-gray-900"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn(
              "shrink-0",
              item.isNewChat ? "" : "text-gray-500 group-hover:text-gray-700"
            )} />
            {!isCollapsed && (
              <span className="truncate font-medium">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content (Starred & Recents) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 px-2 pb-4">
          {/* Loading State */}
          {loading && (
            <div className="px-2 py-4">
              <div className="animate-pulse space-y-2">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-7 bg-gray-100 rounded" />
                <div className="h-7 bg-gray-100 rounded" />
              </div>
            </div>
          )}

          {/* Starred Section */}
          <div className="mb-4">
            <div className="px-2 mb-1 text-xs font-medium text-gray-400 tracking-wide">
              Starred
            </div>
            <ul className="space-y-0.5">
              {displayStarredChats ? (
                displayStarredChats.map((conv) => (
                  <li key={conv.id}>
                    <button
                      onClick={() => onSelectConversation?.(conv)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-[#e5e4df] text-left truncate",
                        selectedConversationId === conv.id && "bg-[#e5e4df]"
                      )}
                    >
                      <span className="truncate flex-1">{conv.title}</span>
                    </button>
                  </li>
                ))
              ) : (
                fallbackStarredChats.map((chat, i) => (
                  <li key={i}>
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-[#e5e4df] text-left truncate">
                      <span className="truncate flex-1">{chat}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Recents Section */}
          <div>
            <div className="px-2 mb-1 text-xs font-medium text-gray-400 tracking-wide">
              Recents
            </div>
            <ul className="space-y-0.5">
              {displayRecentChats ? (
                displayRecentChats.map((conv) => (
                  <li key={conv.id}>
                    <button
                      onClick={() => onSelectConversation?.(conv)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-[#e5e4df] text-left truncate",
                        selectedConversationId === conv.id && "bg-[#e5e4df]"
                      )}
                    >
                      <span className="truncate flex-1">{conv.title}</span>
                    </button>
                  </li>
                ))
              ) : (
                fallbackRecentChats.map((chat, i) => (
                  <li key={i}>
                    <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-lg hover:bg-[#e5e4df] text-left truncate">
                      <span className="truncate flex-1">{chat}</span>
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {/* User Profile (Bottom) */}
      <div className="mt-auto p-2 border-t border-[#e5e5e5]">
        <button className={cn(
          "flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#e5e4df] transition-colors text-left",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-8 h-8 rounded-full bg-[#1a5f5f] text-white flex items-center justify-center text-sm font-semibold shrink-0">
            N
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">Nature</div>
                <div className="text-xs text-gray-500 truncate">Pro plan</div>
              </div>
              <ChevronUp size={16} className="text-gray-400" />
            </>
          )}
        </button>
      </div>
    </nav>
  );
};
