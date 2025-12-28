/**
 * ChatGPT Mock Data
 * Used when Supabase is not configured
 */

import type {
  ConversationListItem,
  ConversationDetail,
  Message,
  PaginatedResponse,
} from '@/types/chatgpt-archive';

// Mock Conversations
export const mockConversations: ConversationDetail[] = [
  {
    id: 'conv-gpt-001',
    title: '如何用Python做数据分析',
    summary: '讨论如何使用Pandas和NumPy进行数据分析',
    tags: ['python', 'data-analysis', 'pandas'],
    message_count: 4,
    created_at: '2025-12-22T08:00:00Z',
    updated_at: '2025-12-22T08:15:00Z',
  },
  {
    id: 'conv-gpt-002',
    title: 'React性能优化技巧',
    summary: '讨论React应用的常见性能问题和优化方法',
    tags: ['react', 'performance', 'frontend'],
    message_count: 4,
    created_at: '2025-12-21T10:00:00Z',
    updated_at: '2025-12-21T10:20:00Z',
  },
  {
    id: 'conv-gpt-003',
    title: 'Docker容器化部署指南',
    summary: '如何使用Docker部署Node.js应用',
    tags: ['docker', 'devops', 'nodejs'],
    message_count: 2,
    created_at: '2025-12-20T14:00:00Z',
    updated_at: '2025-12-20T14:10:00Z',
  },
  {
    id: 'conv-gpt-004',
    title: 'TypeScript高级类型使用',
    summary: '探索TypeScript的高级类型特性',
    tags: ['typescript', 'types', 'programming'],
    message_count: 2,
    created_at: '2025-12-19T16:00:00Z',
    updated_at: '2025-12-19T16:15:00Z',
  },
];

