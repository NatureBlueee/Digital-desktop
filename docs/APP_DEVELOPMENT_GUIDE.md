# 应用开发指南 / App Development Guide

> **目标**: 为Digital Desktop创建新应用提供统一、标准化的开发流程
>
> **适用对象**: 前端AI、开发者

---

## 📐 应用架构设计

### 三层架构模式

Digital Desktop的每个应用遵循清晰的**三层分离**架构：

```
┌─────────────────────────────────────────┐
│          视图层 (View Layer)             │
│    React组件 - 渲染UI和用户交互          │
│    src/components/apps/[AppName]/        │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         状态层 (State Layer)             │
│    Custom Hooks - 数据获取和状态管理     │
│    useAppData, useAppState               │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          数据层 (Data Layer)             │
│    API Routes + Adapters - 数据转换      │
│    src/app/api/ + src/lib/adapters/      │
└─────────────────────────────────────────┘
```

---

## 📁 标准化文件结构

每个应用必须遵循以下目录结构：

```
src/components/apps/[AppName]/
├── index.tsx                 # 主容器组件（必需）
├── hooks/
│   └── useAppData.ts         # 数据获取hook（推荐）
└── components/               # 子组件（按需）
    ├── Header.tsx
    ├── Sidebar.tsx
    ├── Content.tsx
    └── ...
```

### 文件命名规范

- **应用名称**: PascalCase (如 `GitHub`, `ChatGPT`, `Cursor`)
- **组件文件**: PascalCase (如 `Header.tsx`, `RepoList.tsx`)
- **Hook文件**: camelCase with `use` 前缀 (如 `useGitHubData.ts`)

---

## 🎯 开发流程（5步标准）

### Step 1: 确认数据类型

检查 `src/types/index.ts` 是否已有该应用的类型定义。

**如果没有，添加类型定义：**

```typescript
// src/types/index.ts

export type AppType = 'github' | 'chatgpt' | 'cursor' | 'your-app';

export interface YourAppData extends AppData {
  type: 'your-app';
  content: {
    // 定义你的内容结构
    items: YourItem[];
  };
}

export interface YourItem {
  id: string;
  title: string;
  // ... 其他字段
}
```

**如果已有，跳到 Step 2。**

---

### Step 2: 创建数据获取 Hook

在 `src/components/apps/[AppName]/hooks/useAppData.ts` 创建自定义hook：

```typescript
// src/components/apps/GitHub/hooks/useGitHubData.ts

import { useState, useEffect } from 'react';
import { GitHubAppData } from '@/types';

export function useGitHubData() {
  const [data, setData] = useState<GitHubAppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch('/api/apps/github');
        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error || 'Failed to load data');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return { data, loading, error };
}
```

---

### Step 3: 创建主容器组件

在 `src/components/apps/[AppName]/index.tsx` 创建主组件：

```typescript
// src/components/apps/GitHub/index.tsx

"use client";

import React from "react";
import { useGitHubData } from "./hooks/useGitHubData";
import Header from "./components/Header";
import RepoList from "./components/RepoList";

export default function GitHubApp() {
  const { data, loading, error } = useGitHubData();

  // 统一的loading状态
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div className="text-sm text-gray-400">Loading...</div>
        </div>
      </div>
    );
  }

  // 统一的error状态
  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-center">
          <div className="text-red-500 mb-2">⚠️ Error</div>
          <div className="text-sm text-gray-600">{error}</div>
        </div>
      </div>
    );
  }

  // 统一的空数据状态
  if (!data) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-gray-400">No data available</div>
      </div>
    );
  }

  // 主内容渲染
  return (
    <div className="flex flex-col h-full bg-white">
      <Header name={data.name} />
      <RepoList repos={data.content.repos} />
    </div>
  );
}
```

---

### Step 4: 创建子组件

根据需要创建子组件，遵循**单一职责原则**：

```typescript
// src/components/apps/GitHub/components/RepoList.tsx

import React from "react";
import { GitHubRepo } from "@/types";

interface RepoListProps {
  repos: GitHubRepo[];
}

export default function RepoList({ repos }: RepoListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      {repos.map((repo) => (
        <div key={repo.id} className="border-b pb-4 mb-4">
          <h3 className="font-semibold text-lg">{repo.name}</h3>
          <p className="text-sm text-gray-600">{repo.description}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-500">
            <span>⭐ {repo.stars}</span>
            <span>📝 {repo.language}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

### Step 5: 集成到窗口管理器

在 `src/components/os/Window/WindowManager.tsx` 中注册应用：

```typescript
// src/components/os/Window/WindowManager.tsx

import GitHubApp from "@/components/apps/GitHub";

