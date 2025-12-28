/**
 * Claude Mock Data
 * Used when Supabase is not configured
 */

import type {
  ConversationListItem,
  Conversation,
  Message,
  Artifact,
  Project,
  PaginatedResponse,
  SearchResult,
} from '@/types/claude-archive';

// Mock Projects
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    title: 'Digital Desktop Development',
    description: 'Building a Windows 11 style desktop environment for the web',
    icon: '💻',
    color: '#8B5CF6',
    created_at: '2025-12-20T10:00:00Z',
    updated_at: '2025-12-22T10:00:00Z',
    conversation_count: 2,
  },
  {
    id: 'proj-002',
    title: 'AI Integration Research',
    description: 'Research and documentation for integrating AI assistants',
    icon: '🤖',
    color: '#06B6D4',
    created_at: '2025-12-18T10:00:00Z',
    updated_at: '2025-12-19T16:00:00Z',
    conversation_count: 1,
  },
];

// Mock Conversations
export const mockConversations: Conversation[] = [
  {
    id: 'conv-claude-001',
    title: 'Building a React Component Library',
    summary: 'Discussion about creating a reusable component library with TypeScript and Tailwind CSS',
    is_starred: true,
    tags: ['react', 'typescript', 'components'],
    visibility: 'public',
    share_token: null,
    message_count: 4,
    model: 'claude-3.5-sonnet',
    project_id: 'proj-001',
    created_at: '2025-12-22T10:00:00Z',
    updated_at: '2025-12-22T10:06:45Z',
  },
  {
    id: 'conv-claude-002',
    title: 'Understanding Supabase RLS Policies',
    summary: 'Deep dive into Row Level Security and how to implement proper access control',
    is_starred: true,
    tags: ['supabase', 'security', 'database'],
    visibility: 'public',
    share_token: null,
    message_count: 4,
    model: 'claude-3.5-sonnet',
    project_id: 'proj-001',
    created_at: '2025-12-21T14:30:00Z',
    updated_at: '2025-12-21T14:42:30Z',
  },
  {
    id: 'conv-claude-003',
    title: 'Next.js App Router Best Practices',
    summary: 'Exploring the new App Router patterns and server components',
    is_starred: false,
    tags: ['nextjs', 'react', 'web-dev'],
    visibility: 'public',
    share_token: null,
    message_count: 2,
    model: 'claude-3.5-sonnet',
    project_id: null,
    created_at: '2025-12-20T09:15:00Z',
    updated_at: '2025-12-20T09:17:00Z',
  },
  {
    id: 'conv-claude-004',
    title: 'AI Assistant Comparison Analysis',
    summary: 'Comparing different AI assistants and their capabilities',
    is_starred: false,
    tags: ['ai', 'research', 'analysis'],
    visibility: 'public',
    share_token: null,
    message_count: 2,
    model: 'claude-3-opus',
    project_id: 'proj-002',
    created_at: '2025-12-19T16:00:00Z',
    updated_at: '2025-12-19T16:03:00Z',
  },
];

