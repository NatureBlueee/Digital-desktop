# Digital Desktop 改进方案

## 📅 更新日期：2025-12-28

---

## ✅ 已完成的工作

### 1️⃣ **窗口调整大小体验优化**

#### 问题诊断
- 原窗口调整手柄尺寸太小（6px × 6px）
- 手柄完全透明，用户无法看到可拖拽区域
- 缺少视觉反馈

#### 解决方案
```css
/* 增大手柄尺寸 */
- 边缘手柄：6px → 8px
- 角落手柄：12px → 16px

/* 添加 Windows 11 风格的悬停效果 */
.window-resize-edge:hover {
  background-color: rgba(0, 120, 212, 0.8);  /* Windows 蓝 */
  box-shadow: 0 0 8px rgba(0, 120, 212, 0.4);
  opacity: 1;
}

.window-resize-corner:hover {
  background-color: rgba(0, 120, 212, 0.9);
  box-shadow: 0 0 12px rgba(0, 120, 212, 0.5);
  border-radius: 2px;
}
```

#### 效果
✅ 鼠标移动到窗口边缘时，会显示蓝色高亮条
✅ 角落有更大的拖拽区域（16px × 16px）
✅ 符合 Windows 11 的视觉语言

---

### 2️⃣ **Antigravity 和 Cursor AI IDE 应用集成**

#### 新增文件
```
src/components/apps/AIIDE/
├── AntigravityApp.tsx      (26KB) - Antigravity AI IDE
├── CursorApp.tsx            (92KB) - Cursor AI 代码编辑器
├── index.ts                 - 导出
└── useShowcaseProject.ts    (9KB) - 项目数据 Hook

src/components/ui/
├── Menu.tsx                 - VS Code 风格菜单栏
├── ContextMenu.tsx          - 右键菜单
├── Tooltip.tsx              - 工具提示
├── MarkdownPreview.tsx      - Markdown 渲染器
└── ResizeHandle.tsx         - 调整大小手柄组件
```

#### 功能特性

**AntigravityApp（青绿色主题）**
- ✅ VS Code 风格的文件树
- ✅ AI 助手对话框（可折叠）
- ✅ Artifacts 系统（代码、组件、网站预览）
- ✅ Manager View + Editor View 双视图
- ✅ 自定义菜单栏（File、Edit、View、AI、Artifacts、Help）

**CursorApp（紫色主题）**
- ✅ 完整的代码编辑器界面
- ✅ 集成 AI 聊天面板
- ✅ 文件浏览器
- ✅ Git 分支管理
- ✅ 搜索和替换功能

#### 集成到 WindowManager
```tsx
// src/components/os/Window/WindowManager.tsx
import { AntigravityApp, CursorApp } from "@/components/apps/AIIDE";

// 隐藏 AIIDE 应用的标题栏（它们有自定义顶栏）
hideTitleBar={
  window.appId === 'claude' ||
  window.appId === 'chatgpt' ||
  window.appId === 'antigravity' ||
  window.appId === 'cursor'
}

// 路由到对应应用
{window.appId === 'antigravity' ? (
  <AntigravityApp windowId={window.id} />
) : window.appId === 'cursor' ? (
  <CursorApp windowId={window.id} appType="cursor" />
) : ...}
```

---

### 3️⃣ **Supabase 配置优化**

#### 问题
- Supabase 环境变量缺失时应用崩溃
- 缺少 `isSupabaseConfigured()` 导出

#### 解决方案
```typescript
// src/lib/supabase/client.ts
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseAnonKey);
};

// 优雅降级：环境变量缺失时使用占位符
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
```

---

## 🎯 下一步改进计划

### 1️⃣ **Notion API 集成方案**

#### 目标
将您的多个 Notion 页面整合到桌面应用中，形成统一的笔记管理界面。

#### 实现方案

**A. Notion API 认证**

```typescript
// src/lib/notion/client.ts
import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 获取数据库列表
export async function getDatabases() {
  const response = await notion.search({
    filter: { property: "object", value: "database" },
  });
  return response.results;
}

// 获取页面内容
export async function getPage(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  const blocks = await notion.blocks.children.list({
    block_id: pageId,
  });
  return { page, blocks };
}
```

**B. 环境变量配置**

```bash
# .env.local
NOTION_API_KEY=secret_xxx  # 从 https://www.notion.so/my-integrations 获取
```

**C. 数据库设计**

您需要在 Notion 中创建一个"集成连接"：
1. 访问 https://www.notion.so/my-integrations
2. 创建新集成（Internal Integration）
3. 获取 API Key
4. 在每个想要展示的页面中，点击 `...` → `Add connections` → 选择您的集成

