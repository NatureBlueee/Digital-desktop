import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Plus, SlidersHorizontal, History, PenLine, GraduationCap, Code2, Coffee, HardDrive } from "lucide-react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import ClaudeSidebar from "./ClaudeSidebar";

interface ClaudeAppProps {
  windowId: string;
}

export default function ClaudeApp({ windowId }: ClaudeAppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(1000); // Default width

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setWidth(entry.contentRect.width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full bg-[#f0efe9] font-sans text-[#3e3e3c] animate-pulse">
        {/* Skeleton Header */}
        <div className="h-10 flex items-center justify-between px-4 shrink-0 drag-handle">
            <div className="w-20 h-4 bg-gray-300 rounded"></div>
            <div className="flex gap-2">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            </div>
        </div>
        
        {/* Skeleton Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full gap-8">
            <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
            <div className="w-64 h-8 bg-gray-300 rounded"></div>
            <div className="w-full h-32 bg-gray-300 rounded-2xl"></div>
            <div className="flex gap-4">
                <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
                <div className="w-20 h-8 bg-gray-300 rounded-full"></div>
            </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="flex h-full bg-[#f0efe9] font-sans text-[#3e3e3c] overflow-hidden rounded-lg border-t border-black/10">
      
      {/* Sidebar */}
      <ClaudeSidebar windowWidth={width} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative bg-[#f0efe9]">
          {/* Header (Custom Title Bar) */}
          <div className="h-10 flex items-center justify-between px-4 shrink-0 drag-handle select-none relative z-10">
            {/* Left: Menu Icon (Placeholder - handled by Sidebar if collapsed) */}
            <div className="flex items-center w-8">
                {/* Space for sidebar toggle if needed */}
            </div>

            {/* Center: Title */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <span className="text-xs font-medium text-gray-500">Claude — Control+Alt+Space</span>
            </div>

            {/* Right: Window Controls */}
            <div className="flex items-center gap-4 no-drag">
                {/* Minimize */}
                <button onClick={() => minimizeWindow(windowId)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <svg width="13" height="1" viewBox="0 0 13 1" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="13" height="1" rx="0.5" fill="black"/>
                    </svg>
                </button>
                
                {/* Maximize */}
                <button onClick={() => maximizeWindow(windowId)} className="p-1 hover:bg-gray-200 rounded transition-colors">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.5" y="0.5" width="11" height="11" rx="0.5" stroke="black"/>
                    </svg>
                </button>

                {/* Close */}
                <button onClick={() => closeWindow(windowId)} className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors group">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeLinecap="round"/>
                    </svg>
                </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full relative">
            
            {/* Greeting */}
            <div className="flex flex-col items-center gap-6 mb-12">
                <div className="w-12 h-12 text-[#d97757]">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-serif text-[#3e3e3c]">Golden hour thinking</h1>
            </div>

            {/* Input Box */}
            <div className="w-full bg-[#fbfaf8] rounded-2xl shadow-sm border border-gray-200/50 p-4 flex flex-col gap-4">
                <textarea 
                    className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-gray-500 min-h-[60px]"
                    placeholder="How can I help you today?"
                    readOnly
                />
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-gray-500 border border-gray-200">
                            <Plus size={18} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-gray-500 border border-gray-200">
                            <SlidersHorizontal size={16} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors text-blue-500 bg-blue-50 border border-blue-100">
                            <History size={16} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-xs font-medium text-gray-500">Opus 4.5</span>
                        <button className="w-8 h-8 bg-[#d97757]/40 text-white rounded-lg flex items-center justify-center cursor-default">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 19V5M5 12l7-7 7 7"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/50 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
                    <PenLine size={16} />
                    <span>Write</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/50 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
                    <GraduationCap size={16} />
                    <span>Learn</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/50 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
                    <Code2 size={16} />
                    <span>Code</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/50 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
                    <Coffee size={16} />
                    <span>Life stuff</span>
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200/50 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors shadow-sm text-gray-600">
                    <div className="w-4 h-4 flex items-center justify-center">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png" alt="Drive" className="w-full h-full object-contain" />
                    </div>
                    <span>From Drive</span>
                </button>
            </div>

          </div>

          {/* Footer User (Moved to Sidebar) */}
          {/* <div className="p-4 absolute bottom-0 left-0">
            <div className="w-8 h-8 rounded-full bg-[#3e3e3c] text-white flex items-center justify-center text-xs font-medium">
                N
            </div>
          </div> */}
      </div>
    </div>
  );
}
