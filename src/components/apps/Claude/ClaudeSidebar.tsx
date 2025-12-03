"use client";

import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import SidebarIcon from "./icons/SidebarIcon";
import ChatIcon from "./icons/ChatIcon";
import ProjectIcon from "./icons/ProjectIcon";
import ArtifactIcon from "./icons/ArtifactIcon";

interface ClaudeSidebarProps {
  windowWidth: number;
}

export default function ClaudeSidebar({ windowWidth }: ClaudeSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Auto-collapse on small screens, but allow manual toggle if needed (though user spec implies automatic based on width)
  // User said: "when width is small, only top left sidebar icon... when larger, full sidebar"
  // Let's assume a breakpoint, e.g., 800px.
  const isSmallScreen = windowWidth < 800;

  if (isSmallScreen) {
    return (
      <div className="absolute top-3 left-4 z-50">
        <button className="p-2 hover:bg-gray-200/50 rounded-md transition-colors">
            <SidebarIcon className="text-[#bfbfba]" />
        </button>
      </div>
    );
  }

  return (
    <nav className="flex flex-col px-0 relative transition duration-100 border-r border-[#e5e5e5] h-full bg-[#f9f9f9] w-[260px] shrink-0" aria-label="Sidebar">
      {/* Header with Logo and Toggle */}
      <div className="flex w-full items-center p-3 justify-between">
        <div className="flex items-center gap-1.5 pl-2">
            {/* Claude Logo Text */}
            <span className="font-serif text-lg font-semibold text-[#3e3e3c]">Claude</span>
        </div>
        <button className="p-2 hover:bg-gray-200/50 rounded-md transition-colors group">
            <SidebarIcon className="text-[#bfbfba] group-hover:text-gray-600" />
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex flex-col flex-grow overflow-hidden min-h-0">
        <div className="flex flex-col px-2 pt-2 gap-1">
            
            {/* New Chat */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ececec] transition-colors text-sm font-medium text-[#3e3e3c] group text-left">
                <div className="w-6 h-6 bg-[#d97757] rounded-full flex items-center justify-center text-white shrink-0">
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 3C10.4142 3 10.75 3.33579 10.75 3.75V9.25H16.25C16.6642 9.25 17 9.58579 17 10C17 10.3882 16.7051 10.7075 16.3271 10.7461L16.25 10.75H10.75V16.25C10.75 16.6642 10.4142 17 10 17C9.58579 17 9.25 16.6642 9.25 16.25V10.75H3.75C3.33579 10.75 3 10.4142 3 10C3 9.58579 3.33579 9.25 3.75 9.25H9.25V3.75C9.25 3.33579 9.58579 3 10 3Z"/>
                    </svg>
                </div>
                <span>New chat</span>
            </button>

            {/* Chats */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ececec] transition-colors text-sm font-medium text-[#5e5e5e] group text-left">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#5e5e5e]">
                    <ChatIcon />
                </div>
                <span>Chats</span>
            </button>

            {/* Projects */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ececec] transition-colors text-sm font-medium text-[#5e5e5e] group text-left">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#5e5e5e]">
                    <ProjectIcon />
                </div>
                <span>Projects</span>
            </button>
            
            {/* Artifacts */}
            <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#ececec] transition-colors text-sm font-medium text-[#5e5e5e] group text-left">
                <div className="w-6 h-6 flex items-center justify-center shrink-0 text-[#5e5e5e]">
                    <ArtifactIcon />
                </div>
                <span>Artifacts</span>
            </button>

        </div>

        {/* Recents Section */}
        <div className="flex-1 overflow-y-auto mt-4 px-4">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500 mb-2 px-2">
                <span>Recents</span>
            </div>
            <ul className="flex flex-col gap-1">
                {["wowok理解不错", "人机协作", "英语", "数据所有权与AI时代的web3想象", "塔罗牌解读关系能量", "AI素养与Z世代反向管理", "数字艺术中的灵韵缺失"].map((item, i) => (
                    <li key={i}>
                        <button className="w-full text-left px-3 py-1.5 rounded-md hover:bg-[#ececec] transition-colors text-sm text-[#3e3e3c] truncate">
                            {item}
                        </button>
                    </li>
                ))}
            </ul>
        </div>

        {/* User Profile */}
        <div className="p-3 border-t border-[#e5e5e5]">
            <button className="flex items-center gap-3 w-full p-2 hover:bg-[#ececec] rounded-lg transition-colors text-left">
                <div className="w-8 h-8 rounded-full bg-[#3e3e3c] text-white flex items-center justify-center text-xs font-medium shrink-0">
                    N
                </div>
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[#3e3e3c] truncate">Nature</span>
                    <span className="text-xs text-gray-500 truncate">Pro plan</span>
                </div>
            </button>
        </div>
      </div>
    </nav>
  );
}
