'use client';

import React, { useState, useEffect } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { Loader2, RefreshCw } from 'lucide-react';

interface TheiaAppProps {
    windowId: string;
    appType?: 'cursor' | 'antigravity';
}

export function TheiaApp({ windowId, appType = 'cursor' }: TheiaAppProps) {
    const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // code-server URL - configured via environment variable for production
    // Production: VPS at 165.22.62.244:3001
    // Development: localhost:3001
    const codeServerBaseUrl = process.env.NEXT_PUBLIC_CODE_SERVER_URL || 'http://165.22.62.244:3001';
    const theiaUrl = `${codeServerBaseUrl}/?folder=/home/coder/project`;

    // Cross-origin iframes may not fire onLoad, so use timeout fallback
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleRefresh = () => {
        setIsLoading(true);
        setError(null);
        const iframe = document.getElementById(`theia-iframe-${windowId}`) as HTMLIFrameElement;
        if (iframe) {
            iframe.src = theiaUrl;
        }
    };

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
                <button
                    onClick={handleRefresh}
                    className="p-1 hover:bg-[#444444] rounded transition-colors"
                    title="Refresh"
                >
                    <RefreshCw size={14} className="text-[#9b9a97]" />
                </button>
            </div>

            {/* Theia iframe */}
            <div className="flex-1 relative">
                {isLoading && (
                    <div className="absolute inset-0 bg-[#1e1e1e] flex items-center justify-center z-10">
                        <div className="text-center">
                            <Loader2 size={32} className="animate-spin text-blue-400 mx-auto mb-4" />
                            <p className="text-[#cccccc] text-sm">Loading Theia IDE...</p>
                            <p className="text-[#666666] text-xs mt-2">Make sure Theia is running on port 3001</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 bg-[#1e1e1e] flex items-center justify-center z-10">
                        <div className="text-center max-w-md px-4">
                            <p className="text-red-400 text-lg mb-2">Failed to load Theia IDE</p>
                            <p className="text-[#666666] text-sm mb-4">{error}</p>
                            <button
                                onClick={handleRefresh}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                )}

                <iframe
                    id={`theia-iframe-${windowId}`}
                    src={theiaUrl}
                    className="w-full h-full border-0"
                    onLoad={() => setIsLoading(false)}
                    onError={() => {
                        setIsLoading(false);
                        setError('Could not connect to Theia server. Please ensure it is running.');
                    }}
                    title={appType === 'cursor' ? 'Cursor IDE' : 'Antigravity IDE'}
                />
            </div>
        </div>
    );
}

export default TheiaApp;
