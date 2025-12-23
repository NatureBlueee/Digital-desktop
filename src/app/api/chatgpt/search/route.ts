import { NextRequest, NextResponse } from 'next/server';
import { searchMessages } from '@/lib/supabase/chatgpt-database';
import { ApiResponse, PaginatedResponse, SearchResultItem } from '@/types/chatgpt-archive';

/**
 * GET /api/chatgpt/search
 * 全文搜索消息（仅公开对话）
 *
 * Query params:
 * - q: 搜索关键词（必填）
 * - cursor: 分页游标（偏移量）
 * - limit: 每页数量（默认20）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const q = searchParams.get('q');

    if (!q || q.trim().length === 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Search query is required',
        code: 'MISSING_QUERY',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;

    const result = await searchMessages({
      q: q.trim(),
      cursor,
      limit,
    });

    const response: ApiResponse<PaginatedResponse<SearchResultItem>> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error searching messages:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Search failed',
      code: 'SEARCH_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
