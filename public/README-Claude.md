# Claude HTML 参考文档

本目录包含两个 Claude UI 的 HTML 版本，用于辅助开发 React 组件。

## 文件说明

### 1. `Claude-original.html` (1.6MB)
- **用途**: 完整的原始页面保存，包含所有真实的 HTML 结构和 CSS 类名
- **特点**:
  - 从 https://claude.ai 保存的完整页面
  - 包含所有原始的 CSS 类名和结构
  - 依赖外部 CSS 文件（`Claude_files/`目录），这些文件未包含在项目中
  - **无法直接在浏览器中正常显示**（缺少样式文件）
- **使用场景**: 作为参考查看真实的 CSS 类名、HTML 结构、data 属性

### 2. `claude-prototype.html` (26KB)
- **用途**: 可工作的简化原型，用于快速预览和开发
- **特点**:
  - 使用 Tailwind CSS CDN，可直接在浏览器中打开查看
  - 简化的结构，保留核心功能
  - 响应式设计，支持移动端
  - 包含完整的交互逻辑（JavaScript）
- **使用场景**: 快速预览 UI 效果、开发新功能时的参考

## 关键 CSS 类名映射

### 原始类名系统

Claude 使用自定义的 CSS 变量系统，主要类名包括：

```css
/* 背景色 */
bg-bg-100      /* 主背景色 */
bg-bg-200      /* 次级背景色 */
bg-bg-300      /* 三级背景色（hover等） */
bg-bg-400      /* 四级背景色 */

/* 文本色 */
text-text-100  /* 主文本色 */
text-text-400  /* 次级文本色 */
text-text-500  /* 辅助文本色 */

/* 边框色 */
border-border-300  /* 边框颜色 */

/* 强调色 */
bg-accent-main-100  /* 主强调色（橙色按钮等） */
text-always-white   /* 始终白色文本 */
```

### 组件特定类名

#### 侧边栏
```html
<!-- 侧边栏容器 -->
<nav class="flex flex-col px-0 fixed left-0 transition duration-100
     border-border-300 border-r-0.5 h-screen
     lg:bg-gradient-to-t from-bg-200/5 to-bg-200/30">

  <!-- 按钮样式 -->
  <button class="inline-flex items-center justify-center relative shrink-0
         can-focus select-none
         disabled:pointer-events-none disabled:opacity-50
         border-transparent transition font-base
         duration-300 ease-[cubic-bezier(0.165,0.85,0.45,1)]
         h-8 w-8 rounded-md active:scale-95 group
         Button_ghost__BUAoh">
</nav>
```

#### 按钮类型
```css
/* Ghost 按钮 */
.Button_ghost__BUAoh {
  border-transparent
  transition
  duration-300
  ease-[cubic-bezier(0.165,0.85,0.45,1)]
  active:scale-95  /* 点击缩放效果 */
}

/* 缓动函数 */
ease-[cubic-bezier(0.165,0.85,0.45,1)]  /* Claude 特有的缓动 */
```

#### 过渡动画
```css
/* 侧边栏折叠动画 */
.opacity-0.-translate-x-0.5.transition-all.duration-200

/* hover 效果 */
group-hover:text-text-100
group-hover:opacity-100
group-hover:scale-105
group-hover:-rotate-3  /* 轻微旋转 */
```

## HTML 结构分析

### 整体布局

```html
<body class="bg-bg-100 text-text-100 font-ui min-h-screen">
  <div class="root">
    <div class="flex min-h-full w-full overflow-x-clip relative">
      <!-- 背景网格 -->
      <div class="pointer-events-none absolute inset-0 bg-bg-100
                  [background-image:linear-gradient(...)]
                  [background-size:32px_32px]">
      </div>

      <!-- 侧边栏 -->
      <div class="shrink-0">
        <div class="fixed z-sidebar lg:sticky" style="width: 3.05rem;">
          <nav>...</nav>
        </div>
      </div>

      <!-- 主内容区 -->
      <main class="flex-1">...</main>
    </div>
  </div>
</body>
```

### 侧边栏结构

```
nav (3.05rem 宽度 - 折叠状态)
├── 头部控制
│   └── 展开/折叠按钮
├── 新建对话按钮
│   └── 带圆形图标 + 文本
├── 导航菜单
│   ├── Chats (对话图标)
│   ├── Projects (文件夹图标)
│   ├── Artifacts (组件图标)
│   └── Code (代码图标 + 外部链接)
├── Starred (收藏列表)
│   └── 对话列表项
├── Recents (最近对话)
│   └── 对话列表项 (带更多选项按钮)
└── 底部用户信息
    └── 用户头像 + 设置
```

### 图标 SVG

所有图标使用内联 SVG，尺寸统一为 `20x20`，部分带动画效果：

