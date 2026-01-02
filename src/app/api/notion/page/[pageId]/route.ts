/**
 * Notion Page API Route
 *
 * GET /api/notion/page/[pageId]
 * 获取指定 Notion 页面的内容
 * 
 * 优先使用 notion-client（非官方）获取 recordMap，
 * 因为 react-notion-x 可以完整渲染 Notion 样式（包括数据库视图）
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPageDetails, getPageBlocks, isOfficialNotionConfigured } from '@/lib/notion/official-client';
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
    // 带连字符格式的 pageId（官方 API 需要）
    const formattedPageId = pageId.includes('-') ? pageId :
      `${cleanPageId.slice(0, 8)}-${cleanPageId.slice(8, 12)}-${cleanPageId.slice(12, 16)}-${cleanPageId.slice(16, 20)}-${cleanPageId.slice(20)}`;

    // 优先使用非官方 API（notion-client）获取 recordMap
    // 因为 react-notion-x 可以完整渲染 Notion 样式
    try {
      console.log('Trying unofficial API for full Notion styling...');
      const recordMap = await getNotionPage(cleanPageId);

      // 检查是否获取到有效数据
      if (recordMap && Object.keys(recordMap.block || {}).length > 0) {
        console.log('Unofficial API success - returning recordMap');
        return NextResponse.json({
          success: true,
          type: 'unofficial',
          recordMap,
        });
      }
    } catch (unofficialError: any) {
      console.log('Unofficial API failed:', unofficialError.message || unofficialError);
    }

    // 回退到官方 API
    if (isOfficialNotionConfigured) {
      try {
        console.log('Falling back to official API...');
        const [pageDetails, blocks] = await Promise.all([
          getPageDetails(formattedPageId),
          getPageBlocks(formattedPageId)
        ]);

        return NextResponse.json({
          success: true,
          type: 'official',
          page: pageDetails,
          blocks: blocks,
        });
      } catch (officialError) {
        console.error('Official API also failed:', officialError);
        throw officialError;
      }
    }

    throw new Error('No Notion API available');
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Notion page', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
