'use client';

import React from 'react';

/**
 * VS Code/Theia 风格的骨架加载界面
 * 模拟 IDE 的基本布局结构
 */
export function TheiaLoadingSkeleton() {
  return (
    <div className="w-full h-full bg-[#1e1e1e] flex overflow-hidden">
      {/* Activity Bar (左侧图标栏) */}
      <div className="w-12 bg-[#333333] flex flex-col items-center py-4 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="w-8 h-8 bg-[#444444] rounded animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>

      {/* Sidebar (侧边栏 - 文件树) */}
      <div className="w-64 bg-[#252526] border-r border-[#3e3e42] flex flex-col">
        {/* Sidebar Header */}
        <div className="h-9 border-b border-[#3e3e42] px-3 flex items-center gap-2">
          <div className="h-4 w-20 bg-[#444444] rounded animate-pulse" />
          <div className="ml-auto flex gap-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-4 h-4 bg-[#444444] rounded animate-pulse"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>

        {/* File Tree */}
        <div className="flex-1 p-2 space-y-1">
          {/* Folder Items */}
          {[
            { indent: 0, width: 'w-32' },
            { indent: 1, width: 'w-28' },
            { indent: 1, width: 'w-24' },
            { indent: 2, width: 'w-20' },
            { indent: 2, width: 'w-24' },
            { indent: 1, width: 'w-28' },
            { indent: 0, width: 'w-28' },
            { indent: 1, width: 'w-24' },
            { indent: 1, width: 'w-20' },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2"
              style={{ paddingLeft: `${item.indent * 12}px` }}
            >
              <div className="w-4 h-4 bg-[#444444] rounded animate-pulse" />
              <div
                className={`h-4 ${item.width} bg-[#444444] rounded animate-pulse`}
                style={{ animationDelay: `${i * 80}ms` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tab Bar */}
        <div className="h-9 bg-[#2d2d2d] border-b border-[#3e3e42] flex items-center px-2 gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-7 w-32 bg-[#1e1e1e] rounded-t px-3 flex items-center gap-2 animate-pulse"
              style={{ animationDelay: `${i * 200}ms` }}
            >
              <div className="w-4 h-4 bg-[#444444] rounded" />
              <div className="h-3 flex-1 bg-[#444444] rounded" />
            </div>
          ))}
        </div>

        {/* Editor Content */}
        <div className="flex-1 bg-[#1e1e1e] p-4 space-y-2">
          {/* Line numbers + Code lines */}
          {[
            { width: 'w-3/4' },
            { width: 'w-2/3' },
            { width: 'w-1/2' },
            { width: 'w-full' },
            { width: 'w-5/6' },
            { width: 'w-2/3' },
            { width: 'w-1/3' },
            { width: 'w-3/4' },
            { width: 'w-4/5' },
            { width: 'w-2/3' },
            { width: 'w-full' },
            { width: 'w-1/2' },
          ].map((line, i) => (
            <div key={i} className="flex gap-4">
              {/* Line number */}
              <div className="w-8 h-4 bg-[#2d2d2d] rounded animate-pulse" />
              {/* Code content */}
              <div
                className={`h-4 ${line.width} bg-[#2d2d2d] rounded animate-pulse`}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="h-6 bg-[#007acc] flex items-center px-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-3 w-16 bg-[#005a9e] rounded animate-pulse"
              style={{ animationDelay: `${i * 100}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Loading Overlay with Text */}
      <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e]/30 backdrop-blur-[2px]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce" />
            <div
              className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"
              style={{ animationDelay: '150ms' }}
            />
            <div
              className="w-2 h-2 bg-[#007acc] rounded-full animate-bounce"
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <p className="text-[#cccccc] text-sm font-medium">Loading IDE...</p>
          <p className="text-[#888888] text-xs mt-1">
            Connecting to code-server
          </p>
        </div>
      </div>
    </div>
  );
}
