# API 接口文档

**版本**: 0.1.0
**Base URL**: `http://localhost:3000/api` (开发) / `https://your-domain.vercel.app/api` (生产)

---

## 目录

1. [通用说明](#通用说明)
2. [应用数据API](#应用数据api)
3. [同步API](#同步api)
4. [错误处理](#错误处理)
5. [使用示例](#使用示例)

---

## 通用说明

### 响应格式

所有API返回统一的JSON格式：

```typescript
interface ApiResponse<T = any> {
  success: boolean  // 操作是否成功
  data?: T         // 成功时返回的数据
  error?: string   // 失败时的错误信息
}
```

### HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 客户端错误（参数错误等） |
| 404 | 资源不存在 |
| 500 | 服务器错误 |

---

## 应用数据API

### 1. 获取所有应用

获取桌面上的所有应用数据。

**端点**
```
GET /api/apps
```

**请求参数**

无

**响应示例**

```json
{
  "success": true,
  "data": [
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
    },
    {
      "id": "chatgpt-1701234567890",
      "type": "chatgpt",
      "name": "ChatGPT",
      "icon": "/icons/chatgpt.svg",
      "content": {
        "conversations": [...]
      },
      "metadata": {...}
    }
  ]
}
```

**前端使用**

```typescript
const response = await fetch('/api/apps')
const result: ApiResponse<AppData[]> = await response.json()

if (result.success) {
  const apps = result.data
  // 渲染应用列表
}
```

---

### 2. 获取指定类型的应用

获取特定类型的应用数据（如只获取GitHub）。

**端点**
```
GET /api/apps/:type
```

**路径参数**

| 参数 | 类型 | 说明 | 示例 |
|------|------|------|------|
| type | string | 应用类型 | `github`, `notion`, `chatgpt` |

**请求示例**

```
GET /api/apps/github
```

**响应示例**

```json
{
  "success": true,
  "data": {
    "id": "github-1701234567890",
    "type": "github",
    "name": "GitHub",
    "content": {
      "repos": [...]
    },
    "metadata": {...}
  }
}
```

**错误响应（未找到）**

```json
{
  "success": false,
  "error": "App not found"
}
```

**前端使用**

```typescript
const response = await fetch('/api/apps/github')
const result: ApiResponse<GitHubAppData> = await response.json()

if (result.success) {
  const githubData = result.data
  // 渲染GitHub应用
} else {
  console.error(result.error)
}
```

---

## 同步API

### 3. 上传应用数据

上传数据文件到服务器，更新应用内容。

**端点**
```
POST /api/sync/upload
```

**请求格式**

`Content-Type: multipart/form-data`

**请求参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| file | File | 是 | 数据文件（JSON格式） |
| appType | string | 是 | 应用类型 (`github`, `chatgpt`等) |

**请求示例（使用FormData）**

```typescript
const formData = new FormData()
formData.append('file', jsonFile)
formData.append('appType', 'github')

const response = await fetch('/api/sync/upload', {
  method: 'POST',
  body: formData
})

const result: ApiResponse = await response.json()
```

**响应示例（成功）**

```json
{
  "success": true,
  "data": {
    "id": "github-1701234567890",
    "type": "github",
    "name": "GitHub",
    "content": {...},
    "metadata": {...}
  }
}
```

**响应示例（失败）**

```json
{
  "success": false,
  "error": "Invalid GitHub data format"
}
```

**错误情况**

| 错误信息 | 原因 | 解决方案 |
|----------|------|----------|
| No file provided | 没有上传文件 | 检查FormData |
| No appType provided | 没有指定类型 | 添加appType参数 |
| Invalid XXX data format | 数据格式错误 | 检查JSON结构 |
| Adapter for type "xxx" not implemented | 适配器未实现 | 目前只支持github和chatgpt |

---

## 错误处理

### 错误响应格式

```json
{
  "success": false,
  "error": "错误描述信息"
}
```

### 常见错误

**400 Bad Request**

```json
{
  "success": false,
  "error": "No file provided"
}
```

**404 Not Found**

```json
{
  "success": false,
  "error": "App not found"
}
```

**500 Internal Server Error**

```json
{
  "success": false,
  "error": "Database connection failed"
}
```

---

## 使用示例

### 完整的上传流程（前端）

```typescript
// 1. 用户选择文件
const handleFileUpload = async (file: File, appType: string) => {
  // 2. 创建FormData
  const formData = new FormData()
  formData.append('file', file)
  formData.append('appType', appType)

  // 3. 上传到服务器
  try {
    const response = await fetch('/api/sync/upload', {
      method: 'POST',
      body: formData
    })

    const result: ApiResponse = await response.json()

    // 4. 处理响应
    if (result.success) {
      console.log('上传成功！', result.data)
      // 刷新应用列表
      refreshApps()
    } else {
      console.error('上传失败:', result.error)
      alert(`上传失败: ${result.error}`)
    }
  } catch (error) {
    console.error('网络错误:', error)
    alert('网络错误，请重试')
  }
}
```

### 完整的获取数据流程（前端）

```typescript
// 获取所有应用并渲染
const loadApps = async () => {
  try {
    const response = await fetch('/api/apps')
    const result: ApiResponse<AppData[]> = await response.json()

    if (result.success) {
      const apps = result.data || []

      // 渲染桌面上的应用图标
      apps.forEach(app => {
        renderAppIcon(app)
      })
    }
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 点击应用图标，获取详细数据
const openApp = async (appType: string) => {
  try {
    const response = await fetch(`/api/apps/${appType}`)
    const result: ApiResponse<AppData> = await response.json()

    if (result.success) {
      // 渲染应用窗口
      renderAppWindow(result.data)
    } else {
      alert('应用数据不存在，请先上传')
    }
  } catch (error) {
    console.error('打开应用失败:', error)
  }
}
```

---

## 数据文件格式

### GitHub数据格式

前端上传的JSON文件应该符合以下格式：

```json
{
  "repos": [
    {
      "name": "nature-blog",
      "description": "Personal blog",
      "url": "https://github.com/NatureBlueee/nature-blog",
      "language": "TypeScript",
      "stars": 10
    }
  ]
}
```

或者直接是数组：

```json
[
  {
    "name": "nature-blog",
    "description": "Personal blog",
    "language": "TypeScript"
  }
]
```

**最简格式**（只需要name）：

```json
[
  { "name": "repo1" },
  { "name": "repo2" }
]
```

### ChatGPT对话格式

```json
{
  "conversations": [
    {
      "id": "conv-123",
      "title": "对话标题",
      "messages": [
        {
          "role": "user",
          "content": "用户消息",
          "timestamp": "2024-12-02T10:00:00Z"
        },
        {
          "role": "assistant",
          "content": "AI回复",
          "timestamp": "2024-12-02T10:01:00Z"
        }
      ]
    }
  ]
}
```

或ChatGPT原生导出格式（带mapping）：

```json
[
  {
    "title": "对话标题",
    "create_time": 1701234567,
    "mapping": {
      "uuid1": {
        "message": {
          "author": { "role": "user" },
          "content": { "parts": ["用户消息"] }
        }
      }
    }
  }
]
```

---

## 环境配置

### 环境变量

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 开发服务器

```bash
npm run dev
# API访问地址: http://localhost:3000/api/*
```

---

## 测试API

### 使用curl测试

**获取所有应用**:
```bash
curl http://localhost:3000/api/apps
```

**上传GitHub数据**:
```bash
curl -X POST http://localhost:3000/api/sync/upload \
  -F "file=@github-data.json" \
  -F "appType=github"
```

### 使用Postman测试

1. 导入API端点
2. 设置环境变量 `{{baseUrl}} = http://localhost:3000/api`
3. 测试各个端点

---

## 更新日志

**v0.1.0** (2024-12-02)
- 初始版本
- 实现基础的CRUD API
- 支持GitHub和ChatGPT数据上传

---

## 下一步

查看 [FRONTEND_GUIDE.md](./FRONTEND_GUIDE.md) 了解如何在前端使用这些API。
