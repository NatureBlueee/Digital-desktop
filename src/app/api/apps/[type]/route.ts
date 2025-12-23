import { NextRequest, NextResponse } from 'next/server';
import { getAppByType } from '@/lib/supabase/database';
import { AppType, ApiResponse } from '@/types';

/**
 * GET /api/apps/[type]
 * 获取指定类型的应用数据
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await params;
    const appType = type as AppType;
    const app = await getAppByType(appType);

    if (!app) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'App not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: app,
    });
  } catch (error) {
    console.error('Get app error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
