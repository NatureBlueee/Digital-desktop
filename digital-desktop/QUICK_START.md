# 🚀 快速开始指南

> 5分钟快速启动 Digital Desktop 项目

---

## Step 1: 配置Supabase（必须）

### 1.1 创建Supabase项目

1. 访问 https://app.supabase.com/
2. 点击 "New Project"
3. 输入项目名称：`digital-desktop`
4. 设置密码并选择区域
5. 等待项目创建完成（~2分钟）

### 1.2 创建数据库表

1. 在Supabase Dashboard中，点击左侧的 "SQL Editor"
2. 点击 "New query"
3. 复制粘贴以下SQL并执行：

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

4. 点击 "Run" 执行

### 1.3 获取API凭证

1. 点击左侧的 "Settings" → "API"
2. 找到 "Project URL" 和 "Project API keys"
3. 复制 `URL` 和 `anon public` key

---

## Step 2: 配置项目

### 2.1 安装依赖

```bash
cd /home/user/digital-desktop
npm install
```

### 2.2 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入Supabase凭证：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://你的项目id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhb... (你的anon key)
```

---

## Step 3: 启动项目

```bash
npm run dev
```

访问 http://localhost:3000

---

## Step 4: 测试后端API

### 4.1 上传测试数据

打开新终端，运行：

```bash
# 上传GitHub数据
curl -X POST http://localhost:3000/api/sync/upload \
  -F "file=@test-data/github-example.json" \
  -F "appType=github"

# 上传ChatGPT数据
curl -X POST http://localhost:3000/api/sync/upload \
  -F "file=@test-data/chatgpt-example.json" \
  -F "appType=chatgpt"
```

### 4.2 验证数据

```bash
# 查看所有应用
curl http://localhost:3000/api/apps

# 查看GitHub数据
curl http://localhost:3000/api/apps/github

# 查看ChatGPT数据
curl http://localhost:3000/api/apps/chatgpt
```

如果返回JSON数据，说明后端工作正常！✅

---

## Step 5: 开始前端开发

**后端已完成**，现在需要开发前端。

### 5.1 阅读前端开发指南

打开并阅读：[docs/FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md)

### 5.2 安装前端依赖

```bash
npm install react-rnd react-syntax-highlighter lucide-react react-markdown
npm install -D @types/react-syntax-highlighter
```

### 5.3 创建第一个组件

创建 `app/page.tsx`，参考 [FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md) 中的示例。

---

## 📚 文档导航

| 文档 | 用途 |
|------|------|
| [README.md](./README.md) | 项目总体介绍 |
| [FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md) | **前端开发完整指南（重要）** |
| [API_REFERENCE.md](./docs/API_REFERENCE.md) | API详细文档 |
| [TECH_ARCHITECTURE.md](./docs/TECH_ARCHITECTURE.md) | 技术架构说明 |
| [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) | 数据库设计 |
| [PROJECT_SUMMARY.md](./docs/PROJECT_SUMMARY.md) | 项目完成情况总结 |

---

## 🆘 常见问题

### Q: API返回错误

**检查**：
1. Supabase配置是否正确（`.env.local`）
2. 数据库表是否创建成功
3. 开发服务器是否运行

### Q: 无法连接Supabase

**检查**：
1. URL是否以 `https://` 开头
2. API Key是否完整复制
3. 网络连接是否正常

### Q: 上传文件失败

**检查**：
1. JSON格式是否正确
2. `appType` 参数是否正确（`github` 或 `chatgpt`）
3. 文件路径是否正确

---

## ✅ 验收清单

- [ ] Supabase项目创建成功
- [ ] 数据库表创建成功
- [ ] 环境变量配置完成
- [ ] 开发服务器启动成功
- [ ] 测试数据上传成功
- [ ] API返回正确的数据

**全部打勾？恭喜，后端配置完成！现在可以开始前端开发了。**

---

## 🎯 下一步

1. **前端AI开发**：将 [FRONTEND_GUIDE.md](./docs/FRONTEND_GUIDE.md) 交给前端AI
2. **UI设计**：截图参考应用（GitHub、ChatGPT等）
3. **迭代开发**：按照阶段逐步实现功能

---

**祝开发顺利！🎉**
