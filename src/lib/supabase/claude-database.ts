/**
 * Claude Archive Database Operations
 * Supabase database functions for Claude conversation archive
 */

import { supabase } from './client';
import type {
  ClaudeConversationDB,
  ClaudeMessageDB,
  ClaudeArtifactDB,
  ClaudeAssetDB,
  ClaudeProjectDB,
  ConversationListItem,
  Conversation,
  Message,
  Artifact,
  Project,
  MessageAsset,
  MessageAssetRef,
  PaginatedResponse,
  SearchResult,
  ConversationListParams,
  MessageListParams,
  SearchParams,
  ArtifactListParams,
  ProjectListParams,
  MessageRole,
} from '@/types/claude-archive';

// ============================================================
// Internal Types for partial query results
// ============================================================

interface PartialMessageRow {
  id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  assets: MessageAssetRef[];
}

interface SearchMessageRow {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content_text: string;
  claude_conversations: {
    id: string;
    title: string;
    visibility: string;
  }[];
}

// ============================================================
// Conversation Operations
// ============================================================

/**
 * Get public conversations with pagination and filtering
 */
export async function getPublicConversations(
  params: ConversationListParams = {}
): Promise<PaginatedResponse<ConversationListItem>> {
  const { query, tag, starred, project_id, cursor, limit = 30 } = params;

  let queryBuilder = supabase
    .from('claude_conversations')
    .select('id, title, summary, created_at, updated_at, is_starred, tags, message_count, model, project_id')
    .eq('visibility', 'public')
    .order('updated_at', { ascending: false })
    .limit(limit + 1);

  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }

  if (tag) {
    queryBuilder = queryBuilder.contains('tags', [tag]);
  }

  if (starred !== undefined) {
    queryBuilder = queryBuilder.eq('is_starred', starred);
  }

  if (project_id) {
    queryBuilder = queryBuilder.eq('project_id', project_id);
  }

  if (cursor) {
    queryBuilder = queryBuilder.lt('updated_at', cursor);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].updated_at : null;

  return {
    data: items as ConversationListItem[],
    next_cursor: nextCursor,
    has_more: hasMore,
  };
}

/**
 * Get starred conversations
 */
export async function getStarredConversations(
  limit: number = 10
): Promise<ConversationListItem[]> {

  const { data, error } = await supabase
    .from('claude_conversations')
    .select('id, title, summary, created_at, updated_at, is_starred, tags, message_count, model, project_id')
    .eq('visibility', 'public')
    .eq('is_starred', true)
    .order('updated_at', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to fetch starred conversations: ${error.message}`);
  }

  return data as ConversationListItem[];
}

/**
 * Get a single conversation by ID
 */
export async function getConversationById(
  id: string
): Promise<Conversation | null> {

  const { data, error } = await supabase
    .from('claude_conversations')
    .select('*')
    .eq('id', id)
    .eq('visibility', 'public')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }

  const conv = data as ClaudeConversationDB;
  return {
    id: conv.id,
    title: conv.title,
    summary: conv.summary,
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    is_starred: conv.is_starred,
    tags: conv.tags,
    message_count: conv.message_count,
    model: conv.model,
    project_id: conv.project_id,
    visibility: conv.visibility,
    share_token: conv.share_token,
  };
}

/**
 * Get a conversation by share token (for unlisted access)
 */
export async function getConversationByShareToken(
  token: string
): Promise<Conversation | null> {

  const { data, error } = await supabase
    .from('claude_conversations')
    .select('*')
    .eq('share_token', token)
    .eq('visibility', 'unlisted')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch conversation: ${error.message}`);
  }

  const conv = data as ClaudeConversationDB;
  return {
    id: conv.id,
    title: conv.title,
    summary: conv.summary,
    created_at: conv.created_at,
    updated_at: conv.updated_at,
    is_starred: conv.is_starred,
    tags: conv.tags,
    message_count: conv.message_count,
    model: conv.model,
    project_id: conv.project_id,
    visibility: conv.visibility,
    share_token: conv.share_token,
  };
}

// ============================================================
// Message Operations
// ============================================================

/**
 * Resolve asset references to full asset objects
 */
