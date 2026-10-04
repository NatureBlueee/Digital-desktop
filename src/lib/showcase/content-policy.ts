/**
 * The public desktop is an allow-list, never a mirror of a connected account.
 * IDs are configured as comma-separated environment variables so publishing a
 * conversation is an intentional deployment decision.
 */
export type ShowcaseContentSource = 'chatgpt' | 'claude';

function configuredIds(key: string): ReadonlySet<string> {
  return new Set(
    (process.env[key] || '')
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean)
  );
}

const approvedIds = {
  chatgpt: configuredIds('SHOWCASE_CHATGPT_PUBLIC_IDS'),
  claude: configuredIds('SHOWCASE_CLAUDE_PUBLIC_IDS'),
} as const;

export function isPublicShowcaseContent(source: ShowcaseContentSource, id: string): boolean {
  return approvedIds[source].has(id);
}

export function filterPublicShowcaseContent<T extends { id: string }>(
  source: ShowcaseContentSource,
  records: T[]
): T[] {
  return records.filter((record) => isPublicShowcaseContent(source, record.id));
}

export function hasPublishedContent(source: ShowcaseContentSource): boolean {
  return approvedIds[source].size > 0;
}
