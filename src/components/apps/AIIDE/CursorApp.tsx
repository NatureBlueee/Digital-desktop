/**
 * CursorApp - VS Code 风格的 IDE 界面
 *
 * 更新日志:
 * - 2025-12-25: 添加完整菜单栏、右键菜单、Tooltip
 * - 集成 MenuBar, ContextMenu, Tooltip 组件
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { MenuBar, type MenuItemData } from '@/components/ui/Menu';
import { ContextMenu, useContextMenu, type ContextMenuItemData } from '@/components/ui/ContextMenu';
import { Tooltip } from '@/components/ui/Tooltip';
import { ResizeHandle, useResizable } from '@/components/ui/ResizeHandle';
import { MarkdownPreview } from '@/components/ui/MarkdownPreview';
import { useShowcaseProject, type GitCommitForDisplay } from './useShowcaseProject';
import {
  Files,
  Search,
  GitBranch,
  GitCommit,
  Bug,
  Blocks,
  Settings,
  User,
  ChevronRight,
  ChevronDown,
  FileCode,
  FileJson,
  FileText,
  Folder,
  FolderOpen,
  X,
  Minus,
  Square,
  Terminal as TerminalIcon,
  Sparkles,
  Bot,
  Copy,
  Check,
  FilePlus,
  FolderPlus,
  Trash2,
  Pencil,
  RefreshCw,
  AlertCircle,
  Play,
  RotateCcw,
  Scissors,
  Clipboard,
  FileSearch,
  Replace,
  MessageSquare,
  Wand2,
  Eye,
  Code,
  SplitSquareHorizontal,
  Clock,
  History,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface IDEAppProps {
  windowId: string;
  appType: 'cursor' | 'antigravity' | 'windsurf';
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  language?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface OpenTab {
  name: string;
  path: string;
  language: string;
  isModified?: boolean;
}

interface GitCommitData {
  hash: string;
  shortHash: string;
  message: string;
  author: string;
  date: string;
  relativeDate: string;
  branch?: string;
  isMerge?: boolean;
}

interface DiffLine {
  type: 'added' | 'removed' | 'unchanged' | 'header';
  content: string;
  oldLineNum?: number;
  newLineNum?: number;
}

interface FileDiff {
  fileName: string;
  oldPath: string;
  newPath: string;
  additions: number;
  deletions: number;
  lines: DiffLine[];
}

// ============================================================
// Mock Data
// ============================================================

const mockFileTree: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    children: [
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.tsx', type: 'file', language: 'typescript' },
          { name: 'Card.tsx', type: 'file', language: 'typescript' },
          { name: 'Input.tsx', type: 'file', language: 'typescript' },
        ],
      },
      {
        name: 'hooks',
        type: 'folder',
        children: [
          { name: 'useAuth.ts', type: 'file', language: 'typescript' },
          { name: 'useApi.ts', type: 'file', language: 'typescript' },
        ],
      },
      { name: 'App.tsx', type: 'file', language: 'typescript' },
      { name: 'index.tsx', type: 'file', language: 'typescript' },
      { name: 'styles.css', type: 'file', language: 'css' },
    ],
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file', language: 'html' },
      { name: 'favicon.ico', type: 'file', language: 'other' },
    ],
  },
  { name: 'package.json', type: 'file', language: 'json' },
  { name: 'tsconfig.json', type: 'file', language: 'json' },
  { name: 'README.md', type: 'file', language: 'markdown' },
];

const mockFileContents: Record<string, string> = {
  'App.tsx': `import React from 'react';
import { Button } from './components/Button';
import { Card } from './components/Card';
import { useAuth } from './hooks/useAuth';
import './styles.css';

function App() {
  const { user, login, logout } = useAuth();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to My App</h1>
        {user ? (
          <div className="user-info">
            <span>Hello, {user.name}</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        ) : (
          <Button onClick={login}>Login</Button>
        )}
      </header>

      <main className="app-main">
        <Card title="Getting Started">
          <p>Edit src/App.tsx and save to reload.</p>
        </Card>
      </main>
    </div>
  );
}

export default App;`,
  'Button.tsx': `import React from 'react';

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
  'useAuth.ts': `import { useState, useCallback } from 'react';

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setUser({
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
      });
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
    "build": "tsc && vite build",
    "preview": "vite preview"
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

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我创建一个 Button 组件，支持 primary、secondary、danger 三种样式',
    timestamp: '10:30',
  },
  {
    id: '2',
    role: 'assistant',
    content: `好的，我来帮你创建一个 Button 组件。

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  onClick
}) => {
  return (
    <button className={\`btn btn-\${variant}\`} onClick={onClick}>
      {children}
    </button>
  );
};
\`\`\`

这个组件支持三种变体样式，默认是 primary。`,
    timestamp: '10:31',
  },
  {
    id: '3',
    role: 'user',
    content: '再加一个 disabled 属性',
    timestamp: '10:32',
  },
  {
    id: '4',
    role: 'assistant',
    content: `已添加 disabled 属性：

\`\`\`typescript
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;  // 新增
}
\`\`\`

当 disabled 为 true 时，按钮会被禁用且样式变灰。`,
    timestamp: '10:32',
  },
];

// Mock Git Timeline Data (simulating git log output)
const mockGitTimeline: GitCommitData[] = [
  {
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    shortHash: 'a1b2c3d',
    message: 'feat: add Button component with variants',
    author: 'John Doe',
    date: '2024-12-25 14:30:00',
    relativeDate: '2 hours ago',
    branch: 'main',
  },
  {
    hash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7',
    shortHash: 'b2c3d4e',
    message: 'fix: resolve authentication token refresh issue',
    author: 'Jane Smith',
    date: '2024-12-25 12:15:00',
    relativeDate: '4 hours ago',
  },
  {
    hash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8',
    shortHash: 'c3d4e5f',
    message: 'refactor: extract useAuth hook from App component',
    author: 'John Doe',
    date: '2024-12-25 10:00:00',
    relativeDate: '6 hours ago',
  },
  {
    hash: 'd4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9',
    shortHash: 'd4e5f6g',
    message: 'Merge pull request #42 from feature/card-component',
    author: 'John Doe',
    date: '2024-12-24 16:45:00',
    relativeDate: 'Yesterday',
    isMerge: true,
  },
  {
    hash: 'e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
    shortHash: 'e5f6g7h',
    message: 'feat: implement Card component with shadow variants',
    author: 'Alice Wang',
    date: '2024-12-24 15:30:00',
    relativeDate: 'Yesterday',
    branch: 'feature/card-component',
  },
  {
    hash: 'f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1',
    shortHash: 'f6g7h8i',
    message: 'docs: update README with setup instructions',
    author: 'Jane Smith',
    date: '2024-12-24 11:20:00',
    relativeDate: 'Yesterday',
  },
  {
    hash: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2',
    shortHash: 'g7h8i9j',
    message: 'chore: configure TypeScript strict mode',
    author: 'John Doe',
    date: '2024-12-23 09:15:00',
    relativeDate: '2 days ago',
  },
  {
    hash: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3',
    shortHash: 'h8i9j0k',
    message: 'initial commit',
    author: 'John Doe',
    date: '2024-12-22 10:00:00',
    relativeDate: '3 days ago',
    branch: 'main',
  },
];

// Mock Diff Data
const mockFileDiff: FileDiff = {
  fileName: 'App.tsx',
  oldPath: 'src/App.tsx',
  newPath: 'src/App.tsx',
  additions: 8,
  deletions: 3,
  lines: [
    { type: 'header', content: '@@ -1,15 +1,20 @@' },
    { type: 'unchanged', content: "import React from 'react';", oldLineNum: 1, newLineNum: 1 },
    { type: 'unchanged', content: "import { Button } from './components/Button';", oldLineNum: 2, newLineNum: 2 },
    { type: 'removed', content: "import { Card } from './components/Card';", oldLineNum: 3 },
    { type: 'added', content: "import { Card } from './components/Card';", newLineNum: 3 },
    { type: 'added', content: "import { Input } from './components/Input';", newLineNum: 4 },
    { type: 'unchanged', content: "import { useAuth } from './hooks/useAuth';", oldLineNum: 4, newLineNum: 5 },
    { type: 'added', content: "import { useForm } from './hooks/useForm';", newLineNum: 6 },
    { type: 'unchanged', content: "import './styles.css';", oldLineNum: 5, newLineNum: 7 },
    { type: 'unchanged', content: '', oldLineNum: 6, newLineNum: 8 },
    { type: 'unchanged', content: 'function App() {', oldLineNum: 7, newLineNum: 9 },
    { type: 'unchanged', content: '  const { user, login, logout } = useAuth();', oldLineNum: 8, newLineNum: 10 },
    { type: 'added', content: '  const { values, handleChange } = useForm();', newLineNum: 11 },
    { type: 'unchanged', content: '', oldLineNum: 9, newLineNum: 12 },
    { type: 'unchanged', content: '  return (', oldLineNum: 10, newLineNum: 13 },
    { type: 'unchanged', content: '    <div className="app">', oldLineNum: 11, newLineNum: 14 },
    { type: 'removed', content: '      <header className="app-header">', oldLineNum: 12 },
    { type: 'added', content: '      <header className="app-header bg-gradient-to-r from-blue-500 to-purple-600">', newLineNum: 15 },
    { type: 'removed', content: '        <h1>Welcome to My App</h1>', oldLineNum: 13 },
    { type: 'added', content: '        <h1 className="text-white text-2xl font-bold">Welcome to My App</h1>', newLineNum: 16 },
    { type: 'added', content: '        <Input value={values.search} onChange={handleChange} />', newLineNum: 17 },
    { type: 'unchanged', content: '        {user ? (', oldLineNum: 14, newLineNum: 18 },
  ],
};

// ============================================================
// Menu Configuration
// ============================================================

const createMenuConfig = (handlers: {
  onNewFile: () => void;
  onSave: () => void;
  onToggleTerminal: () => void;
  onToggleChat: () => void;
}): { label: string; items: MenuItemData[] }[] => [
  {
    label: 'File',
    items: [
      { label: 'New File', shortcut: 'Ctrl+N', onClick: handlers.onNewFile },
      { label: 'New Window', shortcut: 'Ctrl+Shift+N' },
      { separator: true, label: '' },
      { label: 'Open File...', shortcut: 'Ctrl+O' },
      { label: 'Open Folder...', shortcut: 'Ctrl+K Ctrl+O' },
      {
        label: 'Open Recent',
        submenu: [
          { label: '~/Projects/my-app' },
          { label: '~/Projects/dashboard' },
          { label: '~/Projects/api-server' },
          { separator: true, label: '' },
          { label: 'Clear Recently Opened' },
        ],
      },
      { separator: true, label: '' },
      { label: 'Save', shortcut: 'Ctrl+S', onClick: handlers.onSave },
      { label: 'Save As...', shortcut: 'Ctrl+Shift+S' },
      { label: 'Save All', shortcut: 'Ctrl+K S' },
      { separator: true, label: '' },
      { label: 'Auto Save', checked: true },
      {
        label: 'Preferences',
        submenu: [
          { label: 'Settings', shortcut: 'Ctrl+,' },
          { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
          { label: 'User Snippets' },
          { separator: true, label: '' },
          { label: 'Color Theme' },
          { label: 'File Icon Theme' },
        ],
      },
      { separator: true, label: '' },
      { label: 'Close Editor', shortcut: 'Ctrl+W' },
      { label: 'Close Folder' },
      { separator: true, label: '' },
      { label: 'Exit', shortcut: 'Alt+F4' },
    ],
  },
  {
    label: 'Edit',
    items: [
      { label: 'Undo', shortcut: 'Ctrl+Z' },
      { label: 'Redo', shortcut: 'Ctrl+Y' },
      { separator: true, label: '' },
      { label: 'Cut', shortcut: 'Ctrl+X' },
      { label: 'Copy', shortcut: 'Ctrl+C' },
      { label: 'Paste', shortcut: 'Ctrl+V' },
      { separator: true, label: '' },
      { label: 'Find', shortcut: 'Ctrl+F' },
      { label: 'Replace', shortcut: 'Ctrl+H' },
      { separator: true, label: '' },
      { label: 'Find in Files', shortcut: 'Ctrl+Shift+F' },
      { label: 'Replace in Files', shortcut: 'Ctrl+Shift+H' },
      { separator: true, label: '' },
      { label: 'Toggle Line Comment', shortcut: 'Ctrl+/' },
      { label: 'Toggle Block Comment', shortcut: 'Ctrl+Shift+/' },
    ],
  },
  {
    label: 'Selection',
    items: [
      { label: 'Select All', shortcut: 'Ctrl+A' },
      { label: 'Expand Selection', shortcut: 'Shift+Alt+Right' },
      { label: 'Shrink Selection', shortcut: 'Shift+Alt+Left' },
      { separator: true, label: '' },
      { label: 'Copy Line Up', shortcut: 'Shift+Alt+Up' },
      { label: 'Copy Line Down', shortcut: 'Shift+Alt+Down' },
      { label: 'Move Line Up', shortcut: 'Alt+Up' },
      { label: 'Move Line Down', shortcut: 'Alt+Down' },
      { separator: true, label: '' },
      { label: 'Add Cursor Above', shortcut: 'Ctrl+Alt+Up' },
      { label: 'Add Cursor Below', shortcut: 'Ctrl+Alt+Down' },
      { label: 'Add Cursors to Line Ends', shortcut: 'Shift+Alt+I' },
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Command Palette...', shortcut: 'Ctrl+Shift+P' },
      { label: 'Open View...', shortcut: 'Ctrl+Q' },
      { separator: true, label: '' },
      {
        label: 'Appearance',
        submenu: [
          { label: 'Full Screen', shortcut: 'F11' },
          { label: 'Zen Mode', shortcut: 'Ctrl+K Z' },
          { separator: true, label: '' },
          { label: 'Show Menu Bar', checked: true },
          { label: 'Show Activity Bar', checked: true },
          { label: 'Show Status Bar', checked: true },
          { label: 'Show Side Bar', checked: true },
        ],
      },
      {
        label: 'Editor Layout',
        submenu: [
          { label: 'Split Up' },
          { label: 'Split Down' },
          { label: 'Split Left' },
          { label: 'Split Right' },
          { separator: true, label: '' },
          { label: 'Single' },
          { label: 'Two Columns' },
          { label: 'Three Columns' },
        ],
      },
      { separator: true, label: '' },
      { label: 'Explorer', shortcut: 'Ctrl+Shift+E' },
      { label: 'Search', shortcut: 'Ctrl+Shift+F' },
      { label: 'Source Control', shortcut: 'Ctrl+Shift+G' },
      { label: 'Run and Debug', shortcut: 'Ctrl+Shift+D' },
      { label: 'Extensions', shortcut: 'Ctrl+Shift+X' },
      { separator: true, label: '' },
      { label: 'Problems', shortcut: 'Ctrl+Shift+M' },
      { label: 'Output', shortcut: 'Ctrl+Shift+U' },
      { label: 'Terminal', shortcut: 'Ctrl+`', onClick: handlers.onToggleTerminal },
      { label: 'AI Chat', shortcut: 'Ctrl+L', onClick: handlers.onToggleChat },
    ],
  },
  {
    label: 'Go',
    items: [
      { label: 'Back', shortcut: 'Alt+Left', disabled: true },
      { label: 'Forward', shortcut: 'Alt+Right', disabled: true },
      { separator: true, label: '' },
      { label: 'Go to File...', shortcut: 'Ctrl+P' },
      { label: 'Go to Symbol in Workspace...', shortcut: 'Ctrl+T' },
      { separator: true, label: '' },
      { label: 'Go to Symbol in Editor...', shortcut: 'Ctrl+Shift+O' },
      { label: 'Go to Definition', shortcut: 'F12' },
      { label: 'Go to Type Definition' },
      { label: 'Go to Implementation', shortcut: 'Ctrl+F12' },
      { label: 'Go to References', shortcut: 'Shift+F12' },
      { separator: true, label: '' },
      { label: 'Go to Line...', shortcut: 'Ctrl+G' },
      { label: 'Go to Bracket', shortcut: 'Ctrl+Shift+\\' },
    ],
  },
  {
    label: 'Run',
    items: [
      { label: 'Start Debugging', shortcut: 'F5' },
      { label: 'Run Without Debugging', shortcut: 'Ctrl+F5' },
      { label: 'Stop Debugging', shortcut: 'Shift+F5', disabled: true },
      { label: 'Restart Debugging', shortcut: 'Ctrl+Shift+F5', disabled: true },
      { separator: true, label: '' },
      { label: 'Open Configurations' },
      { label: 'Add Configuration...' },
      { separator: true, label: '' },
      { label: 'Step Over', shortcut: 'F10', disabled: true },
      { label: 'Step Into', shortcut: 'F11', disabled: true },
      { label: 'Step Out', shortcut: 'Shift+F11', disabled: true },
      { label: 'Continue', shortcut: 'F5', disabled: true },
      { separator: true, label: '' },
      { label: 'Toggle Breakpoint', shortcut: 'F9' },
    ],
  },
  {
    label: 'Terminal',
    items: [
      { label: 'New Terminal', shortcut: 'Ctrl+Shift+`' },
      { label: 'Split Terminal', shortcut: 'Ctrl+Shift+5' },
      { separator: true, label: '' },
      { label: 'Run Task...' },
      { label: 'Run Build Task...', shortcut: 'Ctrl+Shift+B' },
      { label: 'Run Active File' },
      { label: 'Run Selected Text' },
      { separator: true, label: '' },
      { label: 'Configure Tasks...' },
      { label: 'Configure Default Build Task...' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Welcome' },
      { label: 'Show All Commands', shortcut: 'Ctrl+Shift+P' },
      { label: 'Documentation' },
      { label: 'Release Notes' },
      { separator: true, label: '' },
      { label: 'Keyboard Shortcuts Reference', shortcut: 'Ctrl+K Ctrl+R' },
      { label: 'Video Tutorials' },
      { label: 'Tips and Tricks' },
      { separator: true, label: '' },
      { label: 'Join Us on Twitter' },
      { label: 'Report Issue' },
      { separator: true, label: '' },
      { label: 'Toggle Developer Tools', shortcut: 'Ctrl+Shift+I' },
      { separator: true, label: '' },
      { label: 'About' },
    ],
  },
];

// ============================================================
// Main Component
// ============================================================

export const CursorApp: React.FC<IDEAppProps> = ({ windowId, appType }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

  // Load project data from Supabase (falls back to mock data)
  const {
    isLoading: isProjectLoading,
    fileTree: projectFileTree,
    fileContents: projectFileContents,
    gitCommits: projectGitCommits,
    getFileContent,
  } = useShowcaseProject();

  // State
  const [activeTab, setActiveTab] = useState<string>('App.tsx');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { name: 'App.tsx', path: 'src/App.tsx', language: 'typescript' },
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'search' | 'git' | 'debug' | 'extensions'>('files');
  const [cursorPosition, setCursorPosition] = useState({ line: 1, col: 1 });
  const [markdownPreviewMode, setMarkdownPreviewMode] = useState<Record<string, boolean>>({});
  const [showDiffView, setShowDiffView] = useState(false);

  // Resizable panels
  const sidebar = useResizable(240, { minSize: 180, maxSize: 400 });
  const chatPanel = useResizable(320, { minSize: 280, maxSize: 500 });
  const terminalPanel = useResizable(192, { minSize: 100, maxSize: 400 });

  // Context menus
  const fileContextMenu = useContextMenu();
  const editorContextMenu = useContextMenu();
  const tabContextMenu = useContextMenu();
  const [contextTarget, setContextTarget] = useState<{ type: string; data: any } | null>(null);

  // Handlers
  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const openFile = useCallback((name: string, path: string, language: string) => {
    if (!openTabs.find(t => t.path === path)) {
      setOpenTabs(prev => [...prev, { name, path, language }]);
    }
    setActiveTab(name);
  }, [openTabs]);

  const closeTab = useCallback((name: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newTabs = openTabs.filter(t => t.name !== name);
    setOpenTabs(newTabs);
    if (activeTab === name && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].name);
    }
  }, [openTabs, activeTab]);

  const handleFileContextMenu = useCallback((e: React.MouseEvent, node: FileNode, path: string) => {
    setContextTarget({ type: 'file', data: { node, path } });
    fileContextMenu.open(e);
  }, [fileContextMenu]);

  const handleEditorContextMenu = useCallback((e: React.MouseEvent) => {
    editorContextMenu.open(e);
  }, [editorContextMenu]);

  const handleTabContextMenu = useCallback((e: React.MouseEvent, tab: OpenTab) => {
    setContextTarget({ type: 'tab', data: tab });
    tabContextMenu.open(e);
  }, [tabContextMenu]);

  // Menu config
  const menuConfig = createMenuConfig({
    onNewFile: () => console.log('New file'),
    onSave: () => console.log('Save'),
    onToggleTerminal: () => setShowTerminal(prev => !prev),
    onToggleChat: () => setShowChat(prev => !prev),
  });

  // Context menu items
  const fileContextMenuItems: ContextMenuItemData[] = contextTarget?.type === 'file' ? [
    { label: 'New File...', icon: <FilePlus size={14} /> },
    { label: 'New Folder...', icon: <FolderPlus size={14} /> },
    { separator: true, label: '' },
    { label: 'Cut', shortcut: 'Ctrl+X', icon: <Scissors size={14} /> },
    { label: 'Copy', shortcut: 'Ctrl+C', icon: <Copy size={14} /> },
    { label: 'Paste', shortcut: 'Ctrl+V', icon: <Clipboard size={14} /> },
    { separator: true, label: '' },
    { label: 'Copy Path', shortcut: 'Ctrl+Shift+C' },
    { label: 'Copy Relative Path', shortcut: 'Ctrl+K Ctrl+Shift+C' },
    { separator: true, label: '' },
    { label: 'Rename...', shortcut: 'F2', icon: <Pencil size={14} /> },
    { label: 'Delete', shortcut: 'Delete', icon: <Trash2 size={14} />, danger: true },
    { separator: true, label: '' },
    { label: 'Add to AI Chat', icon: <MessageSquare size={14} /> },
    { label: 'Generate Code Here...', icon: <Wand2 size={14} /> },
  ] : [];

  const editorContextMenuItems: ContextMenuItemData[] = [
    { label: 'Go to Definition', shortcut: 'F12' },
    { label: 'Go to Type Definition' },
    { label: 'Go to Implementations', shortcut: 'Ctrl+F12' },
    { label: 'Go to References', shortcut: 'Shift+F12' },
    { separator: true, label: '' },
    { label: 'Peek', submenu: [
      { label: 'Peek Definition', shortcut: 'Alt+F12' },
      { label: 'Peek Type Definition' },
      { label: 'Peek References' },
    ]},
    { separator: true, label: '' },
    { label: 'Rename Symbol', shortcut: 'F2', icon: <Pencil size={14} /> },
    { label: 'Change All Occurrences', shortcut: 'Ctrl+F2' },
    { separator: true, label: '' },
    { label: 'Cut', shortcut: 'Ctrl+X', icon: <Scissors size={14} /> },
    { label: 'Copy', shortcut: 'Ctrl+C', icon: <Copy size={14} /> },
    { label: 'Paste', shortcut: 'Ctrl+V', icon: <Clipboard size={14} /> },
    { separator: true, label: '' },
    { label: 'Edit with AI', shortcut: 'Ctrl+K', icon: <Wand2 size={14} /> },
    { label: 'Generate', shortcut: 'Ctrl+Shift+K', icon: <Sparkles size={14} /> },
    { label: 'Explain Code', icon: <Eye size={14} /> },
    { label: 'Fix Error', icon: <AlertCircle size={14} /> },
  ];

  const tabContextMenuItems: ContextMenuItemData[] = [
    { label: 'Close', shortcut: 'Ctrl+W', onClick: () => contextTarget?.data && closeTab(contextTarget.data.name) },
    { label: 'Close Others' },
    { label: 'Close All' },
    { label: 'Close to the Right' },
    { separator: true, label: '' },
    { label: 'Copy Path' },
    { label: 'Copy Relative Path' },
    { separator: true, label: '' },
    { label: 'Reveal in Explorer' },
    { label: 'Open in Terminal' },
    { separator: true, label: '' },
    { label: 'Split Up', icon: <SplitSquareHorizontal size={14} /> },
    { label: 'Split Down' },
  ];

  // Brand colors
  const brandConfig = {
    cursor: { accent: '#007acc', logo: '/icons/cursor-ai-code-icon.svg', name: 'Cursor' },
    antigravity: { accent: '#00bcd4', logo: '/icons/antigravity.png', name: 'Antigravity' },
    windsurf: { accent: '#06b6d4', logo: '/icons/windsurf.svg', name: 'Windsurf' },
  };
  const brand = brandConfig[appType];

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] font-sans text-sm overflow-hidden rounded-lg">
      {/* Title Bar */}
      <div className="flex items-center h-8 bg-[#323233] px-2 drag-handle select-none">
        <div className="flex items-center gap-2 flex-1">
          <img src={brand.logo} className="w-4 h-4" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-xs text-[#cccccc]">{brand.name} - my-app</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => minimizeWindow(windowId)} className="p-1.5 hover:bg-[#404040] rounded transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={() => maximizeWindow(windowId)} className="p-1.5 hover:bg-[#404040] rounded transition-colors">
            <Square size={10} />
          </button>
          <button onClick={() => closeWindow(windowId)} className="p-1.5 hover:bg-[#e81123] rounded transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-7 bg-[#323233] px-1 border-b border-[#252526] flex items-center">
        <MenuBar menus={menuConfig} />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-1 border-r border-[#252526]">
          {[
            { id: 'files', icon: Files, tooltip: 'Explorer', shortcut: 'Ctrl+Shift+E' },
            { id: 'search', icon: Search, tooltip: 'Search', shortcut: 'Ctrl+Shift+F' },
            { id: 'git', icon: GitBranch, tooltip: 'Source Control', shortcut: 'Ctrl+Shift+G' },
            { id: 'debug', icon: Bug, tooltip: 'Run and Debug', shortcut: 'Ctrl+Shift+D' },
            { id: 'extensions', icon: Blocks, tooltip: 'Extensions', shortcut: 'Ctrl+Shift+X' },
          ].map(item => (
            <Tooltip key={item.id} content={item.tooltip} shortcut={item.shortcut} position="right">
              <button
                onClick={() => setActiveSidebarTab(item.id as any)}
                className={cn(
                  "p-2.5 rounded mb-0.5 relative transition-colors",
                  activeSidebarTab === item.id
                    ? "text-white"
                    : "text-[#858585] hover:text-white"
                )}
              >
                {activeSidebarTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-white rounded-r" />
                )}
                <item.icon size={24} />
              </button>
            </Tooltip>
          ))}

          <div className="flex-1" />

          <Tooltip content="Account" position="right">
            <button className="p-2.5 rounded mb-0.5 text-[#858585] hover:text-white transition-colors">
              <User size={24} />
            </button>
          </Tooltip>
          <Tooltip content="Settings" shortcut="Ctrl+," position="right">
            <button className="p-2.5 rounded text-[#858585] hover:text-white transition-colors">
              <Settings size={24} />
            </button>
          </Tooltip>
        </div>

        {/* Sidebar */}
        <div
          className="bg-[#252526] flex flex-col border-r border-[#1e1e1e]"
          style={{ width: sidebar.size }}
        >
          {/* Explorer Panel */}
          {activeSidebarTab === 'files' && (
            <>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
                  Explorer
                </span>
                <div className="flex items-center gap-1">
                  <Tooltip content="New File">
                    <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
                      <FilePlus size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip content="New Folder">
                    <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
                      <FolderPlus size={16} />
                    </button>
                  </Tooltip>
                  <Tooltip content="Refresh">
                    <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
                      <RefreshCw size={16} />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex-1 overflow-auto">
                <div className="px-2">
                  <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                    <ChevronDown size={16} />
                    <span>my-app</span>
                  </div>
                  <FileTree
                    nodes={projectFileTree}
                    expandedFolders={expandedFolders}
                    onToggleFolder={toggleFolder}
                    onOpenFile={openFile}
                    activeFile={activeTab}
                    basePath=""
                    onContextMenu={handleFileContextMenu}
                  />
                </div>
              </div>
            </>
          )}

          {/* Search Panel */}
          {activeSidebarTab === 'search' && (
            <SearchPanel />
          )}

          {/* Git Panel */}
          {activeSidebarTab === 'git' && (
            <GitPanel
              onOpenDiff={() => setShowDiffView(true)}
              commits={projectGitCommits}
            />
          )}

          {/* Debug Panel */}
          {activeSidebarTab === 'debug' && (
            <>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
                  Run and Debug
                </span>
              </div>
              <div className="px-3 py-2">
                <div className="flex items-center gap-2">
                  <select className="flex-1 bg-[#3c3c3c] text-xs text-[#cccccc] rounded px-2 py-1.5 outline-none border border-[#555]">
                    <option>Launch Chrome</option>
                    <option>Launch Node</option>
                    <option>Attach to Process</option>
                  </select>
                  <Tooltip content="Start Debugging">
                    <button className="p-1.5 bg-green-600 hover:bg-green-700 rounded text-white">
                      <Play size={14} />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div className="flex-1 overflow-auto px-2">
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronRight size={16} />
                  <span>Variables</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronRight size={16} />
                  <span>Watch</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronRight size={16} />
                  <span>Call Stack</span>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronRight size={16} />
                  <span>Breakpoints</span>
                </div>
              </div>
            </>
          )}

          {/* Extensions Panel */}
          {activeSidebarTab === 'extensions' && (
            <>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
                  Extensions
                </span>
              </div>
              <div className="px-3 py-2">
                <div className="flex items-center bg-[#3c3c3c] rounded px-2">
                  <Search size={14} className="text-[#858585]" />
                  <input
                    type="text"
                    placeholder="Search Extensions in Marketplace"
                    className="flex-1 bg-transparent text-xs py-1.5 px-2 outline-none text-white placeholder:text-[#858585]"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto px-2">
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronDown size={16} />
                  <span>Installed</span>
                  <span className="ml-auto text-[#858585]">5</span>
                </div>
                <div className="pl-2 space-y-1">
                  {[
                    { name: 'Prettier', desc: 'Code formatter', color: 'bg-blue-500' },
                    { name: 'ESLint', desc: 'Linter', color: 'bg-purple-500' },
                    { name: 'GitLens', desc: 'Git supercharged', color: 'bg-green-500' },
                    { name: 'Tailwind CSS', desc: 'IntelliSense', color: 'bg-cyan-500' },
                    { name: 'Cursor AI', desc: 'AI Assistant', color: 'bg-purple-400' },
                  ].map(ext => (
                    <div key={ext.name} className="flex items-center gap-2 p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                      <div className={`w-8 h-8 ${ext.color} rounded flex items-center justify-center text-white text-xs font-bold`}>
                        {ext.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-white truncate">{ext.name}</div>
                        <div className="text-[10px] text-[#858585] truncate">{ext.desc}</div>
                      </div>
                      <Tooltip content="Disable">
                        <button className="p-1 hover:bg-[#404040] rounded text-[#858585]">
                          <Settings size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Resize Handle */}
        <ResizeHandle
          direction="horizontal"
          onResize={sidebar.handleResize}
          currentSize={sidebar.size}
          minSize={180}
          maxSize={400}
        />

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex items-center h-9 bg-[#252526] overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab.path}
                onClick={() => setActiveTab(tab.name)}
                onContextMenu={(e) => handleTabContextMenu(e, tab)}
                className={cn(
                  "group flex items-center gap-2 px-3 h-full border-r border-[#1e1e1e] cursor-pointer min-w-0 transition-colors",
                  activeTab === tab.name
                    ? "bg-[#1e1e1e] text-white"
                    : "bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2a2a]"
                )}
              >
                <FileIcon language={tab.language} />
                <span className="truncate text-xs">{tab.name}</span>
                {tab.isModified && <span className="text-white">●</span>}
                <button
                  onClick={(e) => closeTab(tab.name, e)}
                  className={cn(
                    "p-0.5 rounded transition-all",
                    activeTab === tab.name
                      ? "hover:bg-[#404040] opacity-100"
                      : "hover:bg-[#404040] opacity-0 group-hover:opacity-100"
                  )}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 flex flex-col overflow-hidden bg-[#1e1e1e]">
              {/* Markdown Preview Toggle */}
              {activeTab?.endsWith('.md') && (
                <div className="flex items-center gap-2 px-3 py-1 bg-[#252526] border-b border-[#1e1e1e]">
                  <button
                    onClick={() => setMarkdownPreviewMode(prev => ({
                      ...prev,
                      [activeTab]: false
                    }))}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
                      !markdownPreviewMode[activeTab]
                        ? "bg-[#3c3c3c] text-white"
                        : "text-[#858585] hover:text-white"
                    )}
                  >
                    <Code size={12} />
                    Source
                  </button>
                  <button
                    onClick={() => setMarkdownPreviewMode(prev => ({
                      ...prev,
                      [activeTab]: true
                    }))}
                    className={cn(
                      "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
                      markdownPreviewMode[activeTab]
                        ? "bg-[#3c3c3c] text-white"
                        : "text-[#858585] hover:text-white"
                    )}
                  >
                    <Eye size={12} />
                    Preview
                  </button>
                </div>
              )}

              {/* Editor or Preview or Diff */}
              <div
                className="flex-1 overflow-auto"
                onContextMenu={handleEditorContextMenu}
              >
                {showDiffView ? (
                  <DiffViewer
                    diff={mockFileDiff}
                    onClose={() => setShowDiffView(false)}
                  />
                ) : activeTab && (
                  activeTab.endsWith('.md') && markdownPreviewMode[activeTab] ? (
                    <MarkdownPreview
                      content={projectFileContents[activeTab] || getFileContent(activeTab) || '# No content'}
                      className="h-full"
                    />
                  ) : (
                    <CodeEditor
                      content={projectFileContents[activeTab] || getFileContent(activeTab) || '// File not found'}
                      language={openTabs.find(t => t.name === activeTab)?.language || 'text'}
                      onCursorChange={setCursorPosition}
                    />
                  )
                )}
              </div>
            </div>

            {/* Chat Panel */}
            {showChat && (
              <>
                <ResizeHandle
                  direction="horizontal"
                  onResize={chatPanel.handleResize}
                  currentSize={chatPanel.size}
                  minSize={280}
                  maxSize={500}
                  reverse
                />
                <ChatPanel
                  onClose={() => setShowChat(false)}
                  appType={appType}
                  width={chatPanel.size}
                />
              </>
            )}
          </div>

          {/* Terminal Resize Handle */}
          {showTerminal && (
            <ResizeHandle
              direction="vertical"
              onResize={terminalPanel.handleResize}
              currentSize={terminalPanel.size}
              minSize={100}
              maxSize={400}
              reverse
            />
          )}

          {/* Terminal Panel */}
          {showTerminal && (
            <div
              className="bg-[#1e1e1e] border-t border-[#414141]"
              style={{ height: terminalPanel.size }}
            >
              <div className="flex items-center h-8 bg-[#252526] px-2 border-b border-[#414141]">
                <button className="flex items-center gap-1 px-2 py-1 text-xs bg-[#1e1e1e] text-white rounded-t border-t border-l border-r border-[#414141]">
                  <TerminalIcon size={12} />
                  Terminal
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#858585] hover:text-white">
                  Problems
                  <span className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-[10px]">0</span>
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#858585] hover:text-white">
                  Output
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#858585] hover:text-white">
                  Debug Console
                </button>
                <div className="flex-1" />
                <Tooltip content="New Terminal">
                  <button className="p-1 hover:bg-[#404040] rounded text-[#858585] hover:text-white">
                    <FilePlus size={14} />
                  </button>
                </Tooltip>
                <Tooltip content="Split Terminal">
                  <button className="p-1 hover:bg-[#404040] rounded text-[#858585] hover:text-white">
                    <SplitSquareHorizontal size={14} />
                  </button>
                </Tooltip>
                <button onClick={() => setShowTerminal(false)} className="p-1 hover:bg-[#404040] rounded">
                  <X size={14} />
                </button>
              </div>
              <div className="p-2 font-mono text-xs overflow-auto h-[calc(100%-32px)]">
                <div className="text-green-400">➜ <span className="text-cyan-400">my-app</span> <span className="text-yellow-400">git:(</span><span className="text-red-400">main</span><span className="text-yellow-400">)</span></div>
                <div className="text-[#cccccc]">$ npm run dev</div>
                <div className="text-[#858585] mt-1">
                  <div className="text-green-400">VITE v5.0.0 <span className="text-[#858585]">ready in</span> 234 ms</div>
                  <div className="mt-1">➜ <span className="text-white">Local:</span>   <span className="text-cyan-400 underline">http://localhost:5173/</span></div>
                  <div>➜ <span className="text-white">Network:</span> use <span className="text-[#cccccc]">--host</span> to expose</div>
                  <div>➜ <span className="text-white">press</span> <span className="text-[#cccccc]">h + enter</span> to show help</div>
                </div>
                <div className="mt-2 text-green-400">➜ <span className="text-cyan-400">my-app</span> <span className="text-yellow-400">git:(</span><span className="text-red-400">main</span><span className="text-yellow-400">)</span> <span className="animate-pulse">█</span></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center h-6 px-2 text-xs text-white" style={{ backgroundColor: brand.accent }}>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <RefreshCw size={12} />
            <span>0↓ 0↑</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle size={12} />
            <span>0</span>
            <span className="text-yellow-300">⚠ 0</span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span>Ln {cursorPosition.line}, Col {cursorPosition.col}</span>
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
          <span>Prettier</span>
          <div className="flex items-center gap-1">
            <Sparkles size={12} />
            <span>AI</span>
          </div>
        </div>
      </div>

      {/* Context Menus */}
      <ContextMenu state={fileContextMenu.state} items={fileContextMenuItems} onClose={fileContextMenu.close} />
      <ContextMenu state={editorContextMenu.state} items={editorContextMenuItems} onClose={editorContextMenu.close} />
      <ContextMenu state={tabContextMenu.state} items={tabContextMenuItems} onClose={tabContextMenu.close} />
    </div>
  );
};

// ============================================================
// Search Panel Component
// ============================================================

interface SearchResult {
  file: string;
  path: string;
  matches: { line: number; content: string; column: number }[];
}

// Mock search results based on user's screenshot style
const mockSearchResults: SearchResult[] = [
  {
    file: 'App.tsx',
    path: 'src/App.tsx',
    matches: [
      { line: 5, content: "import { Button } from './components/Button';", column: 15 },
      { line: 12, content: "  const { user, login, logout } = useAuth();", column: 25 },
    ],
  },
  {
    file: 'Button.tsx',
    path: 'src/components/Button.tsx',
    matches: [
      { line: 1, content: "import React from 'react';", column: 8 },
      { line: 8, content: "  variant?: 'primary' | 'secondary' | 'danger';", column: 12 },
      { line: 15, content: "    <button className={`btn btn-${variant}`}>", column: 22 },
    ],
  },
  {
    file: 'useAuth.ts',
    path: 'src/hooks/useAuth.ts',
    matches: [
      { line: 1, content: "import { useState, useCallback } from 'react';", column: 20 },
    ],
  },
];

const SearchPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFiles, setExpandedFiles] = useState<Set<string>>(new Set(['src/App.tsx', 'src/components/Button.tsx']));
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Simulate search - in real app would search through files
      setResults(mockSearchResults);
    }
  };

  const toggleFile = (path: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  // Highlight search term in text
  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-purple-500/30 text-purple-300">{part}</span>
      ) : (
        part
      )
    );
  };

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);
  const totalFiles = results.length;

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
          Code Search
        </span>
        <div className="flex items-center gap-1">
          <Tooltip content="Refresh">
            <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
              <RefreshCw size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className="px-3 py-2 space-y-2">
        <div className="flex items-center bg-[#3c3c3c] rounded px-2">
          <Search size={14} className="text-[#858585]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search"
            className="flex-1 bg-transparent text-xs py-1.5 px-2 outline-none text-white placeholder:text-[#858585]"
          />
          <span className="text-[10px] text-[#666] px-1">Aa</span>
          <span className="text-[10px] text-[#666] px-1">ab</span>
          <span className="text-[10px] text-[#666] px-1">.*</span>
        </div>
      </div>

      {/* Results Summary */}
      {results.length > 0 && (
        <div className="px-3 py-1 text-xs text-[#858585]">
          {totalMatches} results in {totalFiles} files
        </div>
      )}

      {/* Search Results */}
      <div className="flex-1 overflow-auto px-2">
        {results.length === 0 ? (
          <div className="text-xs text-[#858585] py-4 text-center">
            {searchQuery ? 'No results found' : 'Enter search term and press Enter'}
          </div>
        ) : (
          <div className="space-y-1">
            {results.map(result => (
              <div key={result.path}>
                {/* File Header */}
                <button
                  onClick={() => toggleFile(result.path)}
                  className="flex items-center gap-1 w-full px-2 py-1 hover:bg-[#2a2d2e] rounded text-left"
                >
                  {expandedFiles.has(result.path) ? (
                    <ChevronDown size={14} />
                  ) : (
                    <ChevronRight size={14} />
                  )}
                  <FileCode size={14} className="text-blue-400" />
                  <span className="text-xs text-white flex-1 truncate">{result.file}</span>
                  <span className="w-5 h-5 flex items-center justify-center bg-[#3c3c3c] rounded-full text-[10px] text-[#cccccc]">
                    {result.matches.length}
                  </span>
                </button>

                {/* Match Lines */}
                {expandedFiles.has(result.path) && (
                  <div className="pl-6 space-y-0.5">
                    {result.matches.map((match, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer text-xs"
                      >
                        <span className="text-[#666] w-4 text-right shrink-0">{match.line}</span>
                        <span className="text-[#cccccc] truncate">
                          {highlightText(match.content, searchQuery)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

// ============================================================
// Diff Viewer Component
// ============================================================

interface DiffViewerProps {
  diff: FileDiff;
  mode?: 'split' | 'inline';
  onClose?: () => void;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ diff, mode = 'split', onClose }) => {
  const [viewMode, setViewMode] = useState<'split' | 'inline'>(mode);

  // For split view, we need to pair up lines
  const getSplitLines = () => {
    const pairs: { left: DiffLine | null; right: DiffLine | null }[] = [];
    let leftIdx = 0;
    let rightIdx = 0;

    const leftLines = diff.lines.filter(l => l.type === 'removed' || l.type === 'unchanged' || l.type === 'header');
    const rightLines = diff.lines.filter(l => l.type === 'added' || l.type === 'unchanged' || l.type === 'header');

    // Simple pairing - in real app, would use proper diff algorithm
    diff.lines.forEach((line) => {
      if (line.type === 'header') {
        pairs.push({ left: line, right: line });
      } else if (line.type === 'unchanged') {
        pairs.push({ left: line, right: line });
      } else if (line.type === 'removed') {
        pairs.push({ left: line, right: null });
      } else if (line.type === 'added') {
        // Try to pair with previous null right
        const lastPair = pairs[pairs.length - 1];
        if (lastPair && lastPair.right === null) {
          lastPair.right = line;
        } else {
          pairs.push({ left: null, right: line });
        }
      }
    });

    return pairs;
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 bg-[#252526] border-b border-[#404040]">
        <FileCode size={14} className="text-blue-400" />
        <span className="text-xs text-white">{diff.fileName}</span>
        <span className="text-xs text-green-400">+{diff.additions}</span>
        <span className="text-xs text-red-400">-{diff.deletions}</span>
        <div className="flex-1" />

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-[#3c3c3c] rounded p-0.5">
          <button
            onClick={() => setViewMode('split')}
            className={cn(
              "px-2 py-0.5 text-xs rounded transition-colors",
              viewMode === 'split'
                ? "bg-[#0e639c] text-white"
                : "text-[#858585] hover:text-white"
            )}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode('inline')}
            className={cn(
              "px-2 py-0.5 text-xs rounded transition-colors",
              viewMode === 'inline'
                ? "bg-[#0e639c] text-white"
                : "text-[#858585] hover:text-white"
            )}
          >
            Inline
          </button>
        </div>

        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-[#404040] rounded">
            <X size={14} />
          </button>
        )}
      </div>

      {/* Diff Content */}
      <div className="flex-1 overflow-auto font-mono text-xs">
        {viewMode === 'inline' ? (
          // Inline View
          <div className="flex">
            {/* Line Numbers */}
            <div className="flex flex-col bg-[#1e1e1e] border-r border-[#404040] select-none sticky left-0">
              {diff.lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex h-5 text-[#858585]",
                    line.type === 'added' && "bg-green-900/20",
                    line.type === 'removed' && "bg-red-900/20",
                    line.type === 'header' && "bg-blue-900/20"
                  )}
                >
                  <span className="w-10 text-right pr-2">
                    {line.oldLineNum || ''}
                  </span>
                  <span className="w-10 text-right pr-2 border-r border-[#404040]">
                    {line.newLineNum || ''}
                  </span>
                </div>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1">
              {diff.lines.map((line, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-5 flex items-center px-2",
                    line.type === 'added' && "bg-green-900/30 text-green-300",
                    line.type === 'removed' && "bg-red-900/30 text-red-300",
                    line.type === 'unchanged' && "text-[#d4d4d4]",
                    line.type === 'header' && "bg-blue-900/30 text-blue-300"
                  )}
                >
                  <span className="w-4 text-center mr-2">
                    {line.type === 'added' && '+'}
                    {line.type === 'removed' && '-'}
                  </span>
                  <span className="whitespace-pre">{line.content || '\u00A0'}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Split View
          <div className="flex">
            {/* Left Side (Old) */}
            <div className="flex-1 border-r border-[#404040]">
              <div className="flex">
                {/* Line Numbers */}
                <div className="flex flex-col bg-[#1e1e1e] border-r border-[#404040] select-none">
                  {getSplitLines().map((pair, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-5 w-10 text-right pr-2 text-[#858585]",
                        pair.left?.type === 'removed' && "bg-red-900/20",
                        pair.left?.type === 'header' && "bg-blue-900/20"
                      )}
                    >
                      {pair.left?.oldLineNum || ''}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {getSplitLines().map((pair, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-5 flex items-center px-2 whitespace-pre overflow-hidden",
                        pair.left?.type === 'removed' && "bg-red-900/30 text-red-300",
                        pair.left?.type === 'unchanged' && "text-[#d4d4d4]",
                        pair.left?.type === 'header' && "bg-blue-900/30 text-blue-300",
                        !pair.left && "bg-[#1a1a1a]"
                      )}
                    >
                      {pair.left?.type === 'removed' && (
                        <span className="w-4 text-center mr-2">-</span>
                      )}
                      {pair.left?.type !== 'removed' && pair.left && (
                        <span className="w-4 mr-2" />
                      )}
                      {pair.left?.content || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side (New) */}
            <div className="flex-1">
              <div className="flex">
                {/* Line Numbers */}
                <div className="flex flex-col bg-[#1e1e1e] border-r border-[#404040] select-none">
                  {getSplitLines().map((pair, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-5 w-10 text-right pr-2 text-[#858585]",
                        pair.right?.type === 'added' && "bg-green-900/20",
                        pair.right?.type === 'header' && "bg-blue-900/20"
                      )}
                    >
                      {pair.right?.newLineNum || ''}
                    </div>
                  ))}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {getSplitLines().map((pair, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-5 flex items-center px-2 whitespace-pre overflow-hidden",
                        pair.right?.type === 'added' && "bg-green-900/30 text-green-300",
                        pair.right?.type === 'unchanged' && "text-[#d4d4d4]",
                        pair.right?.type === 'header' && "bg-blue-900/30 text-blue-300",
                        !pair.right && "bg-[#1a1a1a]"
                      )}
                    >
                      {pair.right?.type === 'added' && (
                        <span className="w-4 text-center mr-2">+</span>
                      )}
                      {pair.right?.type !== 'added' && pair.right && (
                        <span className="w-4 mr-2" />
                      )}
                      {pair.right?.content || '\u00A0'}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// Git Panel Component with Timeline
// ============================================================

interface GitPanelProps {
  onOpenDiff?: () => void;
  commits?: GitCommitForDisplay[];
}

const GitPanel: React.FC<GitPanelProps> = ({ onOpenDiff, commits = [] }) => {
  // Use passed commits or fall back to empty array
  const gitCommits = commits;
  const [showTimeline, setShowTimeline] = useState(true);
  const [showChanges, setShowChanges] = useState(true);
  const [showStagedChanges, setShowStagedChanges] = useState(false);
  const [commitMessage, setCommitMessage] = useState('');

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2">
        <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
          Source Control
        </span>
        <div className="flex items-center gap-1">
          <Tooltip content="Commit">
            <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
              <Check size={16} />
            </button>
          </Tooltip>
          <Tooltip content="Refresh">
            <button className="p-1 hover:bg-[#3c3c3c] rounded text-[#c5c5c5]">
              <RefreshCw size={16} />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Commit Message Input */}
      <div className="px-3 py-2">
        <input
          type="text"
          value={commitMessage}
          onChange={(e) => setCommitMessage(e.target.value)}
          placeholder="Message (Ctrl+Enter to commit)"
          className="w-full bg-[#3c3c3c] text-xs py-1.5 px-2 rounded outline-none text-white placeholder:text-[#858585]"
        />
      </div>

      <div className="flex-1 overflow-auto px-2">
        {/* Changes Section */}
        <button
          onClick={() => setShowChanges(!showChanges)}
          className="flex items-center gap-1 w-full px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold hover:bg-[#2a2d2e] rounded"
        >
          {showChanges ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Changes</span>
          <span className="ml-auto text-[#858585]">2</span>
        </button>

        {showChanges && (
          <div className="pl-4 space-y-0.5">
            <div
              onClick={onOpenDiff}
              className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer group"
            >
              <span className="text-yellow-500 text-xs font-bold w-3">M</span>
              <FileCode size={14} className="text-blue-400" />
              <span className="text-xs flex-1 truncate">App.tsx</span>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Tooltip content="Discard Changes">
                  <button className="p-0.5 hover:bg-[#404040] rounded" onClick={(e) => e.stopPropagation()}>
                    <RotateCcw size={12} />
                  </button>
                </Tooltip>
                <Tooltip content="Stage Changes">
                  <button className="p-0.5 hover:bg-[#404040] rounded" onClick={(e) => e.stopPropagation()}>
                    <FilePlus size={12} />
                  </button>
                </Tooltip>
              </div>
            </div>
            <div
              onClick={onOpenDiff}
              className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer group"
            >
              <span className="text-green-500 text-xs font-bold w-3">A</span>
              <FileCode size={14} className="text-blue-400" />
              <span className="text-xs flex-1 truncate">Button.tsx</span>
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                <Tooltip content="Discard Changes">
                  <button className="p-0.5 hover:bg-[#404040] rounded" onClick={(e) => e.stopPropagation()}>
                    <RotateCcw size={12} />
                  </button>
                </Tooltip>
                <Tooltip content="Stage Changes">
                  <button className="p-0.5 hover:bg-[#404040] rounded" onClick={(e) => e.stopPropagation()}>
                    <FilePlus size={12} />
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        )}

        {/* Staged Changes Section */}
        <button
          onClick={() => setShowStagedChanges(!showStagedChanges)}
          className="flex items-center gap-1 w-full px-2 py-1 mt-2 text-xs text-[#bbbbbb] uppercase font-semibold hover:bg-[#2a2d2e] rounded"
        >
          {showStagedChanges ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          <span>Staged Changes</span>
          <span className="ml-auto text-[#858585]">0</span>
        </button>

        {/* Timeline Section */}
        <div className="mt-4 border-t border-[#404040] pt-2">
          <button
            onClick={() => setShowTimeline(!showTimeline)}
            className="flex items-center gap-1 w-full px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold hover:bg-[#2a2d2e] rounded"
          >
            {showTimeline ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            <History size={14} className="text-blue-400" />
            <span>Timeline</span>
            <span className="ml-auto text-[10px] text-[#666]">git log</span>
          </button>

          {showTimeline && (
            <div className="mt-1 space-y-0.5">
              {gitCommits.map((commit, index) => (
                <div
                  key={commit.hash}
                  className="relative group"
                >
                  {/* Timeline connector line */}
                  {index < gitCommits.length - 1 && (
                    <div className="absolute left-[17px] top-6 bottom-0 w-px bg-[#404040]" />
                  )}

                  <div className="flex items-start gap-2 px-2 py-1.5 hover:bg-[#2a2d2e] rounded cursor-pointer">
                    {/* Commit icon */}
                    <div className="relative z-10 flex-shrink-0 mt-0.5">
                      {commit.isMerge ? (
                        <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center">
                          <GitBranch size={10} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-[#3c3c3c] border border-[#666] flex items-center justify-center">
                          <GitCommit size={8} className="text-[#cccccc]" />
                        </div>
                      )}
                    </div>

                    {/* Commit info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-white truncate flex-1">
                          {commit.message}
                        </span>
                        {commit.branch && (
                          <span className="flex-shrink-0 px-1.5 py-0.5 bg-[#3c3c3c] text-[10px] text-blue-400 rounded">
                            {commit.branch}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#858585] font-mono">
                          {commit.shortHash}
                        </span>
                        <span className="text-[10px] text-[#666]">•</span>
                        <span className="text-[10px] text-[#858585]">
                          {commit.author}
                        </span>
                        <span className="text-[10px] text-[#666]">•</span>
                        <span className="text-[10px] text-[#666] flex items-center gap-1">
                          <Clock size={10} />
                          {commit.relativeDate}
                        </span>
                      </div>
                    </div>

                    {/* Actions (visible on hover) */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 flex-shrink-0">
                      <Tooltip content="View Commit">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <Eye size={12} className="text-[#858585]" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Copy Hash">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <Copy size={12} className="text-[#858585]" />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
              ))}

              {/* Load more button */}
              <button className="w-full px-2 py-2 text-xs text-[#858585] hover:text-white hover:bg-[#2a2d2e] rounded flex items-center justify-center gap-1">
                <RefreshCw size={12} />
                Load more commits...
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ============================================================
// Sub Components
// ============================================================

interface FileTreeProps {
  nodes: FileNode[];
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onOpenFile: (name: string, path: string, language: string) => void;
  activeFile: string;
  basePath: string;
  onContextMenu: (e: React.MouseEvent, node: FileNode, path: string) => void;
}

const FileTree: React.FC<FileTreeProps> = ({
  nodes, expandedFolders, onToggleFolder, onOpenFile, activeFile, basePath, onContextMenu
}) => {
  return (
    <div className="pl-2">
      {nodes.map(node => {
        const path = basePath ? `${basePath}/${node.name}` : node.name;
        const isExpanded = expandedFolders.has(path);

        if (node.type === 'folder') {
          return (
            <div key={path}>
              <button
                onClick={() => onToggleFolder(path)}
                onContextMenu={(e) => onContextMenu(e, node, path)}
                className="flex items-center gap-1 w-full px-1 py-0.5 hover:bg-[#2a2d2e] rounded text-left group"
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                {isExpanded ? <FolderOpen size={16} className="text-yellow-500" /> : <Folder size={16} className="text-yellow-500" />}
                <span className="text-xs">{node.name}</span>
              </button>
              {isExpanded && node.children && (
                <FileTree
                  nodes={node.children}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
                  onOpenFile={onOpenFile}
                  activeFile={activeFile}
                  basePath={path}
                  onContextMenu={onContextMenu}
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={path}
            onClick={() => onOpenFile(node.name, path, node.language || 'text')}
            onContextMenu={(e) => onContextMenu(e, node, path)}
            className={cn(
              "flex items-center gap-1 w-full px-1 py-0.5 rounded text-left pl-6 group",
              activeFile === node.name ? "bg-[#094771]" : "hover:bg-[#2a2d2e]"
            )}
          >
            <FileIcon language={node.language} />
            <span className="text-xs">{node.name}</span>
          </button>
        );
      })}
    </div>
  );
};

const FileIcon: React.FC<{ language?: string }> = ({ language }) => {
  const iconMap: Record<string, { color: string }> = {
    typescript: { color: 'text-blue-400' },
    json: { color: 'text-yellow-400' },
    css: { color: 'text-pink-400' },
    html: { color: 'text-orange-400' },
    markdown: { color: 'text-blue-300' },
  };
  const config = iconMap[language || ''] || { color: 'text-[#858585]' };

  if (language === 'json') return <FileJson size={16} className={config.color} />;
  if (language === 'typescript') return <FileCode size={16} className={config.color} />;
  if (language === 'css') return <FileCode size={16} className={config.color} />;
  if (language === 'markdown') return <FileText size={16} className={config.color} />;
  return <FileText size={16} className={config.color} />;
};

interface CodeEditorProps {
  content: string;
  language: string;
  onCursorChange?: (pos: { line: number; col: number }) => void;
}

// 检测可折叠区域
function detectFoldableRegions(lines: string[]): Map<number, number> {
  const regions = new Map<number, number>(); // startLine -> endLine
  const stack: { line: number; char: string }[] = [];

  lines.forEach((line, i) => {
    // 检测 import 块的开始
    if (line.trim().startsWith('import ') && !line.includes(';')) {
      // 多行 import
      let endLine = i;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].includes(';') || lines[j].includes('from')) {
          endLine = j;
          break;
        }
      }
      if (endLine > i) {
        regions.set(i, endLine);
      }
    }

    // 检测花括号
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '{' || char === '[' || char === '(') {
        stack.push({ line: i, char });
      } else if (char === '}' || char === ']' || char === ')') {
        const last = stack.pop();
        if (last && last.line < i) {
          // 只折叠跨越多行的块
          regions.set(last.line, i);
        }
      }
    }
  });

  return regions;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ content, language, onCursorChange }) => {
  const lines = content.split('\n');
  const [activeLine, setActiveLine] = useState(1);
  const [foldedRegions, setFoldedRegions] = useState<Set<number>>(new Set());

  // 检测可折叠区域
  const foldableRegions = React.useMemo(() => detectFoldableRegions(lines), [lines]);

  const handleLineClick = (lineNum: number) => {
    setActiveLine(lineNum);
    onCursorChange?.({ line: lineNum, col: 1 });
  };

  const toggleFold = (lineNum: number) => {
    setFoldedRegions(prev => {
      const next = new Set(prev);
      if (next.has(lineNum)) {
        next.delete(lineNum);
      } else {
        next.add(lineNum);
      }
      return next;
    });
  };

  // 计算哪些行应该被隐藏
  const hiddenLines = React.useMemo(() => {
    const hidden = new Set<number>();
    foldedRegions.forEach(startLine => {
      const endLine = foldableRegions.get(startLine);
      if (endLine !== undefined) {
        for (let i = startLine + 1; i <= endLine; i++) {
          hidden.add(i);
        }
      }
    });
    return hidden;
  }, [foldedRegions, foldableRegions]);

  return (
    <div className="flex text-xs leading-5 font-mono">
      {/* Fold Indicators + Line Numbers */}
      <div className="flex py-2 text-[#858585] select-none bg-[#1e1e1e] border-r border-[#404040] sticky left-0">
        {/* Fold Column */}
        <div className="w-4 flex flex-col items-center">
          {lines.map((_, i) => {
            if (hiddenLines.has(i)) return null;
            const isFoldable = foldableRegions.has(i);
            const isFolded = foldedRegions.has(i);

            return (
              <div key={i} className="h-5 flex items-center justify-center">
                {isFoldable && (
                  <button
                    onClick={() => toggleFold(i)}
                    className="w-3 h-3 flex items-center justify-center hover:bg-[#3c3c3c] rounded text-[10px]"
                  >
                    {isFolded ? '▶' : '▼'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {/* Line Numbers */}
        <div className="flex flex-col items-end pr-2 pl-1">
          {lines.map((_, i) => {
            if (hiddenLines.has(i)) return null;
            return (
              <div
                key={i}
                onClick={() => handleLineClick(i + 1)}
                className={cn(
                  "h-5 cursor-pointer hover:text-white px-1 flex items-center",
                  activeLine === i + 1 && "text-white"
                )}
              >
                {i + 1}
              </div>
            );
          })}
        </div>
      </div>
      {/* Code Content */}
      <pre className="flex-1 p-2 overflow-x-auto">
        <code className="text-[#d4d4d4]">
          {lines.map((line, i) => {
            if (hiddenLines.has(i)) return null;

            const isFolded = foldedRegions.has(i);
            const foldedLinesCount = isFolded
              ? (foldableRegions.get(i) || i) - i
              : 0;

            return (
              <div
                key={i}
                onClick={() => handleLineClick(i + 1)}
                className={cn(
                  "h-5 hover:bg-[#2a2d2e] cursor-text flex items-center",
                  activeLine === i + 1 && "bg-[#2a2d2e] border-l-2 border-[#ffcc00] -ml-0.5 pl-0.5"
                )}
              >
                <SyntaxHighlight line={line} />
                {isFolded && (
                  <span className="ml-1 px-1 py-0.5 bg-[#3c3c3c] text-[#858585] rounded text-[10px]">
                    ... {foldedLinesCount} lines
                  </span>
                )}
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
};

const SyntaxHighlight: React.FC<{ line: string }> = ({ line }) => {
  // Enhanced syntax highlighting
  let highlighted = line
    // Keywords
    .replace(/\b(import|export|from|const|let|var|function|return|if|else|async|await|interface|type|extends|implements|class|new|this|try|catch|finally|throw|default)\b/g,
      '<span class="text-purple-400">$1</span>')
    // Strings
    .replace(/('.*?'|".*?"|`[^`]*`)/g, '<span class="text-orange-300">$1</span>')
    // Comments
    .replace(/(\/\/.*$)/g, '<span class="text-green-600">$1</span>')
    // JSX tags
    .replace(/(&lt;\/?[A-Z][a-zA-Z]*)/g, '<span class="text-blue-400">$1</span>')
    .replace(/(<\/?[A-Z][a-zA-Z]*)/g, '<span class="text-blue-400">$1</span>')
    // React/hooks
    .replace(/\b(React|useState|useCallback|useEffect|useMemo|useRef|useContext)\b/g,
      '<span class="text-cyan-400">$1</span>')
    // Types/Interfaces
    .replace(/:\s*([A-Z][a-zA-Z<>[\]|]+)/g, ': <span class="text-green-400">$1</span>')
    // Numbers
    .replace(/\b(\d+)\b/g, '<span class="text-green-300">$1</span>')
    // Brackets - be careful not to double-replace
    .replace(/([{}()[\]])/g, '<span class="text-yellow-300">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted || '\u00A0' }} />;
};

const ChatBubble: React.FC<{ message: ChatMessage; appName?: string }> = ({ message, appName = 'Cursor' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "rounded-lg p-3",
      message.role === 'user' ? "bg-[#3c3c3c]" : "bg-[#2d2d30]"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {message.role === 'user' ? (
          <User size={14} className="text-blue-400" />
        ) : (
          <Sparkles size={14} className="text-purple-400" />
        )}
        <span className="text-[10px] text-[#858585]">
          {message.role === 'user' ? 'You' : appName}
        </span>
        <span className="text-[10px] text-[#858585]">{message.timestamp}</span>
        <div className="flex-1" />
        <Tooltip content={copied ? 'Copied!' : 'Copy'}>
          <button onClick={handleCopy} className="p-1 hover:bg-[#404040] rounded">
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
          </button>
        </Tooltip>
      </div>
      <div className="text-xs whitespace-pre-wrap leading-relaxed">{message.content}</div>
      {message.role === 'assistant' && message.content.includes('```') && (
        <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#404040]">
          <button className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors">
            Apply
          </button>
          <button className="px-2 py-1 text-xs bg-[#3c3c3c] text-[#cccccc] rounded hover:bg-[#4c4c4c] transition-colors">
            Copy Code
          </button>
          <button className="px-2 py-1 text-xs bg-[#3c3c3c] text-[#cccccc] rounded hover:bg-[#4c4c4c] transition-colors">
            Insert at Cursor
          </button>
        </div>
      )}
    </div>
  );
};

// ============================================================
// Chat Panel Component (Enhanced)
// ============================================================

interface ChatPanelProps {
  onClose: () => void;
  appType: 'cursor' | 'antigravity' | 'windsurf';
  width?: number;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose, appType, width = 320 }) => {
  const [activeTab, setActiveTab] = useState<'chat' | 'composer' | 'history'>('chat');
  const [attachedFiles, setAttachedFiles] = useState<string[]>(['App.tsx']);
  const [inputValue, setInputValue] = useState('');
  const [showCommands, setShowCommands] = useState(false);
  const [showMentions, setShowMentions] = useState(false);

  const appNames = {
    cursor: 'Cursor',
    antigravity: 'Antigravity',
    windsurf: 'Windsurf',
  };

  const commands = [
    { cmd: '/edit', desc: 'Edit selected code' },
    { cmd: '/explain', desc: 'Explain code' },
    { cmd: '/fix', desc: 'Fix errors' },
    { cmd: '/test', desc: 'Generate tests' },
    { cmd: '/docs', desc: 'Add documentation' },
    { cmd: '/refactor', desc: 'Refactor code' },
  ];

  const mentionFiles = [
    { name: 'App.tsx', path: 'src/App.tsx' },
    { name: 'Button.tsx', path: 'src/components/Button.tsx' },
    { name: 'useAuth.ts', path: 'src/hooks/useAuth.ts' },
    { name: 'package.json', path: 'package.json' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    // Check for / commands
    if (value.endsWith('/') || (value.includes('/') && !value.includes(' '))) {
      setShowCommands(true);
      setShowMentions(false);
    }
    // Check for @ mentions
    else if (value.endsWith('@') || (value.includes('@') && value.slice(value.lastIndexOf('@')).indexOf(' ') === -1)) {
      setShowMentions(true);
      setShowCommands(false);
    } else {
      setShowCommands(false);
      setShowMentions(false);
    }
  };

  const selectCommand = (cmd: string) => {
    setInputValue(cmd + ' ');
    setShowCommands(false);
  };

  const selectMention = (file: { name: string; path: string }) => {
    setInputValue(prev => prev.replace(/@[^@]*$/, `@${file.name} `));
    if (!attachedFiles.includes(file.name)) {
      setAttachedFiles(prev => [...prev, file.name]);
    }
    setShowMentions(false);
  };

  const removeAttachedFile = (name: string) => {
    setAttachedFiles(prev => prev.filter(f => f !== name));
  };

  return (
    <div
      className="bg-[#252526] border-l border-[#1e1e1e] flex flex-col"
      style={{ width }}
    >
      {/* Header with tabs */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-1">
          {[
            { id: 'chat', label: 'Chat', icon: MessageSquare },
            { id: 'composer', label: 'Composer', icon: Wand2 },
            { id: 'history', label: 'History', icon: RotateCcw },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 text-xs rounded transition-colors",
                activeTab === tab.id
                  ? "bg-[#3c3c3c] text-white"
                  : "text-[#858585] hover:text-white"
              )}
            >
              <tab.icon size={12} />
              {tab.label}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="p-1 hover:bg-[#404040] rounded">
          <X size={14} />
        </button>
      </div>

      {/* Attached Files */}
      {attachedFiles.length > 0 && (
        <div className="flex items-center gap-1 px-3 py-2 border-b border-[#1e1e1e] flex-wrap">
          <span className="text-[10px] text-[#858585] uppercase">Context:</span>
          {attachedFiles.map(file => (
            <div
              key={file}
              className="flex items-center gap-1 px-1.5 py-0.5 bg-[#3c3c3c] rounded text-[10px] text-[#cccccc]"
            >
              <FileCode size={10} className="text-blue-400" />
              {file}
              <button
                onClick={() => removeAttachedFile(file)}
                className="hover:text-white ml-1"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Chat Content */}
      <div className="flex-1 overflow-auto p-3 space-y-4">
        {activeTab === 'chat' && mockChatHistory.map(msg => (
          <ChatBubble key={msg.id} message={msg} appName={appNames[appType]} />
        ))}
        {activeTab === 'composer' && (
          <div className="text-center py-8">
            <Wand2 size={32} className="mx-auto text-purple-400 mb-3" />
            <p className="text-xs text-[#858585] mb-2">Composer Mode</p>
            <p className="text-[10px] text-[#666]">
              Multi-file editing with AI agents.
              <br />
              Describe what you want to build.
            </p>
          </div>
        )}
        {activeTab === 'history' && (
          <div className="space-y-2">
            {[
              { title: 'Created Button component', time: '2h ago' },
              { title: 'Fixed useAuth hook', time: '3h ago' },
              { title: 'Added form validation', time: 'Yesterday' },
            ].map((item, i) => (
              <div key={i} className="p-2 hover:bg-[#2a2d2e] rounded cursor-pointer">
                <div className="text-xs text-white">{item.title}</div>
                <div className="text-[10px] text-[#858585]">{item.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-[#1e1e1e] relative">
        {/* Commands dropdown */}
        {showCommands && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#2d2d30] border border-[#454545] rounded-lg shadow-lg overflow-hidden">
            {commands.map(cmd => (
              <button
                key={cmd.cmd}
                onClick={() => selectCommand(cmd.cmd)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#094771] text-left"
              >
                <span className="text-purple-400 font-mono">{cmd.cmd}</span>
                <span className="text-[#858585]">{cmd.desc}</span>
              </button>
            ))}
          </div>
        )}

        {/* Mentions dropdown */}
        {showMentions && (
          <div className="absolute bottom-full left-3 right-3 mb-1 bg-[#2d2d30] border border-[#454545] rounded-lg shadow-lg overflow-hidden">
            {mentionFiles.map(file => (
              <button
                key={file.path}
                onClick={() => selectMention(file)}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-[#094771] text-left"
              >
                <FileCode size={14} className="text-blue-400" />
                <span className="text-white">{file.name}</span>
                <span className="text-[#666] text-[10px]">{file.path}</span>
              </button>
            ))}
          </div>
        )}

        <div className="text-xs text-[#858585] mb-2 flex items-center gap-2">
          <span className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-[10px]">@</span>
          <span className="text-[10px]">mention</span>
          <span className="px-1.5 py-0.5 bg-[#3c3c3c] rounded text-[10px]">/</span>
          <span className="text-[10px]">commands</span>
        </div>

        <div className="flex items-center gap-2 bg-[#3c3c3c] rounded-lg px-3 py-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask anything... (Ctrl+L)"
            className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-[#858585]"
          />
          <Tooltip content="Send">
            <button className="p-1 hover:bg-[#4c4c4c] rounded text-[#858585] hover:text-purple-400">
              <Sparkles size={16} />
            </button>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <select className="bg-[#3c3c3c] text-xs text-[#cccccc] rounded px-2 py-1 outline-none border border-[#555] flex-1">
            <option>Claude 3.5 Sonnet</option>
            <option>Claude 3 Opus</option>
            <option>GPT-4o</option>
            <option>GPT-4 Turbo</option>
          </select>
          <Tooltip content="Agent Mode: AI can edit multiple files">
            <button className="px-2 py-1 text-xs bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition-colors flex items-center gap-1">
              <Bot size={12} />
              Agent
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CursorApp;
