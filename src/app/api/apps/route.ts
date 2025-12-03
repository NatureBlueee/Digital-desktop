import { NextResponse } from 'next/server';
import { getAllApps } from '@/lib/supabase/database';
import { ApiResponse } from '@/types';

/**
 * GET /api/apps
 * 获取所有应用数据
 */
export async function GET() {
  try {
    const apps = await getAllApps();

    return NextResponse.json<ApiResponse>({
      success: true,
      data: apps,
    });
  } catch (error) {
    console.error('Get apps error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
