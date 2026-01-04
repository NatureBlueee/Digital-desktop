/**
 * NotionEmbed - 使用 iframe 嵌入已发布的 Notion 页面
 *
 * 功能：
 * - 左侧：自定义 Notion 风格侧边栏（仿真 UI）
 * - 右侧：iframe 嵌入已发布的 Notion 页面（100% 原生样式）
 */

'use client';

import React, { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import {
    Search,
    FileText,
    ChevronRight,
    ChevronDown,
    Home,
    Inbox,
    Sparkles,
    Loader2,
    Calendar,
    MoreHorizontal,
    Mail,
    HelpCircle,
    ExternalLink,
    PanelLeft,
    Plus,
    Settings,
    Trash2,
    Clock,
    Users,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface NotionEmbedProps {
    windowId: string;
}

interface NotionPage {
    id: string;
    title: string;
    icon?: { emoji?: string };
    url: string;
}

// ============================================================
// Sidebar Menu Item Component
// ============================================================

interface MenuItemProps {
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    onClick?: () => void;
    active?: boolean;
}

function MenuItem({ icon, label, shortcut, onClick, active }: MenuItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2.5 px-2 py-1.5 rounded transition-colors group",
                active ? "bg-[#efefef] text-[#37352f]" : "text-[#37352f] hover:bg-[#efefef]"
            )}
        >
            <span className="text-[#9b9a97]">{icon}</span>
            <span className="flex-1 text-left">{label}</span>
            {shortcut && (
                <span className="text-[11px] text-[#9b9a97] opacity-0 group-hover:opacity-100 transition-opacity">
                    {shortcut}
                </span>
            )}
        </button>
    );
}

// ============================================================
// Section Header Component
// ============================================================

interface SectionHeaderProps {
    label: string;
    expanded: boolean;
    onToggle: () => void;
    onAdd?: () => void;
}

