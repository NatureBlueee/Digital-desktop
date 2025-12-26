/**
 * AntigravityApp - Antigravity AI IDE 界面
 *
 * 特点:
 * - 双面设计: Editor View + Manager View
 * - Artifacts 系统
 * - 独特的深色主题配色 (青绿色调)
 *
 * 更新日志:
 * - 2025-12-25: 初始版本
 */

import React, { useState, useCallback } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { MenuBar, type MenuItemData } from '@/components/ui/Menu';
import { ContextMenu, useContextMenu, type ContextMenuItemData } from '@/components/ui/ContextMenu';
import { Tooltip } from '@/components/ui/Tooltip';
import { useShowcaseProject } from './useShowcaseProject';
import {
  Files,
  Search,
  GitBranch,
  Settings,
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
  Sparkles,
  Bot,
  Copy,
  Check,
  FilePlus,
  FolderPlus,
  Trash2,
  Pencil,
  RefreshCw,
  RotateCcw,
  Scissors,
  Clipboard,
  MessageSquare,
  Wand2,
  Play,
  Layers,
  Layout,
  Code,
  Eye,
  Download,
  ExternalLink,
  MoreHorizontal,
  Zap,
  Box,
  Image,
  FileType,
  Globe,
} from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface AntigravityAppProps {
  windowId: string;
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

interface Artifact {
  id: string;
  type: 'code' | 'image' | 'document' | 'component' | 'website';
  name: string;
  preview?: string;
  language?: string;
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
          { name: 'Header.tsx', type: 'file', language: 'typescript' },
          { name: 'Footer.tsx', type: 'file', language: 'typescript' },
          { name: 'Layout.tsx', type: 'file', language: 'typescript' },
        ],
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'Home.tsx', type: 'file', language: 'typescript' },
          { name: 'About.tsx', type: 'file', language: 'typescript' },
        ],
      },
      { name: 'App.tsx', type: 'file', language: 'typescript' },
      { name: 'main.tsx', type: 'file', language: 'typescript' },
    ],
  },
  { name: 'package.json', type: 'file', language: 'json' },
  { name: 'vite.config.ts', type: 'file', language: 'typescript' },
];

const mockArtifacts: Artifact[] = [
  { id: '1', type: 'code', name: 'Header Component', language: 'typescript', preview: 'export const Header...' },
  { id: '2', type: 'component', name: 'Interactive Button', preview: 'React Component' },
  { id: '3', type: 'website', name: 'Landing Page Preview', preview: 'https://...' },
  { id: '4', type: 'image', name: 'Generated Logo', preview: 'PNG Image' },
];

const mockChatHistory: ChatMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '帮我创建一个响应式的 Header 组件',
    timestamp: '14:20',
  },
  {
    id: '2',
    role: 'assistant',
    content: `我来帮你创建一个响应式的 Header 组件。

这个组件包含:
- Logo 区域
- 导航菜单
- 移动端汉堡菜单

已经生成到 Artifacts 面板中，你可以直接预览和应用。`,
    timestamp: '14:21',
  },
];

// ============================================================
// Menu Configuration
// ============================================================

