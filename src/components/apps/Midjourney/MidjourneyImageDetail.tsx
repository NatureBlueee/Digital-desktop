'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import type { MidjourneyImage } from './types';
import { CloseIcon, HeartIcon, CopyIcon, MenuDotsIcon } from './MidjourneyIcons';

interface MidjourneyImageDetailProps {
    image: MidjourneyImage;
    relatedImages?: MidjourneyImage[];
    onClose: () => void;
    onImageSelect?: (image: MidjourneyImage) => void;
}

export const MidjourneyImageDetail: React.FC<MidjourneyImageDetailProps> = ({
    image,
    relatedImages = [],
    onClose,
    onImageSelect,
}) => {
    const [copied, setCopied] = useState(false);
    const [isLiked, setIsLiked] = useState(image.isLiked || false);

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return date.toLocaleDateString();
    };

    const handleCopyPrompt = async () => {
        try {
            await navigator.clipboard.writeText(image.prompt);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy prompt:', err);
        }
    };

    // Close on Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-sm">
            {/* Close button */}
            <button
                onClick={onClose}
                className="absolute top-4 left-4 z-50 p-2 text-gray-400 hover:text-white bg-black/30 hover:bg-black/50 rounded-lg transition-colors"
            >
                <CloseIcon className="w-6 h-6" />
            </button>

            {/* Main Image Area */}
            <div className="flex-1 flex items-center justify-center p-8 min-w-0">
                <div className="relative max-h-full max-w-full">
                    <img
                        src={image.url}
                        alt={image.prompt.slice(0, 50)}
                        className="max-h-[calc(100vh-64px)] max-w-full object-contain rounded-lg shadow-2xl"
                    />
                    {/* Image navigation indicator */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
                        <div className="h-1 w-8 bg-white/80 rounded-full" />
                    </div>
                </div>
            </div>

            {/* Right Panel */}
            <div className="w-[320px] bg-white flex flex-col">
                {/* Header */}
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {image.author.avatar ? (
                                <img
                                    src={image.author.avatar}
                                    alt={image.author.username}
                                    className="w-10 h-10 rounded-full"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                                    {image.author.username[0].toUpperCase()}
                                </div>
                            )}
                            <div>
                                <div className="font-medium text-gray-900">{image.author.username}</div>
                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <span>⏱</span>
                                    <span>{formatTimeAgo(image.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <MenuDotsIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setIsLiked(!isLiked)}
                                className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    isLiked
                                        ? "text-red-500 hover:text-red-600 hover:bg-red-50"
                                        : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                                )}
                            >
                                <HeartIcon className="w-5 h-5" filled={isLiked} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Prompt */}
                <div className="flex-1 overflow-y-auto p-4">
                    <p className="text-sm text-gray-700 leading-relaxed mb-4">
                        {image.prompt}
                    </p>

                    {/* Aspect Ratio Tag */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-600 text-sm rounded-md">
                        <span className="text-gray-400">ar</span>
                        <span className="font-medium">{image.aspectRatio}</span>
                    </div>
                </div>

                {/* Related Images */}
                {relatedImages.length > 0 && (
                    <div className="border-t border-gray-100 p-2">
                        <div className="space-y-2 max-h-[200px] overflow-y-auto">
                            {relatedImages.map((relImg) => (
                                <button
                                    key={relImg.id}
                                    onClick={() => onImageSelect?.(relImg)}
                                    className={cn(
                                        "w-full aspect-square rounded-lg overflow-hidden transition-all",
                                        relImg.id === image.id
                                            ? "ring-2 ring-[#ea4c4c]"
                                            : "hover:opacity-80"
                                    )}
                                >
                                    <img
                                        src={relImg.thumbnailUrl || relImg.url}
                                        alt={relImg.prompt.slice(0, 30)}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Copy Prompt Button */}
                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleCopyPrompt}
                        className={cn(
                            "w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all",
                            copied
                                ? "bg-green-50 text-green-600 border border-green-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        )}
                    >
                        <CopyIcon className="w-5 h-5" />
                        <span>{copied ? 'Copied!' : 'Copy prompt'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};
