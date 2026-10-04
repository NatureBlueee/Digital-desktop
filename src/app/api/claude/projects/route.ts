import { NextRequest, NextResponse } from 'next/server';
import { getProjects } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';
import { hasPublishedContent } from '@/lib/showcase/content-policy';

/**
 * GET /api/claude/projects
 * List Claude projects with pagination
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit');

    if (!hasPublishedContent('claude')) {
      return NextResponse.json<ApiResponse>({ success: true, data: { data: [], next_cursor: null, has_more: false } });
    }

    const result = await getProjects({
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('List Claude projects error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
