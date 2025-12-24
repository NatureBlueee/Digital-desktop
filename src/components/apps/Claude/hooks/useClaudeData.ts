import { useState, useEffect, useCallback } from 'react';
import type {
  ConversationListItem,
  Conversation,
  Message,
  Artifact,
  Project,
} from '@/types/claude-archive';

const API_BASE = '/api/claude';

interface UseConversationsResult {
  conversations: ConversationListItem[];
  starredConversations: ConversationListItem[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseConversationResult {
  conversation: Conversation | null;
  messages: Message[];
  loading: boolean;
  error: string | null;
}

interface UseArtifactsResult {
  artifacts: Artifact[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

interface UseProjectsResult {
  projects: Project[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook for fetching conversation list (recent and starred)
 */
export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<ConversationListItem[]>([]);
  const [starredConversations, setStarredConversations] = useState<ConversationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch recent conversations and starred in parallel
      const [recentRes, starredRes] = await Promise.all([
        fetch(`${API_BASE}/conversations?limit=10`),
        fetch(`${API_BASE}/conversations?starred=true&limit=5`),
      ]);

      if (!recentRes.ok || !starredRes.ok) {
        throw new Error('Failed to fetch conversations');
      }

      const recentData = await recentRes.json();
      const starredData = await starredRes.json();

      if (recentData.success) {
        setConversations(recentData.data.data || []);
      }
      if (starredData.success) {
        setStarredConversations(starredData.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return {
    conversations,
    starredConversations,
    loading,
    error,
    refetch: fetchConversations,
  };
}

/**
 * Hook for fetching a single conversation with messages
 */
export function useConversation(conversationId: string | null): UseConversationResult {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!conversationId) {
      setConversation(null);
      setMessages([]);
      return;
    }

    const fetchConversation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch conversation and messages in parallel
        const [convRes, msgRes] = await Promise.all([
          fetch(`${API_BASE}/conversations/${conversationId}`),
          fetch(`${API_BASE}/conversations/${conversationId}/messages?all=true`),
        ]);

        if (!convRes.ok) {
          throw new Error('Conversation not found');
        }

        const convData = await convRes.json();
        const msgData = await msgRes.json();

        if (convData.success) {
          setConversation(convData.data);
        }
        if (msgData.success) {
          setMessages(msgData.data.data || []);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchConversation();
  }, [conversationId]);

  return { conversation, messages, loading, error };
}

/**
 * Hook for fetching artifacts
 */
export function useArtifacts(): UseArtifactsResult {
  const [artifacts, setArtifacts] = useState<Artifact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArtifacts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/artifacts?limit=20`);
      if (!res.ok) {
        throw new Error('Failed to fetch artifacts');
      }

      const data = await res.json();
      if (data.success) {
        setArtifacts(data.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArtifacts();
  }, [fetchArtifacts]);

  return { artifacts, loading, error, refetch: fetchArtifacts };
}

/**
 * Hook for fetching projects
 */
export function useProjects(): UseProjectsResult {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${API_BASE}/projects?limit=20`);
      if (!res.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await res.json();
      if (data.success) {
        setProjects(data.data.data || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, refetch: fetchProjects };
}
