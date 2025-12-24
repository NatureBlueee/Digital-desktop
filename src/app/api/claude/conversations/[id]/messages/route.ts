import { NextRequest, NextResponse } from 'next/server';
import {
  getConversationMessages,
  getAllConversationMessages,
} from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/conversations/[id]/messages
 * Get messages for a Claude conversation with pagination
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const all = searchParams.get('all') === 'true';
    const cursor = searchParams.get('cursor');
    const limit = searchParams.get('limit');
    const direction = searchParams.get('direction') as 'forward' | 'backward' | null;

    if (all) {
      const messages = await getAllConversationMessages(id);
      return NextResponse.json<ApiResponse>({
        success: true,
        data: {
          data: messages,
          next_cursor: null,
          has_more: false,
        },
      });
    }

    const result = await getConversationMessages(id, {
      cursor: cursor ? parseInt(cursor, 10) : undefined,
      limit: limit ? parseInt(limit, 10) : undefined,
      direction: direction || undefined,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Get Claude messages error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
