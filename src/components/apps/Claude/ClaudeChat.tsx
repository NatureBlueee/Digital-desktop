import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Pen, BookOpen, Code, Heart, Cloud, Plus, ChevronDown, ArrowUp, History } from 'lucide-react';

// Sparkle icon for greeting
const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="currentColor" />
  </svg>
);

// Google Drive icon
const GoogleDriveIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M8.267 14.68l-1.6 2.76H19.6l1.6-2.76H8.267z" fill="#3777E3" />
    <path d="M7.706 14.333L3.573 7.6l1.6-2.76 4.133 6.733-1.6 2.76z" fill="#FFCF63" />
    <path d="M15.093 4.84L10.96 11.573l1.6 2.76 4.133-6.733-1.6-2.76z" fill="#11A861" />
  </svg>
);

export const ClaudeChat: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const userName = 'Nature';

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      <div className="flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full px-4">
        {/* Greeting with sparkle */}
        <div className="flex flex-col items-center gap-4 mb-12">
          <h1 className="text-4xl font-serif text-gray-800 font-normal flex items-center gap-3">
            <SparkleIcon className="w-8 h-8 text-[#D97757]" />
            <span>{userName} returns!</span>
          </h1>
        </div>

        {/* Input Area - Redesigned to match Claude */}
        <div className="w-full max-w-2xl relative">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Input field */}
            <div className="px-4 pt-4 pb-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="How can I help you today?"
                className="w-full outline-none text-gray-700 placeholder-gray-400 text-base bg-transparent"
              />
            </div>

            {/* Bottom bar with controls */}
            <div className="flex items-center justify-between px-3 pb-3">
              <div className="flex items-center gap-1">
                {/* Plus button */}
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <Plus size={18} />
                </button>
                {/* History/Clock button */}
                <button className="p-2 text-[#D97757] hover:bg-orange-50 rounded-lg transition-colors">
                  <History size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* Model selector */}
                <button className="flex items-center gap-1 px-2 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                  <span>Sonnet 4.5</span>
                  <ChevronDown size={14} />
                </button>
                {/* Send button */}
                <button
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    inputValue.trim()
                      ? "bg-[#D97757] text-white hover:bg-[#c56a4c]"
                      : "bg-[#F5E6E0] text-[#D97757]"
                  )}
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="mt-6 w-full max-w-2xl">
          <div className="flex flex-wrap justify-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors shadow-sm">
              <Pen size={14} />
              <span>Write</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors shadow-sm">
              <BookOpen size={14} />
              <span>Learn</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors shadow-sm">
              <Code size={14} />
              <span>Code</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors shadow-sm">
              <Heart size={14} />
              <span>Life stuff</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-600 transition-colors shadow-sm">
              <GoogleDriveIcon className="w-4 h-4" />
              <span>From Drive</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
