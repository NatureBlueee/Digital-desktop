import React from 'react';
import { cn } from '@/lib/utils';

interface ChatGPTMessageProps {
  role: 'user' | 'assistant';
  content: string;
}

const avatarUrls = {
  user: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  assistant: '/icons/chatgpt-icon.svg',
};

export const ChatGPTMessage: React.FC<ChatGPTMessageProps> = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={cn('flex gap-3 w-full', isUser && 'flex-row-reverse text-right')}> 
      <div className={cn('w-8 h-8 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center',
        isUser ? 'border border-gray-200' : 'bg-[#10A37F]/10')}
      >
        {role === 'assistant' ? (
          <img src={avatarUrls.assistant} alt="ChatGPT" className="w-5 h-5" />
        ) : (
          <img src={avatarUrls.user} alt="User" className="w-full h-full" />
        )}
      </div>

      <div
        className={cn(
          'max-w-3xl rounded-2xl px-4 py-3 text-[15px] leading-7 shadow-[0_1px_2px_rgba(16,24,40,0.06)] whitespace-pre-wrap bg-white',
          isUser ? 'bg-gradient-to-r from-[#EEF2FF] to-[#E0EAFF] text-gray-800' : 'bg-white text-gray-800 border border-gray-100'
        )}
      >
        {content}
      </div>
    </div>
  );
};
