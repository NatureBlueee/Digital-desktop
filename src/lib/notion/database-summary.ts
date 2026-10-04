import { isFullDataSource, isFullDatabase } from '@notionhq/client';
import type { DatabaseObjectResponse, SearchResponse } from '@notionhq/client';

/** Search returns data sources in v5; callers still query by the parent database ID. */
export function summarizeDatabases(results: Array<SearchResponse['results'][number] | DatabaseObjectResponse>) {
  const databases = new Map<string, {
    id: string;
    title: string;
    icon: DatabaseObjectResponse['icon'];
    url: string;
  }>();
  for (const result of results) {
    if (!isFullDataSource(result) && !isFullDatabase(result)) continue;
    const id = result.object === 'data_source' ? result.parent.database_id : result.id;
    if (!databases.has(id)) {
      databases.set(id, {
        id,
        title: result.title.map(text => text.plain_text).join('') || 'Untitled Database',
        icon: result.icon,
        url: result.url,
      });
    }
  }
  return [...databases.values()];
}