**D. Notion App 组件结构**

```tsx
// src/components/apps/Notion/NotionApp.tsx
import { useState, useEffect } from 'react';

export function NotionApp({ windowId }: { windowId: string }) {
  const [databases, setDatabases] = useState([]);
  const [selectedPage, setSelectedPage] = useState(null);

  useEffect(() => {
    // 加载数据库列表
    fetch('/api/notion/databases')
      .then(res => res.json())
      .then(data => setDatabases(data));
  }, []);

  return (
    <div className="flex h-full">
      {/* 左侧：数据库/页面列表 */}
      <aside className="w-64 border-r bg-gray-50">
        <div className="p-4">
          <h2 className="font-semibold text-lg mb-4">我的 Notion</h2>
          <ul className="space-y-2">
            {databases.map(db => (
              <li key={db.id}
                  onClick={() => setSelectedPage(db.id)}
                  className="cursor-pointer hover:bg-gray-200 p-2 rounded">
                {db.title[0]?.plain_text || 'Untitled'}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* 右侧：页面内容渲染 */}
      <main className="flex-1 overflow-y-auto p-8">
        {selectedPage ? (
          <NotionPageRenderer pageId={selectedPage} />
        ) : (
          <div className="text-center text-gray-500 mt-20">
            选择一个页面开始查看
          </div>
        )}
      </main>
    </div>
  );
}
```

**E. API 路由**

```typescript
// src/app/api/notion/databases/route.ts
import { NextResponse } from 'next/server';
import { getDatabases } from '@/lib/notion/client';

export async function GET() {
  try {
    const databases = await getDatabases();
    return NextResponse.json({ success: true, data: databases });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
```

**F. 页面渲染器**

```tsx
// src/components/apps/Notion/NotionPageRenderer.tsx
import { useEffect, useState } from 'react';

export function NotionPageRenderer({ pageId }: { pageId: string }) {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`/api/notion/pages/${pageId}`)
      .then(res => res.json())
      .then(data => setBlocks(data.blocks));
  }, [pageId]);

  return (
    <div className="notion-page">
      {blocks.map(block => (
        <NotionBlock key={block.id} block={block} />
      ))}
    </div>
  );
}

function NotionBlock({ block }) {
  const { type } = block;

  switch(type) {
    case 'paragraph':
      return <p>{block.paragraph.rich_text[0]?.plain_text}</p>;
    case 'heading_1':
      return <h1 className="text-3xl font-bold mt-6 mb-4">
        {block.heading_1.rich_text[0]?.plain_text}
      </h1>;
    case 'heading_2':
      return <h2 className="text-2xl font-semibold mt-5 mb-3">
        {block.heading_2.rich_text[0]?.plain_text}
      </h2>;
    case 'bulleted_list_item':
      return <li>{block.bulleted_list_item.rich_text[0]?.plain_text}</li>;
    case 'image':
      return <img src={block.image.file?.url} alt="" className="my-4" />;
    default:
      return null;
  }
}
```

#### 安装依赖
```bash
npm install @notionhq/client --legacy-peer-deps
```

#### Notion API 限制
- **只读访问**：API Key 默认只能读取，无法修改 Notion 内容
- **页面必须授权**：每个页面需要手动添加集成连接
- **速率限制**：每秒 3 次请求

---

### 2️⃣ **Antigravity/Cursor UI 改进建议**

基于您的截图反馈，以下是具体的改进点：

#### A. **图标质量优化**

**问题**：
- 当前图标使用 Lucide Icons，但部分图标不够精致
- SVG 渲染可能有锯齿

**解决方案**：
```tsx
// 使用高质量的 VS Code 官方图标
import { VscFiles, VscSearch, VscSourceControl, VscExtensions } from 'react-icons/vsc';

// 或者使用自定义 SVG
const FileIcon = () => (
  <svg viewBox="0 0 16 16" className="w-4 h-4">
    <path fill="currentColor" d="M..."/>  {/* 高清矢量路径 */}
  </svg>
);

// 添加抗锯齿样式
.icon {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  shape-rendering: geometricPrecision;
}
```

#### B. **Editor View / Manager View 改进**

**当前问题**（基于截图）：
- "Manager View" 界面太空旷
- 缺少实际的项目文件
- AI 对话框占比过大

**改进方案**：

1. **默认视图应该是 Editor View**（代码编辑器）
2. **AI 对话框应该是可折叠的侧边栏**，而不是占据主要区域
3. **Manager View 应该展示项目概览**：
   - 文件统计（总文件数、代码行数）
   - Git 提交历史
   - 最近打开的文件
   - 项目依赖树

