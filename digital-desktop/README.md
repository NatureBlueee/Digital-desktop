# Digital Desktop

> 将你的工作桌面搬到浏览器中 - Building in Public 的极致形式

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Status](https://img.shields.io/badge/status-MVP-yellow)

---

## 📖 项目简介

**Digital Desktop** 是一个创新的"数字桌面"网站，模拟操作系统桌面环境，展示创作者的真实工作内容：

- 🐙 **GitHub仓库和代码**
- 💬 **ChatGPT对话历史**
- 📝 **Notion笔记**（未来）
- 🎨 **其他创作工具内容**

### 核心理念

- **应用容器系统**: 可插拔的应用，易于扩展
- **文本渲染系统**: 所有内容本质都是文本，只是渲染方式不同
- **手动同步**: 上传数据文件，完全可控
- **Building in Public**: 完全透明的工作展示

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18.18.0
- npm 或 pnpm
- Supabase账号

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/digital-desktop.git
cd digital-desktop

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，填入你的Supabase URL和Key
```

### 配置Supabase

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 创建新项目
3. 在SQL编辑器中运行以下脚本：

```sql
CREATE TABLE apps (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  icon TEXT,
  content JSONB NOT NULL,
  metadata JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_apps_type ON apps(type);
CREATE INDEX idx_apps_updated_at ON apps(updated_at DESC);

ALTER TABLE apps DISABLE ROW LEVEL SECURITY;
```

4. 复制项目的URL和anon key到 `.env.local`

### 运行

```bash
npm run dev
```

访问 http://localhost:3000

---

## 📁 项目结构

```
digital-desktop/
├── app/                    # Next.js App Router
│   ├── api/               # 后端API
│   └── page.tsx           # 桌面主页
├── components/            # React组件
│   ├── Desktop/          # 桌面环境
│   └── Apps/             # 应用组件
├── lib/                  # 共享库
│   ├── supabase/         # 数据库操作
│   └── adapters/         # 数据适配器
├── types/                # TypeScript类型
└── docs/                 # 文档
    ├── TECH_ARCHITECTURE.md   # 技术架构
    ├── API_REFERENCE.md       # API文档
    ├── FRONTEND_GUIDE.md      # 前端开发指南
    └── DATABASE_SCHEMA.md     # 数据库文档
```

---

## 🎯 功能特性

### 已实现 (v0.1.0)

- ✅ 后端API（上传、获取数据）
- ✅ Supabase数据库集成
- ✅ GitHub数据适配器
- ✅ ChatGPT数据适配器
- ✅ 完整的技术文档

### 开发中

- 🔄 桌面环境UI
- 🔄 窗口系统
- 🔄 GitHub应用
- 🔄 ChatGPT应用

### 未来计划

- 📅 Notion应用
- 📅 Cursor/AI对话应用
- 📅 Instagram应用
- 📅 版本历史功能
- 📅 批注系统
- 📅 实时同步

---

## 📚 文档

- [技术架构文档](./docs/TECH_ARCHITECTURE.md) - 完整的技术架构说明
- [API接口文档](./docs/API_REFERENCE.md) - API使用指南
- [前端开发指南](./docs/FRONTEND_GUIDE.md) - 前端开发说明
- [数据库Schema](./docs/DATABASE_SCHEMA.md) - 数据库设计

---

## 🔧 开发指南

### 前后端分工

- **后端**: 完成 ✅
  - API开发
  - 数据库设计
  - 数据适配器

- **前端**: 进行中 🔄
  - 桌面环境
  - 应用组件
  - UI/UX实现

### 添加新应用

1. 在 `types/index.ts` 中定义数据类型
2. 创建适配器 `lib/adapters/xxx.ts`
3. 在 `lib/adapters/index.ts` 中注册
4. 创建前端组件 `components/Apps/XxxApp/`

详见 [技术架构文档](./docs/TECH_ARCHITECTURE.md)

---

## 🌐 API端点

### 获取所有应用
```http
GET /api/apps
```

### 获取指定应用
```http
GET /api/apps/:type
```

### 上传数据
```http
POST /api/sync/upload
Content-Type: multipart/form-data

file: JSON文件
appType: github | chatgpt | notion
```

详见 [API文档](./docs/API_REFERENCE.md)

---

## 📦 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| Next.js | 16.0.3 | 全栈框架 |
| React | 19.0.0 | UI框架 |
| TypeScript | 5.x | 类型安全 |
| Tailwind CSS | 3.4.1 | 样式框架 |
| Supabase | 2.39.0 | 数据库 |
| Vercel | - | 部署 |

---

## 🤝 贡献

欢迎贡献！

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 提交规范

```
feat: 添加新功能
fix: 修复bug
docs: 文档更新
refactor: 重构代码
chore: 构建/配置更新
```

---

## 📄 许可证

MIT License

---

## 👤 作者

**Nature (Zhang Chenxi)**

- GitHub: [@NatureBlueee](https://github.com/NatureBlueee)

---

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React框架
- [Supabase](https://supabase.com/) - 数据库服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架
- [Vercel](https://vercel.com/) - 部署平台

---

**⭐ 如果这个项目对你有帮助，请给一个Star！**
