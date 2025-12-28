import { getSupabaseClient } from './client';
import {
  ChatGPTConversationDB,
  ChatGPTMessageDB,
  ChatGPTAssetDB,
  ConversationListItem,
  ConversationDetail,
  Message,
  MessageAsset,
  SearchResultItem,
  PaginatedResponse,
  ConversationListParams,
  MessageListParams,
  SearchParams,
  MessageRole,
} from '@/types/chatgpt-archive';

const DEFAULT_PAGE_SIZE = 30;
const MESSAGE_PAGE_SIZE = 50;
const SEARCH_PAGE_SIZE = 20;

// Internal type for partial message data from queries
interface PartialMessageRow {
  id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  assets: { asset_id: string; caption?: string; alt?: string }[];
}

// Internal type for search fallback
interface SearchMessageRow {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content_text: string;
}

// ============================================================================
// Conversations
// ============================================================================

/**
 * 获取公开对话列表
 */
export async function getPublicConversations(
  params: ConversationListParams = {}
): Promise<PaginatedResponse<ConversationListItem>> {
  const { cursor, limit = DEFAULT_PAGE_SIZE, query, tag } = params;

  let queryBuilder = getSupabaseClient()
    .from('chatgpt_conversations')
    .select('id, title, summary, created_at, updated_at, tags, message_count')
    .eq('visibility', 'public')
    .order('sort_key', { ascending: false, nullsFirst: false })
    .order('updated_at', { ascending: false })
    .limit(limit + 1); // Fetch one extra to check if there's more

  // Apply cursor-based pagination
  if (cursor) {
    queryBuilder = queryBuilder.lt('updated_at', cursor);
  }

  // Apply tag filter
  if (tag) {
    queryBuilder = queryBuilder.contains('tags', [tag]);
  }

  // Apply search query (title only for listing)
  if (query) {
    queryBuilder = queryBuilder.ilike('title', `%${query}%`);
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;

  const conversations = data || [];
  const hasMore = conversations.length > limit;
  const items = hasMore ? conversations.slice(0, limit) : conversations;

  return {
    data: items as ConversationListItem[],
    next_cursor: hasMore ? items[items.length - 1]?.updated_at : null,
    has_more: hasMore,
  };
}

/**
 * 获取单个对话详情（仅公开）
 */
export async function getConversationById(
  id: string
): Promise<ConversationDetail | null> {
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_conversations')
    .select('id, title, summary, created_at, updated_at, tags, message_count')
    .eq('id', id)
    .eq('visibility', 'public')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }

  return data as ConversationDetail;
}

/**
 * 通过分享令牌获取对话（用于 unlisted）
 */
export async function getConversationByShareToken(
  token: string
): Promise<ConversationDetail | null> {
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_conversations')
    .select('id, title, summary, created_at, updated_at, tags, message_count')
    .eq('share_token', token)
    .eq('visibility', 'unlisted')
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as ConversationDetail;
}

/**
 * 获取所有标签（用于筛选器）
 */
export async function getAllTags(): Promise<string[]> {
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_conversations')
    .select('tags')
    .eq('visibility', 'public');

  if (error) throw error;

  // Flatten and deduplicate tags
  const tagSet = new Set<string>();
  (data || []).forEach((conv: { tags: string[] }) => {
    conv.tags.forEach((tag) => tagSet.add(tag));
  });

  return Array.from(tagSet).sort();
}

// ============================================================================
// Messages
// ============================================================================

/**
 * 获取对话的消息列表
 */
export async function getConversationMessages(
  conversationId: string,
  params: MessageListParams = {}
): Promise<PaginatedResponse<Message>> {
  const { cursor, limit = MESSAGE_PAGE_SIZE, direction = 'forward' } = params;

  // First verify conversation is accessible
  const conv = await getConversationById(conversationId);
  if (!conv) {
    throw new Error('Conversation not found or not accessible');
  }

  let queryBuilder = getSupabaseClient()
    .from('chatgpt_messages')
    .select('id, role, created_at, order_index, content_md, assets')
    .eq('conversation_id', conversationId)
    .order('order_index', { ascending: direction === 'forward' })
    .limit(limit + 1);

  if (cursor) {
    const cursorIndex = parseInt(cursor, 10);
    if (direction === 'forward') {
      queryBuilder = queryBuilder.gt('order_index', cursorIndex);
    } else {
      queryBuilder = queryBuilder.lt('order_index', cursorIndex);
    }
  }

  const { data, error } = await queryBuilder;

  if (error) throw error;

  const messages = data || [];
  const hasMore = messages.length > limit;
  const items = hasMore ? messages.slice(0, limit) : messages;

  // Resolve asset references
  const messagesWithAssets = await resolveMessageAssets(items);

  return {
    data: messagesWithAssets,
    next_cursor: hasMore ? String(items[items.length - 1]?.order_index) : null,
    has_more: hasMore,
  };
}

/**
 * 获取对话的所有消息（用于小对话，无分页）
 */
export async function getAllConversationMessages(
  conversationId: string
): Promise<Message[]> {
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_messages')
    .select('id, role, created_at, order_index, content_md, assets')
    .eq('conversation_id', conversationId)
    .order('order_index', { ascending: true });

  if (error) throw error;

  return resolveMessageAssets(data || []);
}

/**
 * 解析消息中的资源引用，获取完整 URL
 */
