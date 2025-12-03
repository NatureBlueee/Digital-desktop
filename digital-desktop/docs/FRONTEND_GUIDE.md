# 前端开发指南

> **目标受众**: 前端开发AI
> **项目**: Digital Desktop
> **版本**: 0.1.0 (MVP)

---

## 🎯 项目概述

### 这是什么项目？

**Digital Desktop** 是一个创新的"数字桌面"网站，将真实的工作环境搬到浏览器中。用户可以看到创作者的：
- GitHub仓库和代码
- ChatGPT对话历史
- Notion笔记（未来）
- 其他工作工具的内容

### 你的任务是什么？

**你负责前端部分**，具体包括：

1. **桌面环境** - 模拟操作系统桌面的界面
2. **应用图标** - 可点击的应用图标（GitHub、ChatGPT等）
3. **窗口系统** - 可拖拽、缩放的应用窗口
4. **应用内容展示** - 展示从API获取的数据
5. **文件上传功能** - 让用户上传数据文件

**你不需要做后端**，后端API已经完成，你只需要调用它们。

---

## 📚 技术栈要求

### 必须使用的技术

| 技术 | 版本 | 说明 |
|------|------|------|
| Next.js | 16.0.3 | 已配置好，使用App Router |
| React | 19.0.0 | 已安装 |
| TypeScript | 5.x | 必须使用，类型已定义好 |
| Tailwind CSS | 3.4.1 | 已配置好 |

### 推荐使用的库

以下是推荐的开源库，可以大大简化开发：

#### 1. 窗口管理

```bash
npm install react-rnd
```

**用途**: 实现可拖拽、可缩放的窗口

**示例**:
```typescript
import { Rnd } from 'react-rnd'

<Rnd
  default={{
    x: 100,
    y: 100,
    width: 800,
    height: 600,
  }}
  minWidth={400}
  minHeight={300}
>
  <div className="window">
    应用内容
  </div>
</Rnd>
```

#### 2. 代码高亮（用于GitHub应用）

```bash
npm install react-syntax-highlighter
npm install @types/react-syntax-highlighter
```

**用途**: 显示代码时添加语法高亮

**示例**:
```typescript
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

<SyntaxHighlighter language="typescript" style={vscDarkPlus}>
  {code}
</SyntaxHighlighter>
```

#### 3. Markdown渲染

```bash
npm install react-markdown
```

**用途**: 渲染Markdown格式的内容

#### 4. 图标

```bash
npm install lucide-react
```

**用途**: 提供各种图标（关闭、最小化、最大化等）

---

## 🗂️ 文件结构

你需要在以下目录创建文件：

```
digital-desktop/
├── app/
│   ├── layout.tsx          # ✅ 已存在（不需要改）
│   └── page.tsx            # ❌ 你需要创建（桌面主页）
│
├── components/
│   ├── Desktop/            # 桌面环境组件
│   │   ├── Desktop.tsx     # 桌面主组件
│   │   ├── AppIcon.tsx     # 应用图标
│   │   ├── Window.tsx      # 窗口组件
│   │   └── UploadButton.tsx # 上传按钮
│   │
│   └── Apps/               # 应用组件
│       ├── GitHubApp/
│       │   ├── index.tsx          # GitHub应用主组件
│       │   ├── RepoList.tsx       # 仓库列表
│       │   └── CodeViewer.tsx     # 代码查看器
│       │
│       └── ChatGPTApp/
│           ├── index.tsx          # ChatGPT应用主组件
│           ├── ConversationList.tsx  # 对话列表
│           └── MessageView.tsx    # 消息显示
│
└── types/
    └── index.ts            # ✅ 已存在（类型定义）
```

---

## 🎨 设计要求

### 桌面环境设计

**参考**: macOS、Windows 10/11桌面

**基本要求**:
1. **背景**: 纯色或渐变（简洁）
2. **图标网格**: 应用图标排列整齐
3. **响应式**: 桌面端优先（移动端可以简化）

