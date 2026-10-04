import type { WorkspaceSession } from './workspaces';

export interface WorkspaceProvisionRequest {
  workspaceId: string;
  githubLogin: string;
  forkRepository: string;
  branchName: string;
  projectSlug: string;
}

/**
 * Trusted boundary for the container scheduler. This app never sends an OAuth
 * cookie or a GitHub user token into the browser iframe or a code-server pod.
 */
export async function provisionWorkspace(request: WorkspaceProvisionRequest): Promise<{
  workspaceUrl: string;
  expiresAt: string;
}> {
  const controlPlaneUrl = process.env.WORKSPACE_CONTROL_PLANE_URL;
  const controlPlaneToken = process.env.WORKSPACE_CONTROL_PLANE_TOKEN;

  if (!controlPlaneUrl || !controlPlaneToken) {
    throw new Error('Workspace provisioning is not configured');
  }

  const response = await fetch(`${controlPlaneUrl.replace(/\/$/, '')}/workspaces`, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${controlPlaneToken}`,
    },
    body: JSON.stringify(request),
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Workspace control plane rejected provisioning (${response.status})`);
  }

  return response.json() as Promise<{ workspaceUrl: string; expiresAt: string }>;
}

export function unavailableWorkspaceSession(input: Omit<WorkspaceSession, 'status' | 'workspaceUrl' | 'expiresAt' | 'failureReason'>): WorkspaceSession {
  return {
    ...input,
    status: 'fork_ready',
    workspaceUrl: null,
    expiresAt: null,
    failureReason: 'Workspace infrastructure is not configured yet.',
  };
}
