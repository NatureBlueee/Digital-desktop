-- ChatGPT Archive Tables Migration
-- Version: 1.0.0
-- Description: Create tables for ChatGPT read-only archive system

-- 1) Conversations table
CREATE TABLE IF NOT EXISTS chatgpt_conversations (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  sort_key TIMESTAMPTZ,
  tags TEXT[] NOT NULL DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'unlisted')),
  share_token TEXT UNIQUE,
  message_count INT NOT NULL DEFAULT 0
);

-- Index for listing conversations by update time
CREATE INDEX IF NOT EXISTS idx_chatgpt_conversations_updated_at
  ON chatgpt_conversations (updated_at DESC);

-- Index for filtering by tags
CREATE INDEX IF NOT EXISTS idx_chatgpt_conversations_tags
  ON chatgpt_conversations USING GIN (tags);

-- Index for visibility filtering
CREATE INDEX IF NOT EXISTS idx_chatgpt_conversations_visibility
  ON chatgpt_conversations (visibility);

-- Index for share token lookup
CREATE INDEX IF NOT EXISTS idx_chatgpt_conversations_share_token
  ON chatgpt_conversations (share_token) WHERE share_token IS NOT NULL;

-- 2) Assets metadata table (binary files stored in Supabase Storage)
CREATE TABLE IF NOT EXISTS chatgpt_assets (
  id UUID PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('image', 'file')),
  sha256 TEXT UNIQUE,
  mime TEXT NOT NULL,
  size BIGINT NOT NULL,
  storage_path TEXT NOT NULL,
  width INT,
  height INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for deduplication by hash
CREATE INDEX IF NOT EXISTS idx_chatgpt_assets_sha256
  ON chatgpt_assets (sha256);

-- 3) Messages table
CREATE TABLE IF NOT EXISTS chatgpt_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES chatgpt_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  order_index INT NOT NULL,
  content_md TEXT NOT NULL,        -- Canonical markdown content
  content_text TEXT NOT NULL,      -- Plain text for search (stripped markdown)
  assets JSONB NOT NULL DEFAULT '[]'::JSONB  -- [{asset_id, kind, caption, ...}]
);

-- Unique index for message ordering within conversation
CREATE UNIQUE INDEX IF NOT EXISTS uq_chatgpt_messages_conv_order
  ON chatgpt_messages (conversation_id, order_index);

-- Index for fetching messages by conversation and time
CREATE INDEX IF NOT EXISTS idx_chatgpt_messages_conv_created
  ON chatgpt_messages (conversation_id, created_at);

-- 4) Full-text search support (Phase 1)
ALTER TABLE chatgpt_messages
  ADD COLUMN IF NOT EXISTS content_tsv TSVECTOR;

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_chatgpt_messages_tsv
  ON chatgpt_messages USING GIN (content_tsv);

-- 5) Trigger to auto-update content_tsv on insert/update
CREATE OR REPLACE FUNCTION chatgpt_messages_tsv_trigger()
RETURNS TRIGGER AS $$
BEGIN
  NEW.content_tsv := to_tsvector('english', COALESCE(NEW.content_text, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatgpt_messages_tsv_update ON chatgpt_messages;
CREATE TRIGGER chatgpt_messages_tsv_update
  BEFORE INSERT OR UPDATE OF content_text ON chatgpt_messages
  FOR EACH ROW EXECUTE FUNCTION chatgpt_messages_tsv_trigger();

-- 6) Trigger to auto-update conversation's updated_at when messages change
CREATE OR REPLACE FUNCTION chatgpt_update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chatgpt_conversations
  SET updated_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatgpt_messages_update_conv_timestamp ON chatgpt_messages;
CREATE TRIGGER chatgpt_messages_update_conv_timestamp
  AFTER INSERT OR UPDATE ON chatgpt_messages
  FOR EACH ROW EXECUTE FUNCTION chatgpt_update_conversation_timestamp();

-- 7) Function to update message_count on conversation
CREATE OR REPLACE FUNCTION chatgpt_update_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE chatgpt_conversations
    SET message_count = message_count + 1
    WHERE id = NEW.conversation_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE chatgpt_conversations
    SET message_count = message_count - 1
    WHERE id = OLD.conversation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS chatgpt_messages_count_trigger ON chatgpt_messages;
CREATE TRIGGER chatgpt_messages_count_trigger
  AFTER INSERT OR DELETE ON chatgpt_messages
  FOR EACH ROW EXECUTE FUNCTION chatgpt_update_message_count();

-- 8) RLS (Row Level Security) policies for public access
ALTER TABLE chatgpt_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatgpt_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatgpt_assets ENABLE ROW LEVEL SECURITY;

-- Public can read public conversations
CREATE POLICY "Public conversations are viewable by everyone"
  ON chatgpt_conversations FOR SELECT
  USING (visibility = 'public');

-- Public can read messages of public conversations
CREATE POLICY "Messages of public conversations are viewable by everyone"
  ON chatgpt_messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chatgpt_conversations
      WHERE id = chatgpt_messages.conversation_id
      AND visibility = 'public'
    )
  );

-- Assets are publicly readable (access control via conversation)
CREATE POLICY "Assets are viewable by everyone"
  ON chatgpt_assets FOR SELECT
  USING (true);

COMMENT ON TABLE chatgpt_conversations IS 'ChatGPT conversation archive - read-only public display';
COMMENT ON TABLE chatgpt_messages IS 'Messages within ChatGPT conversations';
COMMENT ON TABLE chatgpt_assets IS 'Assets (images, files) metadata - binaries stored in Supabase Storage';
