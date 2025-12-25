import React, { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { Minus, Square, X, ChevronLeft, ChevronRight, ExternalLink, Star, Users, Zap, Bot, Code2, Sparkles } from 'lucide-react';
import { aiIDEData, getIDEById } from '@/lib/data/ai-ide-data';
import type { AIIDEInfo, AIIDECategory } from '@/types/ai-ide';
import { AIIDESidebar } from './AIIDESidebar';
import { AIIDEDetail } from './AIIDEDetail';
import { AIIDECompare } from './AIIDECompare';

interface AIIDEAppProps {
  windowId: string;
  initialIDE?: string; // 'cursor' | 'antigravity' etc
}

export const AIIDEApp: React.FC<AIIDEAppProps> = ({ windowId, initialIDE }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const [selectedIDE, setSelectedIDE] = useState<string | null>(initialIDE || null);
  const [view, setView] = useState<'list' | 'compare'>('list');
  const [category, setCategory] = useState<AIIDECategory>('all');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-collapse sidebar on small screens
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 640) {
          setIsSidebarCollapsed(true);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSelectIDE = (id: string) => {
    setSelectedIDE(id);
    setView('list');
  };

  const selectedIDEData = selectedIDE ? getIDEById(selectedIDE) : null;

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans relative overflow-hidden rounded-lg border border-slate-700/50 shadow-2xl drag-handle"
    >
      {/* Window Controls */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-3 drag-handle">
        <button
          onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
          className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
        >
          <Minus size={14} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); maximizeWindow(windowId); }}
          className="p-1.5 hover:bg-white/10 rounded-md text-slate-400 hover:text-white transition-colors"
        >
          <Square size={12} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
          className="p-1.5 hover:bg-red-500/20 rounded-md text-slate-400 hover:text-red-400 transition-colors"
        >
          <X size={14} />
        </button>
      </div>

      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-700/50 bg-slate-800/30 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Code2 size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">AI IDE Hub</h1>
            <p className="text-xs text-slate-400">Explore AI-Powered Development Tools</p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="ml-auto flex items-center gap-2 mr-20">
          <button
            onClick={() => setView('list')}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              view === 'list'
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Browse
          </button>
          <button
            onClick={() => setView('compare')}
            className={cn(
              "px-3 py-1.5 text-sm rounded-md transition-colors",
              view === 'compare'
                ? "bg-violet-500/20 text-violet-300 border border-violet-500/30"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            )}
          >
            Compare
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AIIDESidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          selectedIDE={selectedIDE}
          onSelectIDE={handleSelectIDE}
          category={category}
          onCategoryChange={setCategory}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-slate-900/50">
          {view === 'compare' ? (
            <AIIDECompare />
          ) : selectedIDEData ? (
            <AIIDEDetail
              ide={selectedIDEData}
              onBack={() => setSelectedIDE(null)}
            />
          ) : (
            <AIIDEOverview onSelectIDE={handleSelectIDE} />
          )}
        </main>
      </div>
    </div>
  );
};

// Overview grid when no IDE is selected
const AIIDEOverview: React.FC<{ onSelectIDE: (id: string) => void }> = ({ onSelectIDE }) => {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-3">
            AI IDE Market 2025
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            92% of developers now use AI coding tools. Explore the leading AI-powered IDEs
            and find the perfect one for your workflow.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Users size={20} />} value="5M+" label="Total Users" color="violet" />
          <StatCard icon={<Bot size={20} />} value="5" label="Major Players" color="blue" />
          <StatCard icon={<Zap size={20} />} value="$10-20" label="Avg. Monthly" color="green" />
          <StatCard icon={<Sparkles size={20} />} value="8+" label="AI Models" color="amber" />
        </div>

        {/* IDE Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {aiIDEData.map((ide) => (
            <IDECard key={ide.id} ide={ide} onClick={() => onSelectIDE(ide.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: 'violet' | 'blue' | 'green' | 'amber';
}> = ({ icon, value, label, color }) => {
  const colorClasses = {
    violet: 'from-violet-500/20 to-purple-500/20 border-violet-500/30 text-violet-400',
    blue: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400',
    green: 'from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-400',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400',
  };

  return (
    <div className={cn(
      "p-4 rounded-xl bg-gradient-to-br border backdrop-blur-sm",
      colorClasses[color]
    )}>
      <div className="flex items-center gap-3">
        {icon}
        <div>
          <div className="text-xl font-bold text-white">{value}</div>
          <div className="text-xs text-slate-400">{label}</div>
        </div>
      </div>
    </div>
  );
};

const IDECard: React.FC<{ ide: AIIDEInfo; onClick: () => void }> = ({ ide, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group p-5 rounded-xl bg-slate-800/50 border border-slate-700/50 hover:border-violet-500/50 hover:bg-slate-800 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-slate-700/50 p-2 flex items-center justify-center group-hover:scale-110 transition-transform">
          <img
            src={ide.logo}
            alt={ide.name}
            className="w-8 h-8 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://img.icons8.com/fluency/96/code.png';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-white truncate">{ide.name}</h3>
            {ide.stats?.rating && (
              <div className="flex items-center gap-1 text-amber-400 text-xs">
                <Star size={12} fill="currentColor" />
                {ide.stats.rating}
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">{ide.company}</p>
          <p className="text-sm text-slate-300 mt-2 line-clamp-2">{ide.tagline}</p>

          <div className="flex items-center gap-2 mt-3">
            <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
              {ide.pricing[0]?.price === 'Free' ? 'Free' : ide.pricing.find(p => p.recommended)?.price || ide.pricing[0]?.price}
            </span>
            <span className="text-xs text-slate-500">{ide.baseEditor}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIIDEApp;
