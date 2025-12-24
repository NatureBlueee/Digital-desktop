import { NextRequest, NextResponse } from 'next/server';
import { getArtifacts } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';
import type { ArtifactType } from '@/types/claude-archive';

/**
 * GET /api/claude/artifacts
 * List Claude artifacts with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as ArtifactType | null;
    const conversation_id = searchParams.get('conversation_id') || undefined;
    const cursor = searchParams.get('cursor') || undefined;
    const limit = searchParams.get('limit');

    const result = await getArtifacts({
      type: type || undefined,
      conversation_id,
      cursor,
      limit: limit ? parseInt(limit, 10) : undefined,
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('List Claude artifacts error:', error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
