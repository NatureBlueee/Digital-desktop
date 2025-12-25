/**
 * AI IDE Market Data
 * Based on 2025 research
 */

import type { AIIDEInfo } from '@/types/ai-ide';

export const aiIDEData: AIIDEInfo[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    company: 'Anysphere',
    logo: '/icons/cursor-ai-code-icon.svg',
    tagline: 'The AI Code Editor',
    description: 'Cursor is an AI-powered IDE that combines VS Code familiarity with powerful AI features. It offers smart autocomplete, multi-agent parallel execution, and seamless model switching.',
    website: 'https://cursor.com',
    pricing: [
      { name: 'Hobby', price: 'Free', features: ['One-week Pro trial', 'Limited agent requests', 'Limited tab completions'] },
      { name: 'Pro', price: '$20/mo', features: ['Extended agent limits', 'Unlimited tab completions', 'Background agents', 'Max context windows'], recommended: true },
      { name: 'Pro+', price: '$60/mo', features: ['Everything in Pro', '3x usage on all models'] },
      { name: 'Ultra', price: '$200/mo', features: ['Everything in Pro+', '20x usage', 'Priority access'] },
    ],
    features: [
      { name: 'Multi-Agent Parallel', description: 'Run up to 8 agents simultaneously on a single prompt', icon: 'Users' },
      { name: 'Composer Model', description: 'Proprietary coding model designed for building software', icon: 'Wand2' },
      { name: 'Instant Grep', description: 'All grep commands by agents are instant across all models', icon: 'Search' },
      { name: 'Background Agents', description: 'AI pair programmers in isolated Ubuntu VMs with internet', icon: 'Server' },
      { name: 'Smart Autocomplete', description: 'Predicts next edit across multiple lines, adapts to your patterns', icon: 'Sparkles' },
      { name: 'AI Code Reviews', description: 'Find and fix bugs directly with AI-powered reviews', icon: 'CheckCircle' },
    ],
    models: ['OpenAI GPT-4', 'Claude 3.5', 'Gemini', 'xAI Grok', 'Composer (proprietary)'],
    platform: ['Windows', 'macOS', 'Linux'],
    baseEditor: 'VS Code Fork',
    releaseYear: 2023,
    highlights: [
      '1M+ users in 16 months',
      '360K paying customers',
      'Supermaven-powered autocomplete',
      'Git worktrees for agent isolation',
    ],
    stats: {
      users: '1M+',
      rating: 4.8,
    },
  },
  {
    id: 'antigravity',
    name: 'Antigravity',
    company: 'Google',
    logo: '/icons/antigravity.png',
    tagline: 'Build the New Way',
    description: 'Google Antigravity is a free AI-powered IDE that treats agents as first-class citizens. Build software using autonomous agents that plan, execute, and validate complex engineering tasks.',
    website: 'https://antigravityai.org',
    pricing: [
      { name: 'Free Preview', price: 'Free', features: ['100% free during preview', 'Generous Gemini 3 Pro limits', 'All features included'], recommended: true },
    ],
    features: [
      { name: 'Agent-First Design', description: 'Agents are first-class citizens, not just tools', icon: 'Bot' },
      { name: 'Multi-Surface Autonomy', description: 'Agents work across editor, terminal, and browser', icon: 'Layers' },
      { name: 'Agent Manager', description: 'Dispatch multiple agents to work on different tasks simultaneously', icon: 'LayoutDashboard' },
      { name: 'Artifacts System', description: 'Agents generate tangible deliverables: task lists, plans, screenshots', icon: 'FileBox' },
      { name: 'Development Modes', description: 'Autopilot, Review-driven, or Agent-assisted modes', icon: 'Settings2' },
      { name: 'VS Code Compatible', description: 'Import settings, extensions, and keybindings seamlessly', icon: 'Import' },
    ],
    models: ['Gemini 3 Pro', 'Claude Sonnet 4.5', 'GPT-OSS'],
    platform: ['Windows', 'macOS', 'Linux'],
    baseEditor: 'VS Code Fork',
    releaseYear: 2025,
    highlights: [
      'Free during public preview',
      'Agent-first architecture',
      'Artifacts for transparency',
      'Google backing',
    ],
    stats: {
      rating: 4.6,
    },
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    company: 'Cognition (formerly Codeium)',
    logo: '/icons/windsurf.svg',
    tagline: 'The Agentic IDE',
    description: 'Windsurf (formerly Codeium) is an agentic IDE with deep codebase understanding through its Cascade engine. It creates a graph of your entire repository for intelligent multi-file reasoning.',
    website: 'https://windsurf.com',
    pricing: [
      { name: 'Free', price: 'Free', features: ['25 credits/month', 'Basic features'] },
      { name: 'Pro', price: '$15/mo', features: ['500 credits/month', 'Advanced features'], recommended: true },
      { name: 'Teams', price: '$30/user/mo', features: ['Team collaboration', 'Admin controls'] },
      { name: 'Enterprise', price: '$60/user/mo', features: ['ZDR defaults', 'VPC/On-prem', 'SSO'] },
    ],
    features: [
      { name: 'Cascade Engine', description: 'Deep codebase understanding with repository graph', icon: 'GitBranch' },
      { name: 'Multi-File Reasoning', description: 'Traces imports, checks schemas, proposes multi-file edits', icon: 'Files' },
      { name: 'Supercomplete', description: 'Advanced tab completion with context awareness', icon: 'Zap' },
      { name: 'App Previews', description: 'Preview applications directly in the IDE', icon: 'Eye' },
      { name: 'Enterprise Security', description: 'SOC 2 Type II, optional zero-day retention, VPC hosting', icon: 'Shield' },
      { name: 'JetBrains Support', description: 'Native integration with JetBrains IDEs', icon: 'Puzzle' },
    ],
    models: ['Claude', 'GPT-4', 'Gemini', 'Custom models'],
    platform: ['Windows', 'macOS', 'Linux'],
    baseEditor: 'VS Code Fork',
    releaseYear: 2024,
    highlights: [
      '2025 Gartner Magic Quadrant Leader',
      'Best value at $15/month',
      'Enterprise-grade security',
      'Repository-wide understanding',
    ],
    stats: {
      rating: 4.7,
    },
  },
  {
    id: 'zed',
    name: 'Zed',
    company: 'Zed Industries',
    logo: '/icons/zed.svg',
    tagline: 'The Fastest AI Code Editor',
    description: 'Zed is a high-performance code editor built with Rust and GPUI. It offers 120 FPS rendering and includes Zeta, an open-source LLM for edit predictions. Privacy-focused with local model support.',
    website: 'https://zed.dev',
    pricing: [
      { name: 'Free', price: 'Free', features: ['50 prompts/month', '2000 free edit predictions', 'Bring your own API keys'] },
      { name: 'Pro', price: '$20/mo', features: ['500 prompts/month', 'Unlimited edit predictions', 'Priority support'], recommended: true },
    ],
    features: [
      { name: 'Blazing Fast', description: '120 FPS rendering with Rust and GPUI', icon: 'Gauge' },
      { name: 'Open Source', description: 'Editor and Zeta model are fully open source', icon: 'Github' },
      { name: 'Agentic Editing', description: 'AI agent for code generation and transformation', icon: 'Bot' },
      { name: 'Edit Prediction', description: 'Powered by Zeta, the open LLM', icon: 'Lightbulb' },
      { name: 'Privacy First', description: 'Conversations are private, no data harvesting', icon: 'Lock' },
      { name: 'Local Models', description: 'Run with Ollama on your own hardware', icon: 'HardDrive' },
    ],
    models: ['Zeta (open)', 'Claude', 'Gemini', 'Ollama (local)'],
    platform: ['macOS', 'Linux', 'Windows (coming)'],
    baseEditor: 'Native (Rust)',
    releaseYear: 2024,
    highlights: [
      'World\'s fastest AI editor',
      'Open source including LLM',
      'Privacy by design',
      'JetBrains ACP partnership',
    ],
    stats: {
      rating: 4.5,
    },
  },
  {
    id: 'copilot',
    name: 'GitHub Copilot',
    company: 'GitHub / Microsoft',
    logo: '/icons/copilot.svg',
    tagline: 'Your AI pair programmer',
    description: 'GitHub Copilot is the most widely adopted AI coding assistant. Deep integration with GitHub workflows, agent mode for autonomous task completion, and available across all major IDEs.',
    website: 'https://github.com/features/copilot',
    pricing: [
      { name: 'Individual', price: '$10/mo', features: ['Code completions', 'Chat', 'CLI'], recommended: true },
      { name: 'Business', price: '$19/user/mo', features: ['Everything in Individual', 'Admin controls', 'Policy management'] },
      { name: 'Enterprise', price: '$39/user/mo', features: ['Everything in Business', 'Fine-tuning', 'Advanced security'] },
    ],
    features: [
      { name: 'Agent Mode', description: 'Autonomous agent that can complete entire tasks', icon: 'Bot' },
      { name: 'Agent Skills', description: 'Create custom skills to teach Copilot specialized tasks', icon: 'Wrench' },
      { name: 'GitHub Integration', description: 'Deep alignment with GitHub workflows and PRs', icon: 'Github' },
      { name: 'Multi-IDE Support', description: 'Works in VS Code, Visual Studio, JetBrains, Vim', icon: 'Laptop2' },
      { name: 'Voice & Vision', description: 'Supports voice commands and image inputs', icon: 'Mic' },
      { name: 'Coding Agent', description: 'Assign issues to Copilot, get PRs back', icon: 'GitPullRequest' },
    ],
    models: ['OpenAI GPT-4', 'Claude (Enterprise)'],
    platform: ['All (via extensions)'],
    baseEditor: 'Extension',
    releaseYear: 2021,
    highlights: [
      'Most adopted AI assistant',
      'Best GitHub integration',
      'Project Padawan autonomous agent',
      'Available everywhere',
    ],
    stats: {
      users: '1.8M+',
      rating: 4.6,
    },
  },
];

export const getIDEById = (id: string): AIIDEInfo | undefined => {
  return aiIDEData.find(ide => ide.id === id);
};

export const getIDEsByCategory = (category: string): AIIDEInfo[] => {
  switch (category) {
    case 'free':
      return aiIDEData.filter(ide => ide.pricing.some(p => p.price === 'Free'));
    case 'standalone':
      return aiIDEData.filter(ide => ide.baseEditor !== 'Extension');
    case 'extension':
      return aiIDEData.filter(ide => ide.baseEditor === 'Extension');
    case 'open-source':
      return aiIDEData.filter(ide => ide.id === 'zed');
    default:
      return aiIDEData;
  }
};
