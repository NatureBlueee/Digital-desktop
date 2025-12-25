/**
 * CursorApp - VS Code 风格的 IDE 界面
 *
 * 更新日志:
 * - 2025-12-25: 添加完整菜单栏、右键菜单、Tooltip
 * - 集成 MenuBar, ContextMenu, Tooltip 组件
 */

import React, { useState, useCallback } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { MenuBar, type MenuItemData } from '@/components/ui/Menu';
import { ContextMenu, useContextMenu, type ContextMenuItemData } from '@/components/ui/ContextMenu';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  Files,
  Search,
  GitBranch,
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
        <div className="w-60 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
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
                    nodes={mockFileTree}
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
            <>
              <div className="flex items-center justify-between px-4 py-2">
                <span className="text-xs text-[#bbbbbb] uppercase tracking-wider font-semibold">
                  Search
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
                    placeholder="Search"
                    className="flex-1 bg-transparent text-xs py-1.5 px-2 outline-none text-white placeholder:text-[#858585]"
                  />
                </div>
                <div className="flex items-center bg-[#3c3c3c] rounded px-2">
                  <Replace size={14} className="text-[#858585]" />
                  <input
                    type="text"
                    placeholder="Replace"
                    className="flex-1 bg-transparent text-xs py-1.5 px-2 outline-none text-white placeholder:text-[#858585]"
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-[#858585]">
                  <button className="p-1 hover:bg-[#3c3c3c] rounded" title="Match Case">Aa</button>
                  <button className="p-1 hover:bg-[#3c3c3c] rounded" title="Match Whole Word">Ab</button>
                  <button className="p-1 hover:bg-[#3c3c3c] rounded" title="Use Regular Expression">.*</button>
                </div>
              </div>
              <div className="flex-1 overflow-auto px-3">
                <div className="text-xs text-[#858585] py-4 text-center">
                  Enter search term and press Enter
                </div>
              </div>
            </>
          )}

          {/* Git Panel */}
          {activeSidebarTab === 'git' && (
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
              <div className="px-3 py-2">
                <input
                  type="text"
                  placeholder="Message (Ctrl+Enter to commit)"
                  className="w-full bg-[#3c3c3c] text-xs py-1.5 px-2 rounded outline-none text-white placeholder:text-[#858585]"
                />
              </div>
              <div className="flex-1 overflow-auto px-2">
                <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronDown size={16} />
                  <span>Changes</span>
                  <span className="ml-auto text-[#858585]">2</span>
                </div>
                <div className="pl-4 space-y-0.5">
                  <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer group">
                    <span className="text-yellow-500 text-xs font-bold w-3">M</span>
                    <FileCode size={14} className="text-blue-400" />
                    <span className="text-xs flex-1 truncate">App.tsx</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <Tooltip content="Discard Changes">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <RotateCcw size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Stage Changes">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <FilePlus size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1 hover:bg-[#2a2d2e] rounded cursor-pointer group">
                    <span className="text-green-500 text-xs font-bold w-3">A</span>
                    <FileCode size={14} className="text-blue-400" />
                    <span className="text-xs flex-1 truncate">Button.tsx</span>
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1">
                      <Tooltip content="Discard Changes">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <RotateCcw size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Stage Changes">
                        <button className="p-0.5 hover:bg-[#404040] rounded">
                          <FilePlus size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 mt-2 text-xs text-[#bbbbbb] uppercase font-semibold">
                  <ChevronRight size={16} />
                  <span>Staged Changes</span>
                  <span className="ml-auto text-[#858585]">0</span>
                </div>
              </div>
            </>
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
            <div
              className="flex-1 overflow-auto bg-[#1e1e1e]"
              onContextMenu={handleEditorContextMenu}
            >
              {activeTab && (
                <CodeEditor
                  content={mockFileContents[activeTab] || '// File not found'}
                  language={openTabs.find(t => t.name === activeTab)?.language || 'text'}
                  onCursorChange={setCursorPosition}
                />
              )}
            </div>

            {/* Chat Panel */}
            {showChat && (
              <ChatPanel onClose={() => setShowChat(false)} appType={appType} />
            )}
          </div>

          {/* Terminal Panel */}
          {showTerminal && (
            <div className="h-48 bg-[#1e1e1e] border-t border-[#414141]">
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

const CodeEditor: React.FC<CodeEditorProps> = ({ content, language, onCursorChange }) => {
  const lines = content.split('\n');
  const [activeLine, setActiveLine] = useState(1);

  const handleLineClick = (lineNum: number) => {
    setActiveLine(lineNum);
    onCursorChange?.({ line: lineNum, col: 1 });
  };

  return (
    <div className="flex text-xs leading-5 font-mono">
      {/* Line Numbers */}
      <div className="flex flex-col items-end pr-4 pl-4 py-2 text-[#858585] select-none bg-[#1e1e1e] border-r border-[#404040] sticky left-0">
        {lines.map((_, i) => (
          <div
            key={i}
            onClick={() => handleLineClick(i + 1)}
            className={cn(
              "cursor-pointer hover:text-white px-1",
              activeLine === i + 1 && "text-white"
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>
      {/* Code Content */}
      <pre className="flex-1 p-2 overflow-x-auto">
        <code className="text-[#d4d4d4]">
          {lines.map((line, i) => (
            <div
              key={i}
              onClick={() => handleLineClick(i + 1)}
              className={cn(
                "hover:bg-[#2a2d2e] cursor-text",
                activeLine === i + 1 && "bg-[#2a2d2e] border-l-2 border-[#ffcc00] -ml-0.5 pl-0.5"
              )}
            >
              <SyntaxHighlight line={line} />
            </div>
          ))}
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
}

const ChatPanel: React.FC<ChatPanelProps> = ({ onClose, appType }) => {
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
    <div className="w-80 bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
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
