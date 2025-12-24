#!/usr/bin/env ts-node

/**
 * Claude Archive Import Tool
 * Imports Claude conversation data into Supabase
 *
 * Usage:
 *   npx ts-node scripts/import-claude.ts ./path/to/import-package
 *
 * Expected package structure:
 *   import-package/
 *   ├── projects.json          (optional)
 *   ├── conversations.json     (required)
 *   ├── messages/
 *   │   └── <conversation-id>.json
 *   └── artifacts.json         (optional)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient } from '@supabase/supabase-js';

// Types
interface ProjectImport {
  id?: string;
  title: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface ConversationImport {
  id?: string;
  title: string;
  summary?: string;
  is_starred?: boolean;
  tags?: string[];
  visibility?: 'public' | 'unlisted';
  sort_key?: string;
  model?: string;
  project_id?: string;
}

interface MessageImport {
  id?: string;
  role: 'user' | 'assistant' | 'system';
  order_index: number;
  created_at?: string;
  content_md: string;
  assets?: Array<{ asset_id: string; caption?: string; alt?: string }>;
}

interface ArtifactImport {
  id?: string;
  title: string;
  type: 'code' | 'document' | 'diagram' | 'image' | 'html' | 'react' | 'svg' | 'mermaid' | 'other';
  language?: string;
  content: string;
  icon?: string;
  conversation_id?: string;
  message_id?: string;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: Missing Supabase environment variables');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper functions
function stripMarkdown(md: string): string {
  return md
    .replace(/[#*`\[\]()>_~]/g, '')
    .replace(/\n{2,}/g, '\n')
    .trim();
}

function generateShareToken(): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Import functions
async function importProjects(projects: ProjectImport[]): Promise<Map<string, string>> {
  console.log(`Importing ${projects.length} projects...`);
  const idMap = new Map<string, string>();

  for (const project of projects) {
    const { data, error } = await supabase
      .from('claude_projects')
      .upsert({
        id: project.id,
        title: project.title,
        description: project.description || null,
        icon: project.icon || '📁',
        color: project.color || '#8B5CF6',
      })
      .select('id')
      .single();

    if (error) {
      console.error(`  Failed to import project "${project.title}":`, error.message);
    } else {
      const originalId = project.id || project.title;
      idMap.set(originalId, data.id);
      console.log(`  ✓ Imported project: ${project.title}`);
    }
  }

  return idMap;
}

async function importConversations(
  conversations: ConversationImport[],
  projectIdMap: Map<string, string>
): Promise<Map<string, string>> {
  console.log(`Importing ${conversations.length} conversations...`);
  const idMap = new Map<string, string>();

  for (const conv of conversations) {
    // Resolve project ID if provided
    let projectId = conv.project_id;
    if (projectId && projectIdMap.has(projectId)) {
      projectId = projectIdMap.get(projectId);
    }

    const { data, error } = await supabase
      .from('claude_conversations')
      .upsert({
        id: conv.id,
        title: conv.title,
        summary: conv.summary || null,
        is_starred: conv.is_starred || false,
        tags: conv.tags || [],
        visibility: conv.visibility || 'public',
        sort_key: conv.sort_key || new Date().toISOString(),
        model: conv.model || 'claude-3.5-sonnet',
        project_id: projectId || null,
        share_token: conv.visibility === 'unlisted' ? generateShareToken() : null,
      })
      .select('id')
      .single();

    if (error) {
      console.error(`  Failed to import conversation "${conv.title}":`, error.message);
    } else {
      const originalId = conv.id || conv.title;
      idMap.set(originalId, data.id);
      console.log(`  ✓ Imported conversation: ${conv.title}`);
    }
  }

  return idMap;
}

async function importMessages(
  conversationId: string,
  messages: MessageImport[]
): Promise<void> {
  const rows = messages.map((msg) => ({
    id: msg.id,
    conversation_id: conversationId,
    role: msg.role,
    order_index: msg.order_index,
    created_at: msg.created_at || new Date().toISOString(),
    content_md: msg.content_md,
    content_text: stripMarkdown(msg.content_md),
    assets: msg.assets || [],
  }));

  const { error } = await supabase.from('claude_messages').upsert(rows);

  if (error) {
    console.error(`  Failed to import messages for ${conversationId}:`, error.message);
  } else {
    console.log(`  ✓ Imported ${messages.length} messages for ${conversationId}`);
  }
}

async function importArtifacts(
  artifacts: ArtifactImport[],
  conversationIdMap: Map<string, string>
): Promise<void> {
  console.log(`Importing ${artifacts.length} artifacts...`);

  for (const artifact of artifacts) {
    // Resolve conversation ID if provided
    let conversationId = artifact.conversation_id;
    if (conversationId && conversationIdMap.has(conversationId)) {
      conversationId = conversationIdMap.get(conversationId);
    }

    const { error } = await supabase.from('claude_artifacts').upsert({
      id: artifact.id,
      title: artifact.title,
      type: artifact.type,
      language: artifact.language || null,
      content: artifact.content,
      icon: artifact.icon || '📄',
      conversation_id: conversationId || null,
      message_id: artifact.message_id || null,
    });

    if (error) {
      console.error(`  Failed to import artifact "${artifact.title}":`, error.message);
    } else {
      console.log(`  ✓ Imported artifact: ${artifact.title}`);
    }
  }
}

// Main import function
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: npx ts-node scripts/import-claude.ts <import-package-path>');
    process.exit(1);
  }

  const packagePath = path.resolve(args[0]);

  if (!fs.existsSync(packagePath)) {
    console.error(`Error: Import package not found at ${packagePath}`);
    process.exit(1);
  }

  console.log(`\nClaude Archive Importer`);
  console.log(`=======================\n`);
  console.log(`Package: ${packagePath}\n`);

  // Import projects (optional)
  let projectIdMap = new Map<string, string>();
  const projectsPath = path.join(packagePath, 'projects.json');
  if (fs.existsSync(projectsPath)) {
    const projects: ProjectImport[] = JSON.parse(
      fs.readFileSync(projectsPath, 'utf-8')
    );
    projectIdMap = await importProjects(projects);
  }

  // Import conversations (required)
  const conversationsPath = path.join(packagePath, 'conversations.json');
  if (!fs.existsSync(conversationsPath)) {
    console.error('Error: conversations.json not found');
    process.exit(1);
  }

  const conversations: ConversationImport[] = JSON.parse(
    fs.readFileSync(conversationsPath, 'utf-8')
  );
  const conversationIdMap = await importConversations(conversations, projectIdMap);

  // Import messages for each conversation
  const messagesDir = path.join(packagePath, 'messages');
  if (fs.existsSync(messagesDir)) {
    console.log(`\nImporting messages...`);
    for (const [originalId, newId] of conversationIdMap.entries()) {
      const messageFile = path.join(messagesDir, `${originalId}.json`);
      if (fs.existsSync(messageFile)) {
        const messages: MessageImport[] = JSON.parse(
          fs.readFileSync(messageFile, 'utf-8')
        );
        await importMessages(newId, messages);
      }
    }
  }

  // Import artifacts (optional)
  const artifactsPath = path.join(packagePath, 'artifacts.json');
  if (fs.existsSync(artifactsPath)) {
    const artifacts: ArtifactImport[] = JSON.parse(
      fs.readFileSync(artifactsPath, 'utf-8')
    );
    await importArtifacts(artifacts, conversationIdMap);
  }

  console.log(`\n✓ Import complete!\n`);
}

main().catch((error) => {
  console.error('Import failed:', error);
  process.exit(1);
});
