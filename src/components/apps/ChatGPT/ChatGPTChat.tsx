import React from 'react';
import { ChatGPTConversation } from '@/types';
import { ChatGPTHeader } from './components/ChatGPTHeader';
import { ChatGPTHero } from './components/ChatGPTHero';
import { ChatGPTMessage } from './components/ChatGPTMessage';
import { ChatGPTComposer } from './components/ChatGPTComposer';
import { HeroPrompt } from './data/sampleData';

interface ChatGPTChatProps {
  conversation: ChatGPTConversation;
  heroPrompts: HeroPrompt[];
  onSend: (value: string) => void;
}

export const ChatGPTChat: React.FC<ChatGPTChatProps> = ({ conversation, heroPrompts, onSend }) => {
  const isNewConversation = conversation.messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      <ChatGPTHeader />

      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6"> 
        {isNewConversation ? (
          <ChatGPTHero prompts={heroPrompts} />
        ) : (
          <div className="flex flex-col gap-8 max-w-4xl mx-auto">
            {conversation.messages.map((message, idx) => (
              <ChatGPTMessage key={idx} role={message.role} content={message.content} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 md:px-8 pb-6 bg-gradient-to-t from-white via-white/70 to-white/30 border-t border-gray-100 sticky bottom-0">
        <ChatGPTComposer onSend={onSend} placeholder={isNewConversation ? '向 ChatGPT 提问或粘贴你的想法' : '继续这一轮对话'} />
        <p className="text-xs text-gray-400 text-center mt-2">生成结果仅供参考，请自行甄别内容的准确性与适用性。</p>
      </div>
    </div>
  );
};
