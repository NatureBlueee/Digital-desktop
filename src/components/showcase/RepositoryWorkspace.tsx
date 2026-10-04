'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Code2, ExternalLink, FolderGit2, LockKeyhole, Plus, RefreshCw } from 'lucide-react';
import type { ShowcaseRepository, WorkspaceSession } from '@/lib/showcase/workspaces';

function EmptyRepositories() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center text-zinc-500 dark:text-zinc-400">
      <FolderGit2 size={34} strokeWidth={1.5} />
      <h2 className="mt-4 text-lg font-medium text-zinc-800 dark:text-zinc-100">No published repositories</h2>
      <p className="mt-2 max-w-sm text-sm leading-6">Repositories appear here only after their owner selects a fixed snapshot for this desktop.</p>
    </div>
  );
}

export function RepositoryWorkspace() {
  const [repositories, setRepositories] = useState<ShowcaseRepository[]>([]);
  const [selected, setSelected] = useState<ShowcaseRepository | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [workspace, setWorkspace] = useState<WorkspaceSession | null>(null);
  const [startingWorkspace, setStartingWorkspace] = useState(false);

  const repositoryRequest = useRef<AbortController | null>(null);
  const fetchRepositories = useCallback(async () => {
    repositoryRequest.current?.abort();
    const controller = new AbortController();
    repositoryRequest.current = controller;
    return fetch('/api/showcase/repositories', { cache: 'no-store', signal: controller.signal })
      .then((response) => response.json()).then((result) => {
      if (controller.signal.aborted) return;
      if (!result.success) throw new Error(result.error || 'Unable to load repositories');
      const next = result.data as ShowcaseRepository[];
      setRepositories(next);
      setSelected((current) => next.find((repository) => repository.id === current?.id) || next[0] || null);
      setError(null);
    }).catch((cause: unknown) => {
      if (controller.signal.aborted) return;
      setError(cause instanceof Error ? cause.message : 'Unable to load repositories');
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
  }, []);

  const loadRepositories = () => {
    setLoading(true);
    setError(null);
    return fetchRepositories();
  };

  useEffect(() => {
    void fetchRepositories();
    return () => repositoryRequest.current?.abort();
  }, [fetchRepositories]);

  const startWorkspace = async () => {
    if (!selected) return;
    setStartingWorkspace(true);
    setError(null);
    try {
      const response = await fetch('/api/workspaces', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ projectSlug: selected.slug }),
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Unable to start workspace');
      setWorkspace(result.data as WorkspaceSession);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Unable to start workspace');
    } finally {
      setStartingWorkspace(false);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center bg-white dark:bg-zinc-950"><div className="h-8 w-40 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" /></div>;
  }

  if (error && !selected) {
    return <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-8 text-center dark:bg-zinc-950"><p className="text-sm text-red-600 dark:text-red-400">{error}</p><button onClick={() => void loadRepositories()} className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm text-white dark:bg-zinc-100 dark:text-zinc-900"><RefreshCw size={15} /> Try again</button></div>;
  }

  if (!selected) return <EmptyRepositories />;

  return (
    <div className="flex h-full min-h-0 bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <aside className="hidden w-60 shrink-0 border-r border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-900/50 sm:block">
        <div className="mb-3 flex items-center justify-between px-2 text-xs font-medium uppercase tracking-[0.12em] text-zinc-500"><span>Projects</span><button onClick={() => void loadRepositories()} aria-label="Refresh repositories"><RefreshCw size={14} /></button></div>
        <div className="space-y-1">
          {repositories.map((repository) => <button key={repository.id} onClick={() => { setSelected(repository); setWorkspace(null); setError(null); }} className={`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm transition-colors ${repository.id === selected.id ? 'bg-zinc-200 text-zinc-950 dark:bg-zinc-700 dark:text-white' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}><FolderGit2 size={16} /><span className="truncate">{repository.name}</span></button>)}
        </div>
      </aside>
      <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-6 sm:p-8">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex items-start justify-between gap-4"><div><p className="text-sm text-zinc-500">Read-only project snapshot</p><h1 className="mt-1 text-2xl font-semibold tracking-tight">{selected.name}</h1>{selected.description && <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">{selected.description}</p>}</div><Code2 size={28} strokeWidth={1.5} className="text-zinc-400" /></div>
          <div className="mt-8 grid gap-3 border-y border-zinc-200 py-5 text-sm dark:border-zinc-800 sm:grid-cols-2"><div><span className="block text-xs text-zinc-500">Snapshot</span><span className="mt-1 block font-mono text-xs">{selected.snapshotRef || 'Not specified'}</span></div><div><span className="block text-xs text-zinc-500">Source</span><span className="mt-1 block truncate font-mono text-xs">{selected.gitRepo || 'Not specified'}</span></div></div>
          <div className="mt-6 flex flex-wrap gap-3">
            {selected.readonlyIdeUrl && <a href={selected.readonlyIdeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white transition-transform active:scale-[0.98] dark:bg-zinc-100 dark:text-zinc-900"><Code2 size={16} /> Open read-only VS Code <ExternalLink size={14} /></a>}
            {selected.allowContributions && <button onClick={() => void startWorkspace()} disabled={startingWorkspace} className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium transition-colors hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:hover:bg-zinc-900"><Plus size={16} /> {startingWorkspace ? 'Preparing fork...' : 'Fork and open workspace'}</button>}
          </div>
          {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
          {workspace && <div className="mt-6 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60"><div className="flex items-center gap-2 text-sm font-medium"><LockKeyhole size={16} /> Personal workspace: {workspace.status}</div><p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">{workspace.failureReason || `Your isolated contribution branch is ${workspace.branchName}.`}</p>{workspace.workspaceUrl && <a href={workspace.workspaceUrl} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">Open isolated VS Code <ExternalLink size={14} /></a>}</div>}
        </div>
      </main>
    </div>
  );
}
