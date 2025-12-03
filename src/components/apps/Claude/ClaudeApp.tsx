import React, { useState, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { Minus, Square, X } from 'lucide-react';
import { ClaudeSidebar } from './ClaudeSidebar';
import { ClaudeChat } from './ClaudeChat';
import { ClaudeProjects } from './ClaudeProjects';
import { ClaudeArtifacts } from './ClaudeArtifacts';

interface ClaudeAppProps {
  windowId: string;
}

export const ClaudeApp: React.FC<ClaudeAppProps> = ({ windowId }) => {
  const { closeWindow, minimizeWindow, maximizeWindow, windows } = useDesktopStore();
  const [activeView, setActiveView] = useState<'chat' | 'projects' | 'artifacts' | 'code'>('chat');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000);

  // Track window width for responsive behavior
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
        // Auto-collapse sidebar on very small screens
        if (entry.contentRect.width < 640) {
          setIsSidebarCollapsed(true);
        }
      }
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'projects': return <ClaudeProjects />;
      case 'artifacts': return <ClaudeArtifacts />;
      case 'code': return (
        <div className="flex-1 flex flex-col items-center justify-center bg-white h-full text-gray-500">
          <div className="p-8 text-center">
            <h2 className="text-xl font-serif font-medium text-gray-900 mb-2">Code</h2>
            <p>Code snippets and repositories will appear here.</p>
          </div>
        </div>
      );
      default: return <ClaudeChat />;
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full w-full bg-[#f5f4ef] text-[#333] font-sans relative overflow-hidden rounded-lg border border-gray-200/50 shadow-xl"
    >
      {/* Custom Title Bar / Window Controls */}
      {/* We hide the default title bar in WindowManager, so we build a custom one here that matches Claude's look */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-3 drag-handle">
        <button 
          onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); maximizeWindow(windowId); }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Square size={14} />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
          className="p-1 hover:bg-red-100 rounded-md text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative pt-0"> {/* pt-0 because sidebar handles its own top spacing or we want full height */}
        <ClaudeSidebar 
          isCollapsed={isSidebarCollapsed} 
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          activeView={activeView}
          onViewChange={setActiveView}
        />
        
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-tl-2xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border-l border-gray-100/50 ml-[-1px] z-10 relative">
           {/* The main content area has a rounded top-left corner to simulate the paper-like effect */}
           {renderContent()}
        </main>
      </div>
    </div>
  );
};
