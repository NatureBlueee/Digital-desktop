import { NextRequest, NextResponse } from 'next/server';
import { getArtifactById } from '@/lib/supabase/claude-database';
import { ApiResponse } from '@/types';
import { isPublicShowcaseContent } from '@/lib/showcase/content-policy';
import { isSupabaseConfigured } from '@/lib/supabase/client';

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
    if (!isSupabaseConfigured) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Artifact not found' },
        { status: 404 }
      );
    }
    const artifact = await getArtifactById(id);

    if (!artifact || !artifact.conversation_id || !isPublicShowcaseContent('claude', artifact.conversation_id)) {
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
