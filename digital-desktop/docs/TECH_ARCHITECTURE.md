# Digital Desktop 技术架构文档

**最后更新**: 2024-12-02
**版本**: 0.1.0
**状态**: 初始架构（MVP阶段）

---

## 目录

1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [架构设计](#架构设计)
4. [目录结构](#目录结构)
5. [数据流](#数据流)
6. [核心模块](#核心模块)
7. [API设计](#api设计)
8. [数据库设计](#数据库设计)
9. [部署方案](#部署方案)
10. [开发约定](#开发约定)

---

## 项目概述

Digital Desktop 是一个创新的"数字桌面"项目，旨在将真实的工作环境（应用和数据）搬到网页上，实现 Building in Public 的极致形式。

### 核心理念

- **应用容器系统**: 桌面环境 + 可插拔的应用
- **文本渲染系统**: 所有内容本质都是文本，只是渲染方式不同
- **手动同步优先**: MVP阶段采用手动上传/同步，避免过度复杂化
- **高度模块化**: 添加新应用不影响现有系统

---

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.0.3 | React框架 + SSR |
| React | 19.0.0 | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4.1 | 样式框架 |

### 后端

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js API Routes | 16.0.3 | API后端 |
| Supabase | 2.39.0 | 数据库（PostgreSQL） |

### 部署

| 服务 | 用途 |
|------|------|
| Vercel | 前端 + API部署 |
| Supabase | 数据库托管 |

### 开发工具

- Node.js >= 18.18.0
- npm/pnpm
- Git

---

## 架构设计

### 整体架构（三层）

```
┌─────────────────────────────────────────┐
│          前端层 (Frontend)               │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │Desktop │  │Window  │  │ Apps   │    │
│  │ Env    │  │Manager │  │        │    │
│  └────────┘  └────────┘  └────────┘    │
└─────────────────────────────────────────┘
                  ↕ HTTP/JSON
┌─────────────────────────────────────────┐
│          API层 (Backend)                 │
│  ┌────────┐  ┌────────┐  ┌────────┐    │
│  │Upload  │  │Get Apps│  │Adapters│    │
│  │API     │  │API     │  │        │    │
│  └────────┘  └────────┘  └────────┘    │
└─────────────────────────────────────────┘
                  ↕ Supabase SDK
┌─────────────────────────────────────────┐
│         数据层 (Database)                │
│         Supabase PostgreSQL              │
│              apps 表                     │
└─────────────────────────────────────────┘
```

### 设计原则

1. **前后端分离**: 通过API通信，前后端可独立开发
2. **适配器模式**: 每种数据源有独立的适配器
3. **类型共享**: 前后端共享TypeScript类型定义
4. **开放封闭**: 对扩展开放（添加新应用），对修改封闭（不改核心代码）

---

## 目录结构

```
digital-desktop/
├── app/                    # Next.js App Router
│   ├── api/               # 后端API
│   │   ├── apps/          # 获取应用数据
│   │   │   ├── route.ts   # GET /api/apps
│   │   │   └── [type]/    # GET /api/apps/:type
│   │   │       └── route.ts
│   │   └── sync/          # 同步数据
│   │       └── upload/    # POST /api/sync/upload
│   │           └── route.ts
│   ├── layout.tsx         # 根布局
│   └── page.tsx           # 桌面主页（前端）
│
├── components/            # React组件（前端负责）
│   ├── Desktop/          # 桌面环境
│   └── Apps/             # 应用组件
│
├── lib/                  # 共享库
│   ├── supabase/         # Supabase客户端
│   │   ├── client.ts     # Supabase实例
│   │   └── database.ts   # 数据库操作
│   └── adapters/         # 数据适配器（核心）
│       ├── base.ts       # 基类
│       ├── github.ts     # GitHub适配器
│       ├── chatgpt.ts    # ChatGPT适配器
│       └── index.ts      # 导出
│
├── types/                # TypeScript类型定义
│   └── index.ts          # 所有类型
│
├── docs/                 # 文档
│   ├── TECH_ARCHITECTURE.md    # 本文档
│   ├── DATABASE_SCHEMA.md      # 数据库文档
│   ├── API_REFERENCE.md        # API文档
│   └── FRONTEND_GUIDE.md       # 前端开发指南
│
├── public/               # 静态资源
│   └── icons/            # 应用图标
│
├── .env.example          # 环境变量示例
├── package.json          # 依赖配置
├── tsconfig.json         # TypeScript配置
├── tailwind.config.ts    # Tailwind配置
└── next.config.ts        # Next.js配置
```

---

## 数据流

### 上传数据流程

```
1. 用户准备数据文件（JSON）
   ↓
2. 前端上传文件到 POST /api/sync/upload
   ↓
3. API接收文件 + appType参数
   ↓
4. 调用对应的适配器解析文件
   ↓
5. 适配器返回标准化的AppData
   ↓
6. 保存到Supabase数据库
   ↓
7. 返回成功响应
```

### 获取数据流程

```
1. 前端请求 GET /api/apps 或 /api/apps/:type
   ↓
2. API从Supabase查询数据
   ↓
3. 返回JSON数据
   ↓
4. 前端渲染应用
```

---

## 核心模块

### 1. 适配器系统 (`lib/adapters/`)

**作用**: 将不同来源的数据转换为统一格式

**工作原理**:
```typescript
// 1. 基类定义接口
abstract class BaseAdapter {
  abstract parseFromFile(file: File): Promise<AppData>
  abstract parseFromJSON(json: any): AppData
  abstract validate(data: any): boolean
}

// 2. 具体适配器实现
class GitHubAdapter extends BaseAdapter {
  parseFromFile(file) {
    // 解析GitHub导出的JSON
    // 返回统一的AppData格式
  }
}

// 3. 使用
const adapter = getAdapter('github')
const appData = await adapter.parseFromFile(file)
```

**添加新适配器的步骤**:
1. 在 `types/index.ts` 中定义数据类型
2. 创建 `lib/adapters/xxx.ts` 继承 `BaseAdapter`
3. 在 `lib/adapters/index.ts` 中注册

### 2. 数据库操作 (`lib/supabase/`)

**提供的函数**:
- `saveAppData(appData)` - 保存/更新应用
- `getAllApps()` - 获取所有应用
- `getAppByType(type)` - 获取指定应用
- `deleteApp(id)` - 删除应用

**特点**:
- 封装Supabase细节
- 统一错误处理
- 类型安全

### 3. API路由 (`app/api/`)

**端点列表**:
| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/apps` | GET | 获取所有应用 |
| `/api/apps/:type` | GET | 获取指定类型应用 |
| `/api/sync/upload` | POST | 上传数据文件 |

**请求/响应格式**: 见 [API_REFERENCE.md](./API_REFERENCE.md)

---

## API设计

详见 [API_REFERENCE.md](./API_REFERENCE.md)

### 统一响应格式

所有API返回统一的 `ApiResponse` 格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}
```

**成功示例**:
```json
{
  "success": true,
  "data": { ... }
}
```

**错误示例**:
```json
{
  "success": false,
  "error": "Invalid data format"
}
```

---

## 数据库设计

详见 [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)

### 核心表: `apps`

```sql
CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  content JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

**特点**:
- 使用 JSONB 存储灵活的content数据
- 支持不同类型的应用
- 自动时间戳

---

## 部署方案

### Vercel部署

1. 连接GitHub仓库
2. 设置环境变量（Supabase URL和Key）
3. 自动部署

### Supabase配置

1. 创建项目
2. 运行SQL脚本创建表
3. 复制URL和Key到Vercel

### 环境变量

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 开发约定

### 代码规范

1. **命名约定**
   - 组件: PascalCase (`GitHubApp.tsx`)
   - 函数: camelCase (`getAppData()`)
   - 文件: kebab-case (`api-client.ts`)
   - 常量: UPPER_SNAKE_CASE (`API_BASE_URL`)

2. **类型定义**
   - 所有接口放在 `types/index.ts`
   - 导出时使用 `export interface`
   - 避免使用 `any`，优先使用 `unknown`

3. **错误处理**
   ```typescript
   try {
     // 操作
   } catch (error) {
     console.error('描述性错误信息:', error)
     return { success: false, error: error.message }
   }
   ```

4. **异步操作**
   - 优先使用 `async/await`
   - 避免回调地狱

### Git提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
refactor: 重构代码
chore: 构建/配置更新
```

### 文档更新规则

**每次代码更改都必须更新相关文档**：

- 添加新API → 更新 `API_REFERENCE.md`
- 修改数据结构 → 更新 `DATABASE_SCHEMA.md`
- 改变架构 → 更新本文档
- 前端接口变化 → 更新 `FRONTEND_GUIDE.md`

---

## 技术决策记录

### 决策1: 为什么选择 Next.js API Routes？

**备选方案**:
- A. 独立的Node.js后端
- B. Monorepo（独立前后端）
- C. Next.js API Routes（选择）

**选择原因**:
- ✅ 单一项目，开发部署简单
- ✅ 前后端共享TypeScript类型
- ✅ Vercel部署无缝集成
- ✅ 适合个人开发

### 决策2: 为什么使用 Supabase？

**备选方案**:
- A. MongoDB
- B. MySQL
- C. Supabase（选择）

**选择原因**:
- ✅ 用户已有账号
- ✅ PostgreSQL功能强大
- ✅ JSONB支持灵活数据
- ✅ 免费额度够用
- ✅ 实时功能（未来可用）

### 决策3: 为什么手动上传而不是自动同步？

**MVP阶段原因**:
- ✅ 实现简单
- ✅ 可控性强（筛选内容）
- ✅ 避免敏感信息泄露
- ✅ 降低API成本

**未来可能**:
- 定时自动fetch
- Webhook触发
- 实时同步

---

## MVP范围

### ✅ 包含

- [x] 基础项目结构
- [x] Supabase数据库
- [x] 文件上传API
- [x] 数据获取API
- [x] GitHub适配器
- [x] ChatGPT适配器
- [ ] 前端桌面环境（前端AI负责）
- [ ] 前端应用组件（前端AI负责）

### ❌ 不包含（未来版本）

- 版本历史
- 实时同步
- 批注系统
- 搜索功能
- 移动端优化
- 用户认证

---

## 下一步计划

1. **前端开发** - 交给前端AI完成
2. **测试上传** - 测试文件上传和数据展示
3. **部署** - Vercel + Supabase
4. **迭代** - 根据使用情况优化

---

## 联系方式

如有问题，查看 [API_REFERENCE.md](./API_REFERENCE.md) 或 [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md)

**文档最后更新**: 2024-12-02
