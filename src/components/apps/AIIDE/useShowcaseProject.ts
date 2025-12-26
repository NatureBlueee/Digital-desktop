/**
 * useShowcaseProject Hook
 *
 * 从 Supabase 加载项目展示数据
 * 如果 Supabase 未配置或加载失败，返回内置的 mock 数据
 */

import { useState, useEffect, useCallback } from 'react';
import {
  getFullProjectData,
  getProjects,
  type ShowcaseProject,
  type FileNode,
  type GitCommit,
} from '@/lib/supabase/showcase-service';

// ============================================================
// Types
// ============================================================

interface UseShowcaseProjectResult {
  // 状态
  isLoading: boolean;
  error: string | null;

  // 项目数据
  project: ShowcaseProject | null;
  fileTree: FileNode[];
  fileContents: Record<string, string>;
  gitCommits: GitCommitForDisplay[];

  // 方法
  loadProject: (slug: string) => Promise<void>;
  getFileContent: (path: string) => string | null;
}

// Git commit 格式化为显示用
export interface GitCommitForDisplay {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  relativeDate: string;
  branch?: string;
  isMerge?: boolean;
}

// ============================================================
// Default Mock Data (用于未连接 Supabase 时)
// ============================================================

const defaultFileTree: FileNode[] = [
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
    ],
  },
  { name: 'package.json', type: 'file', path: 'package.json', language: 'json' },
  { name: 'README.md', type: 'file', path: 'README.md', language: 'markdown' },
];

const defaultFileContents: Record<string, string> = {
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
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <button
      className={\`btn btn-\${variant}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};`,
  'src/hooks/useAuth.ts': `import { useState, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = useCallback(async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({ id: '1', name: 'John Doe', email: 'john@example.com' });
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return { user, loading, login, logout };
}`,
  'package.json': `{
  "name": "my-app",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  },
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build"
  }
}`,
  'README.md': `# My App

A modern React application built with TypeScript.

## Getting Started

\`\`\`bash
npm install
npm run dev
\`\`\`

## Features

- React 18 with TypeScript
- Custom hooks for authentication
- Reusable component library
`,
};

const defaultGitCommits: GitCommitForDisplay[] = [
  {
    hash: 'a1b2c3d4e5f6',
    shortHash: 'a1b2c3d',
    message: 'feat: add Button component with variants',
    author: 'John Doe',
    date: '2024-12-25 14:30:00',
    relativeDate: '2 hours ago',
    branch: 'main',
    isMerge: false,
  },
  {
    hash: 'b2c3d4e5f6g7',
    shortHash: 'b2c3d4e',
    message: 'fix: resolve authentication token refresh issue',
    author: 'Jane Smith',
    date: '2024-12-25 12:15:00',
    relativeDate: '4 hours ago',
    isMerge: false,
  },
  {
    hash: 'c3d4e5f6g7h8',
    shortHash: 'c3d4e5f',
    message: 'refactor: extract useAuth hook from App component',
    author: 'John Doe',
    date: '2024-12-25 10:00:00',
    relativeDate: '6 hours ago',
    isMerge: false,
  },
  {
    hash: 'd4e5f6g7h8i9',
    shortHash: 'd4e5f6g',
    message: 'Merge pull request #42 from feature/card-component',
    author: 'John Doe',
    date: '2024-12-24 16:45:00',
    relativeDate: 'Yesterday',
    isMerge: true,
  },
  {
    hash: 'e5f6g7h8i9j0',
    shortHash: 'e5f6g7h',
    message: 'initial commit',
    author: 'John Doe',
    date: '2024-12-22 10:00:00',
    relativeDate: '3 days ago',
    branch: 'main',
    isMerge: false,
  },
];

// ============================================================
// Helper: 格式化 Git Commit
// ============================================================

function formatGitCommit(commit: GitCommit): GitCommitForDisplay {
  const commitDate = new Date(commit.commit_date);
  const now = new Date();
  const diffHours = Math.floor((now.getTime() - commitDate.getTime()) / (1000 * 60 * 60));

  let relativeDate: string;
  if (diffHours < 1) {
    relativeDate = 'Just now';
  } else if (diffHours < 24) {
    relativeDate = `${diffHours} hours ago`;
  } else if (diffHours < 48) {
    relativeDate = 'Yesterday';
  } else {
    const diffDays = Math.floor(diffHours / 24);
    relativeDate = `${diffDays} days ago`;
  }

  return {
    hash: commit.hash,
    shortHash: commit.short_hash,
    message: commit.message,
    author: commit.author_name,
    date: commit.commit_date,
    relativeDate,
    branch: commit.branch,
    isMerge: commit.is_merge,
  };
}

// ============================================================
// Hook
// ============================================================

export function useShowcaseProject(initialSlug?: string): UseShowcaseProjectResult {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [project, setProject] = useState<ShowcaseProject | null>(null);
  const [fileTree, setFileTree] = useState<FileNode[]>(defaultFileTree);
  const [fileContents, setFileContents] = useState<Record<string, string>>(defaultFileContents);
  const [gitCommits, setGitCommits] = useState<GitCommitForDisplay[]>(defaultGitCommits);

  const loadProject = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getFullProjectData(slug);

      if (data && data.project) {
        setProject(data.project);
        setFileTree(data.fileTree.length > 0 ? data.fileTree : defaultFileTree);
        setFileContents(Object.keys(data.files).length > 0 ? data.files : defaultFileContents);
        setGitCommits(
          data.gitCommits.length > 0
            ? data.gitCommits.map(formatGitCommit)
            : defaultGitCommits
        );
      } else {
        // 项目未找到，使用默认数据
        console.log(`Project "${slug}" not found, using default data`);
        setFileTree(defaultFileTree);
        setFileContents(defaultFileContents);
        setGitCommits(defaultGitCommits);
      }
    } catch (err) {
      console.error('Error loading project:', err);
      setError(err instanceof Error ? err.message : 'Failed to load project');
      // 出错时使用默认数据
      setFileTree(defaultFileTree);
      setFileContents(defaultFileContents);
      setGitCommits(defaultGitCommits);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getFileContent = useCallback((path: string): string | null => {
    // 尝试多种路径格式
    return fileContents[path] || fileContents[path.replace(/^\//, '')] || null;
  }, [fileContents]);

  // 初始加载
  useEffect(() => {
    if (initialSlug) {
      loadProject(initialSlug);
    }
  }, [initialSlug, loadProject]);

  return {
    isLoading,
    error,
    project,
    fileTree,
    fileContents,
    gitCommits,
    loadProject,
    getFileContent,
  };
}

export default useShowcaseProject;
