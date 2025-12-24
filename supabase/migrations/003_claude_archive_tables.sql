-- ============================================================
-- Claude Archive Tables
-- Version: 1.0.0
-- Description: Database schema for Claude conversation archive
-- ============================================================

-- ============================================================
-- TABLE: claude_conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sort_key TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_starred BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted')),
    share_token TEXT UNIQUE,
    message_count INT NOT NULL DEFAULT 0,
    model TEXT DEFAULT 'claude-3.5-sonnet',
    project_id UUID REFERENCES claude_projects(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE: claude_projects
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    icon TEXT NOT NULL DEFAULT '📁',
    color TEXT NOT NULL DEFAULT '#8B5CF6',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted')),
    conversation_count INT NOT NULL DEFAULT 0
);

-- Need to create projects table first, then add FK to conversations
-- Drop and recreate with proper order
DROP TABLE IF EXISTS claude_conversations;

CREATE TABLE IF NOT EXISTS claude_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    sort_key TIMESTAMPTZ NOT NULL DEFAULT now(),
    is_starred BOOLEAN NOT NULL DEFAULT false,
    tags TEXT[] DEFAULT '{}',
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted')),
    share_token TEXT UNIQUE,
    message_count INT NOT NULL DEFAULT 0,
    model TEXT DEFAULT 'claude-3.5-sonnet',
    project_id UUID REFERENCES claude_projects(id) ON DELETE SET NULL
);

-- ============================================================
-- TABLE: claude_messages
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES claude_conversations(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    order_index INT NOT NULL,
    content_md TEXT NOT NULL,
    content_text TEXT NOT NULL,
    assets JSONB DEFAULT '[]',
    content_tsv TSVECTOR,
    UNIQUE (conversation_id, order_index)
);

-- ============================================================
-- TABLE: claude_artifacts
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_artifacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES claude_conversations(id) ON DELETE SET NULL,
    message_id UUID REFERENCES claude_messages(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('code', 'document', 'diagram', 'image', 'html', 'react', 'svg', 'mermaid', 'other')),
    language TEXT,
    content TEXT NOT NULL,
    icon TEXT NOT NULL DEFAULT '📄',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted'))
);

-- ============================================================
-- TABLE: claude_assets (for file/image attachments)
-- ============================================================
CREATE TABLE IF NOT EXISTS claude_assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('image', 'file', 'document')),
    sha256 TEXT NOT NULL UNIQUE,
    mime TEXT NOT NULL,
    size BIGINT NOT NULL,
    original_filename TEXT,
    storage_path TEXT NOT NULL,
    width INT,
    height INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_claude_conversations_updated_at ON claude_conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_claude_conversations_starred ON claude_conversations(is_starred) WHERE is_starred = true;
CREATE INDEX IF NOT EXISTS idx_claude_conversations_tags ON claude_conversations USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_claude_conversations_visibility ON claude_conversations(visibility);
CREATE INDEX IF NOT EXISTS idx_claude_conversations_project ON claude_conversations(project_id);

CREATE INDEX IF NOT EXISTS idx_claude_messages_conversation ON claude_messages(conversation_id, order_index);
CREATE INDEX IF NOT EXISTS idx_claude_messages_tsv ON claude_messages USING GIN(content_tsv);

CREATE INDEX IF NOT EXISTS idx_claude_artifacts_conversation ON claude_artifacts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_claude_artifacts_type ON claude_artifacts(type);

CREATE INDEX IF NOT EXISTS idx_claude_projects_updated ON claude_projects(updated_at DESC);

-- ============================================================
-- TRIGGERS: Auto-update tsvector for full-text search
-- ============================================================
CREATE OR REPLACE FUNCTION update_claude_message_tsv()
RETURNS TRIGGER AS $$
BEGIN
    NEW.content_tsv := to_tsvector('english', COALESCE(NEW.content_text, ''));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_claude_message_tsv ON claude_messages;
CREATE TRIGGER trigger_claude_message_tsv
    BEFORE INSERT OR UPDATE OF content_text ON claude_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_claude_message_tsv();

-- ============================================================
-- TRIGGERS: Auto-update message_count on conversations
-- ============================================================
CREATE OR REPLACE FUNCTION update_claude_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE claude_conversations
        SET message_count = message_count + 1,
            updated_at = now()
        WHERE id = NEW.conversation_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE claude_conversations
        SET message_count = message_count - 1,
            updated_at = now()
        WHERE id = OLD.conversation_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_claude_message_count ON claude_messages;
CREATE TRIGGER trigger_claude_message_count
    AFTER INSERT OR DELETE ON claude_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_claude_conversation_message_count();

-- ============================================================
-- TRIGGERS: Auto-update conversation_count on projects
-- ============================================================
CREATE OR REPLACE FUNCTION update_claude_project_conversation_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.project_id IS NOT NULL THEN
        UPDATE claude_projects
        SET conversation_count = conversation_count + 1,
            updated_at = now()
        WHERE id = NEW.project_id;
    ELSIF TG_OP = 'DELETE' AND OLD.project_id IS NOT NULL THEN
        UPDATE claude_projects
        SET conversation_count = conversation_count - 1,
            updated_at = now()
        WHERE id = OLD.project_id;
    ELSIF TG_OP = 'UPDATE' THEN
        IF OLD.project_id IS DISTINCT FROM NEW.project_id THEN
            IF OLD.project_id IS NOT NULL THEN
                UPDATE claude_projects
                SET conversation_count = conversation_count - 1,
                    updated_at = now()
                WHERE id = OLD.project_id;
            END IF;
            IF NEW.project_id IS NOT NULL THEN
                UPDATE claude_projects
                SET conversation_count = conversation_count + 1,
                    updated_at = now()
                WHERE id = NEW.project_id;
            END IF;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_claude_project_count ON claude_conversations;
CREATE TRIGGER trigger_claude_project_count
    AFTER INSERT OR DELETE OR UPDATE OF project_id ON claude_conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_claude_project_conversation_count();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE claude_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE claude_projects ENABLE ROW LEVEL SECURITY;

-- Public read access for public conversations
CREATE POLICY "Public conversations are viewable by everyone"
    ON claude_conversations FOR SELECT
    USING (visibility = 'public');

-- Messages inherit visibility from conversation
CREATE POLICY "Messages are viewable if conversation is public"
    ON claude_messages FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM claude_conversations c
            WHERE c.id = claude_messages.conversation_id
            AND c.visibility = 'public'
        )
    );

-- Artifacts are viewable if public
CREATE POLICY "Public artifacts are viewable by everyone"
    ON claude_artifacts FOR SELECT
    USING (visibility = 'public');

-- Assets are publicly readable
CREATE POLICY "Assets are viewable by everyone"
    ON claude_assets FOR SELECT
    USING (true);

-- Projects are publicly readable
CREATE POLICY "Public projects are viewable by everyone"
    ON claude_projects FOR SELECT
    USING (visibility = 'public');

-- ============================================================
-- COMMENTS
-- ============================================================
COMMENT ON TABLE claude_conversations IS 'Claude conversation archive - read-only display';
COMMENT ON TABLE claude_messages IS 'Messages within Claude conversations';
COMMENT ON TABLE claude_artifacts IS 'Claude artifacts (code, documents, diagrams)';
COMMENT ON TABLE claude_assets IS 'Binary assets (images, files) for Claude messages';
COMMENT ON TABLE claude_projects IS 'Claude projects for grouping conversations';
