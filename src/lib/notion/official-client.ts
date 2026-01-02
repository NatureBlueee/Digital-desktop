/**
 * Notion Official Client
 *
 * 使用官方 @notionhq/client API
 * 支持获取页面列表、数据库查询等高级功能
 */

import { Client } from '@notionhq/client';

// 创建官方 Notion 客户端
const notionApiKey = process.env.NOTION_API_KEY;

let notion: Client | null = null;

if (notionApiKey) {
  notion = new Client({
    auth: notionApiKey,
  });
}

export const isOfficialNotionConfigured = !!notionApiKey;

/**
 * 获取工作区中的所有页面
 */
export async function getAllPages() {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'page',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: getPageTitle(page),
      icon: page.icon,
      lastEditedTime: page.last_edited_time,
      createdTime: page.created_time,
      url: page.url,
    }));
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

/**
 * 获取特定页面的子页面
 */
export async function getChildPages(pageId: string) {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    // 过滤出子页面类型的 block
    const childPages = response.results
      .filter((block: any) => block.type === 'child_page')
      .map((block: any) => ({
        id: block.id,
        title: block.child_page?.title || 'Untitled',
        type: 'child_page',
      }));

    return childPages;
  } catch (error) {
    console.error('Error fetching child pages:', error);
    throw error;
  }
}

/**
 * 获取页面详情
 */
export async function getPageDetails(pageId: string) {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    return {
      id: page.id,
      title: getPageTitle(page),
      icon: (page as any).icon,
      cover: (page as any).cover,
      properties: (page as any).properties,
      lastEditedTime: (page as any).last_edited_time,
      createdTime: (page as any).created_time,
      url: (page as any).url,
    };
  } catch (error) {
    console.error('Error fetching page details:', error);
    throw error;
  }
}

/**
 * 获取页面内容块
 */
export async function getPageBlocks(pageId: string) {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100,
    });

    return response.results;
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    throw error;
  }
}

/**
 * 获取数据库
 */
export async function getDatabases() {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const response = await notion.search({
      filter: {
        property: 'object',
        value: 'database',
      },
    });

    return response.results.map((db: any) => ({
      id: db.id,
      title: getDatabaseTitle(db),
      icon: db.icon,
      url: db.url,
    }));
  } catch (error) {
    console.error('Error fetching databases:', error);
    throw error;
  }
}

/**
 * 查询数据库
 */
export async function queryDatabase(databaseId: string, filter?: any) {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: filter,
    });

    return response.results;
  } catch (error) {
    console.error('Error querying database:', error);
    throw error;
  }
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * 从页面对象中提取标题
 */
function getPageTitle(page: any): string {
  if (page.properties?.title?.title?.[0]?.plain_text) {
    return page.properties.title.title[0].plain_text;
  }
  if (page.properties?.Name?.title?.[0]?.plain_text) {
    return page.properties.Name.title[0].plain_text;
  }
  return 'Untitled';
}

/**
 * 从数据库对象中提取标题
 */
function getDatabaseTitle(database: any): string {
  if (database.title?.[0]?.plain_text) {
    return database.title[0].plain_text;
  }
  return 'Untitled Database';
}

export { notion };
