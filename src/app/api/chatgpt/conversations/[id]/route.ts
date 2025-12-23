import { NextRequest, NextResponse } from 'next/server';
import { getConversationById } from '@/lib/supabase/chatgpt-database';
import { ApiResponse, ConversationDetail } from '@/types/chatgpt-archive';

/**
 * GET /api/chatgpt/conversations/:id
 * 获取单个公开对话详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const conversation = await getConversationById(id);

    if (!conversation) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Conversation not found or not public',
        code: 'NOT_FOUND',
      };
      return NextResponse.json(response, { status: 404 });
    }

    const response: ApiResponse<ConversationDetail> = {
      success: true,
      data: conversation,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching conversation:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch conversation',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
