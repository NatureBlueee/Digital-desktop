# ChatGPT 窗口 UI 实现计划

> 最后更新：2024-12-07
> 状态：进行中

---

## 一、项目背景

### 1.1 所属项目
这是"模拟 Windows 桌面"艺术项目的一部分，整个项目是一个网页实现的仿 Windows 11 桌面系统。

### 1.2 本次任务
在模拟桌面中创建一个 **ChatGPT 窗口**，像素级还原官方 ChatGPT 界面的外观，用于**展示用户的聊天记录数据**。

---

## 二、核心需求

### 2.1 要什么

| 需求 | 描述 |
|-----|------|
| 纯前端静态 UI | 视觉上与官方 ChatGPT 界面一致 |
| 侧边栏 | 显示对话列表，支持按项目分组 |
| 主聊天区 | 展示选中对话的消息记录 |
| 对话切换 | 点击侧边栏切换查看不同对话 |
| 项目分组 | 可选，对话的分类功能 |
| 深色/浅色主题 | 视觉切换 |

### 2.2 不要什么

| 不需要 | 原因 |
|-------|------|
| 真实 AI 对话功能 | 只展示历史记录，不调用 API |
| 发送消息功能 | 只读查看 |
| 登录/账号系统 | 不需要 |
| 设置界面 | 不需要 |
| 完整前端框架逻辑 | 保持轻量 |

---

## 三、技术栈

基于现有项目架构：
- **框架**: Next.js 16 (App Router)
- **样式**: Tailwind CSS + 自定义 CSS 变量
- **状态管理**: Zustand
- **窗口系统**: react-rnd (已有)

---

## 四、组件结构设计

### 4.1 目录结构

```
src/components/apps/ChatGPT/
├── ChatGPTApp.tsx              # 主容器（窗口控制 + 布局）
├── ChatGPTSidebar.tsx          # 侧边栏（对话列表 + 项目分组）
├── ChatGPTChat.tsx             # 聊天区（消息展示）
├── ChatGPTHistoryList.tsx      # 历史列表组件（分组：今天/昨天/过去7天）
├── ChatGPTMessage.tsx          # 单条消息组件
├── chatgpt.css                 # CSS 变量 + 精简样式
└── icons/
    ├── ChatGPTLogo.tsx         # ChatGPT Logo
    ├── NewChatIcon.tsx         # 新建聊天图标
    ├── SearchIcon.tsx          # 搜索图标
    ├── SidebarToggleIcon.tsx   # 侧边栏切换图标
    ├── ProjectIcon.tsx         # 项目图标
    └── MoreIcon.tsx            # 更多选项图标
```

### 4.2 数据流

```
┌─────────────────────────────────────────────────────────────┐
│                     ChatGPTApp                               │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   ChatGPTSidebar    │    │       ChatGPTChat           │ │
│  │                     │    │                             │ │
│  │  ┌───────────────┐  │    │  ┌───────────────────────┐  │ │
│  │  │HistoryList    │  │───▶│  │ Messages Display     │  │ │
│  │  │               │  │    │  │                       │  │ │
│  │  │ - 今天        │  │    │  │ User: xxx             │  │ │
│  │  │ - 昨天        │  │    │  │ AI: xxx               │  │ │
│  │  │ - 过去7天     │  │    │  │                       │  │ │
│  │  │ - 项目分组    │  │    │  └───────────────────────┘  │ │
│  │  └───────────────┘  │    │                             │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

状态管理：
- activeConversationId: 当前选中的对话 ID
- conversations: 对话列表数据
- theme: 'light' | 'dark'
```

---

## 五、视觉规范

### 5.1 颜色系统（CSS Variables）

```css
/* Light Theme */
:root, [data-chatgpt-theme="light"] {
  --chatgpt-bg-primary: #ffffff;
  --chatgpt-bg-secondary: #f9f9f9;
  --chatgpt-bg-tertiary: #f4f4f4;
  --chatgpt-text-primary: #0d0d0d;
  --chatgpt-text-secondary: #6e6e6e;
  --chatgpt-text-tertiary: #8e8e8e;
  --chatgpt-border: rgba(0, 0, 0, 0.1);
  --chatgpt-hover: rgba(0, 0, 0, 0.05);
  --chatgpt-accent: #10a37f;
}

/* Dark Theme */
[data-chatgpt-theme="dark"] {
  --chatgpt-bg-primary: #212121;
  --chatgpt-bg-secondary: #171717;
  --chatgpt-bg-tertiary: #2f2f2f;
  --chatgpt-text-primary: #ececec;
  --chatgpt-text-secondary: #b4b4b4;
  --chatgpt-text-tertiary: #8e8e8e;
  --chatgpt-border: rgba(255, 255, 255, 0.1);
  --chatgpt-hover: rgba(255, 255, 255, 0.05);
}
```

### 5.2 尺寸规范

| 元素 | 尺寸 |
|-----|------|
| 侧边栏宽度 | 260px |
| 历史项高度 | 40px |
| 消息气泡最大宽度 | 48rem |
| 用户头像 | 32px |
| AI 头像 | 28px |
| 圆角 | 8px / 12px / 16px |

