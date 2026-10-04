'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { MidjourneyImage, MidjourneyFilter } from './types';
import { FilterIcon, HeartIcon, SearchIcon } from './MidjourneyIcons';

interface MidjourneyExploreProps {
    images: MidjourneyImage[];
    loading: boolean;
    filter: MidjourneyFilter;
    onFilterChange: (filter: Partial<MidjourneyFilter>) => void;
    onImageClick: (image: MidjourneyImage) => void;
}

export const MidjourneyExplore: React.FC<MidjourneyExploreProps> = ({
    images,
    loading,
    filter,
    onFilterChange,
    onImageClick,
}) => {
    const sortOptions = [
        { id: 'top', label: 'Top Day' },
        { id: 'likes', label: 'Likes' },
    ] as const;

    const typeOptions = [
        { id: 'styles', label: 'Styles', icon: '📐' },
        { id: 'images', label: 'Images', icon: '🖼️' },
        { id: 'videos', label: 'Videos', icon: '🎬' },
    ] as const;

    return (
        <div className="flex flex-col h-full bg-[#fafafa]">
            {/* Search Bar */}
            <div className="px-6 py-4 border-b border-gray-100 bg-white">
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                            <SearchIcon className="w-5 h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Subscribe to start creating..."
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ea4c4c]/20 focus:border-[#ea4c4c]"
                            disabled
                        />
                    </div>
                    <button className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <FilterIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-6 py-3 bg-white border-b border-gray-100 flex items-center justify-between">
                {/* Sort Options */}
                <div className="flex items-center gap-2">
                    {sortOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onFilterChange({ sortBy: option.id })}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                filter.sortBy === option.id
                                    ? "text-gray-900"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                {/* Type Options */}
                <div className="flex items-center gap-1">
                    {typeOptions.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => onFilterChange({ type: option.id })}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors",
                                filter.type === option.id
                                    ? "bg-gray-100 text-gray-900"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                            )}
                        >
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Masonry Grid with minimal gap */}
            <div className="flex-1 overflow-y-auto bg-white p-0.5">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0.5">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="animate-pulse bg-gray-100 aspect-[2/3]"
                            />
                        ))}
                    </div>
                ) : images.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <div className="w-24 h-24 mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                            <span className="text-4xl">🖼️</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-700 mb-2">No images yet</h3>
                        <p className="text-sm text-gray-500 text-center max-w-md">
                            Your Midjourney creations will appear here. Connect your gallery to start exploring.
                        </p>
                    </div>
                ) : (
                    <div className="columns-2 md:columns-3 lg:columns-4 gap-0.5 space-y-0.5">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="break-inside-avoid group cursor-pointer relative"
                                onClick={() => onImageClick(image)}
                            >
                                <img
                                    src={image.thumbnailUrl || image.url}
                                    alt={image.prompt.slice(0, 50)}
                                    className="w-full h-auto object-cover block"
                                    loading="lazy"
                                />
                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                {image.author.avatar ? (
                                                    <img
                                                        src={image.author.avatar}
                                                        alt={image.author.username}
                                                        className="w-6 h-6 rounded-full"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-6 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xs font-semibold">
                                                        {image.author.username[0].toUpperCase()}
                                                    </div>
                                                )}
                                                <span className="text-white text-sm font-medium truncate max-w-[100px] drop-shadow-md">
                                                    {image.author.username}
                                                </span>
                                            </div>
                                            <button
                                                className="p-1.5 text-white/80 hover:text-white transition-colors hover:bg-white/20 rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    image.isLiked = !image.isLiked; // Optimistic update
                                                }}
                                            >
                                                <HeartIcon className="w-5 h-5" filled={image.isLiked} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
