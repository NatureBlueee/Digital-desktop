import { NextRequest, NextResponse } from 'next/server';
import { getPublicConversations } from '@/lib/supabase/chatgpt-database';
import { ApiResponse, PaginatedResponse, ConversationListItem } from '@/types/chatgpt-archive';

/**
 * GET /api/chatgpt/conversations
 * 获取公开对话列表
 *
 * Query params:
 * - query: 搜索关键词（标题）
 * - tag: 标签筛选
 * - cursor: 分页游标（updated_at）
 * - limit: 每页数量（默认30）
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const query = searchParams.get('query') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit')
      ? parseInt(searchParams.get('limit')!, 10)
      : undefined;

    const result = await getPublicConversations({
      query,
      tag,
      cursor,
      limit,
    });

    const response: ApiResponse<PaginatedResponse<ConversationListItem>> = {
      success: true,
      data: result,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching conversations:', error);

    const response: ApiResponse<null> = {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch conversations',
      code: 'FETCH_ERROR',
    };

    return NextResponse.json(response, { status: 500 });
  }
}
