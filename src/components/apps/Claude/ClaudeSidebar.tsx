import React from 'react';
import { cn } from '@/lib/utils';
import { NewChatIcon, ChatsIcon, ProjectsIcon, ArtifactsIcon, CodeIcon } from './ClaudeIcons';
import { PanelLeft, Star, ChevronDown } from 'lucide-react';

interface ClaudeSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeView: 'chat' | 'projects' | 'artifacts' | 'code';
  onViewChange: (view: 'chat' | 'projects' | 'artifacts' | 'code') => void;
}

export const ClaudeSidebar: React.FC<ClaudeSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  activeView,
  onViewChange,
}) => {
  const navItems = [
    { id: 'chat', label: 'New chat', icon: NewChatIcon, action: () => onViewChange('chat') },
    { id: 'recents', label: 'Chats', icon: ChatsIcon, action: () => onViewChange('chat') }, // Maps to chat view for now
    { id: 'projects', label: 'Projects', icon: ProjectsIcon, action: () => onViewChange('projects') },
    { id: 'artifacts', label: 'Artifacts', icon: ArtifactsIcon, action: () => onViewChange('artifacts') },
    { id: 'code', label: 'Code', icon: CodeIcon, action: () => onViewChange('code') },
  ];

  const recentChats = [
    "数据所有权与AI时代的web3想象",
    "塔罗牌解读关系能量",
    "AI素养与Z世代反向管理研究",
    "数字艺术中的灵韵缺失",
    "捕捉真实个性的提示词优化",
    "写作作为逃离与凝视"
  ];

  const starredChats = [
    "wowok理解不错",
    "人机协作",
    "英语"
  ];

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-[#f5f4ef] border-r border-[#e5e5e5] transition-all duration-300 ease-in-out relative z-20",
        isCollapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Toggle Button */}
      <div className="p-3 flex items-center justify-start">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#e5e4df] rounded-md text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col px-3 gap-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg text-sm font-medium transition-colors group",
              activeView === item.id ? "bg-[#e5e4df] text-gray-900" : "text-gray-600 hover:bg-[#e5e4df] hover:text-gray-900"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon className={cn("shrink-0 text-gray-500 group-hover:text-gray-900", activeView === item.id && "text-gray-900")} />
            {!isCollapsed && (
              <span className="truncate opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content (Recents & Starred) */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 px-3 pb-4">
          {/* Starred */}
          <div className="mb-4">
            <div className="flex items-center justify-between px-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span>Starred</span>
            </div>
            <ul className="space-y-0.5">
              {starredChats.map((chat, i) => (
                <li key={i}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-[#e5e4df] text-left truncate group">
                    <span className="truncate flex-1">{chat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Recents */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1 text-xs font-semibold text-gray-500 uppercase tracking-wider group cursor-pointer">
              <span>Recents</span>
              <span className="opacity-0 group-hover:opacity-100 text-[10px]">Hide</span>
            </div>
            <ul className="space-y-0.5">
              {recentChats.map((chat, i) => (
                <li key={i}>
                  <button className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-gray-700 rounded-md hover:bg-[#e5e4df] text-left truncate group">
                    <span className="truncate flex-1">{chat}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* User Profile (Bottom) */}
      <div className="mt-auto p-3 border-t border-[#e5e5e5]">
        <button className={cn(
          "flex items-center gap-3 w-full p-2 rounded-lg hover:bg-[#e5e4df] transition-colors text-left",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-8 h-8 rounded-full bg-orange-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
            N
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">Nature</div>
              <div className="text-xs text-gray-500 truncate">Pro plan</div>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