**布局示例**:
```
┌─────────────────────────────────────┐
│  Digital Desktop                    │
│                                     │
│  ┌────┐  ┌────┐  ┌────┐           │
│  │ GH │  │ CG │  │ NT │           │
│  └────┘  └────┘  └────┘           │
│ GitHub  ChatGPT Notion             │
│                                     │
│                 [Upload Data]       │
└─────────────────────────────────────┘
```

### 窗口设计

**参考**: macOS应用窗口、VS Code

**必须元素**:
1. **标题栏**: 应用名称 + 关闭/最小化/最大化按钮
2. **内容区**: 应用具体内容
3. **可拖拽**: 拖动标题栏移动窗口
4. **可缩放**: 拖动边缘缩放窗口

**窗口示例**:
```
┌─────────────────────────────┐
│ GitHub              ○ ─ ✕   │ ← 标题栏
├─────────────────────────────┤
│                             │
│  [仓库列表]  [代码查看器]   │ ← 内容区
│                             │
│                             │
└─────────────────────────────┘
```

### 应用图标设计

**要求**:
1. **尺寸**: 80x80px（可调整）
2. **样式**: 圆角矩形或圆形
3. **图标**: 使用应用的官方logo或自定义图标
4. **文字**: 图标下方显示应用名称
5. **悬停效果**: 鼠标悬停时稍微放大或高亮

---

## 🔌 API集成

### API端点

后端已提供以下API（详见 [API_REFERENCE.md](./API_REFERENCE.md)）：

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/apps` | GET | 获取所有应用 |
| `/api/apps/:type` | GET | 获取指定应用 |
| `/api/sync/upload` | POST | 上传数据文件 |

### 类型定义

所有类型已在 `types/index.ts` 中定义好，**直接使用**：

```typescript
import { AppData, GitHubAppData, ChatGPTAppData, ApiResponse } from '@/types'
```

### 调用示例

#### 获取所有应用

```typescript
'use client'

import { useEffect, useState } from 'react'
import { AppData, ApiResponse } from '@/types'

export default function Desktop() {
  const [apps, setApps] = useState<AppData[]>([])

  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    const response = await fetch('/api/apps')
    const result: ApiResponse<AppData[]> = await response.json()

    if (result.success) {
      setApps(result.data || [])
    }
  }

  return (
    <div className="desktop">
      {apps.map(app => (
        <AppIcon key={app.id} app={app} />
      ))}
    </div>
  )
}
```

#### 上传文件

```typescript
const handleUpload = async (file: File, appType: string) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('appType', appType)

  const response = await fetch('/api/sync/upload', {
    method: 'POST',
    body: formData
  })

  const result: ApiResponse = await response.json()

  if (result.success) {
    alert('上传成功！')
    loadApps() // 刷新应用列表
  } else {
    alert(`上传失败: ${result.error}`)
  }
}
```

---

## 🏗️ 实现步骤

### 第一阶段: 桌面环境（最基础）

**目标**: 显示一个空桌面，有几个应用图标

**任务**:
1. 创建 `app/page.tsx`
2. 创建 `components/Desktop/Desktop.tsx`
3. 创建 `components/Desktop/AppIcon.tsx`
4. 调用 `/api/apps` 获取应用列表
5. 渲染应用图标

**验收标准**:
- [ ] 页面显示桌面背景
- [ ] 显示应用图标网格
- [ ] 图标显示应用名称

---

### 第二阶段: 窗口系统

**目标**: 点击图标能打开窗口

**任务**:
1. 安装 `react-rnd`
2. 创建 `components/Desktop/Window.tsx`
3. 实现点击图标打开窗口
4. 实现拖拽和缩放
5. 实现关闭窗口

**验收标准**:
- [ ] 点击图标打开窗口
- [ ] 窗口可以拖拽
- [ ] 窗口可以缩放
- [ ] 点击关闭按钮关闭窗口

---

### 第三阶段: GitHub应用

**目标**: GitHub应用能显示仓库列表

**任务**:
1. 创建 `components/Apps/GitHubApp/index.tsx`
2. 创建 `components/Apps/GitHubApp/RepoList.tsx`
3. 调用 `/api/apps/github` 获取数据
4. 显示仓库列表（名称、描述、语言、星标数）

**验收标准**:
- [ ] 打开GitHub应用显示仓库列表
- [ ] 每个仓库显示完整信息
- [ ] 样式美观

---

### 第四阶段: 代码查看器（可选）

**目标**: 点击仓库能查看代码文件

**任务**:
1. 安装 `react-syntax-highlighter`
2. 创建 `components/Apps/GitHubApp/CodeViewer.tsx`
3. 显示代码并高亮

**验收标准**:
- [ ] 点击仓库显示文件列表
- [ ] 点击文件显示代码
- [ ] 代码有语法高亮

---

### 第五阶段: ChatGPT应用

**目标**: ChatGPT应用能显示对话历史

**任务**:
1. 创建 `components/Apps/ChatGPTApp/index.tsx`
2. 创建 `components/Apps/ChatGPTApp/ConversationList.tsx`
3. 创建 `components/Apps/ChatGPTApp/MessageView.tsx`
4. 调用 `/api/apps/chatgpt` 获取数据
5. 显示对话列表和消息

**验收标准**:
- [ ] 显示对话列表
- [ ] 点击对话显示消息
- [ ] 区分用户和AI消息

---

### 第六阶段: 上传功能

**目标**: 添加上传按钮，能上传数据文件

**任务**:
1. 创建 `components/Desktop/UploadButton.tsx`
2. 实现文件选择
3. 调用 `/api/sync/upload`
4. 上传成功后刷新应用

**验收标准**:
- [ ] 页面有上传按钮
- [ ] 点击能选择文件
- [ ] 选择文件后能上传
- [ ] 上传成功有提示

---

## 📦 组件示例

### 桌面组件示例

```typescript
// components/Desktop/Desktop.tsx
'use client'

