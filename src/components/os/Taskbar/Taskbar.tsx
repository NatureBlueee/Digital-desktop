"use client";

import React, { useState, useEffect } from "react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { format } from "date-fns";

export default function Taskbar() {
  const { windows, activeWindowId, minimizeWindow, focusWindow, openWindow } = useDesktopStore();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Group windows by appId
  const pinnedApps = [
    { id: 'start', icon: 'https://img.icons8.com/fluency/96/windows-11.png', title: 'Start' },
    { id: 'search', icon: 'https://img.icons8.com/fluency/96/search.png', title: 'Search' },
    { id: 'recycle-bin', icon: 'https://img.icons8.com/fluency/96/trash.png', title: 'Recycle Bin' },
    { id: 'claude', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Claude_AI_logo.svg', title: 'Claude AI' },
    { id: 'github', icon: 'https://img.icons8.com/fluency/96/github.png', title: 'GitHub' },
  ];

  const handleAppClick = (appId: string) => {
    if (appId === 'start') {
        // Toggle start menu (future)
        return;
    }

    const appWindows = windows.filter(w => w.appId === appId);
    if (appWindows.length > 0) {
      const activeAppWindow = appWindows.find(w => w.id === activeWindowId);
      if (activeAppWindow) {
        minimizeWindow(activeAppWindow.id);
      } else {
        // Focus the last active window of this app
        // For simplicity, just focus the first one
        focusWindow(appWindows[0].id);
      }
    } else {
      // Open new window
      openWindow(appId, pinnedApps.find(p => p.id === appId)?.title || appId);
    }
  };

  return (
    <div className="fixed bottom-0 w-full h-12 bg-[#f3f3f3]/85 backdrop-blur-xl flex items-center justify-between px-4 z-50 border-t border-white/20 shadow-lg">
      <div className="flex items-center gap-1 h-full">
        {/* Start & Pinned Apps */}
        {pinnedApps.map((app) => {
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
                            "absolute bottom-0.5 w-1.5 h-1 rounded-full transition-all duration-300",
                            isActive ? "w-4 bg-blue-600" : "bg-gray-400"
                        )} />
                    )}
                </button>
            );
        })}
      </div>

      {/* System Tray */}
      <div className="flex items-center gap-2 h-full px-2 hover:bg-white/50 rounded-md transition-colors cursor-default">
        <div className="flex flex-col items-end justify-center leading-tight">
            <span className="text-xs font-medium text-gray-800">{format(time, "HH:mm")}</span>
            <span className="text-[10px] text-gray-600">{format(time, "yyyy/MM/dd")}</span>
        </div>
      </div>
    </div>
  );
}
