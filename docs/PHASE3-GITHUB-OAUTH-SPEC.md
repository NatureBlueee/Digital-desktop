# Phase 3: GitHub OAuth + Fork 协作系统 - 开发规范

> ⚠️ **状态：暂停** (2026-01-05)
> 
> 技术实现已完成，但发现 UX 问题需要讨论解决。详见文档末尾。

## 📋 项目概述

### 目标
让访客能够通过 GitHub 登录后，自动 Fork 项目并在 code-server 中编辑，最终提交 PR 贡献代码或评论。

### 当前状态
- ✅ code-server 运行在 VPS (http://165.22.62.244:3001)
- ✅ 只读模式 + 自定义弹窗扩展
- ✅ Docker 自动从 GitHub 拉取代码

---

## 🎯 用户流程

```
┌─────────────────────────────────────────────────────────────┐
│  1. 访客打开 code-server，浏览代码（只读）                    │
│                         ↓                                    │
│  2. 点击"留言/贡献" → 跳转 GitHub OAuth 授权                 │
│                         ↓                                    │
│  3. 授权成功 → 后端自动 Fork 仓库到访客账户                   │
│                         ↓                                    │
│  4. 跳回 code-server，切换到访客的 Fork（可编辑）             │
│                         ↓                                    │
│  5. 访客编辑/评论 → 点击"提交"                               │
│                         ↓                                    │
│  6. 后端自动 commit + push + 创建 PR                         │
│                         ↓                                    │
│  7. 项目主人审核 PR → 合并到 main                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 🏗️ 技术架构

### 组件关系

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Digital Desktop │     │   Next.js API    │     │   GitHub API     │
│   (前端 React)    │ ←→  │   (后端路由)      │ ←→  │   (OAuth + REST) │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         ↓                        ↓
┌──────────────────┐     ┌──────────────────┐
│   code-server    │     │   VPS Docker     │
│   (iframe 嵌入)   │     │   (容器管理)      │
└──────────────────┘     └──────────────────┘
```

### 技术栈
- **前端**: Next.js 14+ (App Router), React, TypeScript
- **后端**: Next.js API Routes
- **认证**: GitHub OAuth 2.0
- **API**: GitHub REST API / Octokit
- **IDE**: code-server (Docker)

---

## 📁 需要创建的文件

### 1. API 路由

| 文件路径 | 用途 |
|---------|------|
| `src/app/api/auth/github/route.ts` | GitHub OAuth 入口（重定向到 GitHub） |
| `src/app/api/auth/github/callback/route.ts` | OAuth 回调，获取 access_token |
| `src/app/api/github/fork/route.ts` | 自动 Fork 仓库 |
| `src/app/api/github/commit/route.ts` | 提交更改到 Fork |
| `src/app/api/github/pr/route.ts` | 创建 Pull Request |

### 2. 前端组件

| 文件路径 | 用途 |
|---------|------|
| `src/components/apps/Theia/ContributeButton.tsx` | "留言/贡献"按钮组件 |
| `src/components/apps/Theia/AuthModal.tsx` | 登录弹窗 |
| `src/lib/github/client.ts` | GitHub API 封装 |
| `src/hooks/useGitHubAuth.ts` | GitHub 认证状态 Hook |

### 3. 环境变量

```env
# .env.local
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GITHUB_REPO_OWNER=NatureBlueee
GITHUB_REPO_NAME=Digital-desktop
NEXTAUTH_SECRET=xxx
```

---

## 🔧 详细实现步骤

### Step 1: 创建 GitHub OAuth App

1. 访问 https://github.com/settings/developers
2. 点击 "New OAuth App"
3. 填写信息：
   - Application name: `Digital Desktop Showcase`
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-domain.com/api/auth/github/callback`
4. 保存 Client ID 和 Client Secret

### Step 2: 实现 OAuth 登录

**`src/app/api/auth/github/route.ts`**
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/github/callback`;
  const scope = 'public_repo'; // 需要 fork 和 创建 PR 的权限

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;
  
  return NextResponse.redirect(authUrl);
}
```

**`src/app/api/auth/github/callback/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 });
  }

  // 用 code 换取 access_token
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });

  const { access_token } = await tokenResponse.json();
  
  // 存储 token 到 cookie (或用 NextAuth session)
  cookies().set('github_token', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // 24 hours
  });

  // 重定向回 code-server 或前端页面
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/showcase`);
}
```