function SectionHeader({ label, expanded, onToggle, onAdd }: SectionHeaderProps) {
    return (
        <div className="flex items-center group">
            <button
                onClick={onToggle}
                className="flex items-center gap-1 px-2 py-1 text-[#9b9a97] hover:text-[#37352f] text-[12px] font-medium transition-colors"
            >
                {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                <span>{label}</span>
            </button>
            {onAdd && (
                <button
                    onClick={onAdd}
                    className="ml-auto mr-2 p-0.5 rounded hover:bg-[#e8e8e8] opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Add a page"
                >
                    <Plus size={14} className="text-[#9b9a97]" />
                </button>
            )}
        </div>
    );
}

// ============================================================
// Page Item Component
// ============================================================

interface PageItemProps {
    page: NotionPage;
    selected: boolean;
    onSelect: () => void;
}

function PageItem({ page, selected, onSelect }: PageItemProps) {
    const [hovered, setHovered] = useState(false);

    return (
        <button
            onClick={onSelect}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={cn(
                "w-full flex items-center gap-1.5 px-1.5 py-1 rounded text-[14px] transition-colors text-left group",
                selected ? "bg-[#efefef] text-[#37352f]" : "text-[#37352f] hover:bg-[#efefef]"
            )}
        >
            {/* Expand arrow (placeholder, appears on hover) */}
            <span className="w-[18px] flex items-center justify-center">
                {hovered ? (
                    <ChevronRight size={14} className="text-[#9b9a97]" />
                ) : null}
            </span>

            {/* Icon */}
            {page.icon?.emoji ? (
                <span className="text-[18px] w-[20px] text-center shrink-0">{page.icon.emoji}</span>
            ) : (
                <FileText size={18} className="text-[#9b9a97] shrink-0" />
            )}

            {/* Title */}
            <span className="truncate flex-1">{page.title}</span>

            {/* Actions on hover */}
            {hovered && (
                <div className="flex items-center gap-0.5">
                    <span className="p-0.5 rounded hover:bg-[#d8d8d8]">
                        <MoreHorizontal size={14} className="text-[#9b9a97]" />
                    </span>
                    <span className="p-0.5 rounded hover:bg-[#d8d8d8]">
                        <Plus size={14} className="text-[#9b9a97]" />
                    </span>
                </div>
            )}
        </button>
    );
}

// ============================================================
// Main Component
// ============================================================

export function NotionEmbed({ windowId }: NotionEmbedProps) {
    const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

    // State
    const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
    const [iframeUrl, setIframeUrl] = useState<string>('');
    const [isLoadingPage, setIsLoadingPage] = useState(false);
    const [favoritesExpanded, setFavoritesExpanded] = useState(true);
    const [privateExpanded, setPrivateExpanded] = useState(true);
    const [notionAppsExpanded, setNotionAppsExpanded] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    // SWR fetcher
    const fetcher = (url: string) => fetch(url).then(res => res.json());

    // 使用 SWR 获取页面列表（自动缓存 + 后台刷新）
    const { data, isLoading: isLoadingList, mutate } = useSWR<{ success: boolean; data: NotionPage[] }>(
        '/api/notion/pages',
        fetcher,
        {
            revalidateOnFocus: false,     // 切换窗口不刷新
            dedupingInterval: 60000,      // 1分钟内不重复请求
            revalidateIfStale: true,      // 数据过期后自动刷新
            revalidateOnReconnect: true,  // 重新联网后刷新
        }
    );

    const pages = data?.data || [];

    // 自动选择第一个页面
    useEffect(() => {
        if (pages.length > 0 && !selectedPageId) {
            selectPage(pages[0]);
        }
    }, [pages]);

    const selectPage = (page: NotionPage) => {
        setSelectedPageId(page.id);
        setIsLoadingPage(true);
        const siteUrl = process.env.NEXT_PUBLIC_NOTION_SITE_URL || 'https://notion.site';
        const cleanPageId = page.id.replace(/-/g, '');
        const embedUrl = `${siteUrl}/ebd//${cleanPageId}`;
        setIframeUrl(embedUrl);
    };

    const favoritePage = pages.length > 0 ? pages[0] : null;

    return (
        <div className="flex flex-col h-full w-full bg-white overflow-hidden rounded-lg shadow-xl">
            <div className="flex flex-1 overflow-hidden">

                {/* Collapsed Sidebar Expand Button */}
                {sidebarCollapsed && (
                    <div className="w-12 bg-[#fbfbfa] flex flex-col items-center pt-3 border-r border-[#e8e8e8]">
                        {/* Traffic Lights */}
                        <div className="flex flex-col items-center gap-2 mb-3 drag-handle">
                            <button onClick={() => closeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90" />
                            <button onClick={() => minimizeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90" />
                            <button onClick={() => maximizeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90" />
                        </div>
                        {/* Expand Button */}
                        <button
                            onClick={() => setSidebarCollapsed(false)}
                            className="p-1.5 hover:bg-[#efefef] rounded transition-colors"
                            title="Expand sidebar"
                        >
                            <PanelLeft size={18} className="text-[#9b9a97]" />
                        </button>
                    </div>
                )}

                {/* Sidebar - Notion 亮色风格 */}
                <div className={cn(
                    "bg-[#fbfbfa] flex flex-col text-[14px] transition-all duration-200 overflow-hidden",
                    sidebarCollapsed ? "w-0" : "w-[240px]"
                )}>

                    {/* Sidebar Header with Traffic Lights */}
                    <div className="flex items-center h-11 px-3 drag-handle select-none shrink-0">
                        <div className="flex items-center gap-2">
                            <button onClick={() => closeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-90 transition-all" />
                            <button onClick={() => minimizeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-90 transition-all" />
                            <button onClick={() => maximizeWindow(windowId)} className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-90 transition-all" />
                        </div>
                        <div className="flex items-center gap-1 ml-3">
                            <button
                                onClick={() => setSidebarCollapsed(true)}
                                className="p-1 hover:bg-[#efefef] rounded transition-colors"
                                title="Collapse sidebar"
                            >
                                <PanelLeft size={16} className="text-[#9b9a97]" />
                            </button>
                        </div>
                    </div>

                    {/* Workspace Header */}
                    <div className="flex items-center px-3 py-2 hover:bg-[#efefef] cursor-pointer transition-colors group shrink-0">
                        <div className="w-[22px] h-[22px] rounded flex items-center justify-center text-[13px] mr-2 bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200">
                            <span>张</span>
                        </div>
                        <span className="text-[#37352f] text-[14px] font-medium flex-1 truncate">
                            张 晨曦的 Notion
                        </span>
                        <ExternalLink size={14} className="text-[#9b9a97] opacity-0 group-hover:opacity-100 mr-1" />
                        <ChevronDown size={14} className="text-[#9b9a97]" />
                    </div>

                    {/* Quick Actions */}
                    <div className="px-1 py-1 shrink-0">
                        <MenuItem icon={<Search size={18} />} label="Search" shortcut="⌘K" />
                        <MenuItem icon={<Home size={18} />} label="Home" />
                        <MenuItem icon={<Calendar size={18} />} label="Meetings" />
                        <MenuItem icon={<Sparkles size={18} />} label="Notion AI" />
                        <MenuItem icon={<Inbox size={18} />} label="Inbox" />
                    </div>

                    {/* Favorites Section */}
                    <div className="px-1 mt-2 shrink-0">
                        <SectionHeader
                            label="Favorites"
                            expanded={favoritesExpanded}
                            onToggle={() => setFavoritesExpanded(!favoritesExpanded)}
                        />
                        {favoritesExpanded && favoritePage && (
                            <div className="mt-0.5">
                                <PageItem
                                    page={favoritePage}
                                    selected={selectedPageId === favoritePage.id}
                                    onSelect={() => selectPage(favoritePage)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Private Section */}
                    <div className="px-1 mt-2 flex-1 overflow-hidden flex flex-col min-h-0">
                        <SectionHeader
                            label="Private"
                            expanded={privateExpanded}
                            onToggle={() => setPrivateExpanded(!privateExpanded)}
                            onAdd={() => console.log('Add new page')}
                        />

                        {privateExpanded && (
                            <div className="mt-0.5 overflow-y-auto flex-1 pb-2">
                                {isLoadingList ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 size={16} className="animate-spin text-[#9b9a97]" />
                                    </div>
                                ) : (
                                    pages.map(page => (
                                        <PageItem
                                            key={page.id}
                                            page={page}
                                            selected={selectedPageId === page.id}
                                            onSelect={() => selectPage(page)}
                                        />
                                    ))
                                )}

                                {/* More Button */}
                                {pages.length > 0 && (
                                    <button className="w-full flex items-center gap-2 px-2 py-1 text-[#9b9a97] hover:bg-[#efefef] rounded transition-colors mt-1">
                                        <MoreHorizontal size={18} />
                                        <span>More</span>
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Notion Apps Section */}
                    <div className="px-1 py-2 border-t border-[#e8e8e8] shrink-0">
                        <SectionHeader
                            label="Notion apps"
                            expanded={notionAppsExpanded}
                            onToggle={() => setNotionAppsExpanded(!notionAppsExpanded)}
                        />
                        {notionAppsExpanded && (
                            <div className="mt-0.5">
                                <MenuItem icon={<Mail size={18} />} label="Notion Mail" />
                                <button className="w-full flex items-center gap-2 px-2 py-1.5 text-[#9b9a97] hover:bg-[#efefef] rounded transition-colors">
                                    <HelpCircle size={18} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content - iframe */}
                <div className="flex-1 bg-white relative border-l border-[#e8e8e8]">
                    {isLoadingPage && (
                        <div className="absolute inset-0 bg-white flex items-center justify-center z-10">
                            <Loader2 size={32} className="animate-spin text-gray-400" />
                        </div>
                    )}
                    {iframeUrl ? (
                        <iframe
                            src={iframeUrl}
                            className="w-full h-full border-0"
                            onLoad={() => setIsLoadingPage(false)}
                            allow="fullscreen"
                            title="Notion Page"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <div className="text-center">
                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                <p>选择一个页面开始查看</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NotionEmbed;