const createMenuConfig = (): { label: string; items: MenuItemData[] }[] => [
  {
    label: 'File',
    items: [
      { label: 'New File', shortcut: 'Ctrl+N' },
      { label: 'New Project', shortcut: 'Ctrl+Shift+N' },
      { separator: true, label: '' },
      { label: 'Open File...', shortcut: 'Ctrl+O' },
      { label: 'Open Project...', shortcut: 'Ctrl+Shift+O' },
      { separator: true, label: '' },
      { label: 'Save', shortcut: 'Ctrl+S' },
      { label: 'Save All', shortcut: 'Ctrl+Shift+S' },
      { separator: true, label: '' },
      { label: 'Export Artifacts...' },
      { separator: true, label: '' },
      { label: 'Close', shortcut: 'Ctrl+W' },
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
    ],
  },
  {
    label: 'View',
    items: [
      { label: 'Editor View', shortcut: 'Ctrl+1', checked: true },
      { label: 'Manager View', shortcut: 'Ctrl+2' },
      { label: 'Split View', shortcut: 'Ctrl+3' },
      { separator: true, label: '' },
      { label: 'Show Artifacts', shortcut: 'Ctrl+Shift+A', checked: true },
      { label: 'Show File Explorer', checked: true },
      { separator: true, label: '' },
      { label: 'Zoom In', shortcut: 'Ctrl+=' },
      { label: 'Zoom Out', shortcut: 'Ctrl+-' },
    ],
  },
  {
    label: 'AI',
    items: [
      { label: 'New Chat', shortcut: 'Ctrl+L' },
      { label: 'Continue Chat' },
      { separator: true, label: '' },
      { label: 'Generate Code', shortcut: 'Ctrl+G' },
      { label: 'Explain Selection', shortcut: 'Ctrl+E' },
      { label: 'Fix Errors', shortcut: 'Ctrl+Shift+F' },
      { separator: true, label: '' },
      { label: 'Model Settings...' },
    ],
  },
  {
    label: 'Artifacts',
    items: [
      { label: 'New Artifact' },
      { label: 'Import Artifact...' },
      { separator: true, label: '' },
      { label: 'Apply to Editor' },
      { label: 'Preview in Browser' },
      { label: 'Download' },
      { separator: true, label: '' },
      { label: 'Clear All Artifacts' },
    ],
  },
  {
    label: 'Help',
    items: [
      { label: 'Documentation' },
      { label: 'Keyboard Shortcuts', shortcut: 'Ctrl+K Ctrl+S' },
      { separator: true, label: '' },
      { label: 'Report Issue' },
      { label: 'About Antigravity' },
    ],
  },
];

// ============================================================
// Main Component
// ============================================================

