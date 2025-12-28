import { NextRequest, NextResponse } from 'next/server';
import { getArtifactById } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/artifacts/[id]
 * Get a single Claude artifact by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const artifact = await getArtifactById(id);

    if (!artifact) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Artifact not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: artifact,
    });
  } catch (error) {
    console.error('Get Claude artifact error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
