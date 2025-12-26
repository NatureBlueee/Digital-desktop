/**
 * Notion Client
 *
 * 使用 notion-client 获取页面数据
 * react-notion-x 需要的是 recordMap 格式
 */

import { NotionAPI } from 'notion-client';

// 创建 Notion 客户端
// notion-client 使用非官方 API，不需要 token 就能读取公开页面
// 但如果页面需要认证，可以传入 token
const notionClient = new NotionAPI({
  authToken: process.env.NOTION_TOKEN,
});

/**
 * 获取页面的 recordMap（react-notion-x 需要的格式）
 */
export async function getNotionPage(pageId: string) {
  try {
    const recordMap = await notionClient.getPage(pageId);
    return recordMap;
  } catch (error) {
    console.error('Error fetching Notion page:', error);
    throw error;
  }
}

/**
 * 获取根页面 ID
 */
export function getRootPageId(): string | null {
  return process.env.NOTION_ROOT_PAGE_ID || null;
}

/**
 * 检查 Notion 是否已配置
 */
export function isNotionConfigured(): boolean {
  return !!process.env.NOTION_ROOT_PAGE_ID;
}
