import React from 'react';
import { cn } from '@/lib/utils';
import { PanelLeft, SquarePen, Search, Library, History, LayoutGrid, Folder, CheckCircle2, Ship, Palette, Briefcase, Globe } from 'lucide-react';

interface ChatGPTSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  activeView: 'chat' | 'projects' | 'artifacts' | 'code';
  onViewChange: (view: 'chat' | 'projects' | 'artifacts' | 'code') => void;
}

export const ChatGPTSidebar: React.FC<ChatGPTSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  activeView,
  onViewChange,
}) => {
  const navItems = [
    { id: 'chat', label: '新聊天', icon: SquarePen, action: () => onViewChange('chat') },
    { id: 'search', label: '搜索聊天', icon: Search, action: () => onViewChange('chat') },
    { id: 'library', label: '库', icon: Library, action: () => onViewChange('artifacts') },
    { id: 'codex', label: 'Codex', icon: History, action: () => onViewChange('code') },
  ];

  const gptItems = [
    { label: '探索', icon: LayoutGrid },
    { label: 'Resume/CV', icon: CheckCircle2, color: 'text-blue-500' },
    { label: 'Midjourney | v7.0 | USE', icon: Ship, color: 'text-gray-700' },
    { label: '微信公众号封面设计师', icon: Palette, color: 'text-orange-500' },
  ];

  const projectItems = [
    { label: '新项目', icon: Folder },
    { label: 'WoWok', icon: Folder },
    { label: 'NEU简历', icon: Briefcase, color: 'text-blue-500' },
    { label: '配色设计', icon: Palette, color: 'text-pink-500' },
  ];

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-[#f9f9f9] transition-all duration-300 ease-in-out relative z-20 pt-2",
        isCollapsed ? "w-[60px]" : "w-[260px]"
      )}
    >
      {/* Header */}
      <div className="px-3 mb-2 flex items-center justify-between">
        {!isCollapsed && (
             <div className="flex items-center gap-2 px-2 py-2 hover:bg-gray-200/50 rounded-lg cursor-pointer transition-colors">
                <div className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                    <Globe size={14} className="text-gray-600" />
                </div>
                <span className="font-medium text-gray-700">ChatGPT</span>
             </div>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-200 rounded-md text-gray-500 hover:text-gray-900 transition-colors"
        >
          <PanelLeft size={20} />
        </button>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-col px-2 gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group text-gray-700 hover:bg-gray-200/60",
              activeView === item.id && "bg-gray-200/60"
            )}
            title={isCollapsed ? item.label : undefined}
          >
            <item.icon size={18} className="shrink-0 text-gray-600" />
            {!isCollapsed && (
              <span className="truncate opacity-100 transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 px-4 pb-4 space-y-6">
          {/* GPT Section */}
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2 px-1">GPT</div>
            <ul className="space-y-0.5">
              {gptItems.map((item, i) => (
                <li key={i}>
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200/60 text-left truncate group">
                    <item.icon size={16} className={cn("shrink-0", item.color || "text-gray-500")} />
                    <span className="truncate flex-1">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Projects Section */}
          <div>
            <div className="text-xs font-medium text-gray-400 mb-2 px-1">项目</div>
            <ul className="space-y-0.5">
              {projectItems.map((item, i) => (
                <li key={i}>
                  <button className="w-full flex items-center gap-3 px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-200/60 text-left truncate group">
                    <item.icon size={16} className={cn("shrink-0", item.color || "text-gray-500")} />
                    <span className="truncate flex-1">{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* User Profile (Bottom) */}
      <div className="mt-auto p-3">
        <button className={cn(
          "flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-200/60 transition-colors text-left",
          isCollapsed && "justify-center px-0"
        )}>
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
             <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" className="w-full h-full bg-gray-100" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">张晨曦</div>
              <div className="text-xs text-gray-500 truncate">Plus</div>
            </div>
          )}
        </button>
      </div>
    </nav>
  );
};
