#!/usr/bin/env npx ts-node

/**
 * Project Parser Script
 *
 * 扫描项目目录，解析文件结构、内容和 Git 历史
 * 输出 JSON 文件供上传到 Supabase
 *
 * Usage:
 *   npx ts-node scripts/parse-project.ts --path ./my-project --name "My Project" --output ./output
 *
 * Options:
 *   --path      项目目录路径 (必需)
 *   --name      项目名称 (必需)
 *   --slug      URL-friendly 名称 (可选，默认从 name 生成)
 *   --output    输出目录 (可选，默认 ./showcase-data)
 *   --app-type  展示应用类型 (cursor|antigravity|windsurf, 默认 cursor)
 *   --max-size  最大文件大小 KB (默认 500)
 *   --git       是否解析 Git 历史 (默认 true)
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

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
  git_diffs: Map<string, GitDiff[]>;  // commit_hash -> diffs
}

// ============================================================
// Configuration
// ============================================================

// 忽略的目录和文件
const IGNORE_PATTERNS = [
  'node_modules',
  '.git',
  '.next',
  '.turbo',
  'dist',
  'build',
  '.cache',
  '__pycache__',
  '.DS_Store',
  'Thumbs.db',
  '*.log',
  '*.lock',
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  '.env',
  '.env.*',
  '*.key',
  '*.pem',
  '*.p12',
  '.idea',
  '.vscode',
];

// 语言映射
const LANGUAGE_MAP: Record<string, string> = {
  '.ts': 'typescript',
  '.tsx': 'typescript',
  '.js': 'javascript',
  '.jsx': 'javascript',
  '.json': 'json',
  '.md': 'markdown',
  '.css': 'css',
  '.scss': 'scss',
  '.less': 'less',
  '.html': 'html',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.py': 'python',
  '.rb': 'ruby',
  '.go': 'go',
  '.rs': 'rust',
  '.java': 'java',
  '.kt': 'kotlin',
  '.swift': 'swift',
  '.c': 'c',
  '.cpp': 'cpp',
  '.h': 'c',
  '.hpp': 'cpp',
  '.sql': 'sql',
  '.sh': 'shell',
  '.bash': 'shell',
  '.zsh': 'shell',
  '.fish': 'shell',
  '.ps1': 'powershell',
  '.dockerfile': 'dockerfile',
  '.vue': 'vue',
  '.svelte': 'svelte',
  '.astro': 'astro',
};

// 二进制文件扩展名
const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.zip', '.tar', '.gz', '.rar', '.7z',
  '.mp3', '.mp4', '.wav', '.avi', '.mov',
  '.ttf', '.otf', '.woff', '.woff2', '.eot',
  '.exe', '.dll', '.so', '.dylib',
];

// ============================================================
// Helpers
// ============================================================

function shouldIgnore(filePath: string): boolean {
  const name = path.basename(filePath);

  for (const pattern of IGNORE_PATTERNS) {
    if (pattern.includes('*')) {
      // Simple glob matching
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(name)) return true;
    } else {
      if (name === pattern) return true;
    }
  }

  return false;
}

function getLanguage(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();

  // Special cases
  const name = path.basename(filePath).toLowerCase();
  if (name === 'dockerfile') return 'dockerfile';
  if (name === 'makefile') return 'makefile';
  if (name === '.gitignore' || name === '.dockerignore') return 'ignore';

  return LANGUAGE_MAP[ext] || 'text';
}

function isBinaryFile(filePath: string): boolean {
  const ext = path.extname(filePath).toLowerCase();
  return BINARY_EXTENSIONS.includes(ext);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

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

// ============================================================
// File Scanning
// ============================================================

function scanDirectory(dirPath: string, relativePath: string = ''): { tree: FileNode[], files: FileData[] } {
  const tree: FileNode[] = [];
  const files: FileData[] = [];

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  // Sort: folders first, then files, alphabetically
  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  for (const entry of entries) {
    if (shouldIgnore(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    const relPath = relativePath ? `${relativePath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      const { tree: childTree, files: childFiles } = scanDirectory(fullPath, relPath);

      // Only include non-empty directories
      if (childTree.length > 0 || childFiles.length > 0) {
        tree.push({
          name: entry.name,
          type: 'folder',
          path: relPath,
          children: childTree,
        });
        files.push(...childFiles);
      }
    } else {
      const stats = fs.statSync(fullPath);
      const language = getLanguage(fullPath);
      const isBinary = isBinaryFile(fullPath);

      tree.push({
        name: entry.name,
        type: 'file',
        path: relPath,
        language,
        size: stats.size,
      });

      // Read file content (unless binary or too large)
      let content: string | null = null;
      const maxSize = parseInt(process.env.MAX_FILE_SIZE || '512000'); // 500KB default

      if (!isBinary && stats.size <= maxSize) {
        try {
          content = fs.readFileSync(fullPath, 'utf-8');
        } catch (e) {
          console.warn(`Warning: Could not read file ${relPath}: ${e}`);
        }
      }

      files.push({
        path: relPath,
        name: entry.name,
        content,
        language,
        size_bytes: stats.size,
        is_binary: isBinary,
      });
    }
  }

  return { tree, files };
}

// ============================================================
// Git Parsing
// ============================================================

function parseGitHistory(projectPath: string, maxCommits: number = 50): GitCommit[] {
  const commits: GitCommit[] = [];

  try {
    // Check if it's a git repository
    execSync('git rev-parse --git-dir', { cwd: projectPath, stdio: 'pipe' });
  } catch {
    console.log('Not a git repository, skipping git history');
    return [];
  }

  try {
    // Get git log with custom format
    const format = '%H|%h|%s|%an|%ae|%aI|%D|%P';
    const logOutput = execSync(
      `git log --format="${format}" -n ${maxCommits}`,
      { cwd: projectPath, encoding: 'utf-8', maxBuffer: 10 * 1024 * 1024 }
    );

    const lines = logOutput.trim().split('\n').filter(Boolean);

    lines.forEach((line, index) => {
      const [hash, short_hash, message, author_name, author_email, commit_date, refs, parents] = line.split('|');

      // Extract branch name from refs
      let branch: string | undefined;
      if (refs) {
        const branchMatch = refs.match(/HEAD -> ([^,]+)/);
        if (branchMatch) branch = branchMatch[1];
      }

      // Check if merge commit (has multiple parents)
      const is_merge = parents ? parents.trim().split(' ').length > 1 : false;

      commits.push({
        hash,
        short_hash,
        message,
        author_name,
        author_email,
        commit_date,
        branch,
        is_merge,
        order_index: index,
      });
    });
  } catch (e) {
    console.error('Error parsing git log:', e);
  }

  return commits;
}

function parseGitDiff(projectPath: string, commitHash: string): GitDiff[] {
  const diffs: GitDiff[] = [];

  try {
    // Get diff stat for this commit
    const diffOutput = execSync(
      `git show --stat --format="" ${commitHash}`,
      { cwd: projectPath, encoding: 'utf-8', maxBuffer: 5 * 1024 * 1024 }
    );

    // Parse stat lines
    const lines = diffOutput.trim().split('\n').filter(Boolean);

    for (const line of lines) {
      // Example: " src/App.tsx | 15 +++++++-------"
      const match = line.match(/^\s*(.+?)\s*\|\s*(\d+)\s*([+-]+)?/);
      if (!match) continue;

      const [, filePath, , changes] = match;
      if (filePath.includes('file changed') || filePath.includes('files changed')) continue;

      const additions = (changes?.match(/\+/g) || []).length;
      const deletions = (changes?.match(/-/g) || []).length;

      // Determine change type
      let change_type: GitDiff['change_type'] = 'modified';
      if (deletions === 0 && additions > 0) change_type = 'added';
      if (additions === 0 && deletions > 0) change_type = 'deleted';

      diffs.push({
        file_path: filePath.trim(),
        change_type,
        additions,
        deletions,
      });
    }
  } catch (e) {
    console.warn(`Warning: Could not parse diff for ${commitHash}: ${e}`);
  }

  return diffs;
}

// ============================================================
// Main
// ============================================================

async function main() {
  const args = parseArgs();

  // Validate required args
  if (!args.path) {
    console.error('Error: --path is required');
    console.log('Usage: npx ts-node scripts/parse-project.ts --path ./my-project --name "My Project"');
    process.exit(1);
  }

  if (!args.name) {
    console.error('Error: --name is required');
    process.exit(1);
  }

  const projectPath = path.resolve(args.path);
  const projectName = args.name;
  const projectSlug = args.slug || slugify(projectName);
  const outputDir = path.resolve(args.output || './showcase-data');
  const appType = args['app-type'] || 'cursor';
  const parseGit = args.git !== 'false';
  const maxFileSize = parseInt(args['max-size'] || '500') * 1024;

  // Set env for file size limit
  process.env.MAX_FILE_SIZE = maxFileSize.toString();

  console.log('='.repeat(60));
  console.log('Project Parser');
  console.log('='.repeat(60));
  console.log(`Project Path: ${projectPath}`);
  console.log(`Project Name: ${projectName}`);
  console.log(`Project Slug: ${projectSlug}`);
  console.log(`App Type: ${appType}`);
  console.log(`Output: ${outputDir}`);
  console.log(`Parse Git: ${parseGit}`);
  console.log(`Max File Size: ${maxFileSize / 1024}KB`);
  console.log('='.repeat(60));

  // Check project path exists
  if (!fs.existsSync(projectPath)) {
    console.error(`Error: Project path does not exist: ${projectPath}`);
    process.exit(1);
  }

  // Scan files
  console.log('\n📁 Scanning files...');
  const { tree, files } = scanDirectory(projectPath);
  console.log(`   Found ${files.length} files`);

  // Parse git history
  let commits: GitCommit[] = [];
  const diffs = new Map<string, GitDiff[]>();

  if (parseGit) {
    console.log('\n📜 Parsing git history...');
    commits = parseGitHistory(projectPath);
    console.log(`   Found ${commits.length} commits`);

    // Parse diffs for each commit (first 20 only for performance)
    console.log('\n🔍 Parsing diffs...');
    for (const commit of commits.slice(0, 20)) {
      const commitDiffs = parseGitDiff(projectPath, commit.hash);
      if (commitDiffs.length > 0) {
        diffs.set(commit.hash, commitDiffs);
      }
    }
    console.log(`   Parsed diffs for ${diffs.size} commits`);
  }

  // Find default file (first .tsx or .ts in src)
  const defaultFile = files.find(f =>
    (f.path.startsWith('src/') || f.path.startsWith('app/')) &&
    (f.name.endsWith('.tsx') || f.name.endsWith('.ts'))
  )?.path;

  // Build project data
  const projectData: ProjectData = {
    project: {
      name: projectName,
      slug: projectSlug,
      app_type: appType,
      default_file: defaultFile,
    },
    file_tree: tree,
    files,
    git_commits: commits,
    git_diffs: diffs,
  };

  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });

  // Write output files
  const outputPath = path.join(outputDir, `${projectSlug}.json`);

  // Convert Map to object for JSON serialization
  const outputData = {
    ...projectData,
    git_diffs: Object.fromEntries(diffs),
  };

  fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

  console.log('\n✅ Done!');
  console.log(`   Output: ${outputPath}`);
  console.log(`   Files: ${files.length}`);
  console.log(`   Commits: ${commits.length}`);
  console.log(`   Size: ${(fs.statSync(outputPath).size / 1024).toFixed(1)}KB`);
}

main().catch(console.error);
