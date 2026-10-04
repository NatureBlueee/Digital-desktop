import assert from 'node:assert/strict';
import test from 'node:test';
import type { DataSourceObjectResponse, DatabaseObjectResponse, RichTextItemResponse } from '@notionhq/client';
import { summarizeDatabases } from './database-summary';

const title: RichTextItemResponse[] = [{
  type: 'text', text: { content: 'Projects', link: null }, plain_text: 'Projects', href: null,
  annotations: { bold: false, italic: false, strikethrough: false, underline: false, code: false, color: 'default' },
}];
const common = {
  title, description: [], is_inline: false, in_trash: false,
  created_time: '2026-10-04T00:00:00.000Z', last_edited_time: '2026-10-04T00:00:00.000Z',
  icon: null, cover: null, url: 'https://www.notion.so/database-1', public_url: null,
};
const source: DataSourceObjectResponse = {
  ...common, object: 'data_source', id: 'source-1', archived: false,
  parent: { type: 'database_id', database_id: 'database-1' },
  database_parent: { type: 'page_id', page_id: 'page-1' },
  created_by: { object: 'user', id: 'user-1' }, last_edited_by: { object: 'user', id: 'user-1' },
  properties: {},
};

test('v5 data sources expose a stable parent database ID and deduplicate that parent', () => {
  assert.deepEqual(summarizeDatabases([source, { ...source, id: 'source-2' }]), [{
    id: 'database-1', title: 'Projects', icon: null, url: common.url,
  }]);
});

test('full database objects keep their own ID; partial search objects are ignored', () => {
  const database: DatabaseObjectResponse = {
    ...common, object: 'database', id: 'legacy-database', is_locked: false,
    parent: { type: 'page_id', page_id: 'page-1' }, data_sources: [],
  };
  assert.deepEqual(summarizeDatabases([database, { object: 'page', id: 'partial-page' }]), [{
    id: 'legacy-database', title: 'Projects', icon: null, url: common.url,
  }]);
});

test('empty database titles receive the existing display fallback', () => {
  assert.equal(summarizeDatabases([{ ...source, title: [] }])[0].title, 'Untitled Database');
});
