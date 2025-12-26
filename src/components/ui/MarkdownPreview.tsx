/**
 * MarkdownPreview - Markdown 渲染组件
 *
 * 使用 react-markdown 渲染 Markdown 内容
 * 支持 GitHub Flavored Markdown (GFM)
 */

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, className }) => {
  return (
    <div className={cn("markdown-preview p-4 overflow-auto", className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 标题
          h1: ({ children }) => (
            <h1 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-[#404040]">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl font-bold text-white mb-3 mt-6 pb-1 border-b border-[#404040]">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg font-semibold text-white mb-2 mt-4">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base font-semibold text-white mb-2 mt-3">
              {children}
            </h4>
          ),

          // 段落
          p: ({ children }) => (
            <p className="text-[#cccccc] mb-3 leading-relaxed">
              {children}
            </p>
          ),

          // 列表
          ul: ({ children }) => (
            <ul className="list-disc list-inside text-[#cccccc] mb-3 space-y-1 ml-2">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside text-[#cccccc] mb-3 space-y-1 ml-2">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-[#cccccc]">{children}</li>
          ),

          // 代码
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const isInline = !match;

            if (isInline) {
              return (
                <code className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-[#e06c75] text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <code className={cn("block", className)} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-[#2d2d30] rounded-lg p-4 mb-3 overflow-x-auto border border-[#404040]">
              <code className="text-sm font-mono text-[#d4d4d4]">
                {children}
              </code>
            </pre>
          ),

          // 引用
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-[#007acc] pl-4 my-3 text-[#858585] italic">
              {children}
            </blockquote>
          ),

          // 链接
          a: ({ href, children }) => (
            <a
              href={href}
              className="text-[#58a6ff] hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // 图片
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt}
              className="max-w-full h-auto rounded my-3"
            />
          ),

          // 表格
          table: ({ children }) => (
            <div className="overflow-x-auto mb-3">
              <table className="min-w-full border-collapse border border-[#404040]">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-[#2d2d30]">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border border-[#404040] px-3 py-2 text-left text-white font-semibold">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-[#404040] px-3 py-2 text-[#cccccc]">
              {children}
            </td>
          ),

          // 水平线
          hr: () => (
            <hr className="my-4 border-[#404040]" />
          ),

          // 强调
          strong: ({ children }) => (
            <strong className="font-bold text-white">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-[#cccccc]">{children}</em>
          ),

          // 删除线
          del: ({ children }) => (
            <del className="text-[#858585] line-through">{children}</del>
          ),

          // 任务列表
          input: ({ checked }) => (
            <input
              type="checkbox"
              checked={checked}
              readOnly
              className="mr-2 accent-[#007acc]"
            />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownPreview;
