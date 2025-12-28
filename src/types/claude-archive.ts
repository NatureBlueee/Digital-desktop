/**
 * Claude Archive Types
 * TypeScript definitions for Claude conversation archive system
 */

// ============================================================
// Database Types (match Supabase schema)
// ============================================================

export type ConversationVisibility = 'public' | 'unlisted';
export type MessageRole = 'user' | 'assistant' | 'system';
export type ArtifactType = 'code' | 'document' | 'diagram' | 'image' | 'html' | 'react' | 'svg' | 'mermaid' | 'other';
export type AssetType = 'image' | 'file' | 'document';

/** Database row type for claude_conversations */
export interface ClaudeConversationDB {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  sort_key: string;
  is_starred: boolean;
  tags: string[];
  visibility: ConversationVisibility;
  share_token: string | null;
  message_count: number;
  model: string | null;
  project_id: string | null;
}

/** Database row type for claude_messages */
export interface ClaudeMessageDB {
  id: string;
  conversation_id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  content_text: string;
  assets: MessageAssetRef[];
  content_tsv: string | null;
}

/** Database row type for claude_artifacts */
export interface ClaudeArtifactDB {
  id: string;
  conversation_id: string | null;
  message_id: string | null;
  title: string;
  type: ArtifactType;
  language: string | null;
  content: string;
  icon: string;
  created_at: string;
  updated_at: string;
  visibility: ConversationVisibility;
}

/** Database row type for claude_assets */
export interface ClaudeAssetDB {
  id: string;
  type: AssetType;
  sha256: string;
  mime: string;
  size: number;
  original_filename: string | null;
  storage_path: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

/** Database row type for claude_projects */
export interface ClaudeProjectDB {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
  visibility: ConversationVisibility;
  conversation_count: number;
}

// ============================================================
// API Response Types
// ============================================================

/** Asset reference stored in message.assets JSONB */
export interface MessageAssetRef {
  asset_id: string;
  caption?: string;
  alt?: string;
}

/** Resolved asset with full details */
export interface MessageAsset {
  id: string;
  type: AssetType;
  mime: string;
  size: number;
  url: string;
  filename: string | null;
  width: number | null;
  height: number | null;
  caption?: string;
  alt?: string;
}

/** Conversation for list display */
export interface ConversationListItem {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  is_starred: boolean;
  tags: string[];
  message_count: number;
  model: string | null;
  project_id: string | null;
}

/** Full conversation details */
export interface Conversation extends ConversationListItem {
  visibility: ConversationVisibility;
  share_token: string | null;
}

/** Message for display */
export interface Message {
  id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  assets: MessageAsset[];
}

/** Artifact for display */
export interface Artifact {
  id: string;
  title: string;
  type: ArtifactType;
  language: string | null;
  content: string;
  icon: string;
  created_at: string;
  updated_at: string;
  conversation_id: string | null;
  message_id: string | null;
}

/** Project for display */
export interface Project {
  id: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  created_at: string;
  updated_at: string;
  conversation_count: number;
}

/** Search result with snippet */
export interface SearchResult {
  message_id: string;
  conversation_id: string;
  conversation_title: string;
  role: MessageRole;
  snippet: string;
  highlight_start: number;
  highlight_end: number;
}

// ============================================================
// API Request/Response Types
// ============================================================

/** Paginated list response */
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  has_more: boolean;
}

/** Conversation list request params */
export interface ConversationListParams {
  query?: string;
  tag?: string;
  starred?: boolean;
  project_id?: string;
  cursor?: string;
  limit?: number;
}

/** Message list request params */
export interface MessageListParams {
  cursor?: number;
  limit?: number;
  direction?: 'forward' | 'backward';
  all?: boolean;
}

/** Search request params */
export interface SearchParams {
  q: string;
  cursor?: number;
  limit?: number;
}

/** Artifact list request params */
export interface ArtifactListParams {
  type?: ArtifactType;
  conversation_id?: string;
  cursor?: string;
  limit?: number;
}

/** Project list request params */
export interface ProjectListParams {
  cursor?: string;
  limit?: number;
}

// ============================================================
// Import Types (for data import tool)
// ============================================================

/** Conversation import format */
export interface ConversationImport {
  id?: string;
  title: string;
  summary?: string;
  is_starred?: boolean;
  tags?: string[];
  visibility?: ConversationVisibility;
  sort_key?: string;
  model?: string;
  project_id?: string;
}

/** Message import format */
export interface MessageImport {
  id?: string;
  role: MessageRole;
  order_index: number;
  created_at?: string;
  content_md: string;
  assets?: MessageAssetRef[];
}

/** Artifact import format */
export interface ArtifactImport {
  id?: string;
  title: string;
  type: ArtifactType;
  language?: string;
  content: string;
  icon?: string;
  conversation_id?: string;
  message_id?: string;
}

/** Project import format */
export interface ProjectImport {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

/** Complete import package */
export interface ClaudeImportPackage {
  projects?: ProjectImport[];
  conversations: ConversationImport[];
  messages: Record<string, MessageImport[]>;  // conversation_id -> messages
  artifacts?: ArtifactImport[];
}

// ============================================================
// Frontend Component Props
// ============================================================

/** Props for conversation list component */
export interface ConversationListProps {
  selectedId?: string;
  onSelect: (conversation: ConversationListItem) => void;
  filter?: {
    starred?: boolean;
    tag?: string;
    projectId?: string;
  };
}

/** Props for message timeline component */
export interface MessageTimelineProps {
  conversationId: string;
  highlightMessageId?: string;
}

/** Props for artifact card component */
export interface ArtifactCardProps {
  artifact: Artifact;
  onClick?: () => void;
}

/** Props for project card component */
export interface ProjectCardProps {
  project: Project;
  onClick?: () => void;
}
