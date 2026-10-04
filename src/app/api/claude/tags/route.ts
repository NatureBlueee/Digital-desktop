import { NextResponse } from 'next/server';
import { getPublicConversations } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';
import { filterPublicShowcaseContent, hasPublishedContent } from '@/lib/showcase/content-policy';

/**
 * GET /api/claude/tags
 * Get all unique tags from public Claude conversations
 */
export async function GET() {
  try {
    const tags = !hasPublishedContent('claude')
      ? []
      : Array.from(new Set(filterPublicShowcaseContent('claude', (await getPublicConversations({ limit: 100 })).data).flatMap((conversation) => conversation.tags))).sort();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: tags,
    });
  } catch (error) {
    console.error('Get Claude tags error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
