/**
 * ChatGPT 窗口主容器
 * 整合侧边栏和聊天区，管理状态
 */

import React, { useState, useEffect, useRef } from 'react';
import { useDesktopStore } from '@/lib/store/desktopStore';
import { cn } from '@/lib/utils';
import { Minus, Square, X } from 'lucide-react';
import { ChatGPTSidebar, Conversation, Project } from './ChatGPTSidebar';
import { ChatGPTChat, ConversationWithMessages } from './ChatGPTChat';
import { Message } from './ChatGPTMessage';
import './chatgpt.css';

interface ChatGPTAppProps {
  windowId: string;
}

// 模拟对话数据
const MOCK_CONVERSATIONS: ConversationWithMessages[] = [
  {
    id: '1',
    title: '如何学习 React 框架',
    messages: [
      { id: '1-1', role: 'user', content: '我想学习 React，应该从哪里开始？' },
      { id: '1-2', role: 'assistant', content: '学习 React 是一个很好的选择！以下是建议的学习路径：\n\n1. **JavaScript 基础** - 确保你掌握 ES6+ 语法，包括箭头函数、解构、模块等\n\n2. **React 官方文档** - 从 react.dev 开始，新文档质量很高\n\n3. **创建第一个项目** - 使用 `create-react-app` 或 Vite 开始\n\n4. **核心概念**：\n   - 组件和 Props\n   - State 状态管理\n   - Hooks（useState, useEffect）\n   - 条件渲染和列表\n\n5. **进阶主题**：\n   - Context API\n   - 自定义 Hooks\n   - 性能优化\n\n需要我详细解释某个部分吗？' },
      { id: '1-3', role: 'user', content: 'Hooks 是什么？能举个例子吗？' },
      { id: '1-4', role: 'assistant', content: 'Hooks 是 React 16.8 引入的特性，让你在函数组件中使用状态和其他 React 特性。\n\n最常用的两个 Hooks：\n\n**useState** - 管理组件状态\n```jsx\nconst [count, setCount] = useState(0);\n\nreturn (\n  <button onClick={() => setCount(count + 1)}>\n    点击了 {count} 次\n  </button>\n);\n```\n\n**useEffect** - 处理副作用（数据获取、订阅等）\n```jsx\nuseEffect(() => {\n  document.title = `点击了 ${count} 次`;\n}, [count]); // 依赖数组\n```\n\n这样代码更简洁，也更容易复用逻辑！' },
    ],
  },
  {
    id: '2',
    title: 'Python 数据分析入门',
    messages: [
      { id: '2-1', role: 'user', content: '用 Python 做数据分析需要学什么库？' },
      { id: '2-2', role: 'assistant', content: 'Python 数据分析的核心库有：\n\n**数据处理**\n- `pandas` - 数据清洗、转换、分析\n- `numpy` - 数值计算基础\n\n**可视化**\n- `matplotlib` - 基础绑图\n- `seaborn` - 统计图表\n- `plotly` - 交互式图表\n\n**机器学习**\n- `scikit-learn` - 传统 ML 算法\n- `statsmodels` - 统计建模\n\n建议从 pandas 开始，它是数据分析的瑞士军刀！' },
    ],
  },
  {
    id: '3',
    title: 'TypeScript 类型系统详解',
    messages: [
      { id: '3-1', role: 'user', content: 'TypeScript 的 interface 和 type 有什么区别？' },
      { id: '3-2', role: 'assistant', content: '两者很相似，但有一些关键区别：\n\n**interface**\n- 可以被扩展（extends）和合并\n- 更适合定义对象形状\n- 可以多次声明同名 interface 会自动合并\n\n**type**\n- 可以定义联合类型、交叉类型\n- 可以使用 typeof、keyof 等操作符\n- 不能重复声明\n\n一般建议：\n- 定义对象结构用 `interface`\n- 需要类型运算用 `type`' },
    ],
  },
  {
    id: '4',
    title: '解释什么是 RESTful API',
    messages: [
      { id: '4-1', role: 'user', content: '什么是 RESTful API？' },
      { id: '4-2', role: 'assistant', content: 'REST（Representational State Transfer）是一种 API 设计风格。\n\n**核心原则**：\n1. 无状态 - 每个请求包含所有信息\n2. 统一接口 - 使用标准 HTTP 方法\n3. 资源导向 - URL 表示资源\n\n**HTTP 方法对应操作**：\n- `GET /users` - 获取用户列表\n- `POST /users` - 创建用户\n- `GET /users/1` - 获取特定用户\n- `PUT /users/1` - 更新用户\n- `DELETE /users/1` - 删除用户\n\n这样的 API 设计直观、易于理解和使用！' },
    ],
  },
  {
    id: '5',
    title: 'Git 分支管理策略',
    messages: [
      { id: '5-1', role: 'user', content: '团队开发应该用什么 Git 分支策略？' },
      { id: '5-2', role: 'assistant', content: '常用的分支策略有几种：\n\n**Git Flow**\n- main：生产代码\n- develop：开发分支\n- feature/*：功能分支\n- release/*：发布分支\n- hotfix/*：紧急修复\n\n**GitHub Flow**（更简单）\n- main：始终可部署\n- feature 分支 + PR\n\n**Trunk Based**\n- 所有人在 main 上开发\n- 使用 feature flags\n\n小团队推荐 GitHub Flow，大团队可以考虑 Git Flow。' },
    ],
  },
];

