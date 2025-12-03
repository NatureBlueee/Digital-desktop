# Supabase 数据库 Schema

## 概述

Digital Desktop 使用 Supabase 作为数据库，存储所有应用的数据。

## 表结构

### `apps` 表

存储所有应用的数据。

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

-- 创建索引
CREATE INDEX idx_apps_type ON apps(type);
CREATE INDEX idx_apps_updated_at ON apps(updated_at DESC);
```

### 字段说明

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `id` | TEXT | 应用唯一标识符 | `github-1701234567890` |
| `type` | TEXT | 应用类型 | `github`, `notion`, `chatgpt` |
| `name` | TEXT | 应用名称 | `GitHub`, `Notion` |
| `icon` | TEXT | 应用图标路径 | `/icons/github.svg` |
| `content` | JSONB | 应用内容（JSON格式） | `{"repos": [...]}` |
| `metadata` | JSONB | 元数据（创建时间、版本等） | `{"version": "1.0.0", ...}` |
| `created_at` | TIMESTAMP | 创建时间 | 自动生成 |
| `updated_at` | TIMESTAMP | 更新时间 | 自动生成 |

## 如何在 Supabase 中创建表

### 方法1: SQL 编辑器

1. 登录 [Supabase Dashboard](https://app.supabase.com/)
2. 选择你的项目
3. 点击左侧菜单的 **SQL Editor**
4. 点击 **New query**
5. 复制上面的 SQL 代码并执行

### 方法2: Table Editor

1. 登录 Supabase Dashboard
2. 点击左侧菜单的 **Table Editor**
3. 点击 **New table**
4. 按照字段说明手动创建

## Row Level Security (RLS)

目前暂时**禁用 RLS**（开发阶段）：

```sql
ALTER TABLE apps DISABLE ROW LEVEL SECURITY;
```

> ⚠️ **注意**: 生产环境建议启用 RLS 并配置适当的策略。

## 数据示例

### GitHub 应用数据

```json
{
  "id": "github-1701234567890",
  "type": "github",
  "name": "GitHub",
  "icon": "/icons/github.svg",
  "content": {
    "repos": [
      {
        "id": "nature-blog",
        "name": "nature-blog",
        "description": "Personal blog with Notion CMS",
        "url": "https://github.com/NatureBlueee/nature-blog",
        "language": "TypeScript",
        "stars": 10,
        "files": []
      }
    ]
  },
  "metadata": {
    "createdAt": "2024-12-02T10:00:00Z",
    "updatedAt": "2024-12-02T10:00:00Z",
    "version": "1.0.0"
  }
}
```

### ChatGPT 应用数据

```json
{
  "id": "chatgpt-1701234567890",
  "type": "chatgpt",
  "name": "ChatGPT",
  "icon": "/icons/chatgpt.svg",
  "content": {
    "conversations": [
      {
        "id": "conv-123",
        "title": "关于数字桌面的讨论",
        "messages": [
          {
            "role": "user",
            "content": "我有一个创意...",
            "timestamp": "2024-12-02T10:00:00Z"
          },
          {
            "role": "assistant",
            "content": "这是个很有意思的想法...",
            "timestamp": "2024-12-02T10:01:00Z"
          }
        ],
        "createdAt": "2024-12-02T10:00:00Z"
      }
    ]
  },
  "metadata": {
    "createdAt": "2024-12-02T10:00:00Z",
    "updatedAt": "2024-12-02T10:00:00Z",
    "version": "1.0.0"
  }
}
```

## 数据操作

所有数据操作都通过 `/lib/supabase/database.ts` 中的函数进行：

- `saveAppData(appData)` - 保存或更新应用数据
- `getAllApps()` - 获取所有应用
- `getAppByType(type)` - 获取指定类型的应用
- `deleteApp(id)` - 删除应用

## 未来扩展

如果需要添加版本历史功能，可以创建 `app_versions` 表：

```sql
CREATE TABLE app_versions (
  id SERIAL PRIMARY KEY,
  app_id TEXT REFERENCES apps(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**注意**: 当前版本（MVP）不包含版本历史功能。