import { useEffect, useState } from 'react'
import { AppData, ApiResponse } from '@/types'
import AppIcon from './AppIcon'
import Window from './Window'

export default function Desktop() {
  const [apps, setApps] = useState<AppData[]>([])
  const [openApp, setOpenApp] = useState<AppData | null>(null)

  useEffect(() => {
    loadApps()
  }, [])

  const loadApps = async () => {
    const response = await fetch('/api/apps')
    const result: ApiResponse<AppData[]> = await response.json()
    if (result.success) {
      setApps(result.data || [])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* 应用图标网格 */}
      <div className="grid grid-cols-4 gap-8 p-8">
        {apps.map(app => (
          <AppIcon
            key={app.id}
            app={app}
            onClick={() => setOpenApp(app)}
          />
        ))}
      </div>

      {/* 窗口 */}
      {openApp && (
        <Window
          app={openApp}
          onClose={() => setOpenApp(null)}
        />
      )}
    </div>
  )
}
```

### 应用图标示例

```typescript
// components/Desktop/AppIcon.tsx
import { AppData } from '@/types'

interface AppIconProps {
  app: AppData
  onClick: () => void
}

export default function AppIcon({ app, onClick }: AppIconProps) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 hover:scale-110 transition-transform"
    >
      {/* 图标 */}
      <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
        {app.icon ? (
          <img src={app.icon} alt={app.name} className="w-12 h-12" />
        ) : (
          <div className="text-3xl">{app.name[0]}</div>
        )}
      </div>

      {/* 名称 */}
      <span className="text-sm font-medium text-gray-700">
        {app.name}
      </span>
    </button>
  )
}
```

### 窗口组件示例

```typescript
// components/Desktop/Window.tsx
import { Rnd } from 'react-rnd'
import { AppData } from '@/types'
import { X } from 'lucide-react'
import GitHubApp from '@/components/Apps/GitHubApp'
import ChatGPTApp from '@/components/Apps/ChatGPTApp'

interface WindowProps {
  app: AppData
  onClose: () => void
}

