import { NextRequest, NextResponse } from 'next/server';
import { getConversationByShareToken } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/share/[token]
 * Access unlisted Claude conversation via share token
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const conversation = await getConversationByShareToken(token);

    if (!conversation) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Conversation not found or not accessible' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Get shared Claude conversation error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
