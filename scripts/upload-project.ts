#!/usr/bin/env npx ts-node

/**
 * Project Upload Script
 *
 * 读取解析后的 JSON 文件，上传到 Supabase
 *
 * Usage:
 *   npx ts-node scripts/upload-project.ts --file ./showcase-data/my-project.json
 *
 * Options:
 *   --file      JSON 文件路径 (必需)
 *   --update    更新已存在的项目 (默认 false，会报错)
 *   --dry-run   只显示将要执行的操作，不实际上传
 *
 * Environment:
 *   SUPABASE_URL          Supabase URL
 *   SUPABASE_SERVICE_KEY  Supabase Service Role Key (用于写入)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ============================================================
// Types
// ============================================================

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  size?: number;
  children?: FileNode[];
}

interface FileData {
  path: string;
  name: string;
  content: string | null;
  language: string;
  size_bytes: number;
  is_binary: boolean;
}

interface GitCommit {
  hash: string;
  short_hash: string;
  message: string;
  author_name: string;
  author_email: string;
  commit_date: string;
  branch?: string;
  is_merge: boolean;
  order_index: number;
}

interface GitDiff {
  file_path: string;
  old_path?: string;
  change_type: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  diff_content?: string;
}

interface ProjectData {
  project: {
    name: string;
    slug: string;
    description?: string;
    app_type: string;
    default_file?: string;
  };
  file_tree: FileNode[];
  files: FileData[];
  git_commits: GitCommit[];
  git_diffs: Record<string, GitDiff[]>;
}

// ============================================================
// Helpers
// ============================================================

function parseArgs(): Record<string, string> {
  const args: Record<string, string> = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true';
      args[key] = value;
      if (value !== 'true') i++;
    }
  }

  return args;
}

function loadEnv() {
  // Try to load .env.local
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const [, key, value] = match;
        if (!process.env[key]) {
          process.env[key] = value.trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }
}

// ============================================================
// Supabase Client
// ============================================================

function createSupabaseClient(): SupabaseClient {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.error('Error: Missing Supabase credentials');
    console.log('Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables');
    console.log('');
    console.log('SUPABASE_SERVICE_KEY is the "service_role" key from Supabase dashboard');
    console.log('(Settings > API > Project API keys > service_role)');
    process.exit(1);
  }

  return createClient(url, key);
}

// ============================================================
// Upload Functions
// ============================================================

async function uploadProject(
  supabase: SupabaseClient,
  data: ProjectData,
  options: { update: boolean; dryRun: boolean }
): Promise<string> {
  const { project, file_tree, files, git_commits, git_diffs } = data;

  console.log('\n📤 Uploading project...');

  if (options.dryRun) {
    console.log('   [DRY RUN] Would insert project:', project.name);
    return 'dry-run-id';
  }

  // Check if project exists
  const { data: existing } = await supabase
    .from('showcase_projects')
    .select('id')
    .eq('slug', project.slug)
    .single();

  if (existing && !options.update) {
    throw new Error(`Project "${project.slug}" already exists. Use --update to update it.`);
  }

  let projectId: string;

  if (existing) {
    // Update existing project
    const { data: updated, error } = await supabase
      .from('showcase_projects')
      .update({
        name: project.name,
        description: project.description,
        app_type: project.app_type,
        default_file: project.default_file,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    projectId = updated.id;

    // Delete old data
    console.log('   Cleaning old data...');
    await supabase.from('showcase_files').delete().eq('project_id', projectId);
    await supabase.from('showcase_file_trees').delete().eq('project_id', projectId);
    await supabase.from('showcase_git_commits').delete().eq('project_id', projectId);

    console.log(`   Updated project: ${project.name} (${projectId})`);
  } else {
    // Insert new project
    const { data: inserted, error } = await supabase
      .from('showcase_projects')
      .insert({
        name: project.name,
        slug: project.slug,
        description: project.description,
        app_type: project.app_type,
        default_file: project.default_file,
      })
      .select()
      .single();

    if (error) throw error;
    projectId = inserted.id;
    console.log(`   Created project: ${project.name} (${projectId})`);
  }

  return projectId;
}

async function uploadFiles(
  supabase: SupabaseClient,
  projectId: string,
  files: FileData[],
  options: { dryRun: boolean }
): Promise<void> {
  console.log(`\n📁 Uploading ${files.length} files...`);

  if (options.dryRun) {
    console.log(`   [DRY RUN] Would insert ${files.length} files`);
    return;
  }

  // Batch insert in chunks of 100
  const chunkSize = 100;
  for (let i = 0; i < files.length; i += chunkSize) {
    const chunk = files.slice(i, i + chunkSize);

    const { error } = await supabase.from('showcase_files').insert(
      chunk.map(file => ({
        project_id: projectId,
        path: file.path,
        name: file.name,
        content: file.content,
        language: file.language,
        size_bytes: file.size_bytes,
        is_binary: file.is_binary,
      }))
    );

    if (error) throw error;
    console.log(`   Uploaded ${Math.min(i + chunkSize, files.length)}/${files.length} files`);
  }
}

async function uploadFileTree(
  supabase: SupabaseClient,
  projectId: string,
  fileTree: FileNode[],
  options: { dryRun: boolean }
): Promise<void> {
  console.log('\n🌳 Uploading file tree...');

  if (options.dryRun) {
    console.log('   [DRY RUN] Would insert file tree');
    return;
  }

  const { error } = await supabase.from('showcase_file_trees').insert({
    project_id: projectId,
    tree_json: fileTree,
  });

  if (error) throw error;
  console.log('   File tree uploaded');
}

async function uploadGitHistory(
  supabase: SupabaseClient,
  projectId: string,
  commits: GitCommit[],
  diffs: Record<string, GitDiff[]>,
  options: { dryRun: boolean }
): Promise<void> {
  if (commits.length === 0) {
    console.log('\n📜 No git history to upload');
    return;
  }

  console.log(`\n📜 Uploading ${commits.length} git commits...`);

  if (options.dryRun) {
    console.log(`   [DRY RUN] Would insert ${commits.length} commits`);
    return;
  }

  // Insert commits
  const { data: insertedCommits, error: commitError } = await supabase
    .from('showcase_git_commits')
    .insert(
      commits.map(commit => ({
        project_id: projectId,
        hash: commit.hash,
        short_hash: commit.short_hash,
        message: commit.message,
        author_name: commit.author_name,
        author_email: commit.author_email,
        commit_date: commit.commit_date,
        branch: commit.branch,
        is_merge: commit.is_merge,
        order_index: commit.order_index,
      }))
    )
    .select();

  if (commitError) throw commitError;
  console.log(`   Uploaded ${commits.length} commits`);

  // Create hash -> id mapping
  const commitIdMap = new Map<string, string>();
  for (const commit of insertedCommits || []) {
    commitIdMap.set(commit.hash, commit.id);
  }

  // Insert diffs
  const allDiffs: any[] = [];
  for (const [hash, commitDiffs] of Object.entries(diffs)) {
    const commitId = commitIdMap.get(hash);
    if (!commitId) continue;

    for (const diff of commitDiffs) {
      allDiffs.push({
        commit_id: commitId,
        file_path: diff.file_path,
        old_path: diff.old_path,
        change_type: diff.change_type,
        additions: diff.additions,
        deletions: diff.deletions,
        diff_content: diff.diff_content,
      });
    }
  }

  if (allDiffs.length > 0) {
    console.log(`\n🔍 Uploading ${allDiffs.length} diffs...`);
    const { error: diffError } = await supabase.from('showcase_git_diffs').insert(allDiffs);
    if (diffError) throw diffError;
    console.log(`   Uploaded ${allDiffs.length} diffs`);
  }
}

// ============================================================
// Main
// ============================================================

async function main() {
  // Load environment
  loadEnv();

  const args = parseArgs();

  // Validate args
  if (!args.file) {
    console.error('Error: --file is required');
    console.log('Usage: npx ts-node scripts/upload-project.ts --file ./showcase-data/my-project.json');
    process.exit(1);
  }

  const filePath = path.resolve(args.file);
  const shouldUpdate = args.update === 'true';
  const dryRun = args['dry-run'] === 'true';

  console.log('='.repeat(60));
  console.log('Project Upload');
  console.log('='.repeat(60));
  console.log(`File: ${filePath}`);
  console.log(`Update: ${shouldUpdate}`);
  console.log(`Dry Run: ${dryRun}`);
  console.log('='.repeat(60));

  // Check file exists
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found: ${filePath}`);
    process.exit(1);
  }

  // Load JSON
  console.log('\n📖 Loading JSON...');
  const data: ProjectData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`   Project: ${data.project.name}`);
  console.log(`   Files: ${data.files.length}`);
  console.log(`   Commits: ${data.git_commits.length}`);

  // Create Supabase client
  const supabase = createSupabaseClient();

  // Upload
  const options = { update: shouldUpdate, dryRun };

  try {
    const projectId = await uploadProject(supabase, data, options);
    await uploadFiles(supabase, projectId, data.files, options);
    await uploadFileTree(supabase, projectId, data.file_tree, options);
    await uploadGitHistory(supabase, projectId, data.git_commits, data.git_diffs, options);

    console.log('\n' + '='.repeat(60));
    console.log('✅ Upload complete!');
    console.log('='.repeat(60));

    if (dryRun) {
      console.log('\n⚠️  This was a dry run. No data was actually uploaded.');
      console.log('   Remove --dry-run to upload for real.');
    }
  } catch (error: any) {
    console.error('\n❌ Upload failed:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);
