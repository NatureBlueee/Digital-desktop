import React from 'react';
import { Archive, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ArchiveBannerProps {
  className?: string;
  variant?: 'floating' | 'inline';
}

/**
 * ArchiveBanner - 只读档案提示标识
 *
 * 根据规范要求，全站必须有明确的 Archive 提示，
 * 表明这是一个只读档案系统，不提供发送/生成能力。
 */
export const ArchiveBanner: React.FC<ArchiveBannerProps> = ({
  className,
  variant = 'floating',
}) => {
  if (variant === 'inline') {
    return (
      <div
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs font-medium',
          className
        )}
      >
        <Archive size={14} />
        <span>Read-only Archive</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-gray-900/90 backdrop-blur-sm rounded-full text-white text-sm font-medium shadow-lg',
        className
      )}
    >
      <Lock size={14} className="text-gray-400" />
      <span className="text-gray-300">Read-only Archive</span>
      <span className="text-gray-500">|</span>
      <span className="text-gray-400 text-xs">Nature Archive</span>
    </div>
  );
};

export default ArchiveBanner;
