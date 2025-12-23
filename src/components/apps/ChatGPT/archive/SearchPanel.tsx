'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Search, X, Loader2, MessageSquare, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SearchResultItem, PaginatedResponse } from '@/types/chatgpt-archive';

interface SearchPanelProps {
  onResultClick: (conversationId: string, messageId: string) => void;
  className?: string;
}

/**
 * SearchPanel - 搜索面板组件
 *
 * 功能：
 * - 关键词搜索
 * - 结果高亮
 * - 点击跳转到对话
 * - 分页加载更多
 */
export const SearchPanel: React.FC<SearchPanelProps> = ({
  onResultClick,
  className,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Search function
  const search = useCallback(async (q: string, cursor?: string, append = false) => {
    if (!q.trim()) {
      setResults([]);
      setHasMore(false);
      return;
    }

    try {
      setIsSearching(true);
      setError(null);

      const params = new URLSearchParams({ q: q.trim() });
      if (cursor) params.set('cursor', cursor);
      params.set('limit', '20');

      const response = await fetch(`/api/chatgpt/search?${params}`);
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Search failed');
      }

      const data = result.data as PaginatedResponse<SearchResultItem>;

      if (append) {
        setResults((prev) => [...prev, ...data.data]);
      } else {
        setResults(data.data);
      }

      setHasMore(data.has_more);
      setNextCursor(data.next_cursor);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        search(value);
      }, 300);
    },
    [search]
  );

  // Load more
  const loadMore = useCallback(() => {
    if (nextCursor && !isSearching) {
      search(query, nextCursor, true);
    }
  }, [nextCursor, isSearching, query, search]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setHasMore(false);
    setNextCursor(null);
    inputRef.current?.focus();
  }, []);

  // Keyboard shortcut to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 100);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={cn('relative', className)}>
      {/* Search trigger button (compact mode) */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 100);
          }}
          className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Search size={16} />
          <span>Search</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs bg-gray-200 rounded">
            ⌘K
          </kbd>
        </button>
      )}

      {/* Search panel (expanded mode) */}
      {isOpen && (
        <div className="absolute top-0 left-0 right-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden w-[400px]">
          {/* Search input */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
            <Search size={18} className="text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search messages..."
              className="flex-1 text-sm outline-none placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={clearSearch}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[400px] overflow-y-auto">
            {/* Loading */}
            {isSearching && results.length === 0 && (
              <div className="py-8 flex justify-center">
                <Loader2 size={24} className="animate-spin text-gray-400" />
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="py-4 px-4 text-sm text-red-500 text-center">
                {error}
              </div>
            )}

            {/* Empty state */}
            {!isSearching && query && results.length === 0 && !error && (
              <div className="py-8 text-center text-gray-500">
                <div className="text-sm">No results found</div>
                <div className="text-xs mt-1">Try different keywords</div>
              </div>
            )}

            {/* Results list */}
            {results.length > 0 && (
              <div className="divide-y divide-gray-50">
                {results.map((result, index) => (
                  <SearchResultCard
                    key={`${result.message_id}-${index}`}
                    result={result}
                    query={query}
                    onClick={() => {
                      onResultClick(result.conversation_id, result.message_id);
                      setIsOpen(false);
                    }}
                  />
                ))}

                {/* Load more */}
                {hasMore && (
                  <div className="py-3 flex justify-center">
                    {isSearching ? (
                      <Loader2 size={16} className="animate-spin text-gray-400" />
                    ) : (
                      <button
                        onClick={loadMore}
                        className="text-xs text-gray-500 hover:text-gray-700"
                      >
                        Load more results
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Initial state */}
            {!query && (
              <div className="py-8 text-center text-gray-400 text-sm">
                Type to search across all conversations
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * SearchResultCard - 搜索结果项
 */
interface ResultCardProps {
  result: SearchResultItem;
  query: string;
  onClick: () => void;
}

const SearchResultCard: React.FC<ResultCardProps> = ({ result, query, onClick }) => {
  // Highlight matching text
  const highlightedSnippet = highlightText(result.snippet, query);

  return (
    <button
      onClick={onClick}
      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors group"
    >
      <div className="flex items-start gap-3">
        <MessageSquare size={16} className="text-gray-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-gray-900 truncate mb-1">
            {result.conversation_title}
          </div>
          <div
            className="text-xs text-gray-500 line-clamp-2"
            dangerouslySetInnerHTML={{ __html: highlightedSnippet }}
          />
          <div className="text-xs text-gray-400 mt-1 capitalize">
            {result.role}
          </div>
        </div>
        <ArrowRight
          size={14}
          className="text-gray-300 group-hover:text-gray-400 mt-0.5"
        />
      </div>
    </button>
  );
};

/**
 * 高亮匹配文本
 */
function highlightText(text: string, query: string): string {
  if (!query) return escapeHtml(text);

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  return escapeHtml(text).replace(
    regex,
    '<mark class="bg-yellow-200 text-yellow-900 px-0.5 rounded">$1</mark>'
  );
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

export default SearchPanel;
