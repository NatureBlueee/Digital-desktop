/**
 * Notion Official Client
 *
 * 使用官方 @notionhq/client API
 * 支持获取页面列表、数据库查询等高级功能
 */

import { Client, isFullPage, isFullBlock } from '@notionhq/client';
import type { PageObjectResponse, QueryDataSourceParameters } from '@notionhq/client';
import { summarizeDatabases } from './database-summary';

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

    return response.results.filter(isFullPage).map((page) => ({
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
      .filter(isFullBlock)
      .filter((block) => block.type === 'child_page')
      .map((block) => ({
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
    if (!isFullPage(page)) throw new Error('Notion returned incomplete page details');
    return {
      id: page.id,
      title: getPageTitle(page),
      icon: page.icon,
      cover: page.cover,
      properties: page.properties,
      lastEditedTime: page.last_edited_time,
      createdTime: page.created_time,
      url: page.url,
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

    return response.results.filter(isFullBlock);
  } catch (error) {
    console.error('Error fetching page blocks:', error);
    throw error;
  }
}

/**
 * 获取数据库
 * 注意：Notion API 的 search 不再支持 filter.value='database'
 * 改用不带 filter 的 search，然后在客户端过滤
 */
export async function getDatabases() {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    // 使用不带 filter 的 search，获取所有对象
    const response = await notion.search({});

    return summarizeDatabases(response.results);
  } catch (error) {
    console.error('Error fetching databases:', error);
    throw error;
  }
}

/**
 * 查询数据库
 */
export async function queryDatabase(databaseId: string, filter?: QueryDataSourceParameters['filter']) {
  if (!notion) {
    throw new Error('Notion API is not configured');
  }

  try {
    const database = await notion.databases.retrieve({ database_id: databaseId });
    const dataSource = 'data_sources' in database ? database.data_sources[0] : undefined;
    if (!dataSource) {
      throw new Error('This Notion database has no queryable data source');
    }

    const response = await notion.dataSources.query({
      data_source_id: dataSource.id,
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
function getPageTitle(page: PageObjectResponse): string {
  const title = Object.values(page.properties).find(property => property.type === 'title');
  return title?.type === 'title' ? title.title.map(text => text.plain_text).join('') || 'Untitled' : 'Untitled';
}

export { notion };
