"use client";

import React from "react";
import { Rnd } from "react-rnd";
import { useDesktopStore } from "@/lib/store/desktopStore";
import WindowFrame from "./WindowFrame";
import { ClaudeApp } from "@/components/apps/Claude/ClaudeApp";
import { ChatGPTArchiveApp } from "@/components/apps/ChatGPT/archive";
import { AntigravityApp, CursorApp } from "@/components/apps/AIIDE";

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
            minWidth={400}
            minHeight={300}
            bounds="parent"
            dragHandleClassName="drag-handle"
            enableResizing={{
                top: true, right: true, bottom: true, left: true,
                topRight: true, bottomRight: true, bottomLeft: true, topLeft: true
            }}
            resizeHandleStyles={{
                top: {
                  height: '8px',
                  top: '0px',
                  cursor: 'ns-resize',
                  zIndex: 50,
                  background: 'transparent'
                },
                bottom: {
                  height: '8px',
                  bottom: '0px',
                  cursor: 'ns-resize',
                  zIndex: 50,
                  background: 'transparent'
                },
                left: {
                  width: '8px',
                  left: '0px',
                  cursor: 'ew-resize',
                  zIndex: 50,
                  background: 'transparent'
                },
                right: {
                  width: '8px',
                  right: '0px',
                  cursor: 'ew-resize',
                  zIndex: 50,
                  background: 'transparent'
                },
                topRight: {
                  width: '16px',
                  height: '16px',
                  right: '0px',
                  top: '0px',
                  cursor: 'ne-resize',
                  zIndex: 60,
                  background: 'transparent'
                },
                topLeft: {
                  width: '16px',
                  height: '16px',
                  left: '0px',
                  top: '0px',
                  cursor: 'nw-resize',
                  zIndex: 60,
                  background: 'transparent'
                },
                bottomRight: {
                  width: '16px',
                  height: '16px',
                  right: '0px',
                  bottom: '0px',
                  cursor: 'se-resize',
                  zIndex: 60,
                  background: 'transparent'
                },
                bottomLeft: {
                  width: '16px',
                  height: '16px',
                  left: '0px',
                  bottom: '0px',
                  cursor: 'sw-resize',
                  zIndex: 60,
                  background: 'transparent'
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
            style={{ zIndex: window.zIndex }}
            onMouseDown={() => focusWindow(window.id)}
          >
            <WindowFrame
              title={window.title}
              isActive={activeWindowId === window.id}
              onClose={() => closeWindow(window.id)}
              onMinimize={() => minimizeWindow(window.id)}
              onMaximize={() => maximizeWindow(window.id)}
              onFocus={() => focusWindow(window.id)}
              hideTitleBar={window.appId === 'claude' || window.appId === 'chatgpt' || window.appId === 'antigravity' || window.appId === 'cursor'}
            >
              {window.appId === 'claude' ? (
                <ClaudeApp windowId={window.id} />
              ) : window.appId === 'chatgpt' ? (
                <ChatGPTArchiveApp windowId={window.id} />
              ) : window.appId === 'antigravity' ? (
                <AntigravityApp windowId={window.id} />
              ) : window.appId === 'cursor' ? (
                <CursorApp windowId={window.id} appType="cursor" />
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
