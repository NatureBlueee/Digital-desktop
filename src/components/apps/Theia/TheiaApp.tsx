'use client';

import React from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { RepositoryWorkspace } from '@/components/showcase/RepositoryWorkspace';

interface TheiaAppProps {
    windowId: string;
    appType?: 'cursor' | 'antigravity';
}

export function TheiaApp({ windowId, appType = 'cursor' }: TheiaAppProps) {
    const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

    return (
        <div className="flex flex-col h-full w-full bg-[#1e1e1e] overflow-hidden">
            {/* Title Bar with Traffic Lights */}
            <div className="flex items-center h-9 px-3 bg-[#323233] drag-handle select-none shrink-0">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => closeWindow(windowId)}
                        className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all"
                    />
                    <button
                        onClick={() => minimizeWindow(windowId)}
                        className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all"
                    />
                    <button
                        onClick={() => maximizeWindow(windowId)}
                        className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all"
                    />
                </div>
                <div className="flex-1 text-center text-[#cccccc] text-sm font-medium">
                    {appType === 'cursor' ? 'Cursor' : 'Antigravity'}
                </div>
                <span className="text-xs text-[#9b9a97]">isolated workspace</span>
            </div>

            <div className="flex-1 overflow-auto bg-[#1e1e1e] p-4">
                <RepositoryWorkspace />
            </div>
        </div>
    );
}

export default TheiaApp;
