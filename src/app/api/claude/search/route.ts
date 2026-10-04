import { NextRequest, NextResponse } from 'next/server';
import { searchMessages } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';
import { hasPublishedContent, isPublicShowcaseContent } from '@/lib/showcase/content-policy';

/**
 * GET /api/claude/search
 * Full-text search across public Claude conversations
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q');
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit');

    if (!q || q.trim().length === 0) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (!hasPublishedContent('claude')) {
      return NextResponse.json<ApiResponse>({ success: true, data: { data: [], next_cursor: null, has_more: false } });
    }

    const result = await searchMessages({
      q: q.trim(),
      cursor: cursor ? parseInt(cursor, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { ...result, data: result.data.filter((item) => isPublicShowcaseContent('claude', item.conversation_id)), next_cursor: null, has_more: false },
    });
  } catch (error) {
    console.error('Claude search error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
