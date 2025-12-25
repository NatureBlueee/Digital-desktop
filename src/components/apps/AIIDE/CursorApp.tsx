import React, { useState } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
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
  Split,
  MoreHorizontal,
  Play,
  Terminal as TerminalIcon,
  MessageSquare,
  Sparkles,
  Bot,
  Copy,
  Check,
} from 'lucide-react';

interface IDEAppProps {
  windowId: string;
  appType: 'cursor' | 'antigravity' | 'windsurf';
}

// Mock file tree data
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

// Mock file contents
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

// Mock chat history
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
}

export const CursorApp: React.FC<IDEAppProps> = ({ windowId, appType }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();
  const [activeTab, setActiveTab] = useState<string>('App.tsx');
  const [openTabs, setOpenTabs] = useState<OpenTab[]>([
    { name: 'App.tsx', path: 'src/App.tsx', language: 'typescript' },
  ]);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [showChat, setShowChat] = useState(true);
  const [showTerminal, setShowTerminal] = useState(true);
  const [activeSidebarTab, setActiveSidebarTab] = useState<'files' | 'search' | 'git'>('files');

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const openFile = (name: string, path: string, language: string) => {
    if (!openTabs.find(t => t.path === path)) {
      setOpenTabs([...openTabs, { name, path, language }]);
    }
    setActiveTab(name);
  };

  const closeTab = (name: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newTabs = openTabs.filter(t => t.name !== name);
    setOpenTabs(newTabs);
    if (activeTab === name && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].name);
    }
  };

  const brandColors = {
    cursor: { primary: 'rgb(99, 102, 241)', bg: 'from-indigo-600/20' },
    antigravity: { primary: 'rgb(168, 85, 247)', bg: 'from-purple-600/20' },
    windsurf: { primary: 'rgb(6, 182, 212)', bg: 'from-cyan-600/20' },
  };

  const brand = brandColors[appType];

  return (
    <div className="flex flex-col h-full w-full bg-[#1e1e1e] text-[#cccccc] font-mono text-sm overflow-hidden rounded-lg">
      {/* Title Bar */}
      <div className="flex items-center h-8 bg-[#323233] px-2 drag-handle">
        <div className="flex items-center gap-2 flex-1">
          <img
            src={appType === 'cursor' ? '/icons/cursor-ai-code-icon.svg' : '/icons/antigravity.png'}
            className="w-4 h-4"
            alt=""
          />
          <span className="text-xs text-[#cccccc]">
            {appType === 'cursor' ? 'Cursor' : appType === 'antigravity' ? 'Antigravity' : 'Windsurf'} - my-app
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => minimizeWindow(windowId)} className="p-1 hover:bg-[#404040] rounded">
            <Minus size={14} />
          </button>
          <button onClick={() => maximizeWindow(windowId)} className="p-1 hover:bg-[#404040] rounded">
            <Square size={10} />
          </button>
          <button onClick={() => closeWindow(windowId)} className="p-1 hover:bg-red-500 rounded">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="flex items-center h-7 bg-[#323233] px-2 text-xs border-b border-[#252526]">
        {['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'].map(item => (
          <button key={item} className="px-2 py-1 hover:bg-[#404040] rounded">
            {item}
          </button>
        ))}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#333333] flex flex-col items-center py-2 border-r border-[#252526]">
          <button
            onClick={() => setActiveSidebarTab('files')}
            className={cn(
              "p-2 rounded mb-1",
              activeSidebarTab === 'files' ? 'bg-[#404040] text-white' : 'text-[#858585] hover:text-white'
            )}
          >
            <Files size={24} />
          </button>
          <button
            onClick={() => setActiveSidebarTab('search')}
            className={cn(
              "p-2 rounded mb-1",
              activeSidebarTab === 'search' ? 'bg-[#404040] text-white' : 'text-[#858585] hover:text-white'
            )}
          >
            <Search size={24} />
          </button>
          <button
            onClick={() => setActiveSidebarTab('git')}
            className={cn(
              "p-2 rounded mb-1",
              activeSidebarTab === 'git' ? 'bg-[#404040] text-white' : 'text-[#858585] hover:text-white'
            )}
          >
            <GitBranch size={24} />
          </button>
          <button className="p-2 rounded mb-1 text-[#858585] hover:text-white">
            <Bug size={24} />
          </button>
          <button className="p-2 rounded mb-1 text-[#858585] hover:text-white">
            <Blocks size={24} />
          </button>
          <div className="flex-1" />
          <button className="p-2 rounded mb-1 text-[#858585] hover:text-white">
            <User size={24} />
          </button>
          <button className="p-2 rounded text-[#858585] hover:text-white">
            <Settings size={24} />
          </button>
        </div>

        {/* Sidebar - File Explorer */}
        <div className="w-60 bg-[#252526] flex flex-col border-r border-[#1e1e1e]">
          <div className="px-4 py-2 text-xs text-[#bbbbbb] uppercase tracking-wider">
            Explorer
          </div>
          <div className="flex-1 overflow-auto">
            <div className="px-2">
              <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#bbbbbb] uppercase">
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
              />
            </div>
          </div>
        </div>

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tabs */}
          <div className="flex items-center h-9 bg-[#252526] overflow-x-auto">
            {openTabs.map(tab => (
              <div
                key={tab.path}
                onClick={() => setActiveTab(tab.name)}
                className={cn(
                  "flex items-center gap-2 px-3 h-full border-r border-[#1e1e1e] cursor-pointer min-w-0",
                  activeTab === tab.name
                    ? 'bg-[#1e1e1e] text-white'
                    : 'bg-[#2d2d2d] text-[#969696] hover:bg-[#2a2a2a]'
                )}
              >
                <FileIcon language={tab.language} />
                <span className="truncate text-xs">{tab.name}</span>
                <button
                  onClick={(e) => closeTab(tab.name, e)}
                  className="p-0.5 hover:bg-[#404040] rounded opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>

          {/* Editor Content */}
          <div className="flex-1 flex overflow-hidden">
            <div className="flex-1 overflow-auto bg-[#1e1e1e]">
              {activeTab && (
                <CodeEditor
                  content={mockFileContents[activeTab] || '// File not found'}
                  language={openTabs.find(t => t.name === activeTab)?.language || 'text'}
                />
              )}
            </div>

            {/* Chat Panel */}
            {showChat && (
              <div className="w-80 bg-[#252526] border-l border-[#1e1e1e] flex flex-col">
                <div className="flex items-center justify-between px-3 py-2 border-b border-[#1e1e1e]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-purple-400" />
                    <span className="text-xs font-medium">AI Chat</span>
                  </div>
                  <button onClick={() => setShowChat(false)} className="p-1 hover:bg-[#404040] rounded">
                    <X size={14} />
                  </button>
                </div>
                <div className="flex-1 overflow-auto p-3 space-y-4">
                  {mockChatHistory.map(msg => (
                    <ChatBubble key={msg.id} message={msg} />
                  ))}
                </div>
                <div className="p-3 border-t border-[#1e1e1e]">
                  <div className="flex items-center gap-2 bg-[#3c3c3c] rounded-lg px-3 py-2">
                    <input
                      type="text"
                      placeholder="Ask anything... (Ctrl+L)"
                      className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <Bot size={16} className="text-[#858585]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Terminal Panel */}
          {showTerminal && (
            <div className="h-48 bg-[#1e1e1e] border-t border-[#414141]">
              <div className="flex items-center h-8 bg-[#252526] px-2 border-b border-[#414141]">
                <button className="flex items-center gap-1 px-2 py-1 text-xs bg-[#1e1e1e] rounded-t border-t border-l border-r border-[#414141]">
                  <TerminalIcon size={12} />
                  Terminal
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#858585] hover:text-white">
                  Problems
                </button>
                <button className="flex items-center gap-1 px-2 py-1 text-xs text-[#858585] hover:text-white">
                  Output
                </button>
                <div className="flex-1" />
                <button onClick={() => setShowTerminal(false)} className="p-1 hover:bg-[#404040] rounded">
                  <X size={14} />
                </button>
              </div>
              <div className="p-2 font-mono text-xs">
                <div className="text-green-400">➜ my-app</div>
                <div className="text-[#cccccc]">$ npm run dev</div>
                <div className="text-[#858585] mt-1">
                  <div>VITE v5.0.0 ready in 234 ms</div>
                  <div className="mt-1">➜ Local: <span className="text-cyan-400">http://localhost:5173/</span></div>
                  <div>➜ Network: use --host to expose</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center h-6 bg-[#007acc] px-2 text-xs text-white">
        <div className="flex items-center gap-2">
          <GitBranch size={12} />
          <span>main</span>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
          <span>Prettier</span>
        </div>
      </div>
    </div>
  );
};

// File Tree Component
const FileTree: React.FC<{
  nodes: FileNode[];
  expandedFolders: Set<string>;
  onToggleFolder: (path: string) => void;
  onOpenFile: (name: string, path: string, language: string) => void;
  activeFile: string;
  basePath: string;
}> = ({ nodes, expandedFolders, onToggleFolder, onOpenFile, activeFile, basePath }) => {
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
                className="flex items-center gap-1 w-full px-1 py-0.5 hover:bg-[#2a2d2e] rounded text-left"
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
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={path}
            onClick={() => onOpenFile(node.name, path, node.language || 'text')}
            className={cn(
              "flex items-center gap-1 w-full px-1 py-0.5 rounded text-left pl-6",
              activeFile === node.name ? 'bg-[#094771]' : 'hover:bg-[#2a2d2e]'
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

// File Icon Component
const FileIcon: React.FC<{ language?: string }> = ({ language }) => {
  switch (language) {
    case 'typescript':
      return <FileCode size={16} className="text-blue-400" />;
    case 'json':
      return <FileJson size={16} className="text-yellow-400" />;
    case 'css':
      return <FileCode size={16} className="text-pink-400" />;
    case 'markdown':
      return <FileText size={16} className="text-blue-300" />;
    default:
      return <FileText size={16} className="text-[#858585]" />;
  }
};

// Code Editor Component
const CodeEditor: React.FC<{ content: string; language: string }> = ({ content, language }) => {
  const lines = content.split('\n');

  return (
    <div className="flex text-xs leading-5">
      {/* Line Numbers */}
      <div className="flex flex-col items-end pr-4 pl-4 py-2 text-[#858585] select-none bg-[#1e1e1e] border-r border-[#404040]">
        {lines.map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      {/* Code Content */}
      <pre className="flex-1 p-2 overflow-x-auto">
        <code className="text-[#d4d4d4]">
          {lines.map((line, i) => (
            <div key={i} className="hover:bg-[#2a2d2e]">
              <SyntaxHighlight line={line} language={language} />
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

// Simple Syntax Highlighting
const SyntaxHighlight: React.FC<{ line: string; language: string }> = ({ line, language }) => {
  // Very basic highlighting
  let highlighted = line
    .replace(/(import|export|from|const|let|var|function|return|if|else|async|await|interface|type|extends|implements)/g, '<span class="text-purple-400">$1</span>')
    .replace(/('.*?'|".*?"|`.*?`)/g, '<span class="text-orange-300">$1</span>')
    .replace(/(\/\/.*$)/g, '<span class="text-green-600">$1</span>')
    .replace(/(\{|\}|\(|\)|\[|\])/g, '<span class="text-yellow-300">$1</span>')
    .replace(/(React|useState|useCallback|useEffect)/g, '<span class="text-cyan-400">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: highlighted || '&nbsp;' }} />;
};

// Chat Bubble Component
const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "rounded-lg p-3",
      message.role === 'user' ? 'bg-[#3c3c3c]' : 'bg-[#2d2d30]'
    )}>
      <div className="flex items-center gap-2 mb-2">
        {message.role === 'user' ? (
          <User size={14} className="text-blue-400" />
        ) : (
          <Sparkles size={14} className="text-purple-400" />
        )}
        <span className="text-xs text-[#858585]">{message.timestamp}</span>
        <div className="flex-1" />
        <button onClick={handleCopy} className="p-1 hover:bg-[#404040] rounded">
          {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
        </button>
      </div>
      <div className="text-xs whitespace-pre-wrap">{message.content}</div>
    </div>
  );
};

export default CursorApp;
