/**
 * 应用类型定义
 */
export type AppType = 'github' | 'notion' | 'chatgpt' | 'cursor' | 'instagram';

/**
 * 应用数据接口
 * 所有应用的数据都遵循这个基础结构
 */
export interface AppData {
  id: string;
  type: AppType;
  name: string;
  icon?: string;
  content: any; // 每个应用的content结构不同
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    version: string;
  };
}

/**
 * GitHub应用的数据结构
 */
export interface GitHubAppData extends AppData {
  type: 'github';
  content: {
    repos: GitHubRepo[];
  };
}

export interface GitHubRepo {
  id: string;
  name: string;
  description: string;
  url: string;
  language: string;
  stars: number;
  files?: GitHubFile[];
}

export interface GitHubFile {
  path: string;
  content: string;
  language: string;
}

/**
 * Notion应用的数据结构
 */
export interface NotionAppData extends AppData {
  type: 'notion';
  content: {
    pages: NotionPage[];
  };
}

export interface NotionPage {
  id: string;
  title: string;
  content: string; // Markdown格式
  icon?: string;
  cover?: string;
  children?: NotionPage[];
}

/**
 * ChatGPT应用的数据结构
 */
export interface ChatGPTAppData extends AppData {
  type: 'chatgpt';
  content: {
    conversations: ChatGPTConversation[];
  };
}

export interface ChatGPTConversation {
  id: string;
  title: string;
  messages: ChatGPTMessage[];
  createdAt: Date;
}

export interface ChatGPTMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * 文件上传接口
 */
export interface FileUpload {
  appType: AppType;
  file: File;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}
