/**
 * API Route: /api/notion/databases
 * 获取所有 Notion 数据库列表
 */

import { NextResponse } from 'next/server';
import { getDatabases, isOfficialNotionConfigured } from '@/lib/notion/official-client';

export async function GET() {
  try {
    if (!isOfficialNotionConfigured) {
      return NextResponse.json({
        success: false,
        configured: false,
        error: 'Notion API is not configured',
      });
    }

    const databases = await getDatabases();

    return NextResponse.json({
      success: true,
      configured: true,
      data: databases,
    });
  } catch (error) {
    console.error('Error in /api/notion/databases:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