### 5.3 字体

```css
font-family: 'Söhne', ui-sans-serif, system-ui, -apple-system, sans-serif;
```

---

## 六、功能模块详解

### 6.1 侧边栏功能

```
┌─────────────────────┐
│ [≡] ChatGPT    [+]  │  ← 折叠按钮 + Logo + 新建聊天
├─────────────────────┤
│ [🔍] 搜索           │  ← 搜索按钮（可选功能）
├─────────────────────┤
│ 今天                │
│   对话标题 1        │
│   对话标题 2        │
├─────────────────────┤
│ 昨天                │
│   对话标题 3        │
├─────────────────────┤
│ 过去 7 天           │
│   对话标题 4        │
│   对话标题 5        │
├─────────────────────┤
│ 📁 项目名称         │  ← 项目分组（可展开/收起）
│   └ 对话 A          │
│   └ 对话 B          │
├─────────────────────┤
│ [头像] 用户名       │  ← 底部用户信息
└─────────────────────┘
```

### 6.2 聊天区功能

```
┌─────────────────────────────────────────────┐
│  ChatGPT 4o              [▼]               │  ← 模型选择器（仅视觉）
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ 👤 User                                │ │
│  │ 这是用户发送的消息                      │ │
│  └────────────────────────────────────────┘ │
│                                             │
│  ┌────────────────────────────────────────┐ │
│  │ 🤖 ChatGPT                             │ │
│  │ 这是 AI 的回复消息                      │ │
│  │ 支持 Markdown 渲染                      │ │
│  └────────────────────────────────────────┘ │
│                                             │
│                    ...                      │
│                                             │
├─────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ │
│ │ [+] 输入框（只读/禁用）         [🎤][▶] │ │  ← 输入框（仅视觉展示）
│ └─────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

### 6.3 空白状态

当没有选中对话时，显示：
- 大尺寸 ChatGPT Logo
- 欢迎文案："有什么可以帮忙的？"

---

## 七、实现步骤

### Phase 1: 基础设施
- [x] 创建计划文档
- [ ] 创建工作日志
- [ ] 创建 `chatgpt.css` 样式变量文件
- [ ] 提取核心 SVG 图标

### Phase 2: 侧边栏实现
- [ ] 重构 `ChatGPTSidebar.tsx`
- [ ] 创建 `ChatGPTHistoryList.tsx`
- [ ] 实现对话列表分组逻辑
- [ ] 实现项目分组功能

### Phase 3: 聊天区实现
- [ ] 重构 `ChatGPTChat.tsx`
- [ ] 创建 `ChatGPTMessage.tsx`
- [ ] 实现消息列表渲染
- [ ] 空白状态 UI

### Phase 4: 交互完善
- [ ] 对话切换功能
- [ ] 侧边栏折叠/展开
- [ ] 深色/浅色主题切换

### Phase 5: 视觉打磨
- [ ] 精确调整间距和颜色
- [ ] Hover 效果
- [ ] 滚动条样式
- [ ] 响应式适配

---

## 八、数据结构

### 8.1 对话数据结构

```typescript
interface Conversation {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  projectId?: string;  // 可选：所属项目
  messages: Message[];
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Project {
  id: string;
  name: string;
  icon?: string;
  color?: string;
}
```

### 8.2 示例数据

项目将使用模拟数据进行展示，数据来源于用户上传的聊天记录 JSON。

---

## 九、参考资源

### 9.1 提取的官方资源位置

| 文件 | 路径 |
|-----|------|
| 完整 HTML | `Clean-temp/pixel-perfect-ui/index.html` |
| CSS 变量 | `Clean-temp/comprehensive-analysis/css-variables.json` |
| 类名列表 | `Clean-temp/pixel-perfect-ui/classes.json` |
| DOM 结构 | `Clean-temp/comprehensive-analysis/dom-structure.json` |
| 主 CSS | `Clean-temp/pixel-perfect-ui/assets/root-esc7wwen.css` |

### 9.2 现有组件位置

| 文件 | 路径 |
|-----|------|
| 主容器 | `src/components/apps/ChatGPT/ChatGPTApp.tsx` |
| 侧边栏 | `src/components/apps/ChatGPT/ChatGPTSidebar.tsx` |
| 聊天区 | `src/components/apps/ChatGPT/ChatGPTChat.tsx` |

---

## 十、注意事项

1. **保持轻量**：不引入额外的大型依赖
2. **视觉优先**：功能简化，视觉精确还原
3. **兼容窗口系统**：保留自定义标题栏和窗口控制
4. **响应式**：适配窗口大小变化，小窗口自动折叠侧边栏
5. **可扩展**：预留数据接口，便于后续接入真实数据

---

## 十一、验收标准

- [ ] 侧边栏样式与官方 ChatGPT 一致
- [ ] 可以切换查看不同对话
- [ ] 消息显示正确（用户 vs AI 区分）
- [ ] 深色/浅色主题可切换
- [ ] 窗口可拖拽、调整大小、最小化、最大化、关闭
- [ ] 小窗口时侧边栏自动折叠

---

*文档结束*
