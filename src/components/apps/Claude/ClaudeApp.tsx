"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Sparkles, Plus, SlidersHorizontal, History, PenLine, GraduationCap, Code2, Coffee, HardDrive } from "lucide-react";

export default function ClaudeApp() {
  return (
    <div className="flex flex-col h-full bg-[#f0efe9] font-sans text-[#3e3e3c]">
      {/* Header */}
      <div className="h-10 flex items-center justify-center relative px-4 shrink-0">
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 text-[#d97757]">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                </svg>
            </div>
        </div>
        <span className="text-xs font-medium text-gray-500">Claude — Control+Alt+Space</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-3xl mx-auto w-full">
        
        {/* Greeting */}
        <div className="flex flex-col items-center gap-6 mb-12">
            <div className="w-12 h-12 text-[#d97757]">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
                </svg>
            </div>
            <h1 className="text-4xl font-serif text-[#3e3e3c]">Hey there, Nature</h1>
        </div>

        {/* Input Box */}
        <div className="w-full bg-[#fbfaf8] rounded-2xl shadow-sm border border-gray-200/50 p-4 flex flex-col gap-4">
            <textarea 
                className="w-full bg-transparent border-none outline-none resize-none text-lg placeholder:text-gray-400 min-h-[60px]"
                placeholder="How can I help you today?"
                readOnly
            />
            
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <Plus size={20} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                        <SlidersHorizontal size={18} />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-blue-500 bg-blue-50">
                        <History size={18} />
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

      {/* Footer User */}
      <div className="p-4">
        <div className="w-8 h-8 rounded-full bg-[#3e3e3c] text-white flex items-center justify-center text-xs font-medium">
            N
        </div>
      </div>
    </div>
  );
}