// Mock Messages by conversation
export const mockMessages: Record<string, Message[]> = {
  'conv-claude-001': [
    {
      id: 'msg-c001-001',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-22T10:00:00Z',
      content_md: "I want to build a reusable component library for my Next.js project. What's the best approach using TypeScript and Tailwind CSS?",
      assets: [],
    },
    {
      id: 'msg-c001-002',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-22T10:01:30Z',
      content_md: `Building a component library with TypeScript and Tailwind CSS is an excellent choice! Here's a structured approach:

## Project Structure

\`\`\`
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── index.ts
│   ├── Input/
│   │   ├── Input.tsx
│   │   └── index.ts
│   └── index.ts          # barrel export
├── hooks/
├── utils/
└── types/
\`\`\`

## Core Principles

1. **Type Safety First**
   - Define explicit prop interfaces for each component
   - Use discriminated unions for variant props
   - Export types alongside components

2. **Composition Over Configuration**
   - Keep components simple and composable
   - Use compound component patterns for complex UI

3. **Tailwind Integration**
   - Use \`clsx\` or \`tailwind-merge\` for class composition
   - Create variant utilities with \`cva\` (class-variance-authority)

Would you like me to elaborate on any specific pattern or show more component examples?`,
      assets: [],
    },
    {
      id: 'msg-c001-003',
      role: 'user',
      order_index: 3,
      created_at: '2025-12-22T10:05:00Z',
      content_md: 'This is great! Can you show me how to implement an Input component with proper form handling?',
      assets: [],
    },
    {
      id: 'msg-c001-004',
      role: 'assistant',
      order_index: 4,
      created_at: '2025-12-22T10:06:45Z',
      content_md: `Here's a comprehensive Input component with form handling support:

## Input Component

\`\`\`tsx
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'flex h-10 w-full rounded-md border px-3 py-2',
            error ? 'border-red-500' : 'border-gray-200',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {helperText && !error && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
\`\`\`

This pattern ensures:
- **Accessibility** - Proper labels, ARIA attributes
- **Type Safety** - Full TypeScript support
- **Flexibility** - Accepts all native input props`,
      assets: [],
    },
  ],
  'conv-claude-002': [
    {
      id: 'msg-c002-001',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-21T14:30:00Z',
      content_md: "I'm setting up Supabase for my project and need to understand RLS (Row Level Security). Can you explain how to implement it properly?",
      assets: [],
    },
    {
      id: 'msg-c002-002',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-21T14:32:00Z',
      content_md: `Row Level Security (RLS) in Supabase/PostgreSQL is a powerful feature for controlling data access at the database level. Here's a comprehensive guide:

## What is RLS?

RLS allows you to define policies that restrict which rows a user can access in a table. This is essential for multi-tenant applications and protecting sensitive data.

## Basic Setup

\`\`\`sql
-- 1. Enable RLS on your table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- 2. Create policies
-- Allow users to read all public posts
CREATE POLICY "Public posts are viewable by everyone"
  ON posts FOR SELECT
  USING (visibility = 'public');

-- Allow users to CRUD their own posts
CREATE POLICY "Users can manage their own posts"
  ON posts FOR ALL
  USING (auth.uid() = user_id);
\`\`\`

## Key Concepts

| Concept | Description |
|---------|-------------|
| \`USING\` clause | Filters rows for SELECT, UPDATE, DELETE |
| \`WITH CHECK\` clause | Validates new data for INSERT, UPDATE |
| \`auth.uid()\` | Returns the current authenticated user's ID |

Would you like me to show more advanced patterns or help with a specific use case?`,
      assets: [],
    },
    {
      id: 'msg-c002-003',
      role: 'user',
      order_index: 3,
      created_at: '2025-12-21T14:40:00Z',
      content_md: 'Yes, I have a specific case: I want public read access for certain data, but only authenticated users should be able to write. How do I set that up?',
      assets: [],
    },
    {
      id: 'msg-c002-004',
      role: 'assistant',
      order_index: 4,
      created_at: '2025-12-21T14:42:30Z',
      content_md: `This is a very common pattern! Here's how to implement public read with authenticated write:

## Implementation

\`\`\`sql
-- Enable RLS
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Public can read all comments (no auth required)
CREATE POLICY "Comments are publicly readable"
  ON comments FOR SELECT
  USING (true);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own comments
CREATE POLICY "Users can update own comments"
  ON comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete own comments"
  ON comments FOR DELETE
  USING (auth.uid() = user_id);
\`\`\`

This setup ensures:
- Anyone can read comments (including non-logged-in users)
- Only logged-in users can create comments
- Users can only modify/delete their own comments`,
      assets: [],
    },
  ],
  'conv-claude-003': [
    {
      id: 'msg-c003-001',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-20T09:15:00Z',
      content_md: "What are the best practices for using Next.js 14 App Router? I'm migrating from the Pages Router.",
      assets: [],
    },
    {
      id: 'msg-c003-002',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-20T09:17:00Z',
      content_md: `Great question! The App Router introduces significant changes. Here are the key best practices:

## 1. Server vs Client Components

**Default to Server Components** - they're the default in App Router:

\`\`\`tsx
// app/page.tsx - Server Component by default
export default async function HomePage() {
  const data = await fetchData();  // Can fetch directly!
  return <div>{data.title}</div>;
}
\`\`\`

**Use \`'use client'\` only when needed:**

\`\`\`tsx
'use client';

import { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

## 2. Layouts and Templates

\`\`\`
app/
├── layout.tsx        # Root layout (required)
├── page.tsx          # Home page
├── dashboard/
│   ├── layout.tsx    # Dashboard-specific layout
│   └── page.tsx      # /dashboard
\`\`\`

## Key Migration Tips

| Pages Router | App Router |
|--------------|------------|
| \`getServerSideProps\` | Direct \`async\` fetch in component |
| \`getStaticProps\` | \`fetch()\` with caching options |
| \`_app.tsx\` | \`app/layout.tsx\` |
| \`useRouter\` (pages) | \`useRouter\` (from \`next/navigation\`) |

Would you like me to explain any specific migration pattern in more detail?`,
      assets: [],
    },
  ],
  'conv-claude-004': [
    {
      id: 'msg-c004-001',
      role: 'user',
      order_index: 1,
      created_at: '2025-12-19T16:00:00Z',
      content_md: 'Can you provide an objective comparison of different AI assistants like ChatGPT, Claude, and Gemini? What are their strengths and weaknesses?',
      assets: [],
    },
    {
      id: 'msg-c004-002',
      role: 'assistant',
      order_index: 2,
      created_at: '2025-12-19T16:03:00Z',
      content_md: `I'll provide an objective analysis based on publicly available information:

## Comparison Overview

| Aspect | ChatGPT (GPT-4) | Claude | Gemini |
|--------|-----------------|--------|--------|
| **Context Window** | 128K tokens | 200K tokens | 1M+ tokens (Pro) |
| **Coding** | Excellent | Excellent | Very Good |
| **Reasoning** | Strong | Strong | Strong |
| **Multimodal** | Yes (images, voice) | Yes (images) | Yes (images, video) |

## Strengths

### ChatGPT (OpenAI)
- Large ecosystem and plugin support
- Strong brand recognition
- Custom GPTs for specialized tasks

### Claude (Anthropic)
- Very long context window
- Strong at following complex instructions
- Artifacts feature for code/documents

### Gemini (Google)
- Deep Google integration
- Massive context window
- Access to real-time information

## Considerations for Developers

**For coding tasks:**
- All three are capable for most programming tasks
- Context window matters for large codebases

**For research/analysis:**
- Verify important claims independently
- All can make mistakes or have outdated info

The "best" choice depends on your specific use case and preferences.`,
      assets: [],
    },
  ],
};

