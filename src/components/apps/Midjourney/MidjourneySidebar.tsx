'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import type { MidjourneySidebarProps, MidjourneyView } from './types';
import {
    ExploreIcon,
    CreateIcon,
    EditIcon,
    OrganizeIcon,
    PersonalizeIcon,
    MoodboardsIcon,
    StyleCreatorIcon,
    UserIcon,
} from './MidjourneyIcons';

interface NavItem {
    id: MidjourneyView;
    label: string;
    icon: React.FC<{ className?: string }>;
    beta?: boolean;
}

// Main nav items
const mainNavItems: NavItem[] = [
    { id: 'explore', label: 'Explore', icon: ExploreIcon },
];

const createItems: NavItem[] = [
    { id: 'create', label: 'Create', icon: CreateIcon },
    { id: 'edit', label: 'Edit', icon: EditIcon },
    { id: 'organize', label: 'Organize', icon: OrganizeIcon },
];

// Aesthetics items
const aestheticsItems: NavItem[] = [
    { id: 'personalize', label: 'Personalize', icon: PersonalizeIcon },
    { id: 'moodboards', label: 'Moodboards', icon: MoodboardsIcon },
    { id: 'styleCreator', label: 'Style Creator', icon: StyleCreatorIcon, beta: true },
];

export const MidjourneySidebar: React.FC<MidjourneySidebarProps> = ({
    isCollapsed,
    activeView,
    onViewChange,
}) => {
    const renderNavItem = (item: NavItem) => {
        const isActive = activeView === item.id;
        const Icon = item.icon;

        return (
            <div key={item.id} className="w-full group" style={{ height: 44, marginLeft: -6, marginTop: 1, marginBottom: 1 }}>
                <button
                    onClick={() => onViewChange(item.id)}
                    className={cn(
                        "flex relative w-full group min-w-fit items-center gap-2 rounded-full px-3 py-3 mb-1.5 transition-all duration-100",
                        "group-hover:pr-4 group-hover:my-[5px] group-hover:py-[7px]",
                        isActive
                            ? "text-gray-900"
                            : "text-gray-500 hover:text-gray-900"
                    )}
                >
                    {/* Background layers */}
                    <div className={cn(
                        "absolute inset-0 rounded-full transition-all",
                        isActive
                            ? "bg-gray-100 border border-gray-200/50"
                            : "group-hover:border group-hover:border-gray-200/50 group-active:shadow-inner"
                    )} />
                    <div className="absolute flex inset-0 rounded-full bg-gradient-to-tl from-white/50 transition duration-200 ease-in-out" />

                    {/* Icon */}
                    <Icon className="relative shrink-0 w-6 h-6" />

                    {/* Label - shows on hover when collapsed */}
                    <p className={cn(
                        "relative truncate text-sm font-semibold h-6 leading-6",
                        isCollapsed ? "hidden group-hover:flex" : "flex"
                    )}>
                        {item.label}
                    </p>

                    {/* Beta badge */}
                    {item.beta && !isCollapsed && (
                        <span className="relative text-[10px] font-semibold text-[#ea4c4c] bg-red-50 px-1.5 py-0.5 rounded-full">
                            Beta
                        </span>
                    )}
                    {item.beta && isCollapsed && (
                        <div className="h-0 flex justify-center items-end absolute top-full -translate-y-0.5 inset-x-0 group-hover:hidden">
                            <span className="flex-center h-4 shrink-0 text-xs p-1 py-1.5 font-semibold text-[#ea4c4c] rounded-full text-center pointer-events-none bg-red-50">
                                Beta
                            </span>
                        </div>
                    )}
                </button>
            </div>
        );
    };

    return (
        <nav
            className={cn(
                "z-[5] top-0 flex h-full shrink-0 pt-5 flex-col items-center justify-between gap-4 overflow-visible ease-out bg-white",
                isCollapsed ? "w-[82px] px-[22px]" : "w-[200px] px-4"
            )}
            style={{ paddingBottom: 20 }}
        >
            {/* Main content */}
            <div className="flex w-full grow select-none flex-col items-start gap-0 whitespace-nowrap text-base text-gray-900">
                {/* Logo */}
                <a
                    className="flex w-full relative items-center overflow-hidden pl-1.5 text-lg font-medium tracking-wide"
                    style={{ height: 54 }}
                >
                    MJ
                </a>

                <div className="h-3" />

                {/* Main nav items */}
                {mainNavItems.map(renderNavItem)}

                <div className="h-3" />

                {createItems.map(renderNavItem)}

                {/* Aesthetics section - no title, just items */}
                {aestheticsItems.map(renderNavItem)}
            </div>

            {/* User profile at bottom */}
            <div className="flex w-full grow flex-col justify-end">
                <div className="flex w-full flex-col items-start justify-end gap-3.5">
                    <div className="m-0 flex w-full shrink items-center justify-between rounded-xl flex-col">
                        <div className="outline-hidden rounded-md flex items-center w-full">
                            <div className={cn(
                                "select-none group flex w-full shrink cursor-pointer items-center justify-start gap-2 rounded-full bg-gray-50 p-2",
                                "hover:bg-gray-100 active:bg-gray-200 transition-colors"
                            )}>
                                <div className="w-full shrink flex justify-start gap-2 items-center overflow-hidden">
                                    <div className="aspect-square w-[22px] shrink-0">
                                        <UserIcon className="w-full h-auto rounded-full" />
                                    </div>
                                    {!isCollapsed && (
                                        <span className="text-sm font-medium text-gray-700 truncate">nature</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
