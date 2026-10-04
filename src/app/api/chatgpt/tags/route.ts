import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getPublicConversations } from '@/lib/supabase/chatgpt-database';
import { ApiResponse } from '@/types/chatgpt-archive';
import { filterPublicShowcaseContent, hasPublishedContent } from '@/lib/showcase/content-policy';

/**
 * GET /api/chatgpt/tags
 * 获取所有公开对话的标签列表（用于筛选器）
 */
export async function GET() {
  try {
    const tags = !isSupabaseConfigured || !hasPublishedContent('chatgpt')
      ? []
      : Array.from(new Set(filterPublicShowcaseContent('chatgpt', (await getPublicConversations({ limit: 100 })).data).flatMap((conversation) => conversation.tags))).sort();

    const response: ApiResponse<string[]> = {
      success: true,
      data: tags,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching tags:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch tags',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
