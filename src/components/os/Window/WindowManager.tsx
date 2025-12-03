"use client";

import React from "react";
import { Rnd } from "react-rnd";
import { useDesktopStore } from "@/lib/store/desktopStore";
import WindowFrame from "./WindowFrame";
import { ClaudeApp } from "@/components/apps/Claude/ClaudeApp";

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
                top: { height: '10px', top: '-5px', cursor: 'ns-resize' },
                bottom: { height: '10px', bottom: '-5px', cursor: 'ns-resize' },
                left: { width: '10px', left: '-5px', cursor: 'ew-resize' },
                right: { width: '10px', right: '-5px', cursor: 'ew-resize' },
                topRight: { width: '20px', height: '20px', right: '-10px', top: '-10px', cursor: 'ne-resize' },
                topLeft: { width: '20px', height: '20px', left: '-10px', top: '-10px', cursor: 'nw-resize' },
                bottomRight: { width: '20px', height: '20px', right: '-10px', bottom: '-10px', cursor: 'se-resize' },
                bottomLeft: { width: '20px', height: '20px', left: '-10px', bottom: '-10px', cursor: 'sw-resize' },
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
              hideTitleBar={window.appId === 'claude' || window.appId === 'chatgpt'}
            >
              {window.appId === 'claude' || window.appId === 'chatgpt' ? (
                <ClaudeApp windowId={window.id} />
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
