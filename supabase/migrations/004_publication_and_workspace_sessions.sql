-- Explicit curation and isolated contribution-workspace control plane.

ALTER TABLE showcase_projects
  ADD COLUMN IF NOT EXISTS visibility TEXT NOT NULL DEFAULT 'unlisted'
    CHECK (visibility IN ('public', 'unlisted')),
  ADD COLUMN IF NOT EXISTS snapshot_ref TEXT,
  ADD COLUMN IF NOT EXISTS readonly_ide_url TEXT,
  ADD COLUMN IF NOT EXISTS allow_contributions BOOLEAN NOT NULL DEFAULT false;

DROP POLICY IF EXISTS "Projects are viewable by everyone" ON showcase_projects;
CREATE POLICY "Published projects are viewable by everyone"
  ON showcase_projects FOR SELECT
  USING (visibility = 'public');

CREATE TABLE IF NOT EXISTS showcase_workspace_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES showcase_projects(id) ON DELETE CASCADE,
  github_login TEXT NOT NULL,
  fork_repository TEXT NOT NULL,
  branch_name TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('request', 'fork_ready', 'provisioned', 'active', 'submitted', 'expired', 'failed')),
  workspace_url TEXT,
  expires_at TIMESTAMPTZ,
  failure_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_showcase_workspace_sessions_owner
  ON showcase_workspace_sessions (github_login, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_showcase_workspace_sessions_expiry
  ON showcase_workspace_sessions (expires_at)
  WHERE status IN ('provisioned', 'active');

ALTER TABLE showcase_workspace_sessions ENABLE ROW LEVEL SECURITY;
-- Workspace sessions are service-role only. The web app returns a scoped view
-- to the authenticated owner; there is intentionally no public select policy.

CREATE TABLE IF NOT EXISTS showcase_workspace_audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_session_id UUID NOT NULL REFERENCES showcase_workspace_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_showcase_workspace_audit_events_session
  ON showcase_workspace_audit_events (workspace_session_id, created_at DESC);
ALTER TABLE showcase_workspace_audit_events ENABLE ROW LEVEL SECURITY;
-- Audit records are service-role only; never expose fork or branch activity publicly.

COMMENT ON TABLE showcase_workspace_sessions IS 'Ephemeral, per-fork code-server workspace sessions';
COMMENT ON TABLE showcase_workspace_audit_events IS 'Service-only audit trail for workspace lifecycle events';
