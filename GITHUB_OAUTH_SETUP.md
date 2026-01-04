# GitHub OAuth + Fork 协作系统 - 设置指南

本指南将帮助你配置 GitHub OAuth 认证系统，让访客能够通过 GitHub 登录、Fork 仓库并提交 Pull Request。

## 📋 功能概述

访客可以：
1. 🔐 通过 GitHub OAuth 登录
2. 🍴 自动 Fork 项目到自己的账户
3. ✏️ 在 code-server 中浏览和编辑代码
4. 📝 提交更改并创建 Pull Request
5. 💬 留言和反馈

## 🚀 快速开始

### 步骤 1: 创建 GitHub OAuth App

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **"New OAuth App"** 或 **"New GitHub App"**
3. 填写应用信息：

   | 字段 | 值 |
   |------|-----|
   | **Application name** | `Digital Desktop Showcase` |
   | **Homepage URL** | 开发环境：`http://localhost:3000`<br>生产环境：`https://your-domain.com` |
   | **Authorization callback URL** | 开发环境：`http://localhost:3000/api/auth/github/callback`<br>生产环境：`https://your-domain.com/api/auth/github/callback` |
   | **Application description** | `Code contribution system for Digital Desktop` |

4. 点击 **"Register application"**
5. 保存生成的 **Client ID** 和 **Client Secret**

### 步骤 2: 配置环境变量

复制 `.env.local.example` 到 `.env.local`：

```bash
cp .env.local.example .env.local
```

编辑 `.env.local`，填入以下信息：

```env
# GitHub OAuth 配置
GITHUB_CLIENT_ID=your_github_oauth_client_id_here
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret_here

# 仓库信息
GITHUB_REPO_OWNER=NatureBlueee
GITHUB_REPO_NAME=Digital-desktop

# 应用基础 URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000  # 开发环境
# NEXT_PUBLIC_BASE_URL=https://your-domain.com  # 生产环境

# code-server URL
NEXT_PUBLIC_CODE_SERVER_URL=http://165.22.62.244:3001  # 或你的 VPS IP
```

### 步骤 3: 安装依赖

```bash
npm install
```

所需依赖已包含在 `package.json` 中：
- `@octokit/rest` - GitHub API 客户端

### 步骤 4: 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:3000`，打开 Cursor 或 Antigravity 应用测试功能。

## 🎯 用户流程

### 前端界面

在 Theia/Cursor IDE 窗口的标题栏，用户可以看到：

1. **💬 留言按钮** - 打开详细的贡献流程弹窗
2. **🔀 GitHub 图标** - 快速创建 PR（登录后）

### 完整贡献流程

```
1. 访客打开 code-server，浏览代码（只读）
   ↓
2. 点击"留言/贡献"图标 → 打开 AuthModal
   ↓
3. 点击"Login with GitHub" → 跳转 GitHub 授权页面
   ↓
4. 授权成功 → 自动返回应用（已登录状态）
   ↓
5. 点击"Fork Repository" → 后端自动 Fork 到访客账户
   ↓
6. Fork 成功 → 可以在 code-server 中编辑代码
   ↓
7. 点击"Create Pull Request" → 自动创建 PR
   ↓
8. PR 创建成功 → 显示 PR 链接，可直接访问
```

## 🏗️ 架构说明

### API 路由

| 路由 | 方法 | 功能 |
|------|------|------|
| `/api/auth/github` | GET | GitHub OAuth 登录入口 |
| `/api/auth/github/callback` | GET | OAuth 回调处理 |
| `/api/auth/github/status` | GET | 检查认证状态 |
| `/api/auth/github/logout` | POST | 登出 |
| `/api/github/fork` | POST | Fork 仓库 |
| `/api/github/fork` | GET | 检查 Fork 状态 |
| `/api/github/commit` | POST | 提交多个文件 |
| `/api/github/commit` | PUT | 更新单个文件 |
| `/api/github/pr` | POST | 创建 Pull Request |
| `/api/github/pr` | GET | 获取用户的 PR 列表 |

### 前端组件

| 组件 | 位置 | 功能 |
|------|------|------|
| `useGitHubAuth` | `src/hooks/useGitHubAuth.ts` | 认证状态管理 Hook |
| `ContributeButton` | `src/components/apps/Theia/ContributeButton.tsx` | 快速贡献按钮 |
| `AuthModal` | `src/components/apps/Theia/AuthModal.tsx` | 详细的认证和贡献流程弹窗 |
| `TheiaApp` | `src/components/apps/Theia/TheiaApp.tsx` | Theia IDE 主组件（已集成） |

### 工具库

| 文件 | 功能 |
|------|------|
| `src/lib/github/client.ts` | GitHub API 客户端封装 |

## 🔒 安全注意事项

### Token 存储

