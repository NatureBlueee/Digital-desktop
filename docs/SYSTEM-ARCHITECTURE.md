# Digital Desktop 系统架构

> ⚠️ **核心概念 - AI 必读**
>
> 这是一个 **作品集/Portfolio 展示系统**，不是真正的在线 IDE 或 SaaS 应用。
>
> 所有"应用"（VS Code 风格 IDE、任务管理、AI 应用等）都是 **展示用途**，
> 访客只能浏览，不能上传或编辑任何内容。

---

## 1. 系统定位

### 1.1 这是什么

```
┌─────────────────────────────────────────────────────────────────┐
│                     Digital Desktop                              │
│                   (作品集展示系统)                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   👤 站长 (Owner)                  👥 访客 (Visitors)            │
│   ─────────────────                ─────────────────            │
│   ✅ 通过脚本上传项目               ❌ 不能上传任何东西            │
│   ✅ 管理/配置展示内容              ✅ 只能浏览和查看              │
│   ✅ 设计 Git 历史展示              ✅ 看到精美的 UI 界面          │
│   ✅ 连接真实 Git 仓库 (只读)       ❌ 无法获取源文件              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 1.2 这不是什么

- ❌ 不是在线 IDE（不能真正编辑/运行代码）
- ❌ 不是多用户 SaaS（只有站长能管理内容）
- ❌ 不是 GitHub 替代品（不是代码托管平台）

### 1.3 设计目标

1. **展示开发过程** - 让访客看到真实的开发体验（文件结构、代码、Git 历史）
2. **精美的 UI** - 模拟 VS Code、Cursor 等专业 IDE 的界面
3. **简单的管理** - 站长只需运行脚本即可更新内容，无需管理后台

---

## 2. 数据流向

```
┌──────────────┐     脚本解析      ┌──────────────┐     上传       ┌──────────────┐
│  本地项目     │  ─────────────▶  │  JSON 数据   │  ──────────▶  │   Supabase   │
│  文件/Git    │                  │  (结构化)     │               │   数据库     │
└──────────────┘                  └──────────────┘               └──────────────┘
                                                                        │
                                                                        │ 读取
                                                                        ▼
                                                                 ┌──────────────┐
                                                                 │   前端网站    │
                                                                 │  (只读展示)   │
                                                                 └──────────────┘
```

### 2.1 数据来源

| 数据类型 | 来源 | 获取方式 |
|---------|------|---------|
| 文件结构 | 本地项目目录 | 脚本扫描 |
| 文件内容 | 本地文件 | 脚本读取 |
| Git 历史 | 本地 .git 或远程仓库 | git log / GitHub API |
| Git Diff | 本地 .git | git diff |

### 2.2 更新流程 (SOP)

```bash
# 1. 准备项目文件（放到指定目录）
cp -r ~/my-project ./showcase/projects/

# 2. 运行解析脚本（自动扫描 + 生成 JSON）
npm run parse-project -- --name "my-project"

# 3. 上传到 Supabase
npm run upload-project -- --name "my-project"

# 4. 完成！网站自动显示新内容
```

---

## 3. Supabase 数据结构

### 3.1 表设计

#### `projects` - 项目列表

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| name | text | 项目名称 |
| description | text | 项目描述 |
| app_type | text | 展示应用类型 (cursor/antigravity/windsurf) |
| git_repo | text | Git 仓库地址 (可选) |
| created_at | timestamp | 创建时间 |
| updated_at | timestamp | 更新时间 |

#### `files` - 文件内容

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| project_id | uuid | 关联项目 |
| path | text | 文件路径 (如 src/App.tsx) |
| name | text | 文件名 |
| content | text | 文件内容 |
| language | text | 语言类型 |
| size | int | 文件大小 (bytes) |

#### `git_commits` - Git 提交历史

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| project_id | uuid | 关联项目 |
| hash | text | 完整 commit hash |
| short_hash | text | 短 hash (7位) |
| message | text | 提交信息 |
| author | text | 作者 |
| date | timestamp | 提交时间 |
| branch | text | 分支名 (可选) |
| is_merge | boolean | 是否合并提交 |

#### `git_diffs` - 文件变更

| 字段 | 类型 | 说明 |
|------|------|------|
| id | uuid | 主键 |
| commit_id | uuid | 关联 commit |
| file_path | text | 文件路径 |
| additions | int | 添加行数 |
| deletions | int | 删除行数 |
| diff_content | text | diff 内容 (unified format) |

---

## 4. 脚本设计

### 4.1 项目解析脚本 (`scripts/parse-project.ts`)

功能：
- 扫描目录结构，生成文件树
- 读取文件内容
- 读取 git log 生成提交历史
- 读取 git diff 生成变更记录
- 输出 JSON 文件

### 4.2 上传脚本 (`scripts/upload-project.ts`)

功能：
- 读取解析后的 JSON
- 连接 Supabase
- 上传/更新数据

### 4.3 Git 同步脚本 (`scripts/sync-git.ts`)

功能：
- 从远程仓库获取最新 git log
- 支持 GitHub API / SSH
- 增量更新提交历史

---

## 5. 前端读取

### 5.1 数据服务 (`src/lib/services/projectService.ts`)

```typescript
// 获取项目列表
export async function getProjects(): Promise<Project[]>

// 获取项目文件树
export async function getProjectFiles(projectId: string): Promise<FileNode[]>

// 获取文件内容
export async function getFileContent(fileId: string): Promise<string>

// 获取 Git 历史
export async function getGitHistory(projectId: string): Promise<GitCommit[]>

// 获取 Diff
export async function getCommitDiff(commitId: string): Promise<FileDiff[]>
```

### 5.2 展示逻辑

1. 网站加载时从 Supabase 获取项目列表
2. 用户打开 IDE 应用时加载对应项目的文件树
3. 点击文件时按需加载文件内容
4. Git 面板显示提交历史
5. 点击 commit 时加载 diff

---

## 6. 安全考虑

### 6.1 Supabase RLS (Row Level Security)

```sql
-- 所有表只允许读取，不允许写入
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON files FOR SELECT USING (true);
CREATE POLICY "Public read access" ON git_commits FOR SELECT USING (true);
CREATE POLICY "Public read access" ON git_diffs FOR SELECT USING (true);

-- 写入操作只能通过服务端密钥（脚本使用）
```

### 6.2 敏感文件过滤

脚本自动排除：
- `.env*` 环境变量
- `node_modules/` 依赖
- `.git/` Git 内部文件
- `*.key`, `*.pem` 密钥文件
- 自定义 `.showcaseignore` 规则

---

## 7. 适用范围

此架构适用于所有 Digital Desktop 中的"应用"：

| 应用 | 展示内容 |
|------|---------|
| Cursor / Windsurf / Antigravity | 代码项目、Git 历史 |
| 任务管理应用 | 预设的任务列表、看板 |
| AI 应用 | 预设的对话历史、示例 |
| 其他展示应用 | 由站长配置的静态/动态内容 |

---

*文档创建于 2025-12-26*
