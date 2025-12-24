import React from 'react';
import { cn } from '@/lib/utils';
import { MarkdownRenderer } from '@/components/apps/ChatGPT/archive/MarkdownRenderer';
import type { Message } from '@/types/claude-archive';
import { Archive, ArrowLeft, Star } from 'lucide-react';

interface ClaudeConversationViewProps {
  title: string;
  isStarred?: boolean;
  messages: Message[];
  loading: boolean;
  onBack: () => void;
}

const ClaudeLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M96.0000 40.0000 L99.5002 42.0000 L99.5002 43.5000 L98.5000 47.0000 L56.0000 57.0000 L52.0040 47.0708 L96.0000 40.0000 M96.0000 40.0000 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(330deg) scaleY(1.075) rotate(-330deg)"}}></path>
    <path d="M80.1032 10.5903 L84.9968 11.6171 L86.2958 13.2179 L87.5346 17.0540 L87.0213 19.5007 L58.5000 58.5000 L49.0000 49.0000 L75.3008 14.4873 L80.1032 10.5903 M80.1032 10.5903 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(300deg) scaleY(1.0523) rotate(-300deg)"}}></path>
    <path d="M55.5002 4.5000 L58.5005 2.5000 L61.0002 3.5000 L63.5002 7.0000 L56.6511 48.1620 L52.0005 45.0000 L50.0005 39.5000 L53.5003 8.5000 L55.5002 4.5000 M55.5002 4.5000 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(270deg) scaleY(1.04397) rotate(-270deg)"}}></path>
    <path d="M23.4253 5.1588 L26.5075 1.2217 L28.5175 0.7632 L32.5063 1.3458 L34.4748 2.8868 L48.8202 34.6902 L54.0089 49.8008 L47.9378 53.1760 L24.8009 11.1886 L23.4253 5.1588 M23.4253 5.1588 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(240deg) scaleY(1.08064) rotate(-240deg)"}}></path>
    <path d="M8.4990 27.0019 L7.4999 23.0001 L10.5003 19.5001 L14.0003 20.0001 L15.0003 20.0001 L36.0000 35.5000 L42.5000 40.5000 L51.5000 47.5000 L46.5000 56.0000 L42.0002 52.5000 L39.0001 49.5000 L10.0000 29.0001 L8.4990 27.0019 M8.4990 27.0019 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(210deg) scaleY(1.2677) rotate(-210deg)"}}></path>
    <path d="M2.5003 53.0000 L0.2370 50.5000 L0.2373 48.2759 L2.5003 47.5000 L28.0000 49.0000 L53.0000 51.0000 L52.1885 55.9782 L4.5000 53.5000 L2.5003 53.0000 M2.5003 53.0000 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(180deg) scaleY(1.05103) rotate(-180deg)"}}></path>
    <path d="M17.5002 79.0264 L12.5005 79.0264 L10.5124 76.7369 L10.5124 74.0000 L19.0005 68.0000 L53.5082 46.0337 L57.0005 52.0000 L17.5002 79.0264 M17.5002 79.0264 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(150deg) scaleY(1.02936) rotate(-150deg)"}}></path>
    <path d="M27.0004 92.9999 L25.0003 93.4999 L22.0003 91.9999 L22.5004 89.4999 L52.0003 50.5000 L56.0004 55.9999 L34.0003 85.0000 L27.0004 92.9999 M27.0004 92.9999 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(120deg) scaleY(1.015) rotate(-120deg)"}}></path>
    <path d="M51.9998 98.0000 L50.5002 100.0000 L47.5002 101.0000 L45.0001 99.0000 L43.5000 96.0000 L51.0003 55.4999 L55.5001 55.9999 L51.9998 98.0000 M51.9998 98.0000 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(90deg) scaleY(1.06) rotate(-90deg)"}}></path>
    <path d="M77.5007 86.9997 L77.5007 90.9997 L77.0006 92.4997 L75.0004 93.4997 L71.5006 93.0339 L47.4669 57.2642 L56.9998 50.0002 L64.9994 64.5004 L65.7507 69.7497 L77.5007 86.9997 M77.5007 86.9997 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(60deg) scaleY(0.97) rotate(-60deg)"}}></path>
    <path d="M89.0008 80.9991 L89.5008 83.4991 L88.0008 85.4991 L86.5007 84.9991 L78.0007 78.9991 L65.0007 67.4991 L55.0007 60.4991 L58.0000 51.0000 L62.9999 54.0001 L66.0007 59.4991 L89.0008 80.9991 M89.0008 80.9991 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(30deg) scaleY(0.997) rotate(-30deg)"}}></path>
    <path d="M82.5003 55.5000 L95.0003 56.5000 L98.0003 58.5000 L100.0000 61.5000 L100.0000 63.6587 L94.5003 66.0000 L66.5005 59.0000 L55.0003 58.5000 L58.0000 48.0000 L66.0005 54.0000 L82.5003 55.5000 M82.5003 55.5000 " fill="currentColor" style={{transformOrigin: "50px 50px", transform: "rotate(0deg) scaleY(1.045) rotate(0deg)"}}></path>
  </svg>
);

const MessageBubble: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={cn('flex gap-4 py-6', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full shrink-0 flex items-center justify-center',
          isUser ? 'bg-gray-200' : 'bg-[#D97757]/10 text-[#D97757]'
        )}
      >
        {isUser ? (
          <span className="text-sm font-medium text-gray-600">N</span>
        ) : (
          <ClaudeLogo className="w-5 h-5" />
        )}
      </div>

      {/* Content */}
      <div className={cn('flex-1 min-w-0', isUser ? 'text-right' : 'text-left')}>
        <div
          className={cn(
            'inline-block max-w-[85%] text-left',
            isUser
              ? 'bg-gray-100 rounded-2xl rounded-tr-sm px-4 py-3'
              : 'prose prose-gray max-w-none'
          )}
        >
          <MarkdownRenderer content={message.content_md} />
        </div>
      </div>
    </div>
  );
};

export const ClaudeConversationView: React.FC<ClaudeConversationViewProps> = ({
  title,
  isStarred,
  messages,
  loading,
  onBack,
}) => {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
          <div className="h-3 w-32 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-medium text-gray-900 truncate flex items-center gap-2">
              {title}
              {isStarred && <Star size={16} className="text-amber-500 fill-amber-500" />}
            </h1>
          </div>
        </div>
      </div>

      {/* Archive Banner */}
      <div className="bg-amber-50 border-b border-amber-100 px-6 py-2">
        <div className="max-w-3xl mx-auto flex items-center gap-2 text-amber-800 text-sm">
          <Archive size={14} />
          <span>This is a read-only archive of a past conversation</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-6 pb-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <p>No messages in this conversation</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
