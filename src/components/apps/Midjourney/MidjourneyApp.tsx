'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { Minus, Square, X } from 'lucide-react';
import { MidjourneySidebar } from './MidjourneySidebar';
import { MidjourneyExplore } from './MidjourneyExplore';
import { MidjourneyImageDetail } from './MidjourneyImageDetail';
import type { MidjourneyImage, MidjourneyView, MidjourneyFilter } from './types';

// Mock data for development - will be replaced with Supabase
const mockImages: MidjourneyImage[] = [
    {
        id: '1',
        url: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400',
        prompt: 'abstract gradient waves, vibrant colors, digital art, smooth transitions, 4k wallpaper',
        aspectRatio: '16:9',
        author: { username: 'nature', avatar: '' },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 234,
        isLiked: false,
    },
    {
        id: '2',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
        prompt: 'geometric abstract art, pastel colors, minimalist design, clean lines, modern',
        aspectRatio: '1:1',
        author: { username: 'designer_pro', avatar: '' },
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: 567,
        isLiked: true,
    },
    {
        id: '3',
        url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
        prompt: 'colorful liquid marble texture, flowing patterns, abstract background, high resolution',
        aspectRatio: '2:3',
        author: { username: 'art_master', avatar: '' },
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        likes: 892,
        isLiked: false,
    },
    {
        id: '4',
        url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
        thumbnailUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400',
        prompt: 'neon glow abstract, dark background, cyberpunk vibes, futuristic digital art',
        aspectRatio: '4:5',
        author: { username: 'cyber_artist', avatar: '' },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        likes: 1203,
        isLiked: false,
    },
];

interface MidjourneyAppProps {
    windowId: string;
}

export const MidjourneyApp: React.FC<MidjourneyAppProps> = ({ windowId }) => {
    const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
    const containerRef = useRef<HTMLDivElement>(null);

    // UI State
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState<MidjourneyView>('explore');
    const [selectedImage, setSelectedImage] = useState<MidjourneyImage | null>(null);

    // Data State
    const images = mockImages;
    const loading = false;
    const [filter, setFilter] = useState<MidjourneyFilter>({
        sortBy: 'top',
        type: 'images',
        timeRange: 'day',
    });

    // Auto-collapse sidebar on small screens
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                if (entry.contentRect.width < 640) {
                    setIsSidebarCollapsed(true);
                }
            }
        });

        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const handleFilterChange = (newFilter: Partial<MidjourneyFilter>) => {
        setFilter((prev) => ({ ...prev, ...newFilter }));
        // In the future, trigger API call here
    };

    const handleImageClick = (image: MidjourneyImage) => {
        setSelectedImage(image);
        setIsSidebarCollapsed(true);
    };

    const handleCloseDetail = () => {
        setSelectedImage(null);
    };

    const renderContent = () => {
        switch (activeView) {
            case 'explore':
                return (
                    <MidjourneyExplore
                        images={images}
                        loading={loading}
                        filter={filter}
                        onFilterChange={handleFilterChange}
                        onImageClick={handleImageClick}
                    />
                );
            default:
                return (
                    <div className="flex-1 flex flex-col items-center justify-center bg-[#fafafa] text-gray-500">
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mb-4 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                                <span className="text-2xl">🚧</span>
                            </div>
                            <h2 className="text-xl font-medium text-gray-700 mb-2 capitalize">{activeView}</h2>
                            <p className="text-gray-500">This feature is coming soon.</p>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div
            ref={containerRef}
            className="flex flex-col h-full w-full bg-[#fafafa] text-[#333] font-sans relative overflow-hidden rounded-lg border border-gray-200/50 shadow-xl"
        >
            {/* Custom Title Bar / Window Controls */}
            <div className="absolute top-0 right-0 z-50 flex items-center gap-2 p-3 drag-handle">
                <button
                    onClick={(e) => { e.stopPropagation(); minimizeWindow(windowId); }}
                    className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Minus size={16} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); maximizeWindow(windowId); }}
                    className="p-1 hover:bg-gray-200/50 rounded-md text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Square size={14} />
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); closeWindow(windowId); }}
                    className="p-1 hover:bg-red-100 rounded-md text-gray-400 hover:text-red-500 transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative">
                <MidjourneySidebar
                    isCollapsed={isSidebarCollapsed}
                    toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    activeView={activeView}
                    onViewChange={setActiveView}
                />

                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {renderContent()}
                </main>
            </div>

            {/* Image Detail Modal */}
            {selectedImage && (
                <MidjourneyImageDetail
                    image={selectedImage}
                    relatedImages={images.filter(img => img.id !== selectedImage.id).slice(0, 6)}
                    onClose={handleCloseDetail}
                    onImageSelect={setSelectedImage}
                />
            )}
        </div>
    );
};