async function resolveMessageAssets(
  messages: PartialMessageRow[]
): Promise<Message[]> {

  // Collect all unique asset IDs
  const assetIds = new Set<string>();
  for (const msg of messages) {
    if (msg.assets && Array.isArray(msg.assets)) {
      for (const ref of msg.assets) {
        assetIds.add(ref.asset_id);
      }
    }
  }

  // Fetch all assets in one query
  let assetMap: Record<string, ClaudeAssetDB> = {};
  if (assetIds.size > 0) {
    const { data: assets, error } = await supabase
      .from('claude_assets')
      .select('*')
      .in('id', Array.from(assetIds));

    if (error) {
      console.error('Failed to fetch assets:', error);
    } else if (assets) {
      assetMap = Object.fromEntries(assets.map((a) => [a.id, a as ClaudeAssetDB]));
    }
  }

  // Build message objects with resolved assets
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    created_at: msg.created_at,
    order_index: msg.order_index,
    content_md: msg.content_md,
    assets: (msg.assets || [])
      .filter((ref) => assetMap[ref.asset_id])
      .map((ref): MessageAsset => {
        const asset = assetMap[ref.asset_id];
        return {
          id: asset.id,
          type: asset.type,
          mime: asset.mime,
          size: asset.size,
          url: asset.storage_path,
          filename: asset.original_filename,
          width: asset.width,
          height: asset.height,
          caption: ref.caption,
          alt: ref.alt,
        };
      }),
  }));
}

/**
 * Get messages for a conversation with pagination
 */
export async function getConversationMessages(
  conversationId: string,
  params: MessageListParams = {}
): Promise<PaginatedResponse<Message>> {
  const { cursor, limit = 50, direction = 'forward' } = params;

  let queryBuilder = supabase
    .from('claude_messages')
    .select('id, role, created_at, order_index, content_md, assets')
    .eq('conversation_id', conversationId)
    .order('order_index', { ascending: direction === 'forward' })
    .limit(limit + 1);

  if (cursor !== undefined) {
    if (direction === 'forward') {
      queryBuilder = queryBuilder.gt('order_index', cursor);
    } else {
      queryBuilder = queryBuilder.lt('order_index', cursor);
    }
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].order_index : null;

  const messages = await resolveMessageAssets(items as PartialMessageRow[]);

  return {
    data: messages,
    next_cursor: nextCursor !== null ? String(nextCursor) : null,
    has_more: hasMore,
  };
}

/**
 * Get all messages for a conversation (no pagination)
 */
export async function getAllConversationMessages(
  conversationId: string
): Promise<Message[]> {

  const { data, error } = await supabase
    .from('claude_messages')
    .select('id, role, created_at, order_index, content_md, assets')
    .eq('conversation_id', conversationId)
    .order('order_index', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }

  return resolveMessageAssets(data as PartialMessageRow[]);
}

// ============================================================
// Artifact Operations
// ============================================================

/**
 * Get artifacts with pagination and filtering
 */
export async function getArtifacts(
  params: ArtifactListParams = {}
): Promise<PaginatedResponse<Artifact>> {
  const { type, conversation_id, cursor, limit = 20 } = params;

  let queryBuilder = supabase
    .from('claude_artifacts')
    .select('*')
    .eq('visibility', 'public')
    .order('created_at', { ascending: false })
    .limit(limit + 1);

  if (type) {
    queryBuilder = queryBuilder.eq('type', type);
  }

  if (conversation_id) {
    queryBuilder = queryBuilder.eq('conversation_id', conversation_id);
  }

  if (cursor) {
    queryBuilder = queryBuilder.lt('created_at', cursor);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch artifacts: ${error.message}`);
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].created_at : null;

  return {
    data: (items as ClaudeArtifactDB[]).map((a): Artifact => ({
      id: a.id,
      title: a.title,
      type: a.type,
      language: a.language,
      content: a.content,
      icon: a.icon,
      created_at: a.created_at,
      updated_at: a.updated_at,
      conversation_id: a.conversation_id,
      message_id: a.message_id,
    })),
    next_cursor: nextCursor,
    has_more: hasMore,
  };
}

/**
 * Get a single artifact by ID
 */
export async function getArtifactById(
  id: string
): Promise<Artifact | null> {

  const { data, error } = await supabase
    .from('claude_artifacts')
    .select('*')
    .eq('id', id)
    .eq('visibility', 'public')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch artifact: ${error.message}`);
  }

  const a = data as ClaudeArtifactDB;
  return {
    id: a.id,
    title: a.title,
    type: a.type,
    language: a.language,
    content: a.content,
    icon: a.icon,
    created_at: a.created_at,
    updated_at: a.updated_at,
    conversation_id: a.conversation_id,
    message_id: a.message_id,
  };
}

