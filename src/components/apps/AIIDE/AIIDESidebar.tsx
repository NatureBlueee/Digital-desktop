import React from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Layers,
  Puzzle,
  Gift,
  Github,
  Code2
} from 'lucide-react';
import { aiIDEData, getIDEsByCategory } from '@/lib/data/ai-ide-data';
import type { AIIDECategory } from '@/types/ai-ide';

interface AIIDESidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  selectedIDE: string | null;
  onSelectIDE: (id: string) => void;
  category: AIIDECategory;
  onCategoryChange: (cat: AIIDECategory) => void;
}

const categories: { id: AIIDECategory; label: string; icon: React.ReactNode }[] = [
  { id: 'all', label: 'All IDEs', icon: <LayoutGrid size={18} /> },
  { id: 'standalone', label: 'Standalone', icon: <Layers size={18} /> },
  { id: 'extension', label: 'Extensions', icon: <Puzzle size={18} /> },
  { id: 'free', label: 'Free Tier', icon: <Gift size={18} /> },
  { id: 'open-source', label: 'Open Source', icon: <Github size={18} /> },
];

export const AIIDESidebar: React.FC<AIIDESidebarProps> = ({
  isCollapsed,
  onToggle,
  selectedIDE,
  onSelectIDE,
  category,
  onCategoryChange,
}) => {
  const filteredIDEs = getIDEsByCategory(category);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-slate-700/50 bg-slate-800/30 transition-all duration-300",
        isCollapsed ? "w-14" : "w-64"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute top-20 -right-3 z-10 p-1 rounded-full bg-slate-700 border border-slate-600 text-slate-300 hover:text-white hover:bg-slate-600 transition-colors"
        style={{ left: isCollapsed ? '44px' : '252px' }}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      <div className="flex-1 overflow-y-auto py-4">
        {/* Categories */}
        <div className={cn("px-3 mb-4", isCollapsed && "px-2")}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
              Categories
            </h3>
          )}
          <div className="space-y-1">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  category === cat.id
                    ? "bg-violet-500/20 text-violet-300"
                    : "text-slate-400 hover:text-white hover:bg-slate-700/50",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? cat.label : undefined}
              >
                {cat.icon}
                {!isCollapsed && <span className="text-sm">{cat.label}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* IDE List */}
        <div className={cn("px-3", isCollapsed && "px-2")}>
          {!isCollapsed && (
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
              AI IDEs ({filteredIDEs.length})
            </h3>
          )}
          <div className="space-y-1">
            {filteredIDEs.map((ide) => (
              <button
                key={ide.id}
                onClick={() => onSelectIDE(ide.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  selectedIDE === ide.id
                    ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-700/50",
                  isCollapsed && "justify-center px-2"
                )}
                title={isCollapsed ? ide.name : undefined}
              >
                <div className="w-6 h-6 rounded-md bg-slate-700/50 p-0.5 flex items-center justify-center flex-shrink-0">
                  <img
                    src={ide.logo}
                    alt={ide.name}
                    className="w-4 h-4 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/code.png';
                    }}
                  />
                </div>
                {!isCollapsed && (
                  <div className="flex-1 min-w-0 text-left">
                    <div className="text-sm font-medium truncate">{ide.name}</div>
                    <div className="text-xs text-slate-500 truncate">{ide.company}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-slate-700/50">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Code2 size={14} />
            <span>Updated Dec 2025</span>
          </div>
        </div>
      )}
    </aside>
  );
};
