/**
 * Notion Page API Route
 *
 * GET /api/notion/page/[pageId]
 * 获取指定 Notion 页面的 recordMap
 */

import { NextRequest, NextResponse } from 'next/server';
import { getNotionPage } from '@/lib/notion/client';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageId: string }> }
) {
  try {
    const { pageId } = await params;

    if (!pageId) {
      return NextResponse.json(
        { error: 'Page ID is required' },
        { status: 400 }
      );
    }

    // 清理 pageId（移除连字符）
    const cleanPageId = pageId.replace(/-/g, '');

    const recordMap = await getNotionPage(cleanPageId);

    return NextResponse.json({
      success: true,
      recordMap,
    });
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Notion page' },
      { status: 500 }
    );
  }
}
