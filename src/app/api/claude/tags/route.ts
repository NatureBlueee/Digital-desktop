import { NextResponse } from 'next/server';
import { getAllTags } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/tags
 * Get all unique tags from public Claude conversations
 */
export async function GET() {
  try {
    const tags = await getAllTags();

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
