// Midjourney Image Types
// Designed to be compatible with Supabase integration

export interface MidjourneyImage {
    id: string;
    url: string;                    // 图片 URL
    thumbnailUrl?: string;          // 缩略图 URL（可选，用于优化加载）
    prompt: string;                 // 生成提示词
    aspectRatio: string;            // 宽高比，如 "2:3", "16:9", "1:1"
    width?: number;                 // 图片宽度（像素）
    height?: number;                // 图片高度（像素）
    author: {
        id?: string;
        username: string;
        avatar?: string;
    };
    createdAt: string;              // ISO 时间字符串
    likes?: number;
    isLiked?: boolean;              // 当前用户是否已点赞
    style?: string;                 // 风格标签
    version?: string;               // Midjourney 版本，如 "v6"
}

export interface MidjourneyGalleryState {
    images: MidjourneyImage[];
    loading: boolean;
    error?: string;
    filter: MidjourneyFilter;
}

export interface MidjourneyFilter {
    sortBy: 'top' | 'likes' | 'recent';
    type: 'all' | 'styles' | 'images' | 'videos';
    timeRange?: 'day' | 'week' | 'month' | 'all';
}

export type MidjourneyView = 'explore' | 'create' | 'edit' | 'organize' | 'personalize' | 'moodboards' | 'styleCreator';

export interface MidjourneySidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
    activeView: MidjourneyView;
    onViewChange: (view: MidjourneyView) => void;
}