// ============================================================
// Project Operations
// ============================================================

/**
 * Get projects with pagination
 */
export async function getProjects(
  params: ProjectListParams = {}
): Promise<PaginatedResponse<Project>> {
  const { cursor, limit = 20 } = params;

  let queryBuilder = supabase
    .from('claude_projects')
    .select('*')
    .eq('visibility', 'public')
    .order('updated_at', { ascending: false })
    .limit(limit + 1);

  if (cursor) {
    queryBuilder = queryBuilder.lt('updated_at', cursor);
  }

  const { data, error } = await queryBuilder;

  if (error) {
    throw new Error(`Failed to fetch projects: ${error.message}`);
  }

  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;
  const nextCursor = hasMore ? items[items.length - 1].updated_at : null;

  return {
    data: items.map((p: ClaudeProjectDB): Project => ({
      id: p.id,
      title: p.title,
      description: p.description,
      icon: p.icon,
      color: p.color,
      created_at: p.created_at,
      updated_at: p.updated_at,
      conversation_count: p.conversation_count,
    })),
    next_cursor: nextCursor,
    has_more: hasMore,
  };
}

/**
 * Get a single project by ID
 */
export async function getProjectById(
  id: string
): Promise<Project | null> {

  const { data, error } = await supabase
    .from('claude_projects')
    .select('*')
    .eq('id', id)
    .eq('visibility', 'public')
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch project: ${error.message}`);
  }

  const p = data as ClaudeProjectDB;
  return {
    id: p.id,
    title: p.title,
    description: p.description,
    icon: p.icon,
    color: p.color,
    created_at: p.created_at,
    updated_at: p.updated_at,
    conversation_count: p.conversation_count,
  };
}

// ============================================================
// Search Operations
// ============================================================

/**
 * Full-text search across messages
 */
export async function searchMessages(
  params: SearchParams
): Promise<PaginatedResponse<SearchResult>> {
  const { q, cursor = 0, limit = 20 } = params;

  // Try full-text search first, fallback to ILIKE
  const searchQuery = q.split(/\s+/).join(' & ');

  const { data, error } = await supabase
    .from('claude_messages')
    .select(`
      id,
      conversation_id,
      role,
      content_text,
      claude_conversations!inner (
        id,
        title,
        visibility
      )
    `)
    .textSearch('content_tsv', searchQuery, { type: 'websearch' })
    .eq('claude_conversations.visibility', 'public')
    .range(cursor, cursor + limit);

  // If FTS fails or returns no results, try ILIKE
  if (error || !data || data.length === 0) {
    const { data: iLikeData, error: iLikeError } = await supabase
      .from('claude_messages')
      .select(`
        id,
        conversation_id,
        role,
        content_text,
        claude_conversations!inner (
          id,
          title,
          visibility
        )
      `)
      .ilike('content_text', `%${q}%`)
      .eq('claude_conversations.visibility', 'public')
      .range(cursor, cursor + limit + 1);

    if (iLikeError) {
      throw new Error(`Search failed: ${iLikeError.message}`);
    }

    return formatSearchResults(iLikeData as SearchMessageRow[], q, cursor, limit);
  }

  return formatSearchResults(data as SearchMessageRow[], q, cursor, limit);
}

function formatSearchResults(
  data: SearchMessageRow[],
  query: string,
  cursor: number,
  limit: number
): PaginatedResponse<SearchResult> {
  const hasMore = data.length > limit;
  const items = hasMore ? data.slice(0, limit) : data;

  const results: SearchResult[] = items.map((row) => {
    const text = row.content_text;
    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const idx = lowerText.indexOf(lowerQuery);

    // Extract snippet around the match
    const snippetStart = Math.max(0, idx - 50);
    const snippetEnd = Math.min(text.length, idx + query.length + 50);
    let snippet = text.slice(snippetStart, snippetEnd);
    if (snippetStart > 0) snippet = '...' + snippet;
    if (snippetEnd < text.length) snippet = snippet + '...';

    // Get conversation title from joined data (inner join returns array)
    const conversationTitle = row.claude_conversations[0]?.title || 'Unknown';

    return {
      message_id: row.id,
      conversation_id: row.conversation_id,
      conversation_title: conversationTitle,
      role: row.role,
      snippet,
      highlight_start: idx - snippetStart + (snippetStart > 0 ? 3 : 0),
      highlight_end: idx - snippetStart + query.length + (snippetStart > 0 ? 3 : 0),
    };
  });

  return {
    data: results,
    next_cursor: hasMore ? String(cursor + limit) : null,
    has_more: hasMore,
  };
}

// ============================================================
// Tag Operations
// ============================================================

/**
 * Get all unique tags from public conversations
 */
export async function getAllTags(): Promise<string[]> {

  const { data, error } = await supabase
    .from('claude_conversations')
    .select('tags')
    .eq('visibility', 'public');

  if (error) {
    throw new Error(`Failed to fetch tags: ${error.message}`);
  }

  const tagSet = new Set<string>();
  for (const row of data) {
    if (row.tags && Array.isArray(row.tags)) {
      for (const tag of row.tags) {
        tagSet.add(tag);
      }
    }
  }

  return Array.from(tagSet).sort();
}

// ============================================================
// Import Operations
// ============================================================

/**
 * Import a project
 */
export async function importProject(
  project: {
    id?: string;
    title: string;
    description?: string;
    icon?: string;
    color?: string;
  }
): Promise<string> {

  const { data, error } = await supabase
    .from('claude_projects')
    .insert({
      id: project.id,
      title: project.title,
      description: project.description || null,
      icon: project.icon || '📁',
      color: project.color || '#8B5CF6',
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to import project: ${error.message}`);
  }

  return data.id;
}