- ✅ Access Token 存储在 **httpOnly cookie** 中，前端无法访问
- ✅ 用户信息存储在普通 cookie 中，仅包含公开信息（用户名、头像）
- ✅ Cookie 设置了 `secure` 标志（生产环境）和 `sameSite: 'lax'`

### OAuth Scope

- 只请求 **`public_repo`** 权限
- 不请求访问私有仓库、用户邮箱等敏感信息

### CORS 和 CSRF

- API 路由使用 Next.js 内置的 CSRF 保护
- OAuth 回调支持 `state` 参数（可选，用于防止 CSRF）

### Rate Limiting

- GitHub API 有速率限制：
  - 未认证：60 次/小时
  - 已认证：5000 次/小时
- API 会自动处理 429 错误并返回友好提示

## 🧪 测试指南

### 本地测试

1. 确保 `.env.local` 配置正确
2. 启动开发服务器：`npm run dev`
3. 打开 `http://localhost:3000`
4. 打开 Cursor 或 Antigravity 应用
5. 点击标题栏的"💬"图标
6. 测试登录、Fork、PR 流程

### 常见问题

**Q: OAuth 回调失败，显示 404**
- 检查 GitHub OAuth App 的回调 URL 是否正确
- 确保 `NEXT_PUBLIC_BASE_URL` 配置正确

**Q: Fork 失败，提示"Not authenticated"**
- 检查是否已登录
- 查看浏览器控制台，检查 cookie 是否设置成功
- 确保 `GITHUB_CLIENT_SECRET` 配置正确

**Q: 创建 PR 失败，提示"No commits between"**
- Fork 和原仓库没有差异，需要先提交一些更改
- 使用 `/api/github/commit` API 提交文件后再创建 PR

**Q: API 返回 403 错误**
- 可能超过了 GitHub API 速率限制
- 等待一段时间后重试

## 🚀 生产环境部署

### 更新 OAuth App 回调 URL

1. 访问 [GitHub Developer Settings](https://github.com/settings/developers)
2. 编辑你的 OAuth App
3. 更新 **Authorization callback URL** 为：`https://your-domain.com/api/auth/github/callback`

### 更新环境变量

在生产环境（Vercel、Netlify 等）设置以下环境变量：

```env
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REPO_OWNER=NatureBlueee
GITHUB_REPO_NAME=Digital-desktop
NEXT_PUBLIC_BASE_URL=https://your-domain.com
NEXT_PUBLIC_CODE_SERVER_URL=http://165.22.62.244:3001
```

### HTTPS 要求

- ⚠️ **生产环境必须使用 HTTPS**
- GitHub OAuth 回调要求使用 HTTPS（本地开发除外）

## 📝 使用示例

### 在其他组件中使用认证

```tsx
import { useGitHubAuth } from '@/hooks/useGitHubAuth';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useGitHubAuth();

  if (!isAuthenticated) {
    return <button onClick={login}>Login with GitHub</button>;
  }

  return (
    <div>
      <p>Welcome, {user?.name || user?.login}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### 手动调用 GitHub API

```tsx
import { forkRepository, createPullRequest } from '@/lib/github/client';

async function handleContribute() {
  // Fork 仓库
  const forkResult = await forkRepository();
  if (!forkResult.success) {
    console.error(forkResult.message);
    return;
  }

  // 创建 PR
  const prResult = await createPullRequest({
    title: 'My contribution',
    body: 'Description of my changes',
  });

  if (prResult.success) {
    console.log('PR created:', prResult.pr?.url);
  }
}
```

## 🛠️ 高级配置

### 自定义 OAuth Scope

如果需要更多权限（如访问私有仓库），编辑 `src/app/api/auth/github/route.ts`：

```typescript
const scope = 'public_repo,read:user'; // 添加更多 scope
```

可用的 scope：
- `public_repo` - 访问公开仓库
- `repo` - 访问所有仓库（包括私有）
- `read:user` - 读取用户信息
- `user:email` - 读取用户邮箱

### 自定义 Fork 仓库

默认 Fork 的是 `GITHUB_REPO_OWNER/GITHUB_REPO_NAME`，可以通过环境变量修改：

```env
GITHUB_REPO_OWNER=your-username
GITHUB_REPO_NAME=your-repo
```

## 📚 参考资料

- [GitHub OAuth 文档](https://docs.github.com/en/developers/apps/building-oauth-apps/authorizing-oauth-apps)
- [GitHub REST API 文档](https://docs.github.com/en/rest)
- [Octokit.js 文档](https://octokit.github.io/rest.js/)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

## 🙋 获取帮助

如果遇到问题：
1. 检查浏览器控制台和服务器日志
2. 查看本文档的"常见问题"部分
3. 提交 Issue 到 GitHub 仓库

---

祝你配置顺利！🎉
