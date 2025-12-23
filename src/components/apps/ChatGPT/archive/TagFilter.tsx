'use client';

import React, { useState, useEffect } from 'react';
import { Tag, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  selectedTag: string | null;
  onTagSelect: (tag: string | null) => void;
  className?: string;
}

/**
 * TagFilter - 标签筛选组件
 *
 * 从 API 获取所有可用标签，提供筛选功能
 */
export const TagFilter: React.FC<TagFilterProps> = ({
  selectedTag,
  onTagSelect,
  className,
}) => {
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/chatgpt/tags');
        const result = await response.json();
        if (result.success) {
          setTags(result.data);
        }
      } catch (err) {
        console.error('Failed to fetch tags:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (isLoading) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Loader2 size={14} className="animate-spin text-gray-400" />
        <span className="text-xs text-gray-400">Loading tags...</span>
      </div>
    );
  }

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="text-xs text-gray-500 mr-1">Tags:</span>

      {/* Clear filter button */}
      {selectedTag && (
        <button
          onClick={() => onTagSelect(null)}
          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 text-white rounded text-xs hover:bg-gray-700 transition-colors"
        >
          <span>{selectedTag}</span>
          <X size={12} />
        </button>
      )}

      {/* Tag list */}
      {!selectedTag &&
        tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onTagSelect(tag)}
            className={cn(
              'inline-flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
              'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            <Tag size={10} />
            {tag}
          </button>
        ))}
    </div>
  );
};

export default TagFilter;
