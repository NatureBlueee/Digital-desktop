/**
 * Notion Root Page API Route
 *
 * GET /api/notion/root
 * 获取配置的根页面 recordMap
 */

import { NextResponse } from 'next/server';
import { getNotionPage, getRootPageId, isNotionConfigured } from '@/lib/notion/client';

export async function GET() {
  try {
    if (!isNotionConfigured()) {
      return NextResponse.json(
        { error: 'Notion is not configured', configured: false },
        { status: 400 }
      );
    }

    const rootPageId = getRootPageId();
    if (!rootPageId) {
      return NextResponse.json(
        { error: 'Root page ID not set' },
        { status: 400 }
      );
    }

    const recordMap = await getNotionPage(rootPageId);

    return NextResponse.json({
      success: true,
      configured: true,
      pageId: rootPageId,
      recordMap,
    });
  } catch (error) {
    console.error('Error fetching Notion root page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Notion page' },
      { status: 500 }
    );
  }
}
