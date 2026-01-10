import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { ChatGPTSidebar } from './ChatGPTSidebar';
import { ChatGPTChat } from './ChatGPTChat';
import { chatgptConversations, heroPrompts } from './data/sampleData';
import { ChatGPTConversation } from '@/types';
import { useDesktopStore } from '@/lib/store/desktopStore';

interface ChatGPTAppProps {
  windowId: string;
}

export const ChatGPTApp: React.FC<ChatGPTAppProps> = ({ windowId }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [conversations, setConversations] = useState<ChatGPTConversation[]>(chatgptConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>('new-conversation');

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 640) {
          setIsSidebarCollapsed(true);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const activeConversation = useMemo(
    () => conversations.find((conv) => conv.id === activeConversationId) || conversations[0],
    [activeConversationId, conversations]
  );

  const handleNewChat = () => {
    setActiveConversationId('new-conversation');
  };

  const handleConversationSelect = (id: string) => {
    setActiveConversationId(id);
  };

  const handleSend = (value: string) => {
    setConversations((prev) => {
      if (activeConversationId === 'new-conversation') {
        const id = `chat-${Date.now()}`;
        const title = value.length > 24 ? `${value.slice(0, 24)}...` : value || '新对话';
        const newConversation: ChatGPTConversation = {
          id,
          title,
          createdAt: new Date(),
          messages: [
            {
              role: 'user',
              content: value,
              timestamp: new Date(),
            },
          ],
        };
        setActiveConversationId(id);
        return [...prev, newConversation];
      }

      return prev.map((conversation) =>
        conversation.id === activeConversationId
          ? {
              ...conversation,
              messages: [
                ...conversation.messages,
                {
                  role: 'user',
                  content: value,
                  timestamp: new Date(),
                },
              ],
            }
          : conversation
      );
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col h-full w-full bg-white text-[#333] font-sans relative overflow-hidden drag-handle"
    >
      <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-3 drag-handle">
        <button
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow(windowId);
          }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            maximizeWindow(windowId);
          }}
          className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
        >
          <Square size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(windowId);
          }}
          className="p-1 hover:bg-red-100 rounded-md text-gray-400 hover:text-red-500 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <ChatGPTSidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed((prev) => !prev)}
          conversations={conversations}
          activeConversationId={activeConversationId}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />

        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white rounded-tl-2xl shadow-[0_0_15px_rgba(0,0,0,0.03)] border-l border-gray-100/50 ml-[-1px] z-10 relative">
          <ChatGPTChat conversation={activeConversation} heroPrompts={heroPrompts} onSend={handleSend} />
        </main>
      </div>
    </div>
  );
};
