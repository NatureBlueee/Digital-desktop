"use client";

import React, { useEffect, useState } from "react";
import { getClaudeConversation } from "@/lib/adapters/claudeAdapter";
import { ClaudeConversation } from "@/types";
import { cn } from "@/lib/utils";
import { User, Bot } from "lucide-react";

export default function ClaudeApp() {
  const [conversation, setConversation] = useState<ClaudeConversation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClaudeConversation("mock").then((data) => {
      setConversation(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-[#fcfcfc]">
        <div className="animate-pulse flex flex-col items-center gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            <div className="text-sm text-gray-400">Loading conversation...</div>
        </div>
      </div>
    );
  }

  if (!conversation) return null;

  return (
    <div className="flex flex-col h-full bg-[#fcfcfc]">
      {/* Header */}
      <div className="h-12 border-b flex items-center px-4 bg-white sticky top-0 z-10">
        <h2 className="font-serif text-lg text-gray-800">{conversation.name}</h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {conversation.chat_messages.map((msg) => (
          <div key={msg.uuid} className={cn(
            "flex gap-4 max-w-3xl mx-auto",
            msg.sender === 'human' ? "flex-row-reverse" : "flex-row"
          )}>
            {/* Avatar */}
            <div className={cn(
              "w-8 h-8 rounded-sm flex items-center justify-center shrink-0",
              msg.sender === 'human' ? "bg-gray-200 text-gray-600" : "bg-[#d97757] text-white"
            )}>
              {msg.sender === 'human' ? <User size={18} /> : <Bot size={18} />}
            </div>

            {/* Bubble */}
            <div className={cn(
                "flex flex-col gap-1 min-w-0",
                msg.sender === 'human' ? "items-end" : "items-start"
            )}>
                <div className="font-medium text-xs text-gray-400 mb-0.5">
                    {msg.sender === 'human' ? 'You' : 'Claude'}
                </div>
                <div className={cn(
                    "prose prose-sm max-w-none p-3 rounded-lg text-sm leading-relaxed whitespace-pre-wrap",
                    msg.sender === 'human' ? "bg-[#f0f0f0] text-gray-800" : "bg-white border border-gray-100 shadow-sm text-gray-800"
                )}>
                    {msg.text}
                </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Input Area (Read Only) */}
      <div className="p-4 border-t bg-white">
        <div className="max-w-3xl mx-auto relative">
            <div className="w-full h-12 border rounded-md bg-gray-50 flex items-center px-4 text-gray-400 text-sm cursor-not-allowed">
                This is a read-only archive.
            </div>
        </div>
      </div>
    </div>
  );
}
