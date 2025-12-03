"use client";

import React, { useState, useEffect } from "react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { ChevronUp, Wifi, Volume2, Battery } from "lucide-react";
import { format } from "date-fns";

export default function Taskbar() {
  const { windows, activeWindowId, minimizeWindow, focusWindow, openWindow } = useDesktopStore();
  const [currentTime, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pinned apps configuration
  const pinnedApps = [
    { id: 'start', icon: 'https://img.icons8.com/fluency/96/windows-11.png', title: 'Start' },
    { id: 'search', icon: 'https://img.icons8.com/fluency/96/search.png', title: 'Search' },
    { id: 'task-view', icon: 'https://img.icons8.com/fluency/96/task-view.png', title: 'Task View' },
    { id: 'wechat', icon: 'https://icons.iconarchive.com/icons/juancadr/software/256/WeChat-icon.png', title: 'WeChat' },
    { id: 'file-explorer', icon: 'https://img.icons8.com/fluency/96/folder-invoices--v1.png', title: 'File Explorer' },
    { id: 'github', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Github-desktop-logo-symbol.svg/2048px-Github-desktop-logo-symbol.svg.png', title: 'GitHub' },
    { id: 'chrome', icon: 'https://img.icons8.com/fluency/96/chrome.png', title: 'Google Chrome' },
    { id: 'notion', icon: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png', title: 'Notion' },
    { id: 'cursor', icon: 'https://www.cursor.com/assets/images/logo.svg', title: 'Cursor' },
    { id: 'arc', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Arc_Browser_logo.png/600px-Arc_Browser_logo.png', title: 'Arc Browser' },
  ];

  const handleAppClick = (appId: string) => {
    if (appId === 'start') {
        // Toggle start menu (future)
        return;
    }
    if (appId === 'search') {
        return;
    }

    const appWindows = windows.filter(w => w.appId === appId);
    if (appWindows.length > 0) {
      const activeAppWindow = appWindows.find(w => w.id === activeWindowId);
      if (activeAppWindow) {
        minimizeWindow(activeAppWindow.id);
      } else {
        focusWindow(appWindows[0].id);
      }
    } else {
      openWindow(appId, pinnedApps.find(p => p.id === appId)?.title || appId);
    }
  };

  return (
    <div className="absolute bottom-0 w-full h-12 bg-[#f3f3f3]/85 backdrop-blur-xl border-t border-white/40 flex items-center justify-between px-4 z-50 select-none">
      {/* Center: Start & Apps */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 h-full">
        {/* Start Button */}
        <button 
            className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors group relative"
            title="Start"
        >
            <img src="https://img.icons8.com/fluency/96/windows-11.png" alt="Start" className="w-6 h-6 transition-transform group-hover:scale-105" />
        </button>

        {/* Search Bar (Wide) */}
        <div className="h-8 w-48 bg-white/60 hover:bg-white/80 rounded-full flex items-center px-3 gap-2 cursor-text transition-colors border border-gray-200/50 shadow-sm">
            <img src="https://img.icons8.com/fluency/96/search.png" alt="Search" className="w-4 h-4 opacity-70" />
            <span className="text-xs text-gray-500">搜索</span>
            <div className="ml-auto">
                <img src="https://img.icons8.com/fluency/48/sparkling.png" alt="AI" className="w-4 h-4" />
            </div>
        </div>

        {/* Pinned Apps */}
        {pinnedApps.map((app) => {
            if (app.id === 'start' || app.id === 'search') return null;

            const isUrl = app.icon.startsWith('http') || app.icon.startsWith('/');
            const Icon = !isUrl ? (LucideIcons as any)[app.icon] || LucideIcons.AppWindow : null;
            
            const isOpen = windows.some(w => w.appId === app.id);
            const isActive = windows.some(w => w.appId === app.id && w.id === activeWindowId);

            return (
                <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-md transition-all relative group",
                        isActive ? "bg-white shadow-sm" : "hover:bg-white/50"
                    )}
                    title={app.title}
                >
                    {isUrl ? (
                        <img src={app.icon} alt={app.title} className={cn(
                            "w-6 h-6 object-contain transition-transform duration-200",
                            isActive ? "" : "group-hover:scale-110"
                        )} />
                    ) : (
                        Icon && <Icon size={24} strokeWidth={1.5} className={cn(
                            "transition-transform duration-200",
                            isActive ? "text-blue-600" : "text-gray-700 group-hover:scale-110"
                        )} />
                    )}
                    
                    {/* Running Indicator */}
                    {isOpen && (
                        <div className={cn(
                            "absolute bottom-1 w-1.5 h-1.5 rounded-full transition-all duration-300",
                            isActive ? "w-4 bg-blue-500" : "bg-gray-400 group-hover:bg-gray-500"
                        )} />
                    )}
                </button>
            );
        })}
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-2 h-full">
        <div className="flex items-center justify-center h-8 w-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <ChevronUp size={16} className="text-gray-600" />
        </div>
        
        <div className="flex items-center gap-1 px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <span className="text-xs font-medium text-gray-700">中</span>
        </div>

        <div className="flex items-center gap-2 px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <Wifi size={16} className="text-gray-700" />
            <Volume2 size={16} className="text-gray-700" />
            <Battery size={16} className="text-gray-700" />
        </div>

        <div className="flex flex-col items-end justify-center px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors min-w-[70px]">
            <span className="text-xs text-gray-800 leading-none">{format(currentTime, 'HH:mm')}</span>
            <span className="text-[10px] text-gray-600 leading-none mt-0.5">{format(currentTime, 'yyyy/MM/dd')}</span>
        </div>

        <div className="w-1.5 h-full border-l border-gray-300/50 ml-1 hover:bg-white/50 cursor-pointer" title="Show Desktop"></div>
      </div>
    </div>
  );
}
