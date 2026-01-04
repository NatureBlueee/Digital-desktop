"use client";

import React from "react";
import { Rnd } from "react-rnd";
import { useDesktopStore } from "@/lib/store/desktopStore";
import WindowFrame from "./WindowFrame";
import { ClaudeApp } from "@/components/apps/Claude/ClaudeApp";
import { ChatGPTArchiveApp } from "@/components/apps/ChatGPT/archive";
import { TheiaApp } from "@/components/apps/Theia";
import { NotionEmbed } from "@/components/apps/Notion";

export default function WindowManager() {
  const { windows, activeWindowId, closeWindow, minimizeWindow, maximizeWindow, focusWindow } = useDesktopStore();

  if (windows.length === 0) return null;

  return (
    <>
      {windows.map((window) => (
        !window.isMinimized && (
          <Rnd
            key={window.id}
            default={{
              x: 100 + window.zIndex * 20,
              y: 50 + window.zIndex * 20,
              width: 800,
              height: 600,
            }}
            position={window.isMaximized ? { x: 0, y: 0 } : undefined}
            size={window.isMaximized ? { width: '100vw', height: 'calc(100vh - 48px)' } : undefined}
            disableDragging={window.isMaximized}
            enableResizing={window.isMaximized ? false : {
              top: true, right: true, bottom: true, left: true,
              topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
            }}
            minWidth={400}
            minHeight={300}
            bounds="parent"
            dragHandleClassName="drag-handle"
            resizeHandleStyles={{
              top: {
                height: '8px',
                top: '-4px',
                left: '8px',
                right: '8px',
                width: 'calc(100% - 16px)',
                cursor: 'ns-resize',
                zIndex: 9999,
                background: 'transparent',
              },
              bottom: {
                height: '8px',
                bottom: '-4px',
                left: '8px',
                right: '8px',
                width: 'calc(100% - 16px)',
                cursor: 'ns-resize',
                zIndex: 9999,
                background: 'transparent',
              },
              left: {
                width: '8px',
                left: '-4px',
                top: '8px',
                bottom: '8px',
                height: 'calc(100% - 16px)',
                cursor: 'ew-resize',
                zIndex: 9999,
                background: 'transparent',
              },
              right: {
                width: '8px',
                right: '-4px',
                top: '8px',
                bottom: '8px',
                height: 'calc(100% - 16px)',
                cursor: 'ew-resize',
                zIndex: 9999,
                background: 'transparent',
              },
              topRight: {
                width: '16px',
                height: '16px',
                right: '-4px',
                top: '-4px',
                cursor: 'ne-resize',
                zIndex: 10000,
                background: 'transparent',
              },
              topLeft: {
                width: '16px',
                height: '16px',
                left: '-4px',
                top: '-4px',
                cursor: 'nw-resize',
                zIndex: 10000,
                background: 'transparent',
              },
              bottomRight: {
                width: '16px',
                height: '16px',
                right: '-4px',
                bottom: '-4px',
                cursor: 'se-resize',
                zIndex: 10000,
                background: 'transparent',
              },
              bottomLeft: {
                width: '16px',
                height: '16px',
                left: '-4px',
                bottom: '-4px',
                cursor: 'sw-resize',
                zIndex: 10000,
                background: 'transparent',
              },
            }}
            resizeHandleClasses={{
              top: 'window-resize-handle window-resize-edge',
              bottom: 'window-resize-handle window-resize-edge',
              left: 'window-resize-handle window-resize-edge',
              right: 'window-resize-handle window-resize-edge',
              topRight: 'window-resize-handle window-resize-corner',
              topLeft: 'window-resize-handle window-resize-corner',
              bottomRight: 'window-resize-handle window-resize-corner',
              bottomLeft: 'window-resize-handle window-resize-corner',
            }}
            style={{ zIndex: window.zIndex, pointerEvents: 'auto' }}
            onMouseDown={() => focusWindow(window.id)}
          >
            <WindowFrame
              title={window.title}
              isActive={activeWindowId === window.id}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              hideTitleBar={window.appId === 'claude' || window.appId === 'chatgpt' || window.appId === 'cursor' || window.appId === 'antigravity' || window.appId === 'notion'}
            >
              {window.appId === 'claude' ? (
                <ClaudeApp windowId={window.id} />
              ) : window.appId === 'chatgpt' ? (
                <ChatGPTArchiveApp windowId={window.id} />
              ) : window.appId === 'cursor' ? (
                <TheiaApp windowId={window.id} appType="cursor" />
              ) : window.appId === 'antigravity' ? (
                <TheiaApp windowId={window.id} appType="antigravity" />
              ) : window.appId === 'notion' ? (
                <NotionEmbed windowId={window.id} />
              ) : (
                <div className="p-4">
                  <h1 className="text-xl font-bold mb-2">Welcome to {window.title}</h1>
                  <p className="text-gray-600">This is a placeholder content for app: {window.appId}</p>
                </div>
              )}
            </WindowFrame>
          </Rnd>
        )
      ))}
    </>
  );
}
