import React, { useState } from 'react';
import { AudioLines, FilePlus, Image, Mic, Plus, Rocket, Smile } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatGPTComposerProps {
  className?: string;
  placeholder?: string;
  onSend?: (value: string) => void;
}

export const ChatGPTComposer: React.FC<ChatGPTComposerProps> = ({ className, placeholder, onSend }) => {
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSend?.(value.trim());
    setValue('');
  };

  return (
    <div
      className={cn(
        'bg-[#F6F6F6] rounded-3xl px-3 py-3 shadow-[0_12px_30px_-12px_rgba(16,24,40,0.2)] border border-gray-100 flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"><Plus size={20} /></button>
        <button className="px-3 py-1.5 rounded-full bg-white text-gray-800 text-sm font-medium border border-gray-100 hover:border-gray-200 transition-colors">思考</button>
        <button className="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"><Mic size={18} /></button>
        <button className="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"><Image size={18} /></button>
        <button className="p-2 rounded-full hover:bg-white text-gray-600 transition-colors"><FilePlus size={18} /></button>
      </div>

      <textarea
        rows={2}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder || '询问任何问题'}
        className="w-full bg-transparent outline-none resize-none text-[15px] leading-7 text-gray-800 px-2 placeholder:text-gray-400"
      />

      <div className="flex items-center justify-between px-1">
        <button className="flex items-center gap-2 text-gray-500 text-sm hover:text-gray-700 transition-colors">
          <Smile size={18} />
          表情 & 语气
        </button>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-white text-gray-600 transition-colors">
            <AudioLines size={18} />
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-3 py-2 rounded-full bg-[#10A37F] text-white font-semibold shadow-[0_12px_20px_-12px_rgba(16,163,127,0.8)] hover:bg-[#0E8D6F] transition-colors"
          >
            <Rocket size={16} />
            发送
          </button>
        </div>
      </div>
    </div>
  );
};