export default function Window({ app, onClose }: WindowProps) {
  // 根据应用类型渲染不同的内容
  const renderContent = () => {
    switch (app.type) {
      case 'github':
        return <GitHubApp data={app} />
      case 'chatgpt':
        return <ChatGPTApp data={app} />
      default:
        return <div>应用开发中...</div>
    }
  }

  return (
    <Rnd
      default={{
        x: 100,
        y: 100,
        width: 900,
        height: 600,
      }}
      minWidth={600}
      minHeight={400}
      bounds="window"
      dragHandleClassName="window-header"
    >
      <div className="h-full bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden">
        {/* 标题栏 */}
        <div className="window-header bg-gray-100 px-4 py-3 flex items-center justify-between cursor-move">
          <h2 className="font-semibold">{app.name}</h2>
          <button
            onClick={onClose}
            className="hover:bg-red-500 hover:text-white rounded-full p-1 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-auto">
          {renderContent()}
        </div>
      </div>
    </Rnd>
  )
}
```

### GitHub应用示例

```typescript
// components/Apps/GitHubApp/index.tsx
import { GitHubAppData } from '@/types'

interface GitHubAppProps {
  data: GitHubAppData
}

export default function GitHubApp({ data }: GitHubAppProps) {
  const repos = data.content.repos

  return (
    <div className="p-6">
      <h3 className="text-2xl font-bold mb-6">我的仓库</h3>

      <div className="space-y-4">
        {repos.map(repo => (
          <div key={repo.id} className="border rounded-lg p-4 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-lg font-semibold text-blue-600">
                  {repo.name}
                </h4>
                <p className="text-gray-600 mt-1">{repo.description}</p>
              </div>
              <span className="text-yellow-500">⭐ {repo.stars}</span>
            </div>

            <div className="mt-3 flex gap-3 text-sm text-gray-500">
              <span>🔤 {repo.language}</span>
              <a href={repo.url} target="_blank" className="text-blue-500 hover:underline">
                查看仓库 →
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## 🎯 设计参考

### 截图任务

你需要截图以下应用来参考UI：

1. **macOS桌面** - 桌面环境参考
2. **GitHub网页版** - 仓库列表样式
3. **ChatGPT网页版** - 对话界面样式
4. **VS Code** - 窗口和代码查看器参考

### 设计风格

- **简洁现代**: 类似macOS/Windows 11的风格
- **卡片设计**: 使用阴影和圆角
- **柔和配色**: 避免过于鲜艳的颜色
- **微交互**: 悬停效果、过渡动画

---

## ✅ 验收清单

### MVP必须完成

- [ ] 桌面环境显示正常
- [ ] 能显示应用图标
- [ ] 点击图标能打开窗口
- [ ] 窗口可以拖拽和关闭
- [ ] GitHub应用能显示仓库列表
- [ ] ChatGPT应用能显示对话（至少列表）
- [ ] 有上传按钮并能上传文件

### 体验优化（可选）

- [ ] 响应式设计（桌面/平板）
- [ ] 加载状态显示
- [ ] 错误处理（API失败提示）
- [ ] 窗口可最大化/最小化
- [ ] 代码语法高亮
- [ ] 平滑动画效果

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd /home/user/digital-desktop
npm install
npm install react-rnd react-syntax-highlighter lucide-react
```

### 2. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

### 3. 创建第一个组件

从 `app/page.tsx` 开始，逐步实现各个组件。

---

## 📞 需要帮助？

- **API文档**: [API_REFERENCE.md](./API_REFERENCE.md)
- **技术架构**: [TECH_ARCHITECTURE.md](./TECH_ARCHITECTURE.md)
- **数据库**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

---

## 📝 注意事项

1. **使用TypeScript**: 所有组件必须用TypeScript
2. **使用Tailwind**: 样式优先用Tailwind，避免自定义CSS
3. **类型安全**: 从 `@/types` 导入类型，不要使用 `any`
4. **错误处理**: API调用必须处理错误情况
5. **用户体验**: 加载、错误、空状态都要有提示

---

**开始开发吧！有任何问题可以参考上面的文档。**
