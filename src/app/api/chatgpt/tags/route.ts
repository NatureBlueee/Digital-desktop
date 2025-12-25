import { NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getAllTags } from '@/lib/supabase/chatgpt-database';
import { getMockTags } from '@/lib/mock/chatgpt-data';
import { ApiResponse } from '@/types/chatgpt-archive';

/**
 * GET /api/chatgpt/tags
 * 获取所有公开对话的标签列表（用于筛选器）
 */
export async function GET() {
  try {
    // Use mock data if Supabase is not configured
    const tags = isSupabaseConfigured
      ? await getAllTags()
      : getMockTags();

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