async function resolveMessageAssets(
  messages: PartialMessageRow[]
): Promise<Message[]> {
  // Collect all asset IDs
  const assetIds = new Set<string>();
  messages.forEach((msg) => {
    (msg.assets || []).forEach((ref) => {
      assetIds.add(ref.asset_id);
    });
  });

  if (assetIds.size === 0) {
    return messages.map((msg) => ({
      id: msg.id,
      role: msg.role,
      created_at: msg.created_at,
      order_index: msg.order_index,
      content_md: msg.content_md,
      assets: [],
    }));
  }

  // Fetch assets
  const { data: assets, error } = await getSupabaseClient()
    .from('chatgpt_assets')
    .select('*')
    .in('id', Array.from(assetIds));

  if (error) throw error;

  const assetMap = new Map<string, ChatGPTAssetDB>();
  (assets || []).forEach((asset: ChatGPTAssetDB) => {
    assetMap.set(asset.id, asset);
  });

  // Map messages with resolved assets
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    created_at: msg.created_at,
    order_index: msg.order_index,
    content_md: msg.content_md,
    assets: (msg.assets || [])
      .map((ref: { asset_id: string; caption?: string; alt?: string }) => {
        const asset = assetMap.get(ref.asset_id);
        if (!asset) return null;

        // Get public URL from Supabase Storage
        const { data: urlData } = getSupabaseClient().storage
          .from('chatgpt-assets')
          .getPublicUrl(asset.storage_path);

        return {
          id: asset.id,
          type: asset.type,
          mime: asset.mime,
          size: asset.size,
          url: urlData.publicUrl,
          width: asset.width,
          height: asset.height,
          caption: ref.caption,
          alt: ref.alt,
        } as MessageAsset;
      })
      .filter(Boolean) as MessageAsset[],
  }));
}

// ============================================================================
// Search
// ============================================================================

/**
 * 全文搜索消息（仅公开对话）
 */
export async function searchMessages(
  params: SearchParams
): Promise<PaginatedResponse<SearchResultItem>> {
  const { q, cursor, limit = SEARCH_PAGE_SIZE } = params;

  if (!q || q.trim().length === 0) {
    return { data: [], next_cursor: null, has_more: false };
  }

  // Convert query to tsquery format
  const searchQuery = q
    .trim()
    .split(/\s+/)
    .map((word) => `${word}:*`)
    .join(' & ');

  const offset = cursor ? parseInt(cursor, 10) : 0;

  const { data, error } = await getSupabaseClient().rpc('search_chatgpt_messages', {
    search_query: searchQuery,
    result_limit: limit + 1,
    result_offset: offset,
  });

  if (error) {
    // Fallback to ILIKE if RPC not available
    console.warn('RPC search failed, falling back to ILIKE:', error);
    return searchMessagesFallback(params);
  }

  const results = data || [];
  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, limit) : results;

  return {
    data: items as SearchResultItem[],
    next_cursor: hasMore ? String(offset + limit) : null,
    has_more: hasMore,
  };
}

/**
 * 备用搜索方法（使用 ILIKE）
 */
async function searchMessagesFallback(
  params: SearchParams
): Promise<PaginatedResponse<SearchResultItem>> {
  const { q, cursor, limit = SEARCH_PAGE_SIZE } = params;
  const offset = cursor ? parseInt(cursor, 10) : 0;

  // Get public conversation IDs first
  const { data: publicConvs, error: convError } = await getSupabaseClient()
    .from('chatgpt_conversations')
    .select('id, title')
    .eq('visibility', 'public');

  if (convError) throw convError;

  const publicIds = (publicConvs || []).map((c: { id: string }) => c.id);
  const convTitleMap = new Map(
    (publicConvs || []).map((c: { id: string; title: string }) => [c.id, c.title])
  );

  if (publicIds.length === 0) {
    return { data: [], next_cursor: null, has_more: false };
  }

  // Search messages
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_messages')
    .select('id, conversation_id, role, content_text')
    .in('conversation_id', publicIds)
    .ilike('content_text', `%${q}%`)
    .range(offset, offset + limit);

  if (error) throw error;

  const results = (data || []).map((msg: SearchMessageRow) => ({
    conversation_id: msg.conversation_id,
    conversation_title: convTitleMap.get(msg.conversation_id) || '',
    message_id: msg.id,
    role: msg.role,
    snippet: createSnippet(msg.content_text, q),
    rank: 1,
  }));

  const hasMore = results.length > limit;
  const items = hasMore ? results.slice(0, limit) : results;

  return {
    data: items,
    next_cursor: hasMore ? String(offset + limit) : null,
    has_more: hasMore,
  };
}

/**
 * 创建搜索结果摘要
 */
function createSnippet(text: string, query: string, maxLength = 150): string {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const index = lowerText.indexOf(lowerQuery);

  if (index === -1) {
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(text.length, index + query.length + 100);

  let snippet = text.substring(start, end);
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';

  return snippet;
}

// ============================================================================
// Import Functions (for admin/importer use)
// ============================================================================

/**
 * 导入或更新对话
 */
export async function upsertConversation(
  conversation: ChatGPTConversationDB
): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('chatgpt_conversations')
    .upsert(conversation);

  if (error) throw error;
}

/**
 * 导入或更新消息
 */
export async function upsertMessage(message: ChatGPTMessageDB): Promise<void> {
  const { error } = await getSupabaseClient().from('chatgpt_messages').upsert(message);

  if (error) throw error;
}

/**
 * 导入资源（去重）
 */
export async function upsertAsset(asset: ChatGPTAssetDB): Promise<void> {
  const { error } = await getSupabaseClient()
    .from('chatgpt_assets')
    .upsert(asset, { onConflict: 'sha256' });

  if (error) throw error;
}

/**
 * 通过 SHA256 查找资源
 */
export async function getAssetBySha256(
  sha256: string
): Promise<ChatGPTAssetDB | null> {
  const { data, error } = await getSupabaseClient()
    .from('chatgpt_assets')
    .select('*')
    .eq('sha256', sha256)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return data as ChatGPTAssetDB;
}
