# Digital Desktop / 数字桌面项目文档

> **Vision / 愿景**: A high-fidelity, web-based operating system that turns "Building in Public" into an interactive desktop experience.
>
> **愿景**: 一个高保真的 Web 操作系统，将“公开构建”转化为交互式的桌面体验。

---

## 1. Project Philosophy / 项目理念

**Digital Desktop** is not just a personal website; it's a "Digital Soul" container. It simulates a complete operating system environment where your digital life—code, conversations, notes—are treated as first-class citizens (Applications).
**Digital Desktop** 不仅仅是一个个人网站，它是“数字灵魂”的容器。它模拟了一个完整的操作系统环境，将您的数字生活——代码、对话、笔记——视为一等公民（应用程序）。

### Core Concepts / 核心概念
- **The Desktop Metaphor / 桌面隐喻**: Leveraging the familiarity of Windows 11 to reduce cognitive load.
  利用 Windows 11 的熟悉感来降低认知负荷。
- **Content as Apps / 内容即应用**: Your GitHub repos are an app. Your ChatGPT history is an app.
  您的 GitHub 仓库是一个应用，您的 ChatGPT 历史记录也是一个应用。
- **Transparency / 透明度**: A radical approach to "Building in Public" by exposing the raw materials of your work.
  通过展示工作的原始素材，实现彻底的“公开构建”。

---

## 2. Technical Architecture / 技术架构

The project follows a modern **Full-Stack** architecture, combining a high-fidelity React frontend with a robust Supabase backend.
项目采用现代**全栈**架构，结合了高保真 React 前端和强大的 Supabase 后端。

### Tech Stack / 技术栈
- **Frontend / 前端**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, React Rnd (Window Management).
- **Backend / 后端**: Next.js API Routes, Supabase (PostgreSQL).
- **State Management / 状态管理**: Zustand (Desktop State), React Query (Data Fetching).
- **Type Safety / 类型安全**: Full TypeScript support shared between frontend and backend.
  前后端共享完整的 TypeScript 支持。

### System Layers / 系统分层
1.  **Presentation Layer (The Desktop) / 表现层（桌面）**
    - **DesktopGrid**: Manages icons, drag-and-drop, selection. (管理图标、拖拽、框选)
    - **WindowManager**: Handles window lifecycle. (处理窗口生命周期：打开、关闭、最小化、层级)
    - **Taskbar**: Manages active apps and system tray. (管理活动应用和系统托盘)
    - **Icons**: Dedicated React components for SVGs to improve maintainability and performance. (独立的 SVG React 组件，提高可维护性和性能)
    - **Apps**: Individual React components rendering specific content. (渲染具体内容的独立组件，如 Claude, GitHub)

2.  **Data Layer (The OS Kernel) / 数据层（OS 内核）**
    - **Adapters**: Standardized interfaces to convert raw data into a unified format. (标准化接口，将原始数据转换为统一格式)
    - **Supabase**: Persistent storage for application data and metadata. (用于存储应用数据和元数据的持久化存储)
    - **API Routes**: Server-side endpoints for secure data access. (用于安全数据访问的服务端端点)

---

## 3. Data Management & Security / 数据管理与安全

> [!IMPORTANT]
> **Data Security / 数据安全**:
> Data synchronization is a strict **Admin-Only** function. There is NO public upload interface on the website to prevent unauthorized modifications.
> 数据同步是严格的**仅限管理员**功能。网站上**没有**公共上传接口，以防止未经授权的修改。

### Data Ingestion Workflow / 数据摄入流程
Data is ingested through secure, authenticated channels (e.g., local scripts, protected API endpoints with API Keys), ensuring that only the site owner can update the content displayed on the desktop.
数据通过安全的、经过身份验证的渠道（例如本地脚本、受 API 密钥保护的端点）摄入，确保只有网站所有者可以更新桌面上显示的内容。

---

## 4. Frontend Guide / 前端指南

### Directory Structure / 目录结构
```
src/
  app/
    api/            # Backend API Routes (后端 API 路由)
    page.tsx        # Desktop Entry Point (桌面入口)
  components/
    apps/           # Application Components (应用组件: Claude, GitHub)
    os/             # OS Components (OS 组件: Desktop, Taskbar, Window)
  lib/
    adapters/       # Data Adapters (数据适配器)
    store/          # Zustand Stores (状态存储)
    supabase/       # Supabase Client (Supabase 客户端)
  types/            # Shared TypeScript Interfaces (共享类型定义)
```

---

## 5. Setup & Deployment / 设置与部署

### Environment Variables / 环境变量
Create a `.env.local` file with your Supabase credentials:
创建一个 `.env.local` 文件并填入您的 Supabase 凭证：

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Installation / 安装
```bash
yarn install
yarn dev
```
