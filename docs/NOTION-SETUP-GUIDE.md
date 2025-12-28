# Notion 集成配置指南

## 📖 目录

1. [配置概览](#配置概览)
2. [详细步骤](#详细步骤)
3. [两种集成方案对比](#两种集成方案对比)
4. [常见问题](#常见问题)
5. [使用示例](#使用示例)

---

## 配置概览

Digital Desktop 的 Notion 集成支持展示您的多个 Notion 页面，通过左侧列表可以快速切换不同页面。

**所需环境变量**：
```bash
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 详细步骤

### 第 1 步：创建 Notion Integration

1. **访问 Integration 管理页面**
   ```
   https://www.notion.so/my-integrations
   ```

2. **点击 "New integration"**

3. **填写 Integration 信息**：
   - **Name**: `Digital Desktop`（或您喜欢的名字）
   - **Associated workspace**: 选择您的工作区（例如"美丽人生"）
   - **Type**: Internal Integration
   - **Capabilities**:
     - ✅ Read content
     - ✅ Read comments（可选）
     - ⬜ Update content（不需要勾选）
     - ⬜ Insert content（不需要勾选）

4. **点击 "Submit"**

5. **复制 Integration Token**
   - 格式：`secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ 请妥善保管，不要泄露

---

### 第 2 步：配置环境变量

1. **在项目根目录创建 `.env.local` 文件**（如果已存在则编辑）

2. **添加以下配置**：
   ```bash
   # Notion 官方 API Key
   NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **重启开发服务器**：
   ```bash
   npm run dev
   ```

---

### 第 3 步：分享页面给 Integration

这一步**非常重要**！您需要将想要在应用中展示的每个页面都分享给 Integration。

#### 方法 1：分享单个页面

1. 打开 Notion 中的某个页面
2. 点击右上角的 **"..."** 按钮（或 "Share" 按钮）
3. 点击 **"Add connections"** 或 **"Connect to"**
4. 选择您刚创建的 Integration（例如 "Digital Desktop"）
5. 点击 **"Confirm"**

#### 方法 2：分享父页面（推荐）

如果您有一个父页面包含多个子页面：

1. 只需分享父页面给 Integration
2. 所有子页面会**自动继承权限**
3. 这样可以一次性授权所有相关页面

**示例**：
```
📄 美丽人生（父页面）← 分享给 Integration
├── 📝 任务看板
├── 📊 项目管理
└── 📅 日程安排
    ↑ 这些子页面会自动获得权限
```

---

### 第 4 步：测试集成

1. **启动应用**：
   ```bash
   npm run dev
   ```

2. **打开 Notion 应用**：
   - 双击桌面上的 "Notion" 图标
   - 或者访问 `http://localhost:3000` 后双击图标

3. **查看效果**：
   - 左侧：显示所有已分享的页面列表
   - 右侧：点击页面后显示内容
   - 搜索框：可以搜索页面标题

---

## 两种集成方案对比

项目中实现了两种 Notion 集成方案，您可以根据需求选择：

| 特性 | **官方 API 方案**（推荐） | **notion-client 方案** |
|------|-------------------------|----------------------|
| **文件** | `official-client.ts` | `client.ts` |
| **组件** | `NotionAppImproved.tsx` | `NotionApp.tsx` |
| **优点** | • 获取页面列表<br>• 支持多页面展示<br>• 官方支持，稳定 | • 无需创建 Integration<br>• 可读取公开页面<br>• 更简单的配置 |
| **缺点** | • 需要创建 Integration<br>• 需要手动分享页面 | • 只能展示单个页面<br>• 无法列出所有页面<br>• 非官方，可能不稳定 |
| **适用场景** | ✅ 展示多个页面<br>✅ 需要页面列表<br>✅ 正式项目 | 展示单个固定页面<br>临时演示 |
| **配置要求** | `NOTION_API_KEY` | `NOTION_ROOT_PAGE_ID` |

---

## 常见问题

### 1. 页面列表为空怎么办？

**原因**：页面没有分享给 Integration

**解决方法**：
1. 确认 `.env.local` 中的 `NOTION_API_KEY` 正确
2. 打开 Notion 页面
3. 点击 "..." → "Add connections" → 选择您的 Integration
4. 刷新应用页面列表

---

### 2. 出现 "unauthorized" 错误

**原因**：
- API Token 错误
- Token 已过期
- Integration 被删除

**解决方法**：
1. 检查 `.env.local` 中的 Token 是否正确
2. 访问 https://www.notion.so/my-integrations 确认 Integration 存在
3. 如果需要，重新生成 Token

---

### 3. 子页面没有显示

**原因**：可能是 Integration 权限问题

**解决方法**：
1. 确保父页面已分享给 Integration
2. 尝试单独分享子页面
3. 检查子页面是否为"私有"状态

---

### 4. 页面内容加载失败

**可能原因**：
- 页面 ID 错误
- 页面需要额外权限
- 网络问题

**解决方法**：
1. 刷新页面列表
2. 检查浏览器控制台的错误信息
3. 确认页面在 Notion 中可正常访问

---

### 5. 如何获取页面 ID？

**方法 1：从 URL 获取**
```
https://www.notion.so/页面标题-1234567890abcdef1234567890abcdef
                                ↑
                          这部分是 Page ID（32位）
```

**方法 2：使用 API**
- 应用会自动通过 API 获取所有页面 ID
- 无需手动输入

---

## 使用示例

### 示例 1：展示个人工作区

**场景**：您有一个"美丽人生"工作区，包含多个页面

**配置**：
```bash
# .env.local
NOTION_API_KEY=secret_xxx
```

**操作**：
1. 在 Notion 中将"美丽人生"主页分享给 Integration
2. 打开应用，左侧会显示所有页面
3. 点击任意页面查看内容

---

### 示例 2：展示项目文档

**场景**：您有多个项目，每个项目都有独立的 Notion 页面

**配置**：
```bash
# .env.local
NOTION_API_KEY=secret_xxx
```

**操作**：
1. 创建一个父页面，例如"项目总览"
2. 将所有项目页面作为子页面
3. 分享"项目总览"给 Integration
4. 应用会自动显示所有项目页面

---

### 示例 3：展示数据库

**场景**：您使用 Notion Database 管理任务

**配置**：
```bash
# .env.local
NOTION_API_KEY=secret_xxx
```

**操作**：
1. 分享数据库给 Integration
2. 在应用中切换到"数据库"标签
3. 点击数据库查看内容（需要额外开发）

---

## 技术细节

### API 端点

应用提供了以下 API 端点：

| 端点 | 功能 |
|------|------|
| `GET /api/notion/pages` | 获取所有页面列表 |
| `GET /api/notion/databases` | 获取所有数据库列表 |
| `GET /api/notion/blocks/[pageId]` | 获取页面内容块 |
| `GET /api/notion/page/[pageId]` | 获取页面 recordMap（用于渲染） |

### 数据流

```
1. 应用启动
   ↓
2. 调用 /api/notion/pages
   ↓
3. 使用官方 API 获取页面列表
   ↓
4. 左侧显示页面
   ↓
5. 用户点击页面
   ↓
6. 调用 /api/notion/page/[pageId]
   ↓
7. 使用 notion-client 获取 recordMap
   ↓
8. react-notion-x 渲染页面
```

---

## 下一步

配置完成后，您可以：

1. ✅ 在应用中浏览所有 Notion 页面
2. ✅ 使用搜索功能快速找到页面
3. ✅ 点击页面查看完整内容
4. 🔄 自定义页面样式（修改 CSS）
5. 🔄 添加编辑功能（需要额外权限）
6. 🔄 集成 Notion Database 查询

---

## 支持

如果遇到问题：

1. 查看浏览器控制台的错误信息
2. 检查 `.env.local` 配置
3. 确认 Integration 权限正确
4. 查阅 [Notion API 文档](https://developers.notion.com/)

---

**配置愉快！** 🎉

*最后更新：2025-12-28*
