/**
 * ChatGPT Archive Types
 * 专用于只读档案系统的类型定义
 * @version 1.0.0
 */

// ============================================================================
// Database Types (match Supabase schema)
// ============================================================================

/**
 * 对话可见性
 */
export type ConversationVisibility = 'public' | 'unlisted';

/**
 * 消息角色
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * 资源类型
 */
export type AssetType = 'image' | 'file';

/**
 * 对话表结构
 */
export interface ChatGPTConversationDB {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  sort_key: string | null;
  tags: string[];
  visibility: ConversationVisibility;
  share_token: string | null;
  message_count: number;
}

/**
 * 消息表结构
 */
export interface ChatGPTMessageDB {
  id: string;
  conversation_id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  content_text: string;
  assets: MessageAssetRef[];
  content_tsv?: string; // tsvector for search, not used in frontend
}

/**
 * 资源表结构
 */
export interface ChatGPTAssetDB {
  id: string;
  type: AssetType;
  sha256: string | null;
  mime: string;
  size: number;
  storage_path: string;
  width: number | null;
  height: number | null;
  created_at: string;
}

/**
 * 消息中的资源引用
 */
export interface MessageAssetRef {
  asset_id: string;
  kind: 'inline' | 'attachment';
  caption?: string;
  alt?: string;
}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * 对话列表项（不含完整消息）
 */
export interface ConversationListItem {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  message_count: number;
  // 预览：第一条消息的摘要
  preview?: string;
}

/**
 * 对话详情（含元信息，不含完整消息列表）
 */
export interface ConversationDetail {
  id: string;
  title: string;
  summary: string | null;
  created_at: string;
  updated_at: string;
  tags: string[];
  message_count: number;
}

/**
 * 消息（用于前端展示）
 */
export interface Message {
  id: string;
  role: MessageRole;
  created_at: string;
  order_index: number;
  content_md: string;
  assets: MessageAsset[];
}

/**
 * 资源（用于前端展示，含完整URL）
 */
export interface MessageAsset {
  id: string;
  type: AssetType;
  mime: string;
  size: number;
  url: string; // Full storage URL
  width: number | null;
  height: number | null;
  caption?: string;
  alt?: string;
}

/**
 * 搜索结果项
 */
export interface SearchResultItem {
  conversation_id: string;
  conversation_title: string;
  message_id: string;
  role: MessageRole;
  snippet: string; // Highlighted snippet
  rank: number;
}

// ============================================================================
// API Request/Response Types
// ============================================================================

/**
 * 分页参数
 */
export interface PaginationParams {
  cursor?: string;
  limit?: number;
}

/**
 * 对话列表请求参数
 */
export interface ConversationListParams extends PaginationParams {
  query?: string;
  tag?: string;
}

/**
 * 消息列表请求参数
 */
export interface MessageListParams extends PaginationParams {
  direction?: 'forward' | 'backward';
}

/**
 * 搜索请求参数
 */
export interface SearchParams extends PaginationParams {
  q: string;
}

/**
 * 分页响应结构
 */
export interface PaginatedResponse<T> {
  data: T[];
  next_cursor: string | null;
  has_more: boolean;
  total?: number;
}

/**
 * API 响应结构
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

// ============================================================================
// Import Package Types (for Importer tool)
// ============================================================================

/**
 * 导入包 - 对话
 */
export interface ImportConversation {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
  visibility?: ConversationVisibility;
  sort_key?: string;
}

/**
 * 导入包 - 消息
 */
export interface ImportMessage {
  id: string;
  role: MessageRole;
  order_index: number;
  created_at?: string;
  content_md: string;
  assets?: ImportAssetRef[];
}

/**
 * 导入包 - 资源引用
 */
export interface ImportAssetRef {
  path: string; // Relative path in import package
  type: AssetType;
  caption?: string;
  alt?: string;
}

// ============================================================================
// UI State Types
// ============================================================================

/**
 * 对话视图状态
 */
export interface ConversationViewState {
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * 搜索状态
 */
export interface SearchState {
  query: string;
  isSearching: boolean;
  results: SearchResultItem[];
  error: string | null;
}

/**
 * 筛选状态
 */
export interface FilterState {
  selectedTag: string | null;
  sortBy: 'updated_at' | 'created_at' | 'title';
  sortOrder: 'asc' | 'desc';
}
