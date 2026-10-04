import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';
import { getWorkspaceSession, updateWorkspaceSession } from '@/lib/showcase/workspace-session-service';
import type { WorkspaceStatus } from '@/lib/showcase/workspaces';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = (await cookies()).get('github_token')?.value;
    if (!token) return NextResponse.json({ success: false, error: 'GitHub login required' }, { status: 401 });

    const { data: user } = await new Octokit({ auth: token }).users.getAuthenticated();
    const { id } = await params;
    const session = await getWorkspaceSession(id, user.login);
    if (!session) return NextResponse.json({ success: false, error: 'Workspace not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to read workspace' },
      { status: 500 }
    );
  }
}

/**
 * Control-plane callback. It is deliberately service-token-only: browsers and
 * code-server containers cannot advance a workspace lifecycle themselves.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const expectedToken = process.env.WORKSPACE_CONTROL_PLANE_TOKEN;
  const authorization = request.headers.get('authorization');
  if (!expectedToken || authorization !== `Bearer ${expectedToken}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const allowed = new Set<WorkspaceStatus>(['fork_ready', 'provisioned', 'active', 'submitted', 'expired', 'failed']);
    if (!allowed.has(body.status)) {
      return NextResponse.json({ success: false, error: 'Invalid workspace status' }, { status: 400 });
    }

    const { id } = await params;
    const session = await updateWorkspaceSession(id, {
      status: body.status,
      workspaceUrl: typeof body.workspaceUrl === 'string' ? body.workspaceUrl : undefined,
      expiresAt: typeof body.expiresAt === 'string' ? body.expiresAt : undefined,
      failureReason: typeof body.failureReason === 'string' ? body.failureReason : undefined,
    });
    return NextResponse.json({ success: true, data: session });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unable to update workspace' },
      { status: 500 }
    );
  }
}
