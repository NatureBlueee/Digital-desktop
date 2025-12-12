import React from 'react';
import { ChevronDown, Plus, Share2, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatGPTHeaderProps {
  className?: string;
}

export const ChatGPTHeader: React.FC<ChatGPTHeaderProps> = ({ className }) => {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white/70 backdrop-blur-sm sticky top-0 z-20',
        className
      )}
    >
      <div className="flex items-center gap-2 text-gray-800 font-medium text-lg">
        <span>ChatGPT</span>
        <span className="text-gray-500">5.1 Thinking</span>
        <ChevronDown size={16} className="text-gray-400" />
      </div>

      <div className="flex items-center gap-2 text-sm">
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F4EBFF] text-[#6941C6] font-medium hover:bg-[#E9D7FE] transition-colors">
          <Sparkles size={16} />
          新功能速览
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
          <Share2 size={16} />
          分享
        </button>
        <button className="p-2 rounded-full hover:bg-gray-100 text-gray-700 transition-colors">
          <Plus size={18} />
        </button>
      </div>
    </header>
  );
};
