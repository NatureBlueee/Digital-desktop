import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getConversationById } from '@/lib/supabase/claude-database';
import { getMockConversation } from '@/lib/mock/claude-data';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/conversations/[id]
 * Get a single Claude conversation by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Use mock data if Supabase is not configured
    const conversation = isSupabaseConfigured
      ? await getConversationById(id)
      : getMockConversation(id);

    if (!conversation) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: conversation,
    });
  } catch (error) {
    console.error('Get Claude conversation error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
