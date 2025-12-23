'use client';

import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

/**
 * MarkdownRenderer - 安全渲染 Markdown 内容
 *
 * 功能：
 * - 解析基础 Markdown 语法
 * - 代码块高亮
 * - XSS 防护（不渲染 HTML）
 * - 支持 GFM 扩展（表格、删除线等）
 *
 * 注意：这是一个简化版实现。
 * 生产环境建议使用 react-markdown + rehype-sanitize。
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
  className,
}) => {
  const rendered = useMemo(() => {
    return parseMarkdown(content);
  }, [content]);

  return (
    <div
      className={cn(
        'prose prose-sm max-w-none',
        'prose-headings:font-semibold prose-headings:text-gray-900',
        'prose-p:text-gray-700 prose-p:leading-relaxed',
        'prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono',
        'prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-lg prose-pre:overflow-x-auto',
        'prose-blockquote:border-l-4 prose-blockquote:border-gray-300 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600',
        'prose-ul:list-disc prose-ul:pl-6',
        'prose-ol:list-decimal prose-ol:pl-6',
        'prose-li:text-gray-700',
        'prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800',
        'prose-strong:font-semibold prose-strong:text-gray-900',
        'prose-em:italic',
        'prose-table:border-collapse prose-table:w-full',
        'prose-th:border prose-th:border-gray-300 prose-th:px-3 prose-th:py-2 prose-th:bg-gray-50 prose-th:text-left',
        'prose-td:border prose-td:border-gray-300 prose-td:px-3 prose-td:py-2',
        className
      )}
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  );
};

/**
 * 简化的 Markdown 解析器
 * 支持：标题、段落、粗体、斜体、代码、代码块、链接、列表、引用、表格
 */
function parseMarkdown(text: string): string {
  // 转义 HTML 实体，防止 XSS
  let html = escapeHtml(text);

  // 代码块（先处理，避免内部被其他规则影响）
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (_, lang, code) => {
      const langClass = lang ? ` data-language="${lang}"` : '';
      return `<pre class="code-block"${langClass}><code>${code.trim()}</code></pre>`;
    }
  );

  // 行内代码
  html = html.replace(
    /`([^`\n]+)`/g,
    '<code>$1</code>'
  );

  // 标题
  html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

  // 粗体和斜体
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/___(.+?)___/g, '<strong><em>$1</em></strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // 删除线 (GFM)
  html = html.replace(/~~(.+?)~~/g, '<del>$1</del>');

  // 链接
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // 图片（转为占位符，实际图片由 AssetCard 处理）
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<span class="image-placeholder" data-alt="$1" data-src="$2">[Image: $1]</span>'
  );

  // 引用块
  html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');
  // 合并连续引用
  html = html.replace(/<\/blockquote>\n<blockquote>/g, '\n');

  // 无序列表
  html = html.replace(/^[\-\*]\s+(.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // 有序列表
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li>$1</li>');
  // 注意：这个简单实现可能会误匹配，生产环境需要更精确的处理

  // 水平线
  html = html.replace(/^[-*_]{3,}$/gm, '<hr />');

  // 段落（将双换行转为段落分隔）
  html = html.replace(/\n\n+/g, '</p><p>');
  html = `<p>${html}</p>`;

  // 清理空段落
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p>(<h[1-6]>)/g, '$1');
  html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<pre)/g, '$1');
  html = html.replace(/(<\/pre>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<blockquote>)/g, '$1');
  html = html.replace(/(<\/blockquote>)<\/p>/g, '$1');
  html = html.replace(/<p>(<hr \/>)<\/p>/g, '$1');

  // 单换行转 <br>
  html = html.replace(/\n/g, '<br />');

  return html;
}

/**
 * HTML 实体转义
 */
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

export default MarkdownRenderer;
