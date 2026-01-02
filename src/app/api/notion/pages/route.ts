/**
 * API Route: /api/notion/pages
 * 获取所有 Notion 页面列表
 */

import { NextResponse } from 'next/server';
import { getAllPages, isOfficialNotionConfigured } from '@/lib/notion/official-client';

export async function GET() {
  try {
    if (!isOfficialNotionConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'Notion API is not configured. Please set NOTION_API_KEY in .env.local',
      });
    }

    const pages = await getAllPages();

    return NextResponse.json({
      success: true,
      configured: true,
      data: pages,
    });
  } catch (error) {
    console.error('Error in /api/notion/pages:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
