import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { ApiResponse } from '@/types';
import { filterPublicShowcaseContent, hasPublishedContent } from '@/lib/showcase/content-policy';

// Import real database functions
import * as db from '@/lib/supabase/claude-database';

/**
 * GET /api/claude/conversations
 * List public Claude conversations with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const starred = searchParams.get('starred');
    const project_id = searchParams.get('project_id') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit');

    if (!isSupabaseConfigured || !hasPublishedContent('claude')) {
      return NextResponse.json<ApiResponse>({ success: true, data: { data: [], next_cursor: null, has_more: false } });
    }

    // Use real database
    if (starred === 'true' && !cursor) {
      const starredConversations = await db.getStarredConversations(
        limit ? parseInt(limit, 10) : 10
      );
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          data: filterPublicShowcaseContent('claude', starredConversations),
          next_cursor: null,
          has_more: false,
        },
      });
    }

    const result = await db.getPublicConversations({
      query,
      tag,
      starred: starred === 'true' ? true : starred === 'false' ? false : undefined,
      project_id,
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: { ...result, data: filterPublicShowcaseContent('claude', result.data) },
    });
  } catch (error) {
    console.error('List Claude conversations error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