// Mock Messages by conversation
export const mockMessages: Record<string, Message[]> = {
  'conv-gpt-001': [
    {
      id: 'msg-gpt-001-1',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-22T08:00:00Z',
      content_md: '我想学习用Python做数据分析，应该从哪里开始？需要掌握哪些库？',
      assets: [],
    },
    {
      id: 'msg-gpt-001-2',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-22T08:02:00Z',
      content_md: `很好的问题！Python数据分析主要需要掌握以下核心库：

## 必学库

### 1. Pandas - 数据处理
\`\`\`python
import pandas as pd

# 读取CSV文件
df = pd.read_csv('data.csv')

# 查看前5行
print(df.head())

# 基本统计信息
print(df.describe())
\`\`\`

### 2. NumPy - 数值计算
\`\`\`python
import numpy as np

# 创建数组
arr = np.array([1, 2, 3, 4, 5])

# 基本运算
print(arr.mean())  # 平均值
print(arr.std())   # 标准差
\`\`\`

### 3. Matplotlib - 数据可视化
\`\`\`python
import matplotlib.pyplot as plt

plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
plt.xlabel('X轴')
plt.ylabel('Y轴')
plt.title('简单折线图')
plt.show()
\`\`\`

## 学习路径建议

1. **先学Python基础** - 变量、循环、函数
2. **学习Pandas** - 数据读取、清洗、转换
3. **学习可视化** - Matplotlib和Seaborn
4. **进阶学习** - Scikit-learn机器学习

需要我详细讲解某个部分吗？`,
      assets: [],
    },
    {
      id: 'msg-gpt-001-3',
      role: 'user',
      order_index: 3,
      created_at: '2025-12-22T08:10:00Z',
      content_md: '能详细讲一下Pandas的数据清洗吗？比如处理缺失值和重复数据。',
      assets: [],
    },
    {
      id: 'msg-gpt-001-4',
      role: 'assistant',
      order_index: 4,
      created_at: '2025-12-22T08:15:00Z',
      content_md: `当然！数据清洗是数据分析中非常重要的一步。

## 处理缺失值

\`\`\`python
import pandas as pd

# 检查缺失值
print(df.isnull().sum())

# 删除含有缺失值的行
df_clean = df.dropna()

# 用均值填充缺失值
df['age'].fillna(df['age'].mean(), inplace=True)

# 用指定值填充
df['category'].fillna('未知', inplace=True)
\`\`\`

## 处理重复数据

\`\`\`python
# 检查重复行
print(df.duplicated().sum())

# 删除重复行
df_unique = df.drop_duplicates()

# 基于特定列删除重复
df_unique = df.drop_duplicates(subset=['name', 'email'])
\`\`\`

## 数据类型转换

\`\`\`python
# 转换数据类型
df['date'] = pd.to_datetime(df['date'])
df['price'] = df['price'].astype(float)
\`\`\`

## 常用清洗技巧

| 问题 | 解决方法 |
|------|----------|
| 空白字符 | \`df['name'].str.strip()\` |
| 大小写统一 | \`df['name'].str.lower()\` |
| 异常值 | 使用IQR或Z-score检测 |

这些是最常用的数据清洗操作，实际项目中根据具体情况选择合适的方法！`,
      assets: [],
    },
  ],
  'conv-gpt-002': [
    {
      id: 'msg-gpt-002-1',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-21T10:00:00Z',
      content_md: '我的React应用运行很慢，有什么优化建议吗？',
      assets: [],
    },
    {
      id: 'msg-gpt-002-2',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-21T10:05:00Z',
      content_md: `React性能优化是一个很重要的话题！这里是一些常见的优化技巧：

## 1. 使用React.memo避免不必要的重渲染

\`\`\`tsx
const ExpensiveComponent = React.memo(({ data }) => {
  return <div>{/* 复杂的渲染逻辑 */}</div>;
});
\`\`\`

## 2. 使用useMemo和useCallback

\`\`\`tsx
// useMemo - 缓存计算结果
const sortedList = useMemo(() => {
  return items.sort((a, b) => a.name.localeCompare(b.name));
}, [items]);

// useCallback - 缓存函数引用
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);
\`\`\`

## 3. 虚拟列表

对于长列表，使用虚拟化：
\`\`\`tsx
import { FixedSizeList } from 'react-window';

<FixedSizeList
  height={400}
  itemCount={1000}
  itemSize={50}
>
  {Row}
</FixedSizeList>
\`\`\`

## 4. 代码分割

\`\`\`tsx
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
\`\`\`

需要我详细讲解某个优化技巧吗？`,
      assets: [],
    },
    {
      id: 'msg-gpt-002-3',
      role: 'user',
      order_index: 3,
      created_at: '2025-12-21T10:15:00Z',
      content_md: '如何使用React DevTools来定位性能问题？',
      assets: [],
    },
    {
      id: 'msg-gpt-002-4',
      role: 'assistant',
      order_index: 4,
      created_at: '2025-12-21T10:20:00Z',
      content_md: `React DevTools是定位性能问题的利器！以下是使用方法：

## 安装React DevTools

1. Chrome扩展商店搜索"React Developer Tools"
2. 安装后在开发者工具中会出现新的标签页

## Profiler使用步骤

1. **打开Profiler标签**
2. **点击录制按钮**
3. **执行需要分析的操作**
4. **停止录制，查看结果**

## 关键指标

| 指标 | 含义 |
|------|------|
| Render duration | 组件渲染耗时 |
| Commit duration | DOM更新耗时 |
| Why did this render? | 重渲染原因 |

## 常见问题诊断

### 1. 不必要的重渲染
- 查看"Highlight updates"选项
- 闪烁频繁的组件需要优化

### 2. 渲染耗时过长
- 火焰图中查找耗时最长的组件
- 考虑使用memo或拆分组件

### 3. 频繁更新的状态
- 检查是否在循环中调用setState
- 使用batch更新或useReducer

建议开启"Record why each component rendered"选项，可以更清楚地看到重渲染原因！`,
      assets: [],
    },
  ],
  'conv-gpt-003': [
    {
      id: 'msg-gpt-003-1',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-20T14:00:00Z',
      content_md: '如何用Docker部署一个Node.js应用？',
      assets: [],
    },
    {
      id: 'msg-gpt-003-2',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-20T14:10:00Z',
      content_md: `使用Docker部署Node.js应用非常方便！以下是完整的步骤：

## 1. 创建Dockerfile

\`\`\`dockerfile
# 使用官方Node.js镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖
RUN npm ci --only=production

# 复制应用代码
COPY . .

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
\`\`\`

## 2. 创建.dockerignore

\`\`\`
node_modules
npm-debug.log
Dockerfile
.git
.gitignore
\`\`\`

## 3. 构建镜像

\`\`\`bash
docker build -t my-node-app .
\`\`\`

## 4. 运行容器

\`\`\`bash
docker run -p 3000:3000 -d my-node-app
\`\`\`

## 最佳实践

- 使用多阶段构建减小镜像大小
- 不要以root用户运行
- 使用.dockerignore排除不必要的文件
- 利用缓存层加速构建

需要我讲解docker-compose多服务部署吗？`,
      assets: [],
    },
  ],
  'conv-gpt-004': [
    {
      id: 'msg-gpt-004-1',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-19T16:00:00Z',
      content_md: 'TypeScript的泛型和条件类型怎么使用？',
      assets: [],
    },
    {
      id: 'msg-gpt-004-2',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-19T16:15:00Z',
      content_md: `泛型和条件类型是TypeScript最强大的特性之一！

## 泛型基础

\`\`\`typescript
// 基础泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Container<T> {
  value: T;
  getValue: () => T;
}

// 泛型约束
function getLength<T extends { length: number }>(arg: T): number {
  return arg.length;
}
\`\`\`

## 条件类型

\`\`\`typescript
// 基础条件类型
type IsString<T> = T extends string ? true : false;

// 提取类型
type ExtractArrayType<T> = T extends Array<infer U> ? U : never;

// 实用示例
type ElementType = ExtractArrayType<string[]>;  // string
\`\`\`

## 常用内置类型

| 类型 | 用途 |
|------|------|
| \`Partial<T>\` | 所有属性可选 |
| \`Required<T>\` | 所有属性必选 |
| \`Pick<T, K>\` | 选取部分属性 |
| \`Omit<T, K>\` | 排除部分属性 |
| \`ReturnType<T>\` | 获取函数返回类型 |

这些高级类型在实际项目中非常有用，可以让类型系统更加灵活和安全！`,
      assets: [],
    },
  ],
};

// Helper functions
export function getMockConversations(params?: {
  tag?: string;
  query?: string;
  limit?: number;
}): PaginatedResponse<ConversationListItem> {
  let filtered = [...mockConversations];

  if (params?.tag) {
    filtered = filtered.filter(c => c.tags.includes(params.tag!));
  }

  if (params?.query) {
    const q = params.query.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.summary?.toLowerCase().includes(q)
    );
  }

  const limit = params?.limit || 30;
  const data = filtered.slice(0, limit);

  return {
    data,
    next_cursor: null,
    has_more: false,
  };
}

export function getMockConversation(id: string): ConversationDetail | null {
  return mockConversations.find(c => c.id === id) || null;
}

export function getMockMessages(conversationId: string): PaginatedResponse<Message> {
  const messages = mockMessages[conversationId] || [];
  return {
    data: messages,
    next_cursor: null,
    has_more: false,
  };
}

export function getMockTags(): string[] {
  const tagSet = new Set<string>();
  mockConversations.forEach(c => {
    c.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
