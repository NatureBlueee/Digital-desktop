import { NextRequest, NextResponse } from 'next/server';
import { getProjectById } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';

/**
 * GET /api/claude/projects/[id]
 * Get a single Claude project by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error('Get Claude project error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