```tsx
// 优化后的布局
<div className="flex h-full">
  {/* 左侧：文件树（固定） */}
  <FileExplorer width={250} />

  {/* 中间：主工作区（可切换 Editor/Manager） */}
  <MainWorkArea>
    {view === 'editor' ? (
      <CodeEditor file={selectedFile} />
    ) : (
      <ProjectOverview />  {/* 项目统计、Git 历史 */}
    )}
  </MainWorkArea>

  {/* 右侧：AI 助手（可折叠） */}
  {showAI && <AIAssistant width={350} onClose={() => setShowAI(false)} />}
</div>
```

#### C. **Search 和 Source Control 界面优化**

**当前问题**：
- 界面过于简陋
- 缺少实际功能

**Search 界面改进**：
```tsx
<div className="p-4 border-b">
  {/* 搜索输入框 */}
  <input
    type="text"
    placeholder="Search (Ctrl+Shift+F)"
    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
  />

  {/* 搜索选项 */}
  <div className="flex gap-2 mt-2">
    <button className="text-xs px-2 py-1 border rounded hover:bg-gray-100">
      Aa Match Case
    </button>
    <button className="text-xs px-2 py-1 border rounded hover:bg-gray-100">
      ab Match Whole Word
    </button>
    <button className="text-xs px-2 py-1 border rounded hover:bg-gray-100">
      .* Use Regex
    </button>
  </div>
</div>

{/* 搜索结果列表 */}
<div className="flex-1 overflow-y-auto">
  {searchResults.map(result => (
    <div key={result.id} className="p-3 hover:bg-gray-50 cursor-pointer">
      <div className="flex items-center gap-2">
        <FileIcon type={result.fileType} />
        <span className="text-sm font-medium">{result.fileName}</span>
        <span className="text-xs text-gray-500">{result.lineNumber}</span>
      </div>
      <pre className="text-xs mt-1 text-gray-700">
        {result.snippet}
      </pre>
    </div>
  ))}
</div>
```

**Source Control 界面改进**：
```tsx
<div className="flex flex-col h-full">
  {/* Git 分支和操作 */}
  <div className="p-4 border-b">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <GitBranch size={16} />
        <span className="text-sm font-medium">main</span>
      </div>
      <button className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">
        Commit
      </button>
    </div>

    {/* 提交信息输入 */}
    <textarea
      placeholder="Message (Ctrl+Enter to commit)"
      className="w-full px-2 py-1 border rounded text-sm"
      rows={3}
    />
  </div>

  {/* 变更文件列表 */}
  <div className="flex-1 overflow-y-auto">
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
      Changes ({changedFiles.length})
    </div>
    {changedFiles.map(file => (
      <div key={file.path} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50">
        <span className={`text-xs font-mono ${
          file.status === 'modified' ? 'text-orange-500' :
          file.status === 'added' ? 'text-green-500' :
          'text-red-500'
        }`}>
          {file.status[0].toUpperCase()}
        </span>
        <span className="text-sm flex-1">{file.name}</span>
      </div>
    ))}
  </div>

  {/* Git 历史 */}
  <div className="border-t">
    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
      Recent Commits
    </div>
    {recentCommits.map(commit => (
      <div key={commit.sha} className="px-4 py-2 hover:bg-gray-50">
        <div className="text-xs font-mono text-gray-400">{commit.sha.slice(0, 7)}</div>
        <div className="text-sm">{commit.message}</div>
        <div className="text-xs text-gray-500">{commit.author} · {commit.date}</div>
      </div>
    ))}
  </div>
</div>
```

#### D. **颜色和字体优化**

```css
/* 优化代码编辑器字体 */
.code-editor {
  font-family: 'Fira Code', 'JetBrains Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  letter-spacing: 0.02em;
}

/* Antigravity 主题色调整 */
:root {
  --antigravity-primary: #10b981;     /* 更鲜艳的青绿色 */
  --antigravity-secondary: #059669;
  --antigravity-bg: #0a0e14;          /* 深色背景 */
  --antigravity-sidebar: #0f1419;
  --antigravity-border: #1f2937;
}

/* Cursor 主题色调整 */
:root {
  --cursor-primary: #8b5cf6;          /* 紫色 */
  --cursor-secondary: #7c3aed;
  --cursor-bg: #1e1e1e;               /* VS Code 深色主题背景 */
  --cursor-sidebar: #252526;
  --cursor-border: #3e3e42;
}
```

---

### 3️⃣ **性能优化建议**

#### A. **代码分割优化**

