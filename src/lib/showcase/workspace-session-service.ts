import { createClient } from '@supabase/supabase-js';
import type { WorkspaceSession, WorkspaceStatus } from './workspaces';

type SessionRow = {
  id: string;
  github_login: string;
  branch_name: string;
  status: WorkspaceStatus;
  workspace_url: string | null;
  expires_at: string | null;
  failure_reason: string | null;
  showcase_projects: { slug: string } | null;
};

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error('Workspace session storage is not configured');
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isWorkspaceSessionStorageConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_KEY);
}

function mapSession(row: SessionRow): WorkspaceSession {
  return {
    id: row.id,
    projectSlug: row.showcase_projects?.slug || '',
    githubLogin: row.github_login,
    branchName: row.branch_name,
    status: row.status,
    workspaceUrl: row.workspace_url,
    expiresAt: row.expires_at,
    failureReason: row.failure_reason,
  };
}

export async function createWorkspaceSession(input: {
  projectId: string;
  projectSlug: string;
  githubLogin: string;
  forkRepository: string;
  branchName: string;
}) {
  const { data, error } = await adminClient()
    .from('showcase_workspace_sessions')
    .insert({
      project_id: input.projectId,
      github_login: input.githubLogin,
      fork_repository: input.forkRepository,
      branch_name: input.branchName,
      status: 'request',
    })
    .select('id, github_login, branch_name, status, workspace_url, expires_at, failure_reason, showcase_projects(slug)')
    .single();

  if (error) throw error;
  const session = mapSession(data as unknown as SessionRow);
  const mapped = { ...session, projectSlug: input.projectSlug };
  await recordWorkspaceAudit(mapped.id, 'requested', { projectSlug: input.projectSlug, forkRepository: input.forkRepository });
  return mapped;
}

export async function updateWorkspaceSession(
  id: string,
  patch: Partial<Pick<WorkspaceSession, 'status' | 'workspaceUrl' | 'expiresAt' | 'failureReason'>>
) {
  const update: Record<string, string | null> = {
    updated_at: new Date().toISOString(),
  };
  if (patch.status !== undefined) update.status = patch.status;
  if (patch.workspaceUrl !== undefined) update.workspace_url = patch.workspaceUrl;
  if (patch.expiresAt !== undefined) update.expires_at = patch.expiresAt;
  if (patch.failureReason !== undefined) update.failure_reason = patch.failureReason;

  const { data, error } = await adminClient()
    .from('showcase_workspace_sessions')
    .update(update)
    .eq('id', id)
    .select('id, github_login, branch_name, status, workspace_url, expires_at, failure_reason, showcase_projects(slug)')
    .single();

  if (error) throw error;
  const session = mapSession(data as unknown as SessionRow);
  await recordWorkspaceAudit(session.id, 'status_updated', { status: session.status });
  return session;
}

export async function getWorkspaceSession(id: string, githubLogin: string) {
  const { data, error } = await adminClient()
    .from('showcase_workspace_sessions')
    .select('id, github_login, branch_name, status, workspace_url, expires_at, failure_reason, showcase_projects(slug)')
    .eq('id', id)
    .eq('github_login', githubLogin)
    .maybeSingle();

  if (error) throw error;
  return data ? mapSession(data as unknown as SessionRow) : null;
}

export async function recentWorkspaceRequestCount(githubLogin: string, since: Date) {
  const { count, error } = await adminClient()
    .from('showcase_workspace_sessions')
    .select('id', { count: 'exact', head: true })
    .eq('github_login', githubLogin)
    .gte('created_at', since.toISOString());
  if (error) throw error;
  return count || 0;
}

async function recordWorkspaceAudit(sessionId: string, eventType: string, details: Record<string, string>) {
  const { error } = await adminClient()
    .from('showcase_workspace_audit_events')
    .insert({ workspace_session_id: sessionId, event_type: eventType, details });
  if (error) throw error;
}