```html
<!-- 聊天图标 -->
<svg width="20" height="20" viewBox="0 0 20 20">
  <path class="group-hover:-translate-x-[0.5px] transition">...</path>
  <path class="group-hover:translate-x-[0.5px] transition">...</path>
</svg>

<!-- Artifacts 图标 -->
<svg class="shrink-0 group backface-hidden">
  <path class="group-hover:rotate-[120deg]
               transition-transform duration-200
               ease-snappy-out">...</path>
</svg>
```

## 对应到 React 组件

### 当前组件结构

```
src/components/apps/Claude/
├── ClaudeApp.tsx        → 主容器
├── ClaudeSidebar.tsx    → 侧边栏
├── ClaudeChat.tsx       → 聊天区域
├── ClaudeProjects.tsx   → 项目视图
├── ClaudeArtifacts.tsx  → Artifacts 视图
└── ClaudeIcons.tsx      → 图标组件
```

### 映射关系

| HTML 部分 | React 组件 | 关键类名 |
|-----------|-----------|----------|
| `<nav class="flex flex-col...">` | `ClaudeSidebar.tsx` | `border-border-300 border-r-0.5` |
| 新建对话按钮 | `ClaudeSidebar` 内的按钮 | `bg-accent-main-100 rounded-full` |
| 导航菜单项 | `ClaudeSidebar` 内的链接 | `Button_ghost__BUAoh group` |
| 聊天消息 | `ClaudeChat.tsx` | Message 组件 |
| 输入框区域 | `ClaudeChat.tsx` 底部 | `border-2 rounded-2xl focus-within:border-orange-300` |

### 需要注意的细节

1. **动画缓动函数**: `cubic-bezier(0.165, 0.85, 0.45, 1)` - Claude 特有的流畅感
2. **按钮点击效果**: `active:scale-95` 或 `active:scale-[0.985]`
3. **侧边栏宽度**:
   - 折叠: `3.05rem` (约 49px)
   - 展开: 约 `16rem` (256px)
4. **图标动画**: 使用 `group-hover` 实现精细的悬停动画
5. **文本截断**: `truncate + mask-image` 实现渐变淡出效果

## CSS 变量定义（需要在项目中添加）

```css
:root {
  /* 背景色 */
  --bg-100: 250 250 249;  /* #FAFAF9 */
  --bg-200: 245 245 244;  /* #F5F5F4 */
  --bg-300: 240 240 239;  /* #F0F0EF */
  --bg-400: 231 229 228;  /* #E7E5E4 */

  /* 文本色 */
  --text-100: 28 25 23;    /* #1C1917 */
  --text-400: 168 162 158; /* #A8A29E */
  --text-500: 120 113 108; /* #78716C */

  /* 边框色 */
  --border-300: 231 229 228; /* #E7E5E4 */

  /* 强调色 */
  --accent-main-100: 217 119 87;  /* #D97757 橙色 */

  /* 特殊色 */
  --always-white: 255 255 255;
  --always-black: 0 0 0;
}
```

## 开发建议

### 1. 使用 Tailwind 配置

在 `tailwind.config.js` 中添加 Claude 的设计令牌：

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'claude-bg-100': 'hsl(var(--bg-100))',
        'claude-bg-200': 'hsl(var(--bg-200))',
        // ... 更多颜色
      },
      transitionTimingFunction: {
        'claude': 'cubic-bezier(0.165, 0.85, 0.45, 1)',
      }
    }
  }
}
```

### 2. 提取可复用组件

建议创建以下基础组件：

- `Button.tsx` - 基于 `Button_ghost__BUAoh` 样式
- `SidebarItem.tsx` - 侧边栏列表项
- `Icon.tsx` - 统一的图标组件（20x20）
- `Avatar.tsx` - 用户头像

### 3. 动画效果

使用 Framer Motion 或 CSS transitions 实现：
- 侧边栏展开/折叠动画
- 按钮点击缩放效果
- 图标 hover 动画
- 页面切换过渡

### 4. 响应式设计

- 桌面: 固定侧边栏（3.05rem 或展开）
- 平板: 可折叠侧边栏
- 移动: 完全隐藏的抽屉式侧边栏

## 调试技巧

1. **查看真实类名**: 打开 `Claude-original.html` 搜索特定元素
2. **预览效果**: 在浏览器中打开 `claude-prototype.html`
3. **提取 SVG**: 从原始文件中复制完整的 SVG 代码
4. **CSS 变量**: 使用浏览器开发者工具查看计算后的颜色值

## 参考链接

- Claude 官网: https://claude.ai
- Tailwind CSS: https://tailwindcss.com
- Framer Motion: https://www.framer.com/motion/

---

**最后更新**: 2025-12-03
**维护者**: Claude Assistant
