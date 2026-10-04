import { createClient } from '@supabase/supabase-js';
import { getSupabaseClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { ShowcaseRepository } from './workspaces';

type RepositoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  git_repo: string | null;
  snapshot_ref: string | null;
  readonly_ide_url: string | null;
  allow_contributions: boolean;
  updated_at: string;
};

function mapRepository(row: RepositoryRow): ShowcaseRepository {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    gitRepo: row.git_repo,
    snapshotRef: row.snapshot_ref,
    readonlyIdeUrl: row.readonly_ide_url,
    allowContributions: row.allow_contributions,
    updatedAt: row.updated_at,
  };
}

export async function listPublicRepositories(): Promise<ShowcaseRepository[]> {
  if (!isSupabaseConfigured) return [];

  const { data, error } = await getSupabaseClient()
    .from('showcase_projects')
    .select('id, slug, name, description, git_repo, snapshot_ref, readonly_ide_url, allow_contributions, updated_at')
    .eq('visibility', 'public')
    .order('display_order', { ascending: true })
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return (data || []).map((row) => mapRepository(row as RepositoryRow));
}

export async function getPublicRepository(slug: string): Promise<ShowcaseRepository | null> {
  if (!isSupabaseConfigured) return null;

  const { data, error } = await getSupabaseClient()
    .from('showcase_projects')
    .select('id, slug, name, description, git_repo, snapshot_ref, readonly_ide_url, allow_contributions, updated_at')
    .eq('slug', slug)
    .eq('visibility', 'public')
    .maybeSingle();

  if (error) throw error;
  return data ? mapRepository(data as RepositoryRow) : null;
}

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) {
    throw new Error('Repository administration is not configured');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function createShowcaseRepository(input: {
  name: string;
  slug: string;
  description?: string;
  gitRepo: string;
  snapshotRef: string;
  readonlyIdeUrl?: string;
  allowContributions?: boolean;
}) {
  const { data, error } = await getAdminClient()
    .from('showcase_projects')
    .insert({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      git_repo: input.gitRepo,
      snapshot_ref: input.snapshotRef,
      readonly_ide_url: input.readonlyIdeUrl || null,
      allow_contributions: Boolean(input.allowContributions),
      visibility: 'public',
    })
    .select('id, slug, name, description, git_repo, snapshot_ref, readonly_ide_url, allow_contributions, updated_at')
    .single();

  if (error) throw error;
  return mapRepository(data as RepositoryRow);
}