### Step 3: 自动 Fork 仓库

**`src/app/api/github/fork/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

export async function POST(request: NextRequest) {
  const token = cookies().get('github_token')?.value;
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const octokit = new Octokit({ auth: token });
  
  try {
    // 检查用户是否已经 fork 过
    const { data: user } = await octokit.users.getAuthenticated();
    
    try {
      // 尝试获取已存在的 fork
      await octokit.repos.get({
        owner: user.login,
        repo: process.env.GITHUB_REPO_NAME!,
      });
      
      return NextResponse.json({ 
        message: 'Fork already exists',
        forkUrl: `https://github.com/${user.login}/${process.env.GITHUB_REPO_NAME}`,
      });
    } catch {
      // Fork 不存在，创建新的
      const { data: fork } = await octokit.repos.createFork({
        owner: process.env.GITHUB_REPO_OWNER!,
        repo: process.env.GITHUB_REPO_NAME!,
      });
      
      return NextResponse.json({
        message: 'Fork created',
        forkUrl: fork.html_url,
      });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Fork failed' }, { status: 500 });
  }
}
```

### Step 4: 提交更改

**`src/app/api/github/commit/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

export async function POST(request: NextRequest) {
  const token = cookies().get('github_token')?.value;
  const { filePath, content, message } = await request.json();
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.users.getAuthenticated();
  
  try {
    // 获取文件当前的 SHA (如果存在)
    let sha: string | undefined;
    try {
      const { data: file } = await octokit.repos.getContent({
        owner: user.login,
        repo: process.env.GITHUB_REPO_NAME!,
        path: filePath,
      });
      sha = (file as { sha: string }).sha;
    } catch {
      // 文件不存在，新建
    }

    // 创建或更新文件
    await octokit.repos.createOrUpdateFileContents({
      owner: user.login,
      repo: process.env.GITHUB_REPO_NAME!,
      path: filePath,
      message: message || `Update ${filePath}`,
      content: Buffer.from(content).toString('base64'),
      sha,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Commit failed' }, { status: 500 });
  }
}
```

### Step 5: 创建 Pull Request

**`src/app/api/github/pr/route.ts`**
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Octokit } from '@octokit/rest';

export async function POST(request: NextRequest) {
  const token = cookies().get('github_token')?.value;
  const { title, body } = await request.json();
  
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const octokit = new Octokit({ auth: token });
  const { data: user } = await octokit.users.getAuthenticated();
  
  try {
    const { data: pr } = await octokit.pulls.create({
      owner: process.env.GITHUB_REPO_OWNER!,
      repo: process.env.GITHUB_REPO_NAME!,
      title: title || `Contribution from ${user.login}`,
      body: body || 'Thank you for your contribution!',
      head: `${user.login}:main`,
      base: 'main',
    });

    return NextResponse.json({ 
      success: true,
      prUrl: pr.html_url,
    });
  } catch (error) {
    return NextResponse.json({ error: 'PR creation failed' }, { status: 500 });
  }
}
```

### Step 6: 更新 VS Code 扩展

修改 VPS 上的扩展，添加"提交更改"功能：

**`local-extensions/showcase-readonly/extension.js`** (更新版)
```javascript
const vscode = require('vscode');

function activate(context) {
    // 欢迎消息
    vscode.window.showInformationMessage(
        '👋 Hi! 欢迎浏览我的代码~',
        '登录留言'
    ).then(sel => {
        if (sel === '登录留言') {
            // 跳转到 OAuth 登录
            vscode.env.openExternal(vscode.Uri.parse(
                `${process.env.OAUTH_BASE_URL}/api/auth/github`
            ));
        }
    });

    // 拦截保存
    vscode.commands.registerCommand('workbench.action.files.save', () => {
        const isAuthenticated = checkAuth(); // 检查是否已登录
        
        if (!isAuthenticated) {
            vscode.window.showInformationMessage(
                '👋 请先登录 GitHub 才能保存更改',
                '登录 GitHub'
            ).then(sel => {
                if (sel) {
                    vscode.env.openExternal(vscode.Uri.parse(
                        `${process.env.OAUTH_BASE_URL}/api/auth/github`
                    ));
                }
            });
        } else {
            // 已登录，允许编辑并提示提交
            vscode.window.showInformationMessage(
                '保存成功！要提交你的更改吗？',
                '提交到 GitHub',
                '稍后'
            ).then(sel => {
                if (sel === '提交到 GitHub') {
                    submitChanges();
                }
            });
        }
    });
}

module.exports = { activate, deactivate: () => {} };
```

---

## 🔒 安全注意事项

1. **Token 存储**: 使用 httpOnly cookie，不暴露给前端 JS
2. **Scope 最小化**: OAuth 只请求 `public_repo` 权限
3. **CORS**: API 路由只允许来自前端域名的请求
4. **Rate Limiting**: GitHub API 有速率限制，需要处理 429 错误

---

## 📦 依赖安装

```bash
npm install @octokit/rest
# 或者使用 NextAuth（可选，更完整的认证方案）
npm install next-auth @auth/core
```

---

## 🧪 测试计划

1. **OAuth 流程测试**
   - 点击登录 → 跳转 GitHub → 授权 → 回调 → 获取 token ✓

2. **Fork 测试**
   - 已登录用户 → 点击贡献 → 检查 Fork 是否创建 ✓

3. **编辑提交测试**
   - 在 code-server 编辑文件 → 提交 → 检查 Fork 仓库是否有更改 ✓

4. **PR 创建测试**
   - 提交更改后 → 创建 PR → 检查原仓库是否收到 PR ✓

---

## 🚀 部署检查清单

- [x] 创建 GitHub OAuth App
- [x] 设置环境变量 (GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)
- [x] 部署 API 路由
- [x] 更新 code-server 扩展
- [x] 测试完整流程
- [ ] 配置 HTTPS（重要：OAuth 回调需要 HTTPS）

---

## 📝 备注

- 当前 VPS: `165.22.62.244:3001`
- GitHub 仓库: `NatureBlueee/Digital-desktop`
- 前端框架: Next.js 14+ (App Router)
- 验证 TheiaApp.tsx 的实现以了解 iframe 集成方式

---

## ⚠️ 待解决的 UX 问题 (2026-01-05)

### 核心问题

用户在 code-server 中编辑代码，点击保存时提示登录。但跳转到 GitHub OAuth 后再返回，**编辑内容会丢失**。

### 理想流程

1. 浏览时无压力（只读，多人可同时访问）
2. 点保存才触发登录
3. 登录后不丢失刚才的编辑内容
4. 每个用户的修改保存到自己的 Fork
5. 只有真正有更改时才创建 PR

### 候选方案

| 方案 | 描述 | 优点 | 缺点 |
|------|------|------|------|
| **A** | 弹窗登录 + 本地缓存 | 保留编辑内容，体验最好 | 跨域 iframe 难以获取文件内容 |
| **B** | 跳转到 github.dev | 最简单，GitHub 处理一切 | 用户离开网站 |
| **C** | 每用户独立容器 | 完美隔离，可读写 | 资源消耗大，实现复杂 |

### 结论

**暂停开发**，等待 UX 方案确定后继续。

技术实现（OAuth、Fork、Commit、PR API）**已全部完成**，可随时启用。