/**
 * Import a conversation
 */
export async function importConversation(
  conversation: {
    id?: string;
    title: string;
    summary?: string;
    is_starred?: boolean;
    tags?: string[];
    visibility?: 'public' | 'unlisted';
    sort_key?: string;
    model?: string;
    project_id?: string;
  }
): Promise<string> {

  const { data, error } = await supabase
    .from('claude_conversations')
    .insert({
      id: conversation.id,
      title: conversation.title,
      summary: conversation.summary || null,
      is_starred: conversation.is_starred || false,
      tags: conversation.tags || [],
      visibility: conversation.visibility || 'public',
      sort_key: conversation.sort_key || new Date().toISOString(),
      model: conversation.model || 'claude-3.5-sonnet',
      project_id: conversation.project_id || null,
      share_token: conversation.visibility === 'unlisted'
        ? crypto.randomUUID().replace(/-/g, '').slice(0, 16)
        : null,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to import conversation: ${error.message}`);
  }

  return data.id;
}

/**
 * Import messages for a conversation
 */
export async function importMessages(
  conversationId: string,
  messages: Array<{
    id?: string;
    role: 'user' | 'assistant' | 'system';
    order_index: number;
    created_at?: string;
    content_md: string;
    assets?: Array<{ asset_id: string; caption?: string; alt?: string }>;
  }>
): Promise<void> {

  const rows = messages.map((msg) => ({
    id: msg.id,
    conversation_id: conversationId,
    role: msg.role,
    order_index: msg.order_index,
    created_at: msg.created_at || new Date().toISOString(),
    content_md: msg.content_md,
    content_text: msg.content_md.replace(/[#*`\[\]()>_~]/g, ''),
    assets: msg.assets || [],
  }));

  const { error } = await supabase.from('claude_messages').insert(rows);

  if (error) {
    throw new Error(`Failed to import messages: ${error.message}`);
  }
}

/**
 * Import an artifact
 */
export async function importArtifact(
  artifact: {
    id?: string;
    title: string;
    type: 'code' | 'document' | 'diagram' | 'image' | 'html' | 'react' | 'svg' | 'mermaid' | 'other';
    language?: string;
    content: string;
    icon?: string;
    conversation_id?: string;
    message_id?: string;
  }
): Promise<string> {

  const { data, error } = await supabase
    .from('claude_artifacts')
    .insert({
      id: artifact.id,
      title: artifact.title,
      type: artifact.type,
      language: artifact.language || null,
      content: artifact.content,
      icon: artifact.icon || '📄',
      conversation_id: artifact.conversation_id || null,
      message_id: artifact.message_id || null,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to import artifact: ${error.message}`);
  }

  return data.id;
}
