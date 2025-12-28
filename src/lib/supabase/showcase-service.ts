/**
 * Showcase Service
 *
 * 从 Supabase 读取项目展示数据
 * 用于 AI IDE 等应用展示代码、Git 历史等
 */

import { supabase, isSupabaseConfigured } from './client';

// ============================================================
// Types
// ============================================================

export interface ShowcaseProject {
  id: string;
  name: string;
  slug: string;
  description?: string;
  app_type: 'cursor' | 'antigravity' | 'windsurf';
  git_repo?: string;
  default_file?: string;
  is_featured: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  language?: string;
  size?: number;
  children?: FileNode[];
}

export interface ShowcaseFile {
  id: string;
  project_id: string;
  path: string;
  name: string;
  content: string | null;
  language: string;
  size_bytes: number;
  is_binary: boolean;
}

export interface GitCommit {
  id: string;
  project_id: string;
  hash: string;
  short_hash: string;
  message: string;
  author_name: string;
  author_email?: string;
  commit_date: string;
  branch?: string;
  is_merge: boolean;
  order_index: number;
}

export interface GitDiff {
  id: string;
  commit_id: string;
  file_path: string;
  old_path?: string;
  change_type: 'added' | 'modified' | 'deleted' | 'renamed';
  additions: number;
  deletions: number;
  diff_content?: string;
}

// ============================================================
// Mock Data (当 Supabase 未配置时使用)
// ============================================================

const mockProjects: ShowcaseProject[] = [
  {
    id: 'mock-project-1',
    name: 'My App',
    slug: 'my-app',
    description: 'A modern React application',
    app_type: 'cursor',
    default_file: 'src/App.tsx',
    is_featured: true,
    display_order: 0,
    created_at: '2024-12-25T10:00:00Z',
    updated_at: '2024-12-25T14:30:00Z',
  },
];

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    path: 'src',
    children: [
      {
        name: 'components',
        type: 'folder',
        path: 'src/components',
        children: [
          { name: 'Button.tsx', type: 'file', path: 'src/components/Button.tsx', language: 'typescript' },
          { name: 'Card.tsx', type: 'file', path: 'src/components/Card.tsx', language: 'typescript' },
        ],
      },
      {
        name: 'hooks',
        type: 'folder',
        path: 'src/hooks',
        children: [
          { name: 'useAuth.ts', type: 'file', path: 'src/hooks/useAuth.ts', language: 'typescript' },
        ],
      },
      { name: 'App.tsx', type: 'file', path: 'src/App.tsx', language: 'typescript' },
      { name: 'index.tsx', type: 'file', path: 'src/index.tsx', language: 'typescript' },
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json', language: 'json' },
  { name: 'README.md', type: 'file', path: 'README.md', language: 'markdown' },
];