// Mock Artifacts
export const mockArtifacts: Artifact[] = [
  {
    id: 'art-001',
    title: 'Button Component',
    type: 'code',
    language: 'tsx',
    icon: '⚛️',
    conversation_id: 'conv-claude-001',
    message_id: 'msg-c001-002',
    content: `import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes } from 'react';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-white hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />
  )
);`,
    created_at: '2025-12-22T10:01:30Z',
    updated_at: '2025-12-22T10:01:30Z',
  },
  {
    id: 'art-002',
    title: 'RLS Policy Template',
    type: 'code',
    language: 'sql',
    icon: '🔒',
    conversation_id: 'conv-claude-002',
    message_id: 'msg-c002-004',
    content: `-- Enable RLS
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access"
  ON your_table FOR SELECT
  USING (visibility = 'public');

-- Authenticated user insert
CREATE POLICY "Authenticated users can insert"
  ON your_table FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);`,
    created_at: '2025-12-21T14:42:30Z',
    updated_at: '2025-12-21T14:42:30Z',
  },
];

// Helper functions to get data
export function getMockConversations(params?: {
  starred?: boolean;
  tag?: string;
  limit?: number;
}): PaginatedResponse<ConversationListItem> {
  let filtered = [...mockConversations];

  if (params?.starred) {
    filtered = filtered.filter(c => c.is_starred);
  }

  if (params?.tag) {
    filtered = filtered.filter(c => c.tags.includes(params.tag!));
  }

  const limit = params?.limit || 30;
  const data = filtered.slice(0, limit);

  return {
    data,
    next_cursor: null,
    has_more: false,
  };
}

export function getMockConversation(id: string): Conversation | null {
  return mockConversations.find(c => c.id === id) || null;
}

export function getMockMessages(conversationId: string): Message[] {
  return mockMessages[conversationId] || [];
}

export function getMockArtifacts(): PaginatedResponse<Artifact> {
  return {
    data: mockArtifacts,
    next_cursor: null,
    has_more: false,
  };
}

export function getMockProjects(): PaginatedResponse<Project> {
  return {
    data: mockProjects,
    next_cursor: null,
    has_more: false,
  };
}

export function getMockStarredConversations(): ConversationListItem[] {
  return mockConversations.filter(c => c.is_starred);
}
