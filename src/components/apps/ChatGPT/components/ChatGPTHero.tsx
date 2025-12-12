import React from 'react';
import { ChevronRight } from 'lucide-react';
import { HeroPrompt } from '../data/sampleData';

interface ChatGPTHeroProps {
  prompts: HeroPrompt[];
}

export const ChatGPTHero: React.FC<ChatGPTHeroProps> = ({ prompts }) => {
  return (
    <div className="flex flex-col items-center text-center gap-6 py-10">
      <div className="w-16 h-16 text-[#10A37F]">
        <img src="/icons/chatgpt-icon.svg" alt="ChatGPT" className="w-full h-full" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold text-gray-900">有什么可以帮忙的？</h1>
        <p className="text-gray-500">新对话保持为空白，方便你快速开始输入。下面也有灵感提示供参考。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            className="group relative flex flex-col items-start gap-2 p-4 rounded-2xl border border-gray-100 bg-white/80 hover:border-gray-200 hover:shadow-[0_16px_30px_-18px_rgba(16,24,40,0.3)] transition-all text-left"
          >
            <div className="flex items-center gap-2">
              <span className="text-gray-900 font-medium">{prompt.title}</span>
              {prompt.badge && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-200">{prompt.badge}</span>
              )}
            </div>
            <p className="text-sm text-gray-500 leading-6">{prompt.subtitle}</p>
            <div className="absolute right-3 bottom-3 w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center group-hover:bg-[#10A37F] group-hover:text-white transition-colors">
              <ChevronRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
