import { NextRequest, NextResponse } from 'next/server';
import { getConversationByShareToken, getAllConversationMessages } from '@/lib/supabase/chatgpt-database';
import { ApiResponse, ConversationDetail, Message } from '@/types/chatgpt-archive';

interface ShareResponse {
  conversation: ConversationDetail;
  messages: Message[];
}

/**
 * GET /api/chatgpt/share/:token
 * 通过分享令牌获取 unlisted 对话
 * 返回对话详情和消息列表
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    // Validate token format (should be at least 32 chars)
    if (!token || token.length < 32) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid share token',
        code: 'INVALID_TOKEN',
      };
      return NextResponse.json(response, { status: 400 });
    }

    const conversation = await getConversationByShareToken(token);

    if (!conversation) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Share link not found or expired',
        code: 'NOT_FOUND',
      };
      return NextResponse.json(response, { status: 404 });
    }

    // Get all messages for the shared conversation
    const messages = await getAllConversationMessages(conversation.id);

    const response: ApiResponse<ShareResponse> = {
      success: true,
      data: {
        conversation,
        messages,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching shared conversation:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch shared conversation',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