const mockFiles: Record<string, string> = {
  'src/App.tsx': `import React from 'react';
import { Button } from './components/Button';
import { useAuth } from './hooks/useAuth';

function App() {
  const { user, login, logout } = useAuth();

  return (
    <div className="app">
      <header>
        <h1>Welcome to My App</h1>
        {user ? (
          <Button onClick={logout}>Logout</Button>
        ) : (
          <Button onClick={login}>Login</Button>
        )}
      </header>
    </div>
  );
}

export default App;`,
  'src/components/Button.tsx': `import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`,
  'README.md': `# My App

A modern React application built with TypeScript.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`
`,
};

const mockGitCommits: Omit<GitCommit, 'id' | 'project_id'>[] = [
  {
    hash: 'a1b2c3d4e5f6',
    short_hash: 'a1b2c3d',
    message: 'feat: add Button component with variants',
    author_name: 'John Doe',
    commit_date: '2024-12-25T14:30:00Z',
    branch: 'main',
    is_merge: false,
    order_index: 0,
  },
  {
    hash: 'b2c3d4e5f6g7',
    short_hash: 'b2c3d4e',
    message: 'fix: resolve auth token refresh',
    author_name: 'Jane Smith',
    commit_date: '2024-12-25T12:00:00Z',
    is_merge: false,
    order_index: 1,
  },
  {
    hash: 'c3d4e5f6g7h8',
    short_hash: 'c3d4e5f',
    message: 'initial commit',
    author_name: 'John Doe',
    commit_date: '2024-12-24T10:00:00Z',
    branch: 'main',
    is_merge: false,
    order_index: 2,
  },
];

// ============================================================
// Service Functions
// ============================================================

/**
 * 获取所有项目列表
 */
export async function getProjects(): Promise<ShowcaseProject[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProjects;
  }

  const { data, error } = await supabase
    .from('showcase_projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching projects:', error);
    return mockProjects;
  }

  return data || [];
}

/**
 * 根据 slug 获取项目
 */
export async function getProjectBySlug(slug: string): Promise<ShowcaseProject | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockProjects.find(p => p.slug === slug) || null;
  }

  const { data, error } = await supabase
    .from('showcase_projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching project:', error);
    return null;
  }

  return data;
}

/**
 * 获取项目文件树
 */
export async function getProjectFileTree(projectId: string): Promise<FileNode[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockFileTree;
  }

  const { data, error } = await supabase
    .from('showcase_file_trees')
    .select('tree_json')
    .eq('project_id', projectId)
    .single();

  if (error) {
    console.error('Error fetching file tree:', error);
    return [];
  }

  return data?.tree_json || [];
}

/**
 * 获取文件内容
 */
export async function getFileContent(projectId: string, filePath: string): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    return mockFiles[filePath] || null;
  }

  const { data, error } = await supabase
    .from('showcase_files')
    .select('content')
    .eq('project_id', projectId)
    .eq('path', filePath)
    .single();

  if (error) {
    console.error('Error fetching file content:', error);
    return null;
  }

  return data?.content || null;
}

/**
 * 获取项目所有文件 (用于一次性加载)
 */
export async function getProjectFiles(projectId: string): Promise<ShowcaseFile[]> {
  if (!isSupabaseConfigured || !supabase) {
    return Object.entries(mockFiles).map(([path, content]) => ({
      id: path,
      project_id: 'mock-project-1',
      path,
      name: path.split('/').pop() || path,
      content,
      language: path.endsWith('.tsx') || path.endsWith('.ts') ? 'typescript' :
                path.endsWith('.md') ? 'markdown' : 'text',
      size_bytes: content.length,
      is_binary: false,
    }));
  }

  const { data, error } = await supabase
    .from('showcase_files')
    .select('*')
    .eq('project_id', projectId);

  if (error) {
    console.error('Error fetching files:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取 Git 提交历史
 */
export async function getGitCommits(projectId: string): Promise<GitCommit[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockGitCommits.map((c, i) => ({
      ...c,
      id: `mock-commit-${i}`,
      project_id: 'mock-project-1',
    }));
  }

  const { data, error } = await supabase
    .from('showcase_git_commits')
    .select('*')
    .eq('project_id', projectId)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('Error fetching git commits:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取 commit 的文件变更
 */
export async function getCommitDiffs(commitId: string): Promise<GitDiff[]> {
  if (!isSupabaseConfigured || !supabase) {
    // Mock diff data
    return [
      {
        id: 'mock-diff-1',
        commit_id: commitId,
        file_path: 'src/App.tsx',
        change_type: 'modified',
        additions: 5,
        deletions: 2,
      },
    ];
  }

  const { data, error } = await supabase
    .from('showcase_git_diffs')
    .select('*')
    .eq('commit_id', commitId);

  if (error) {
    console.error('Error fetching diffs:', error);
    return [];
  }

  return data || [];
}

/**
 * 获取项目的完整数据 (一次性加载)
 */
export async function getFullProjectData(slug: string): Promise<{
  project: ShowcaseProject | null;
  fileTree: FileNode[];
  files: Record<string, string>;
  gitCommits: GitCommit[];
} | null> {
  const project = await getProjectBySlug(slug);
  if (!project) return null;

  const [fileTree, filesArray, gitCommits] = await Promise.all([
    getProjectFileTree(project.id),
    getProjectFiles(project.id),
    getGitCommits(project.id),
  ]);

  // Convert files array to content map
  const files: Record<string, string> = {};
  for (const file of filesArray) {
    if (file.content) {
      files[file.path] = file.content;
    }
  }

  return {
    project,
    fileTree,
    files,
    gitCommits,
  };
}
