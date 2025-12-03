import { NextRequest, NextResponse } from 'next/server';
import { getAdapter } from '@/lib/adapters';
import { saveAppData } from '@/lib/supabase/database';
import { AppType, ApiResponse } from '@/types';

/**
 * POST /api/sync/upload
 * 上传应用数据文件
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const appType = formData.get('appType') as AppType;

    if (!file) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!appType) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'No appType provided' },
        { status: 400 }
      );
    }

    // 获取对应的适配器
    const adapter = getAdapter(appType);

    // 解析文件数据
    const appData = await adapter.parseFromFile(file);

    // 保存到数据库
    const savedData = await saveAppData(appData);

    return NextResponse.json<ApiResponse>({
      success: true,
      data: savedData,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
