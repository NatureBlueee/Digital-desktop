"use client";

import React, { useState, useEffect } from "react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { ChevronUp } from "lucide-react";
import { format } from "date-fns";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import StartIcon from "./icons/StartIcon";
import SearchIcon from "./icons/SearchIcon";
import WifiIcon from "./icons/WifiIcon";
import VolumeIcon from "./icons/VolumeIcon";
import BatteryIcon from "./icons/BatteryIcon";
import FileExplorerIcon from "./icons/FileExplorerIcon";
import WeatherIcon from "./icons/WeatherIcon";

interface SortableAppProps {
  app: { id: string; icon: string; title: string };
  isActive: boolean;
  isOpen: boolean;
  onClick: () => void;
}

function SortableApp({ app, isActive, isOpen, onClick }: SortableAppProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: app.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Custom SVG for File Explorer
  if (app.id === 'file-explorer') {
    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <button
            onClick={onClick}
            className={cn(
                "h-10 flex items-center justify-center rounded-md transition-all relative group px-1",
                isActive ? "bg-white/60 shadow-sm" : "hover:bg-white/40"
            )}
            title={app.title}
        >
            <FileExplorerIcon className={cn("transition-transform duration-200", isActive ? "scale-100" : "group-hover:scale-110")} />
            {isOpen && (
                <div className={cn(
                    "absolute bottom-0.5 w-1.5 h-1 rounded-full transition-all duration-300",
                    isActive ? "w-4 bg-[#005FB8] h-[3px]" : "bg-gray-400 group-hover:bg-gray-500"
                )} />
            )}
        </button>
      </div>
    );
  }

  const isUrl = app.icon.startsWith('http') || app.icon.startsWith('/');
  const Icon = !isUrl ? (LucideIcons as any)[app.icon] || LucideIcons.AppWindow : null;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        <button
            onClick={onClick}
            className={cn(
                "h-10 w-10 flex items-center justify-center rounded-md transition-all relative group",
                isActive ? "bg-white/60 shadow-sm" : "hover:bg-white/40"
            )}
            title={app.title}
        >
            {app.id === 'widgets' ? (
                 <WeatherIcon className="w-[28px] h-[28px] opacity-80 group-hover:scale-105 transition-transform" />
            ) : isUrl ? (
                <img src={app.icon} alt={app.title} className={cn(
                    "w-[30px] h-[30px] object-contain transition-transform duration-200",
                    isActive ? "scale-100" : "group-hover:scale-110"
                )} />
            ) : (
                Icon && <Icon size={30} strokeWidth={1.5} className={cn(
                    "transition-transform duration-200",
                    isActive ? "text-blue-600" : "text-gray-700 group-hover:scale-110"
                )} />
            )}
            
            {/* Active Indicator Line */}
            {isOpen && (
                <div className={cn(
                    "absolute bottom-0.5 w-1.5 h-1 rounded-full transition-all duration-300",
                    isActive ? "w-4 bg-[#005FB8] h-[3px]" : "bg-gray-400 group-hover:bg-gray-500"
                )} />
            )}
        </button>
    </div>
  );
}

export default function Taskbar() {
  const { windows, activeWindowId, minimizeWindow, focusWindow, openWindow, pinnedApps, setPinnedApps } = useDesktopStore();
  const [currentTime, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
        activationConstraint: {
            distance: 5,
        },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = pinnedApps.findIndex((app) => app.id === active.id);
      const newIndex = pinnedApps.findIndex((app) => app.id === over.id);
      setPinnedApps(arrayMove(pinnedApps, oldIndex, newIndex));
    }
  };

  const handleAppClick = (appId: string) => {
    if (appId === 'start') {
        // Toggle start menu (future)
        return;
    }
    if (appId === 'search') {
        return;
    }
    if (appId === 'widgets') {
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
      // Open new window
      const app = pinnedApps.find(a => a.id === appId);
      if (app) {
        openWindow(app.id, app.title);
      }
    }
  };

  // Filter out Start and Search for the sortable list, we'll render them fixed
  const sortableApps = pinnedApps.filter(app => app.id !== 'start' && app.id !== 'search');

  return (
    <div className="absolute bottom-0 w-full h-[48px] bg-[#e1ebff]/90 backdrop-blur-[35px] flex items-center justify-between px-4 z-50 select-none border-t border-white/40 font-[Segoe_UI] antialiased">
      
      {/* Left: Start, Search, Widgets, Apps (Left Aligned) */}
      <div className="flex items-center gap-[26px] h-full pl-2">
        {/* Fixed Start Button */}
        <button 
            className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors group relative"
            title="Start"
            onClick={() => handleAppClick('start')}
        >
            <StartIcon className="transition-transform group-hover:scale-105" />
        </button>

        {/* Fixed Search Bar */}
        <div className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors cursor-pointer group" onClick={() => handleAppClick('search')}>
             <SearchIcon className="opacity-80 group-hover:scale-105 transition-transform" />
        </div>

        {/* Sortable Apps */}
        <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
        >
            <SortableContext 
                items={sortableApps.map(app => app.id)} 
                strategy={horizontalListSortingStrategy}
            >
                {sortableApps.map((app) => {
                    const isOpen = windows.some(w => w.appId === app.id);
                    const isActive = windows.some(w => w.appId === app.id && w.id === activeWindowId);
                    
                    return (
                        <SortableApp 
                            key={app.id} 
                            app={app} 
                            isActive={isActive} 
                            isOpen={isOpen} 
                            onClick={() => handleAppClick(app.id)} 
                        />
                    );
                })}
            </SortableContext>
        </DndContext>
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-[10px] h-full px-2">
        {/* Chevron */}
        <div className="flex items-center justify-center h-8 w-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <ChevronUp size={20} className="text-gray-600" />
        </div>

        {/* Network/Volume/Battery Group */}
        <div className="flex items-center gap-[10px] px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <WifiIcon />
            <VolumeIcon />
            <BatteryIcon className="scale-90" />
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end justify-center h-[32px] w-[64px] hover:bg-white/50 rounded-md cursor-default transition-colors" style={{ fontFamily: '"Open Sans", sans-serif' }}>
            <span className="text-[12px] text-black font-normal leading-[16px] text-right">{format(currentTime, 'HH:mm')}</span>
            <span className="text-[12px] text-black font-normal leading-[16px] text-right">{format(currentTime, 'yyyy/MM/dd')}</span>
        </div>

        {/* Show Desktop Line */}
        <div className="w-0.5 h-4 border-l border-gray-400/30 ml-2 hover:bg-white/50 cursor-pointer" title="Show Desktop"></div>
      </div>
    </div>
  );
}
