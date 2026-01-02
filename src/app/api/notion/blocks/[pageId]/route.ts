/**
 * API Route: /api/notion/blocks/[pageId]
 * 获取页面的内容块
 */

import { NextResponse } from 'next/server';
import { getPageBlocks, getPageDetails } from '@/lib/notion/official-client';

export async function GET(
  request: Request,
  { params }: { params: { pageId: string } }
) {
  try {
    const { pageId } = params;

    // 获取页面详情和内容块
    const [pageDetails, blocks] = await Promise.all([
      getPageDetails(pageId),
      getPageBlocks(pageId),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        page: pageDetails,
        blocks: blocks,
      },
    });
  } catch (error) {
    console.error('Error in /api/notion/blocks:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