// 模拟项目数据
const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: '前端学习', color: '#10a37f' },
  { id: 'p2', name: '后端开发', color: '#6941c6' },
];

// 将 ConversationWithMessages 转换为 Conversation（侧边栏用）
function toSidebarConversation(conv: ConversationWithMessages, index: number): Conversation {
  const now = new Date();
  // 模拟不同日期
  const daysAgo = index === 0 ? 0 : index === 1 ? 1 : index < 4 ? 3 : 10;
  const updatedAt = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);

  return {
    id: conv.id,
    title: conv.title,
    updatedAt,
  };
}

export const ChatGPTApp: React.FC<ChatGPTAppProps> = ({ windowId }) => {
  const { closeWindow, minimizeWindow, maximizeWindow } = useDesktopStore();

  // 状态
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeConversationId, setActiveConversationId] = useState<string | undefined>('1');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const containerRef = useRef<HTMLDivElement>(null);

  // 响应式：窗口太小时自动折叠侧边栏
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width < 640) {
          setIsSidebarCollapsed(true);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // 获取当前选中的对话
  const activeConversation = MOCK_CONVERSATIONS.find(
    (c) => c.id === activeConversationId
  );

  // 侧边栏用的对话列表
  const sidebarConversations = MOCK_CONVERSATIONS.map(toSidebarConversation);

  // 切换主题
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div
      ref={containerRef}
      data-chatgpt-theme={theme}
      className={cn(
        "flex flex-col h-full w-full relative overflow-hidden drag-handle",
        "font-sans",
        theme === 'light' ? 'bg-white text-gray-900' : 'bg-[#212121] text-gray-100'
      )}
      style={{
        // 应用 CSS 变量
        ['--chatgpt-bg-primary' as string]: theme === 'light' ? '#ffffff' : '#212121',
        ['--chatgpt-bg-secondary' as string]: theme === 'light' ? '#f9f9f9' : '#171717',
        ['--chatgpt-bg-tertiary' as string]: theme === 'light' ? '#f4f4f4' : '#2f2f2f',
        ['--chatgpt-bg-hover' as string]: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        ['--chatgpt-sidebar-bg' as string]: theme === 'light' ? '#f9f9f9' : '#171717',
        ['--chatgpt-sidebar-hover' as string]: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        ['--chatgpt-sidebar-active' as string]: theme === 'light' ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.1)',
        ['--chatgpt-text-primary' as string]: theme === 'light' ? '#0d0d0d' : '#ececec',
        ['--chatgpt-text-secondary' as string]: theme === 'light' ? '#6e6e6e' : '#b4b4b4',
        ['--chatgpt-text-tertiary' as string]: theme === 'light' ? '#8e8e8e' : '#8e8e8e',
        ['--chatgpt-text-quaternary' as string]: theme === 'light' ? '#b4b4b4' : '#6e6e6e',
        ['--chatgpt-border' as string]: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
        ['--chatgpt-border-light' as string]: theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
        ['--chatgpt-input-bg' as string]: theme === 'light' ? '#f4f4f4' : '#2f2f2f',
        ['--chatgpt-input-placeholder' as string]: '#8e8e8e',
        ['--chatgpt-accent' as string]: '#10a37f',
      }}
    >
      {/* 窗口控制按钮 */}
      <div className="absolute top-0 right-0 z-50 flex items-center gap-1 p-3 drag-handle">
        <button
          onClick={(e) => {
            e.stopPropagation();
            minimizeWindow(windowId);
          }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            theme === 'light'
              ? "hover:bg-gray-200/60 text-gray-500 hover:text-gray-700"
              : "hover:bg-white/10 text-gray-400 hover:text-gray-200"
          )}
        >
          <Minus size={14} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            maximizeWindow(windowId);
          }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            theme === 'light'
              ? "hover:bg-gray-200/60 text-gray-500 hover:text-gray-700"
              : "hover:bg-white/10 text-gray-400 hover:text-gray-200"
          )}
        >
          <Square size={12} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            closeWindow(windowId);
          }}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            theme === 'light'
              ? "hover:bg-red-100 text-gray-500 hover:text-red-600"
              : "hover:bg-red-500/20 text-gray-400 hover:text-red-400"
          )}
        >
          <X size={14} />
        </button>
      </div>

      {/* 主内容区：侧边栏 + 聊天区 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 侧边栏 */}
        <ChatGPTSidebar
          isCollapsed={isSidebarCollapsed}
          toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          conversations={sidebarConversations}
          projects={MOCK_PROJECTS}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* 聊天区 */}
        <ChatGPTChat
          conversation={activeConversation}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(false)}
        />
      </div>
    </div>
  );
};
