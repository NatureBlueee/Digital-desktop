-- Showcase/Portfolio Tables Migration
-- Version: 1.0.0
-- Description: Create tables for project showcase system (AI IDE, etc.)

-- ============================================================
-- 1) Projects table - 项目列表
-- ============================================================
CREATE TABLE IF NOT EXISTS showcase_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,  -- URL-friendly name
  description TEXT,
  app_type TEXT NOT NULL DEFAULT 'cursor' CHECK (app_type IN ('cursor', 'antigravity', 'windsurf')),
  git_repo TEXT,  -- 远程仓库地址 (可选)
  default_file TEXT,  -- 默认打开的文件路径
  is_featured BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for listing projects
CREATE INDEX IF NOT EXISTS idx_showcase_projects_order
  ON showcase_projects (display_order, created_at DESC);

-- Index for slug lookup
CREATE UNIQUE INDEX IF NOT EXISTS idx_showcase_projects_slug
  ON showcase_projects (slug);

-- ============================================================
-- 2) Files table - 文件内容
-- ============================================================
CREATE TABLE IF NOT EXISTS showcase_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES showcase_projects(id) ON DELETE CASCADE,
  path TEXT NOT NULL,  -- 完整路径 (如 src/components/Button.tsx)
  name TEXT NOT NULL,  -- 文件名
  content TEXT,  -- 文件内容 (大文件可为 null，使用 storage)
  language TEXT NOT NULL DEFAULT 'text',
  size_bytes INT DEFAULT 0,
  is_binary BOOLEAN DEFAULT false,
  storage_path TEXT,  -- Supabase Storage 路径 (用于大文件/二进制)
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 确保同一项目内路径唯一
  UNIQUE(project_id, path)
);

-- Index for fetching files by project
CREATE INDEX IF NOT EXISTS idx_showcase_files_project
  ON showcase_files (project_id);

-- Index for path lookup
CREATE INDEX IF NOT EXISTS idx_showcase_files_path
  ON showcase_files (project_id, path);

-- ============================================================
-- 3) File tree cache - 文件树缓存 (JSON 格式，加速加载)
-- ============================================================
CREATE TABLE IF NOT EXISTS showcase_file_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL UNIQUE REFERENCES showcase_projects(id) ON DELETE CASCADE,
  tree_json JSONB NOT NULL,  -- 预计算的文件树结构
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 4) Git commits - Git 提交历史
-- ============================================================
CREATE TABLE IF NOT EXISTS showcase_git_commits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES showcase_projects(id) ON DELETE CASCADE,
  hash TEXT NOT NULL,  -- 完整 commit hash
  short_hash TEXT NOT NULL,  -- 短 hash (7位)
  message TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_email TEXT,
  commit_date TIMESTAMPTZ NOT NULL,
  branch TEXT,  -- 分支名 (可选)
  is_merge BOOLEAN DEFAULT false,
  order_index INT NOT NULL DEFAULT 0,  -- 用于排序
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- 确保同一项目内 hash 唯一
  UNIQUE(project_id, hash)
);

-- Index for fetching commits by project
CREATE INDEX IF NOT EXISTS idx_showcase_commits_project
  ON showcase_git_commits (project_id, order_index DESC);

-- Index for hash lookup
CREATE INDEX IF NOT EXISTS idx_showcase_commits_hash
  ON showcase_git_commits (project_id, short_hash);

-- ============================================================
-- 5) Git diffs - 文件变更 (每个 commit 的变更)
-- ============================================================
CREATE TABLE IF NOT EXISTS showcase_git_diffs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  commit_id UUID NOT NULL REFERENCES showcase_git_commits(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  old_path TEXT,  -- 重命名时的旧路径
  change_type TEXT NOT NULL CHECK (change_type IN ('added', 'modified', 'deleted', 'renamed')),
  additions INT DEFAULT 0,
  deletions INT DEFAULT 0,
  diff_content TEXT,  -- unified diff 格式
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for fetching diffs by commit
CREATE INDEX IF NOT EXISTS idx_showcase_diffs_commit
  ON showcase_git_diffs (commit_id);

-- ============================================================
-- 6) Trigger to auto-update project's updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION showcase_update_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE showcase_projects
  SET updated_at = NOW()
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on files
DROP TRIGGER IF EXISTS showcase_files_update_project_timestamp ON showcase_files;
CREATE TRIGGER showcase_files_update_project_timestamp
  AFTER INSERT OR UPDATE ON showcase_files
  FOR EACH ROW EXECUTE FUNCTION showcase_update_project_timestamp();

-- Trigger on commits
DROP TRIGGER IF EXISTS showcase_commits_update_project_timestamp ON showcase_git_commits;
CREATE TRIGGER showcase_commits_update_project_timestamp
  AFTER INSERT OR UPDATE ON showcase_git_commits
  FOR EACH ROW EXECUTE FUNCTION showcase_update_project_timestamp();

-- ============================================================
-- 7) RLS (Row Level Security) - 只读公开访问
-- ============================================================
ALTER TABLE showcase_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_file_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_git_commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE showcase_git_diffs ENABLE ROW LEVEL SECURITY;

-- Public read access for all tables
CREATE POLICY "Projects are viewable by everyone"
  ON showcase_projects FOR SELECT
  USING (true);

CREATE POLICY "Files are viewable by everyone"
  ON showcase_files FOR SELECT
  USING (true);

CREATE POLICY "File trees are viewable by everyone"
  ON showcase_file_trees FOR SELECT
  USING (true);

CREATE POLICY "Git commits are viewable by everyone"
  ON showcase_git_commits FOR SELECT
  USING (true);

CREATE POLICY "Git diffs are viewable by everyone"
  ON showcase_git_diffs FOR SELECT
  USING (true);

-- ============================================================
-- 8) Comments
-- ============================================================
COMMENT ON TABLE showcase_projects IS 'Project showcase - read-only portfolio display';
COMMENT ON TABLE showcase_files IS 'File contents for showcase projects';
COMMENT ON TABLE showcase_file_trees IS 'Pre-computed file tree JSON for fast loading';
COMMENT ON TABLE showcase_git_commits IS 'Git commit history for showcase projects';
COMMENT ON TABLE showcase_git_diffs IS 'File diffs for each git commit';
