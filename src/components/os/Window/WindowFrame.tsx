"use client";

import React from "react";
import { X, Minus, Square } from "lucide-react";
import { cn } from "@/lib/utils";

interface WindowFrameProps {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onFocus: () => void;
  children: React.ReactNode;
  hideTitleBar?: boolean;
}

export default function WindowFrame({ 
  title, 
  isActive, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus,
  children,
  hideTitleBar
}: WindowFrameProps) {
  return (
    <div
      className={cn(
        "flex flex-col h-full w-full rounded-lg overflow-hidden transition-all duration-200 pointer-events-auto",
        isActive
          ? "shadow-2xl border-2 border-blue-400/40"
          : "shadow-md border border-black/5 opacity-90"
      )}
      onClick={onFocus}
    >
      {/* Title Bar */}
      {!hideTitleBar && (
      <div 
        className={cn(
          "h-9 flex items-center justify-between px-3 select-none drag-handle",
          isActive ? "bg-white" : "bg-[#f3f3f3]"
        )}
      >
        <div className="flex items-center gap-2 text-xs font-medium text-gray-700">
          <span>{title}</span>
        </div>
        
        <div className="flex items-center gap-1 h-full no-drag">
          <button 
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="w-8 h-7 flex items-center justify-center hover:bg-gray-200 rounded-sm transition-colors"
          >
            <Minus size={14} className="text-gray-600" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onMaximize(); }}
            className="w-8 h-7 flex items-center justify-center hover:bg-gray-200 rounded-sm transition-colors"
          >
            <Square size={12} className="text-gray-600" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="w-8 h-7 flex items-center justify-center hover:bg-red-500 hover:text-white rounded-sm transition-colors group"
          >
            <X size={14} className="text-gray-600 group-hover:text-white" />
          </button>
        </div>
      </div>
      )}

      {/* Content */}
      <div className="flex-1 bg-white/95 backdrop-blur-xl relative overflow-hidden">
        {children}
      </div>
    </div>
  );
}