```tsx
// 使用 Next.js 动态导入减少初始加载
import dynamic from 'next/dynamic';

const AntigravityApp = dynamic(
  () => import('@/components/apps/AIIDE/AntigravityApp'),
  {
    loading: () => <LoadingSpinner />,
    ssr: false  // 这些应用不需要 SSR
  }
);

const CursorApp = dynamic(
  () => import('@/components/apps/AIIDE/CursorApp'),
  { ssr: false }
);
```

#### B. **虚拟滚动优化文件列表**

```tsx
// 安装 react-window
npm install react-window --legacy-peer-deps

// 使用虚拟滚动渲染大文件列表
import { FixedSizeList } from 'react-window';

function FileList({ files }) {
  const Row = ({ index, style }) => (
    <div style={style} className="file-item">
      {files[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={files.length}
      itemSize={32}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

#### C. **缓存 Git 数据**

```typescript
// 使用 SWR 缓存 Git 提交历史
import useSWR from 'swr';

function useGitHistory(projectId: string) {
  const { data, error } = useSWR(
    `/api/git/history/${projectId}`,
    fetcher,
    {
      refreshInterval: 60000,  // 每分钟刷新一次
      revalidateOnFocus: false
    }
  );

  return {
    commits: data?.commits || [],
    isLoading: !error && !data,
    isError: error
  };
}
```

---

## 🎨 UI/UX 改进清单

### 高优先级
- [ ] 替换 Antigravity/Cursor 的 Lucide 图标为 VS Code 官方图标
- [ ] 修复 "Manager View" 的空白问题，添加实际内容
- [ ] AI 对话框改为可折叠侧边栏
- [ ] Search 界面添加搜索选项（大小写、正则、整词匹配）
- [ ] Source Control 添加提交历史时间线

### 中优先级
- [ ] 优化代码编辑器字体（使用 Fira Code 或 JetBrains Mono）
- [ ] 添加主题切换功能（浅色/深色模式）
- [ ] 文件树添加图标（文件类型识别）
- [ ] 添加快捷键提示（Tooltips）

### 低优先级
- [ ] 添加代码高亮（使用 Prism.js 或 Shiki）
- [ ] 添加 Git diff 视图
- [ ] 添加终端面板集成
- [ ] 添加扩展市场界面

---

## 📦 依赖项清单

### 需要安装的包
```bash
# Notion 集成
npm install @notionhq/client --legacy-peer-deps

# VS Code 图标
npm install react-icons --legacy-peer-deps

# 虚拟滚动
npm install react-window --legacy-peer-deps

# 代码高亮（可选）
npm install prismjs --legacy-peer-deps

# SWR 数据缓存（可选）
npm install swr --legacy-peer-deps
```

---

## 🚀 下一步行动

### 立即执行
1. ✅ 测试窗口调整大小功能（鼠标悬停在窗口边缘查看蓝色高亮）
2. ✅ 测试 Antigravity 和 Cursor 应用（双击桌面图标）
3. 📝 收集用户反馈，确定优先级

### 本周内完成
1. 🎯 实现 Notion API 集成（参考上面的方案）
2. 🎨 改进 AIIDE 应用的 UI 质量
3. 📊 添加项目统计面板到 Manager View

### 长期规划
1. 🌐 添加更多第三方集成（GitHub、Google Drive）
2. 🤖 实现真实的 AI 对话功能（调用 OpenAI/Claude API）
3. 📱 响应式设计优化（支持平板和手机）

---

## 📞 需要进一步说明的问题

1. **Notion 集成范围**：您想展示哪些 Notion 页面？是数据库还是普通页面？
2. **UI 风格偏好**：您更喜欢 Antigravity 的青绿色主题还是 Cursor 的紫色主题？
3. **功能优先级**：Notion 集成 vs UI 改进，您希望先完成哪个？
4. **数据来源**：Git 历史数据是从真实仓库读取还是使用 Mock 数据？

---

## 📊 技术债务

- [ ] Google Fonts 加载失败问题（考虑使用本地字体）
- [ ] ESLint 版本冲突（升级到 ESLint 9 或降级 eslint-config-next）
- [ ] npm audit 显示 1 个严重漏洞（需要修复）
- [ ] TypeScript strict 模式下的隐式 any 类型（MarkdownPreview）

---

## 📝 参考资料

- [Notion API 文档](https://developers.notion.com/)
- [VS Code 图标库](https://microsoft.github.io/vscode-codicons/dist/codicon.html)
- [React Window 虚拟滚动](https://react-window.vercel.app/)
- [Windows 11 设计指南](https://learn.microsoft.com/en-us/windows/apps/design/)

---

*生成于：2025-12-28*
*提交哈希：50c0551*
*分支：claude/understand-project-architecture-AzH3O*
