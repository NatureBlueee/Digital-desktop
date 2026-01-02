# Digital Desktop 🖥️

一个基于 Next.js 构建的高保真 Windows 11 桌面体验，集成多种 AI 工具和生产力应用。

![Next.js](https://img.shields.io/badge/Next.js-latest-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ 核心特性

### 🎨 Windows 11 UI/UX
- **完整桌面系统**: 网格布局、任务栏、开始菜单、窗口管理
- **拖拽交互**: 桌面图标拖放、窗口拖拽、大小调整
- **选择框**: 多选图标支持、右键菜单
- **窗口管理**: 最小化、最大化、关闭、Z-index 层级管理
- **Windows 11 风格调整**: 边缘和角落的蓝色高亮 resize 句柄

### 🤖 内置应用程序

#### AI 工具
- **Claude AI**: 模拟 Claude 聊天界面的 AI 助手应用
- **ChatGPT Archive**: ChatGPT 对话归档查看器，支持搜索和过滤

#### 开发工具
- **Cursor IDE**: 深色主题的代码编辑器 (VS Code 风格)
- **Antigravity IDE**: GitHub 深色主题的代码编辑器

#### 生产力工具
- **Notion**:
  - 多页面浏览器 (NotionAppImproved)
  - 支持显示所有工作区页面
  - 侧边栏导航 + 内容渲染
  - 搜索和数据库视图

### 🗄️ 数据管理
- **Supabase 集成**: PostgreSQL 数据库，Row Level Security (RLS)
- **Claude Archive System**: Claude 对话归档
- **Showcase System**: 项目展示系统

## 🛠️ 技术栈

### 前端框架
- **Next.js** (latest) - React 框架，App Router 模式
- **React** (latest) - UI 库
- **TypeScript** (v5) - 类型安全

### 样式和 UI
- **Tailwind CSS** (v3.3) - 原子化 CSS
- **Framer Motion** (v11) - 动画库
- **Lucide React** - 图标库
- **class-variance-authority** - CSS 变体管理
- **clsx** / **tailwind-merge** - 类名工具

### 状态管理
- **Zustand** (v5) - 轻量级状态管理 (3KB)

### 拖拽和窗口
- **@dnd-kit/core** & **@dnd-kit/sortable** - 拖拽功能
- **react-rnd** - 窗口拖拽和调整大小
- **react-contexify** - 右键菜单

### 数据集成
- **@supabase/supabase-js** - Supabase 客户端
- **@notionhq/client** - Notion 官方 API
- **notion-client** - Notion 非官方 API (用于渲染)
- **react-notion-x** - Notion 页面渲染组件

### Markdown 和内容
- **react-markdown** - Markdown 渲染
- **remark-gfm** - GitHub Flavored Markdown

### 工具库
- **date-fns** - 日期处理
- **ts-node** - TypeScript 脚本执行

## 📁 项目结构

```
Digital-desktop/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API 路由
│   │   │   └── notion/               # Notion API 端点
│   │   │       ├── pages/            # 获取页面列表
│   │   │       ├── databases/        # 获取数据库
│   │   │       └── blocks/[pageId]/  # 获取页面内容
│   │   ├── globals.css               # 全局样式（窗口句柄、滚动条）
│   │   ├── layout.tsx                # 根布局
│   │   └── page.tsx                  # 主页（桌面入口）
│   │
│   ├── components/                   # React 组件
│   │   ├── apps/                     # 应用程序组件
│   │   │   ├── Claude/               # Claude AI 应用
│   │   │   ├── ChatGPT/              # ChatGPT Archive
│   │   │   ├── AIIDE/                # Cursor & Antigravity IDE
│   │   │   │   ├── AntigravityApp.tsx
│   │   │   │   ├── CursorApp.tsx
│   │   │   │   └── useShowcaseProject.ts
│   │   │   └── Notion/               # Notion 应用
│   │   │       ├── NotionApp.tsx     # 单页版本
│   │   │       └── NotionAppImproved.tsx  # 多页版本
│   │   │
│   │   ├── os/                       # 操作系统组件
│   │   │   ├── Desktop/              # 桌面系统
│   │   │   │   ├── DesktopGrid.tsx   # 桌面网格和图标
│   │   │   │   └── SelectionBox.tsx  # 选择框
│   │   │   ├── Taskbar/              # 任务栏
│   │   │   │   ├── Taskbar.tsx
│   │   │   │   ├── StartMenu.tsx
│   │   │   │   └── TaskbarIcon.tsx
│   │   │   └── Window/               # 窗口系统
│   │   │       ├── WindowManager.tsx # 窗口管理器（核心）
│   │   │       └── WindowFrame.tsx   # 窗口框架
│   │   │
│   │   └── ui/                       # UI 组件库
│   │       ├── Menu/                 # IDE 菜单组件
│   │       ├── ContextMenu/          # 右键菜单
│   │       └── Tooltip/              # 提示框
│   │
│   └── lib/                          # 工具库
│       ├── store/                    # Zustand 状态管理
│       │   └── desktopStore.ts       # 桌面状态（窗口、图标）
│       ├── supabase/                 # Supabase 客户端
│       │   └── client.ts             # 类型安全的 Supabase 客户端
│       └── notion/                   # Notion 客户端
│           └── official-client.ts    # 官方 API 封装
│
├── public/                           # 静态资源
│   ├── icons/                        # 应用图标
│   └── README-Claude.md              # Claude 相关文档
│
├── docs/                             # 项目文档
│   ├── MERGE-SUMMARY.md              # 分支合并总结
│   ├── IMPROVEMENT_PLAN.md           # 改进计划
│   └── NOTION-SETUP-GUIDE.md         # Notion 配置指南
│
├── scripts/                          # 脚本工具
│   ├── parse-project.ts              # 项目解析脚本
│   └── upload-project.ts             # 上传脚本
│
├── .env.local.example                # 环境变量模板
├── package.json                      # 项目依赖
├── tsconfig.json                     # TypeScript 配置
└── tailwind.config.ts                # Tailwind 配置
```

## 🚀 快速开始

### 1. 克隆项目

```bash
git clone https://github.com/NatureBlueee/Digital-desktop.git
cd Digital-desktop
```

### 2. 安装依赖

```bash
npm install
# 或
yarn install
```

### 3. 配置环境变量

复制 `.env.local.example` 为 `.env.local`:

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 配置以下环境变量：

```env
# Supabase 配置（可选，用于数据存储）
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_KEY=your_supabase_service_role_key_here

# Notion 配置（可选，用于 Notion 应用）
NOTION_API_KEY=secret_your_notion_integration_token_here
NOTION_TOKEN=your_notion_integration_token_here
NOTION_ROOT_PAGE_ID=your_notion_page_id_here
```

### 4. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 5. 构建生产版本

```bash
npm run build
npm run start
# 或
yarn build
yarn start
```

## ⚙️ 配置指南

### Supabase 配置

1. 访问 [Supabase Dashboard](https://supabase.com/dashboard)
2. 创建新项目
3. 在 Settings > API 中获取：
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_KEY`

### Notion 配置

详细配置指南请查看 [docs/NOTION-SETUP-GUIDE.md](docs/NOTION-SETUP-GUIDE.md)

**快速步骤：**

1. 访问 [Notion Integrations](https://www.notion.so/my-integrations)
2. 创建新 Integration
3. 复制 "Internal Integration Token"
4. 在 Notion 页面中：点击 `...` → `Add connections` → 选择你的 Integration
5. 将 token 添加到 `.env.local` 的 `NOTION_API_KEY`

## 📚 开发指南

### 添加新应用

1. 在 `src/components/apps/` 创建新应用文件夹
2. 实现应用组件（接收 `windowId` prop）
3. 在 `src/components/os/Window/WindowManager.tsx` 中注册应用
4. 在桌面图标配置中添加应用入口

### 窗口管理

所有窗口通过 `useDesktopStore` 管理：

```typescript
const {
  windows,
  openWindow,
  closeWindow,
  minimizeWindow,
  maximizeWindow,
  focusWindow
} = useDesktopStore();
```

### 自定义样式

- 全局样式：`src/app/globals.css`
- 窗口 resize 句柄：`.window-resize-handle` 类
- IDE 滚动条：`.ide-scrollbar` 类

## 🎯 最新功能

### v0.1.0 (当前版本)

- ✅ **多页 Notion 集成**: 在一个界面浏览所有 Notion 页面
- ✅ **改进的窗口 resize**: Windows 11 风格的蓝色高亮句柄
- ✅ **Cursor & Antigravity IDE**: 双 IDE 应用，支持项目展示
- ✅ **ChatGPT Archive**: 对话归档系统
- ✅ **类型安全**: 完整的 TypeScript 类型覆盖
- ✅ **Supabase 集成**: 数据持久化支持

## 📖 文档

- [MERGE-SUMMARY.md](docs/MERGE-SUMMARY.md) - 查看所有功能合并记录
- [IMPROVEMENT_PLAN.md](docs/IMPROVEMENT_PLAN.md) - 未来改进计划
- [NOTION-SETUP-GUIDE.md](docs/NOTION-SETUP-GUIDE.md) - Notion 配置详细指南

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