export const AntigravityApp: React.FC<AntigravityAppProps> = ({ windowId }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

  // Load project data from Supabase (falls back to mock data)
  const {
    fileTree: projectFileTree,
    fileContents: projectFileContents,
    gitCommits: projectGitCommits,
  } = useShowcaseProject();

  // State
  const [viewMode, setViewMode] = useState<'editor' | 'manager' | 'split'>('editor');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['src', 'src/components']));
  const [showArtifacts, setShowArtifacts] = useState(true);
  const [selectedArtifact, setSelectedArtifact] = useState<string | null>('1');
  const [activeSideTab, setActiveSideTab] = useState<'files' | 'search' | 'git'>('files');

  // Context menus
  const fileContextMenu = useContextMenu();
  const artifactContextMenu = useContextMenu();

  // Handlers
  const toggleFolder = useCallback((path: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  }, []);

  const menuConfig = createMenuConfig();

  // Artifact context menu items
  const artifactContextMenuItems: ContextMenuItemData[] = [
    { label: 'Apply to Editor', icon: <Code size={14} /> },
    { label: 'Preview', icon: <Eye size={14} /> },
    { separator: true, label: '' },
    { label: 'Download', icon: <Download size={14} /> },
    { label: 'Open in New Tab', icon: <ExternalLink size={14} /> },
    { separator: true, label: '' },
    { label: 'Rename...', icon: <Pencil size={14} /> },
    { label: 'Delete', icon: <Trash2 size={14} />, danger: true },
  ];

  return (
    <div className="flex flex-col h-full w-full bg-[#0d1117] text-[#c9d1d9] font-sans text-sm overflow-hidden rounded-lg">
      {/* Title Bar */}
      <div className="flex items-center h-8 bg-[#161b22] px-2 drag-handle select-none border-b border-[#30363d]">
        <div className="flex items-center gap-2 flex-1">
          <img src="/icons/antigravity.png" className="w-4 h-4" alt="" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
          <span className="text-xs text-[#8b949e]">Antigravity - my-project</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={() => minimizeWindow(windowId)} className="p-1.5 hover:bg-[#30363d] rounded transition-colors">
            <Minus size={14} />
          </button>
          <button onClick={() => maximizeWindow(windowId)} className="p-1.5 hover:bg-[#30363d] rounded transition-colors">
            <Square size={10} />
          </button>
          <button onClick={() => closeWindow(windowId)} className="p-1.5 hover:bg-[#da3633] rounded transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Menu Bar */}
      <div className="h-7 bg-[#161b22] px-1 border-b border-[#30363d] flex items-center">
        <MenuBar menus={menuConfig} />
        <div className="flex-1" />
        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 mr-2">
          {[
            { mode: 'editor', icon: Code, label: 'Editor' },
            { mode: 'manager', icon: Layers, label: 'Manager' },
            { mode: 'split', icon: Layout, label: 'Split' },
          ].map(item => (
            <Tooltip key={item.mode} content={item.label + ' View'}>
              <button
                onClick={() => setViewMode(item.mode as any)}
                className={cn(
                  "p-1 rounded transition-colors",
                  viewMode === item.mode
                    ? "bg-[#238636] text-white"
                    : "text-[#8b949e] hover:text-white hover:bg-[#30363d]"
                )}
              >
                <item.icon size={14} />
              </button>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Activity Bar */}
        <div className="w-12 bg-[#0d1117] flex flex-col items-center py-1 border-r border-[#30363d]">
          {[
            { id: 'files', icon: Files, tooltip: 'Explorer' },
            { id: 'search', icon: Search, tooltip: 'Search' },
            { id: 'git', icon: GitBranch, tooltip: 'Source Control' },
          ].map(item => (
            <Tooltip key={item.id} content={item.tooltip} position="right">
              <button
                onClick={() => setActiveSideTab(item.id as any)}
                className={cn(
                  "p-2.5 rounded mb-0.5 relative transition-colors",
                  activeSideTab === item.id
                    ? "text-[#58a6ff]"
                    : "text-[#8b949e] hover:text-white"
                )}
              >
                {activeSideTab === item.id && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-[#58a6ff] rounded-r" />
                )}
                <item.icon size={22} />
              </button>
            </Tooltip>
          ))}
          <div className="flex-1" />
          <Tooltip content="Settings" position="right">
            <button className="p-2.5 rounded text-[#8b949e] hover:text-white transition-colors">
              <Settings size={22} />
            </button>
          </Tooltip>
        </div>

        {/* Sidebar - File Explorer */}
        <div className="w-56 bg-[#0d1117] flex flex-col border-r border-[#30363d]">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-[#8b949e] uppercase tracking-wider font-semibold">
              {activeSideTab === 'files' ? 'Explorer' : activeSideTab}
            </span>
            <div className="flex items-center gap-1">
              <Tooltip content="New File">
                <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white">
                  <FilePlus size={14} />
                </button>
              </Tooltip>
              <Tooltip content="New Folder">
                <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white">
                  <FolderPlus size={14} />
                </button>
              </Tooltip>
            </div>
          </div>
          <div className="flex-1 overflow-auto px-2">
            <div className="flex items-center gap-1 px-2 py-1 text-xs text-[#8b949e] uppercase font-semibold">
              <ChevronDown size={14} />
              <span>my-project</span>
            </div>
            <FileTree
              nodes={projectFileTree}
              expandedFolders={expandedFolders}
              onToggleFolder={toggleFolder}
              basePath=""
            />
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Editor / Manager View */}
          <div className="flex-1 flex flex-col">
            {viewMode === 'editor' || viewMode === 'split' ? (
              <EditorView />
            ) : (
              <ManagerView />
            )}
          </div>

          {/* Artifacts Panel */}
          {showArtifacts && (
            <div className="w-72 bg-[#0d1117] border-l border-[#30363d] flex flex-col">
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]">
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-[#f0883e]" />
                  <span className="text-xs font-medium">Artifacts</span>
                  <span className="px-1.5 py-0.5 bg-[#30363d] rounded text-[10px] text-[#8b949e]">
                    {mockArtifacts.length}
                  </span>
                </div>
                <button onClick={() => setShowArtifacts(false)} className="p-1 hover:bg-[#30363d] rounded">
                  <X size={14} />
                </button>
              </div>

              {/* Artifact List */}
              <div className="flex-1 overflow-auto p-2 space-y-2">
                {mockArtifacts.map(artifact => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    isSelected={selectedArtifact === artifact.id}
                    onClick={() => setSelectedArtifact(artifact.id)}
                    onContextMenu={(e) => {
                      artifactContextMenu.open(e);
                    }}
                  />
                ))}
              </div>

              {/* Artifact Preview */}
              {selectedArtifact && (
                <div className="h-48 border-t border-[#30363d] p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#8b949e]">Preview</span>
                    <div className="flex items-center gap-1">
                      <Tooltip content="Apply to Editor">
                        <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff]">
                          <Code size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Open in Browser">
                        <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff]">
                          <ExternalLink size={12} />
                        </button>
                      </Tooltip>
                      <Tooltip content="Download">
                        <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff]">
                          <Download size={12} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>
                  <div className="h-full bg-[#161b22] rounded border border-[#30363d] p-2 text-xs font-mono text-[#8b949e] overflow-auto">
                    <pre>{`export const Header = () => {
  return (
    <header className="...">
      <Logo />
      <Nav />
    </header>
  );
};`}</pre>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Chat Panel */}
          <div className="w-80 bg-[#0d1117] border-l border-[#30363d] flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#30363d]">
              <div className="flex items-center gap-2">
                <Bot size={14} className="text-[#58a6ff]" />
                <span className="text-xs font-medium">AI Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip content="New Chat">
                  <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-white">
                    <MessageSquare size={14} />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-auto p-3 space-y-4">
              {mockChatHistory.map(msg => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[#30363d]">
              <div className="flex items-center gap-2 bg-[#161b22] border border-[#30363d] rounded-lg px-3 py-2">
                <input
                  type="text"
                  placeholder="Ask Antigravity AI..."
                  className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-[#6e7681]"
                />
                <Tooltip content="Generate">
                  <button className="p-1 hover:bg-[#30363d] rounded text-[#8b949e] hover:text-[#58a6ff]">
                    <Sparkles size={16} />
                  </button>
                </Tooltip>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <select className="bg-[#161b22] text-xs text-[#8b949e] rounded px-2 py-1 outline-none border border-[#30363d] flex-1">
                  <option>Claude 3.5 Sonnet</option>
                  <option>GPT-4o</option>
                  <option>Gemini Pro</option>
                </select>
                <Tooltip content="Generate Artifact">
                  <button className="px-2 py-1 text-xs bg-[#238636] text-white rounded hover:bg-[#2ea043] transition-colors flex items-center gap-1">
                    <Zap size={12} />
                    Generate
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex items-center h-6 px-2 text-xs text-[#8b949e] bg-[#161b22] border-t border-[#30363d]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <GitBranch size={12} />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1 text-[#3fb950]">
            <Check size={12} />
            <span>Ready</span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span>Artifacts: {mockArtifacts.length}</span>
          <div className="flex items-center gap-1 text-[#58a6ff]">
            <Bot size={12} />
            <span>AI Active</span>
          </div>
        </div>
      </div>

      {/* Context Menus */}
      <ContextMenu state={artifactContextMenu.state} items={artifactContextMenuItems} onClose={artifactContextMenu.close} />
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
  basePath: string;
}

const FileTree: React.FC<FileTreeProps> = ({ nodes, expandedFolders, onToggleFolder, basePath }) => {
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
                className="flex items-center gap-1 w-full px-1 py-0.5 hover:bg-[#161b22] rounded text-left"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                {isExpanded
                  ? <FolderOpen size={14} className="text-[#54aeff]" />
                  : <Folder size={14} className="text-[#54aeff]" />
                }
                <span className="text-xs">{node.name}</span>
              </button>
              {isExpanded && node.children && (
                <FileTree
                  nodes={node.children}
                  expandedFolders={expandedFolders}
                  onToggleFolder={onToggleFolder}
                  basePath={path}
                />
              )}
            </div>
          );
        }

        return (
          <button
            key={path}
            className="flex items-center gap-1 w-full px-1 py-0.5 hover:bg-[#161b22] rounded text-left pl-6"
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
  if (language === 'json') return <FileJson size={14} className="text-yellow-400" />;
  if (language === 'typescript') return <FileCode size={14} className="text-blue-400" />;
  return <FileText size={14} className="text-[#8b949e]" />;
};

const EditorView: React.FC = () => (
  <div className="flex-1 bg-[#0d1117] p-4 overflow-auto">
    <div className="font-mono text-xs">
      <div className="flex">
        <div className="pr-4 text-[#6e7681] select-none">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <pre className="text-[#c9d1d9]">
          <code>{`import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <img src="/logo.svg" alt="Logo" className="h-8" />
        <span className="font-bold text-xl">MyApp</span>
      </div>

      <nav className="hidden md:flex items-center gap-6">
        <a href="/" className="hover:text-primary">Home</a>
        <a href="/about" className="hover:text-primary">About</a>
        <a href="/contact" className="hover:text-primary">Contact</a>
      </nav>

      <button className="md:hidden">
        <MenuIcon />
      </button>
    </header>
  );
};`}</code>
        </pre>
      </div>
    </div>
  </div>
);

const ManagerView: React.FC = () => (
  <div className="flex-1 bg-[#0d1117] p-4 overflow-auto">
    <div className="text-center py-12">
      <Layers size={48} className="mx-auto text-[#30363d] mb-4" />
      <h2 className="text-lg font-medium text-[#c9d1d9] mb-2">Manager View</h2>
      <p className="text-sm text-[#8b949e]">
        Manage your project files, artifacts, and AI-generated content.
      </p>
    </div>
  </div>
);

interface ArtifactCardProps {
  artifact: Artifact;
  isSelected: boolean;
  onClick: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}

const ArtifactCard: React.FC<ArtifactCardProps> = ({ artifact, isSelected, onClick, onContextMenu }) => {
  const iconMap = {
    code: Code,
    image: Image,
    document: FileType,
    component: Box,
    website: Globe,
  };
  const Icon = iconMap[artifact.type];

  return (
    <div
      onClick={onClick}
      onContextMenu={onContextMenu}
      className={cn(
        "p-2 rounded-lg border cursor-pointer transition-all",
        isSelected
          ? "bg-[#161b22] border-[#58a6ff]"
          : "bg-[#0d1117] border-[#30363d] hover:border-[#8b949e]"
      )}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-8 h-8 rounded flex items-center justify-center",
          artifact.type === 'code' ? "bg-blue-500/20 text-blue-400" :
          artifact.type === 'component' ? "bg-purple-500/20 text-purple-400" :
          artifact.type === 'website' ? "bg-green-500/20 text-green-400" :
          artifact.type === 'image' ? "bg-pink-500/20 text-pink-400" :
          "bg-gray-500/20 text-gray-400"
        )}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs text-[#c9d1d9] truncate">{artifact.name}</div>
          <div className="text-[10px] text-[#6e7681] truncate">{artifact.preview}</div>
        </div>
        <button className="p-1 hover:bg-[#30363d] rounded opacity-0 group-hover:opacity-100">
          <MoreHorizontal size={12} className="text-[#8b949e]" />
        </button>
      </div>
    </div>
  );
};

const ChatMessage: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div className={cn(
      "rounded-lg p-3",
      message.role === 'user' ? "bg-[#161b22]" : "bg-[#0d1117] border border-[#30363d]"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {message.role === 'user' ? (
          <div className="w-5 h-5 rounded-full bg-[#238636] flex items-center justify-center text-[10px] text-white font-bold">
            Y
          </div>
        ) : (
          <Bot size={16} className="text-[#58a6ff]" />
        )}
        <span className="text-[10px] text-[#6e7681]">
          {message.role === 'user' ? 'You' : 'Antigravity'}
        </span>
        <span className="text-[10px] text-[#6e7681]">{message.timestamp}</span>
      </div>
      <div className="text-xs text-[#c9d1d9] whitespace-pre-wrap leading-relaxed">{message.content}</div>
    </div>
  );
};

export default AntigravityApp;