// 在渲染部分添加：
{window.appId === 'github' && <GitHubApp />}
```

在 `src/lib/store/desktopStore.ts` 中添加图标（如果需要）：

```typescript
icons: [
  // ... 现有图标
  {
    id: 'github',
    title: 'GitHub',
    icon: 'https://img.icons8.com/fluency/96/github.png',
    x: 0,
    y: 3,
    type: 'app',
    appId: 'github'
  },
]
```

---

## 🎨 UI/UX 统一规范

### 布局结构

所有应用遵循相同的布局模式：

```typescript
<div className="flex flex-col h-full bg-white">
  {/* Header - 固定高度，12-16单位 */}
  <div className="h-12 border-b flex items-center px-4 bg-white">
    <h2 className="font-semibold">{title}</h2>
  </div>

  {/* Content - flex-1 自动填充，可滚动 */}
  <div className="flex-1 overflow-y-auto p-4">
    {/* 内容 */}
  </div>

  {/* Footer (可选) - 固定高度 */}
  <div className="h-12 border-t px-4 bg-white">
    {/* 底部内容 */}
  </div>
</div>
```

### 颜色规范

- **背景**: `bg-white` 或 `bg-[#fcfcfc]`
- **边框**: `border-gray-200`
- **主文字**: `text-gray-800`
- **次要文字**: `text-gray-600`
- **辅助文字**: `text-gray-400`
- **强调色**: 根据应用品牌色（如 GitHub: `#24292e`, Claude: `#d97757`）

### 间距规范

- **容器内边距**: `p-4` (16px)
- **元素间距**: `gap-4` 或 `mb-4`
- **小间距**: `gap-2` 或 `mb-2`

---

## 🔄 状态管理规范

### Loading 状态

统一使用以下loading UI：

```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-pulse flex flex-col items-center gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        <div className="text-sm text-gray-400">Loading...</div>
      </div>
    </div>
  );
}
```

### Error 状态

统一使用以下error UI：

```typescript
if (error) {
  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-center">
        <div className="text-red-500 mb-2">⚠️ Error</div>
        <div className="text-sm text-gray-600">{error}</div>
      </div>
    </div>
  );
}
```

### Empty 状态

统一使用以下empty UI：

```typescript
if (!data || data.length === 0) {
  return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="text-center text-gray-400">
        <div className="text-4xl mb-2">📭</div>
        <div>No data available</div>
      </div>
    </div>
  );
}
```

---

## 📋 开发检查清单

在完成应用开发后，确保：

- [ ] 文件结构符合标准
- [ ] 使用了统一的loading/error/empty状态
- [ ] 使用了 `@/types` 中的类型定义
- [ ] 使用了 `@/` 路径别名导入
- [ ] 组件使用了 `"use client"` 指令（如果需要）
- [ ] 布局使用了 `flex flex-col h-full`
- [ ] 内容区域可滚动 (`overflow-y-auto`)
- [ ] 颜色符合规范
- [ ] 已在 WindowManager 中注册
- [ ] 已在 desktopStore 中添加图标（如果需要）

---

## 🚀 快速开始模板

复制以下模板快速开始开发新应用：

### 最小化模板

```typescript
// src/components/apps/[YourApp]/index.tsx

"use client";

import React, { useState, useEffect } from "react";
import { YourAppData } from "@/types";

export default function YourApp() {
  const [data, setData] = useState<YourAppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/apps/your-app');
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full bg-white">
        <div className="text-red-500">{error || 'No data'}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="h-12 border-b flex items-center px-4">
        <h2 className="font-semibold">{data.name}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {/* Your content here */}
      </div>
    </div>
  );
}
```

---

## 💡 最佳实践

### 1. 组件拆分原则
- **Header** 单独组件（如果复杂）
- **列表项** 独立为组件（便于复用和优化）
- **表单/交互** 独立为组件

### 2. 性能优化
- 使用 `React.memo` 包装列表项组件
- 长列表使用虚拟滚动（`react-window`）
- 图片使用 Next.js `Image` 组件

### 3. 类型安全
- 所有props定义interface
- 避免使用 `any`
- 充分利用 `@/types` 中的共享类型

### 4. 代码风格
- 使用函数组件和hooks
- 优先使用 `const` 而非 `let`
- 组件内部按顺序：hooks → handlers → render

---

## 📚 参考示例

### Claude应用
完整示例请参考：`src/components/apps/Claude/ClaudeApp.tsx`

### 即将实现的示例
- GitHub应用（即将完成）
- ChatGPT应用（计划中）
- Cursor应用（计划中）

---

## 🤝 开发协作

### 给前端AI的prompt模板

```
请为 Digital Desktop 创建一个 [应用名称] 应用。

参考开发指南：docs/APP_DEVELOPMENT_GUIDE.md

要求：
1. 从 /api/apps/[type] 获取数据
2. 使用 @/types 中的类型定义
3. 遵循统一的文件结构和UI规范
4. 实现 loading/error/empty 三种状态
5. 布局使用 flex flex-col h-full

数据类型参考：
[粘贴相关的类型定义]

请实现完整的组件代码。
```

---

**版本**: v1.0
**最后更新**: 2024-12-03
**维护者**: Digital Desktop Team
