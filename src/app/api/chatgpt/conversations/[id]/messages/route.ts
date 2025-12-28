import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { getConversationMessages, getAllConversationMessages } from '@/lib/supabase/chatgpt-database';
import { getMockMessages } from '@/lib/mock/chatgpt-data';
import { ApiResponse, PaginatedResponse, Message } from '@/types/chatgpt-archive';

/**
 * GET /api/chatgpt/conversations/:id/messages
 * 获取对话消息列表（分页）
 *
 * Query params:
 * - cursor: 分页游标（order_index）
 * - limit: 每页数量（默认50）
 * - direction: 'forward' | 'backward'（默认 forward）
 * - all: 如果为 'true'，返回所有消息（无分页，用于小对话）
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: conversationId } = await params;
    const { searchParams } = new URL(request.url);

    const all = searchParams.get('all') === 'true';

    // Use mock data if Supabase is not configured
    if (!isSupabaseConfigured) {
      const result = getMockMessages(conversationId);
      const response: ApiResponse<PaginatedResponse<Message>> = {
        success: true,
        data: result,
      };
      return NextResponse.json(response);
    }

    if (all) {
      // Return all messages without pagination
      const messages = await getAllConversationMessages(conversationId);

      const response: ApiResponse<Message[]> = {
        success: true,
        data: messages,
      };

      return NextResponse.json(response);
    }

    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;
    const direction = (searchParams.get('direction') as 'forward' | 'backward') || 'forward';

    const result = await getConversationMessages(conversationId, {
      cursor,
      limit,
      direction,
    });

    const response: ApiResponse<PaginatedResponse<Message>> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching messages:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
    const isNotFound = errorMessage.includes('not found');

    const response: ApiResponse<null> = {
      success: false,
      error: errorMessage,
      code: isNotFound ? 'NOT_FOUND' : 'FETCH_ERROR',
    };

    return NextResponse.json(response, { status: isNotFound ? 404 : 500 });
  }
}
