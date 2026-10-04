export type WorkspaceStatus =
  | 'request'
  | 'fork_ready'
  | 'provisioned'
  | 'active'
  | 'submitted'
  | 'expired'
  | 'failed';

export interface WorkspaceSession {
  id: string;
  projectSlug: string;
  githubLogin: string;
  branchName: string;
  status: WorkspaceStatus;
  workspaceUrl: string | null;
  expiresAt: string | null;
  failureReason: string | null;
}

export interface ShowcaseRepository {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  gitRepo: string | null;
  snapshotRef: string | null;
  readonlyIdeUrl: string | null;
  allowContributions: boolean;
  updatedAt: string;
}
