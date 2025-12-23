#!/usr/bin/env npx ts-node

/**
 * ChatGPT Archive Importer
 *
 * 导入 ChatGPT 对话数据到 Supabase
 *
 * 使用方法:
 *   npx ts-node scripts/import-chatgpt.ts ./path/to/import-package
 *
 * 导入包结构:
 *   import-package/
 *   ├── conversations.json
 *   ├── messages/
 *   │   ├── <conversation-id-1>.json
 *   │   └── <conversation-id-2>.json
 *   └── assets/
 *       ├── image1.png
 *       └── document.pdf
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// ============================================================================
// Configuration
// ============================================================================

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const STORAGE_BUCKET = 'chatgpt-assets';

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================================
// Types
// ============================================================================

interface ImportConversation {
  id: string;
  title: string;
  summary?: string;
  tags?: string[];
  visibility?: 'public' | 'unlisted';
  sort_key?: string;
}

interface ImportMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  order_index: number;
  created_at?: string;
  content_md: string;
  assets?: ImportAssetRef[];
}

interface ImportAssetRef {
  path: string;
  type: 'image' | 'file';
  caption?: string;
  alt?: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

function generateSha256(filePath: string): string {
  const buffer = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, ' ') // Remove code blocks
    .replace(/`[^`]+`/g, ' ') // Remove inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
    .replace(/[#*_~`]/g, '') // Remove markdown symbols
    .replace(/\n+/g, ' ') // Collapse newlines
    .replace(/\s+/g, ' ') // Collapse spaces
    .trim();
}

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.txt': 'text/plain',
    '.json': 'application/json',
    '.csv': 'text/csv',
    '.zip': 'application/zip',
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// ============================================================================
// Import Functions
// ============================================================================

async function uploadAsset(
  filePath: string,
  assetType: 'image' | 'file'
): Promise<string> {
  const sha256 = generateSha256(filePath);

  // Check if asset already exists
  const { data: existing } = await supabase
    .from('chatgpt_assets')
    .select('id')
    .eq('sha256', sha256)
    .single();

  if (existing) {
    console.log(`  Asset already exists: ${path.basename(filePath)}`);
    return existing.id;
  }

  // Upload to storage
  const fileName = path.basename(filePath);
  const storagePath = `${sha256.slice(0, 2)}/${sha256}/${fileName}`;
  const fileBuffer = fs.readFileSync(filePath);
  const mime = getMimeType(filePath);

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: mime,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Failed to upload asset: ${uploadError.message}`);
  }

  // Get image dimensions if applicable
  let width = null;
  let height = null;
  // Note: For production, use sharp or similar to get dimensions

  // Insert asset record
  const assetId = crypto.randomUUID();
  const { error: insertError } = await supabase.from('chatgpt_assets').insert({
    id: assetId,
    type: assetType,
    sha256,
    mime,
    size: fileBuffer.length,
    storage_path: storagePath,
    width,
    height,
  });

  if (insertError) {
    throw new Error(`Failed to insert asset record: ${insertError.message}`);
  }

  console.log(`  Uploaded asset: ${fileName}`);
  return assetId;
}

async function importConversation(
  conv: ImportConversation,
  messagesDir: string,
  assetsDir: string
): Promise<void> {
  console.log(`Importing conversation: ${conv.title}`);

  // Generate share token for unlisted conversations
  let shareToken = null;
  if (conv.visibility === 'unlisted') {
    shareToken = generateToken();
  }

  // Upsert conversation
  const { error: convError } = await supabase
    .from('chatgpt_conversations')
    .upsert({
      id: conv.id,
      title: conv.title,
      summary: conv.summary || null,
      tags: conv.tags || [],
      visibility: conv.visibility || 'public',
      sort_key: conv.sort_key || null,
      share_token: shareToken,
      message_count: 0, // Will be updated by trigger
    });

  if (convError) {
    throw new Error(`Failed to upsert conversation: ${convError.message}`);
  }

  // Load and import messages
  const messagesFile = path.join(messagesDir, `${conv.id}.json`);
  if (!fs.existsSync(messagesFile)) {
    console.log(`  No messages file found: ${messagesFile}`);
    return;
  }

  const messages: ImportMessage[] = JSON.parse(
    fs.readFileSync(messagesFile, 'utf-8')
  );

  console.log(`  Importing ${messages.length} messages...`);

  for (const msg of messages) {
    // Process assets
    const assetRefs: { asset_id: string; kind: string; caption?: string; alt?: string }[] = [];

    if (msg.assets) {
      for (const assetRef of msg.assets) {
        const assetPath = path.join(assetsDir, assetRef.path);
        if (fs.existsSync(assetPath)) {
          const assetId = await uploadAsset(assetPath, assetRef.type);
          assetRefs.push({
            asset_id: assetId,
            kind: 'inline',
            caption: assetRef.caption,
            alt: assetRef.alt,
          });
        } else {
          console.warn(`  Asset not found: ${assetRef.path}`);
        }
      }
    }

    // Strip markdown for search
    const contentText = stripMarkdown(msg.content_md);

    // Upsert message
    const { error: msgError } = await supabase.from('chatgpt_messages').upsert({
      id: msg.id,
      conversation_id: conv.id,
      role: msg.role,
      created_at: msg.created_at || new Date().toISOString(),
      order_index: msg.order_index,
      content_md: msg.content_md,
      content_text: contentText,
      assets: assetRefs,
    });

    if (msgError) {
      console.error(`  Failed to upsert message ${msg.id}: ${msgError.message}`);
    }
  }

  // Update message count
  const { error: countError } = await supabase
    .from('chatgpt_conversations')
    .update({ message_count: messages.length })
    .eq('id', conv.id);

  if (countError) {
    console.warn(`  Failed to update message count: ${countError.message}`);
  }

  console.log(`  Done importing conversation: ${conv.title}`);
}

async function main() {
  const importPath = process.argv[2];

  if (!importPath) {
    console.error('Usage: npx ts-node scripts/import-chatgpt.ts <import-package-path>');
    process.exit(1);
  }

  const conversationsFile = path.join(importPath, 'conversations.json');
  const messagesDir = path.join(importPath, 'messages');
  const assetsDir = path.join(importPath, 'assets');

  if (!fs.existsSync(conversationsFile)) {
    console.error(`Error: conversations.json not found at ${conversationsFile}`);
    process.exit(1);
  }

  const conversations: ImportConversation[] = JSON.parse(
    fs.readFileSync(conversationsFile, 'utf-8')
  );

  console.log(`Found ${conversations.length} conversations to import`);
  console.log('');

  for (const conv of conversations) {
    try {
      await importConversation(conv, messagesDir, assetsDir);
    } catch (error) {
      console.error(`Error importing conversation ${conv.id}:`, error);
    }
    console.log('');
  }

  console.log('Import complete!');
}

main().catch(console.error);
