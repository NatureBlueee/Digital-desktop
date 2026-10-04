import { useState, useEffect, useCallback } from 'react';
import type { ConversationListItem, Conversation, Message, Artifact, Project } from '@/types/claude-archive';

const API_BASE = '/api/claude';

interface ApiResult<T> { success: boolean; data: T }

async function getData<T>(path: string, signal: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}/${path}`, { signal });
  if (!response.ok) throw new Error('Failed to fetch Claude archive');
  const result: ApiResult<T> = await response.json();
  if (!result.success) throw new Error('Failed to fetch Claude archive');
  return result.data;
}

// Request identity owns loading and data, so changing selection never shows an
// earlier conversation or lets its late response replace the current one.
function useResource<T>(key: string | null, initial: T, load: (key: string, signal: AbortSignal) => Promise<T>) {
  const [revision, setRevision] = useState(0);
  const [result, setResult] = useState<{ key: string; revision: number; data: T; error: string | null } | null>(null);
  useEffect(() => {
    if (key === null) return;
    const controller = new AbortController();
    load(key, controller.signal).then(
      (data) => { if (!controller.signal.aborted) setResult({ key, revision, data, error: null }); },
      (cause: unknown) => {
        if (!controller.signal.aborted) setResult({ key, revision, data: initial, error: cause instanceof Error ? cause.message : 'Unknown error' });
      },
    );
    return () => controller.abort();
  }, [key, revision, load, initial]);
  const refetch = useCallback(() => setRevision((value) => value + 1), []);
  const current = key !== null && result?.key === key && result.revision === revision;
  return { data: current ? result.data : initial, loading: key !== null && !current, error: current ? result.error : null, refetch };
}

const emptyConversations: { conversations: ConversationListItem[]; starredConversations: ConversationListItem[] } = { conversations: [], starredConversations: [] };
async function loadConversations(_key: string, signal: AbortSignal) {
  const [recent, starred] = await Promise.all([
    getData<{ data: ConversationListItem[] }>('conversations?limit=10', signal),
    getData<{ data: ConversationListItem[] }>('conversations?starred=true&limit=5', signal),
  ]);
  return { conversations: recent.data || [], starredConversations: starred.data || [] };
}

export function useConversations() {
  const { data, ...state } = useResource('conversations', emptyConversations, loadConversations);
  return { ...data, ...state };
}

const emptyConversation: { conversation: Conversation | null; messages: Message[] } = { conversation: null, messages: [] };
async function loadConversation(id: string, signal: AbortSignal) {
  const [conversation, messages] = await Promise.all([
    getData<Conversation>(`conversations/${id}`, signal),
    getData<{ data: Message[] }>(`conversations/${id}/messages?all=true`, signal),
  ]);
  return { conversation, messages: messages.data || [] };
}

export function useConversation(conversationId: string | null) {
  const { data, loading, error } = useResource(conversationId, emptyConversation, loadConversation);
  return { ...data, loading, error };
}

const emptyArtifacts: Artifact[] = [];
async function loadArtifacts(_key: string, signal: AbortSignal) {
  return (await getData<{ data: Artifact[] }>('artifacts?limit=20', signal)).data || [];
}

export function useArtifacts() {
  const { data: artifacts, ...state } = useResource('artifacts', emptyArtifacts, loadArtifacts);
  return { artifacts, ...state };
}

const emptyProjects: Project[] = [];
async function loadProjects(_key: string, signal: AbortSignal) {
  return (await getData<{ data: Project[] }>('projects?limit=20', signal)).data || [];
}

export function useProjects() {
  const { data: projects, ...state } = useResource('projects', emptyProjects, loadProjects);
  return { projects, ...state };
}
