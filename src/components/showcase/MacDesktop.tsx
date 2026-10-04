'use client';

import { useState } from 'react';
import { Bot, FolderGit2, MessageCircle, Minus, X } from 'lucide-react';
import { ChatGPTArchiveApp } from '@/components/apps/ChatGPT/archive';
import { ClaudeApp } from '@/components/apps/Claude/ClaudeApp';
import { RepositoryWorkspace } from './RepositoryWorkspace';

type AppId = 'chatgpt' | 'claude' | 'projects';
type WindowState = { app: AppId; minimized: boolean; zIndex: number };

const apps: Array<{ id: AppId; label: string; icon: typeof MessageCircle; tint: string }> = [
  { id: 'chatgpt', label: 'ChatGPT', icon: MessageCircle, tint: 'bg-emerald-500' },
  { id: 'claude', label: 'Claude', icon: Bot, tint: 'bg-orange-400' },
  { id: 'projects', label: 'Projects', icon: FolderGit2, tint: 'bg-sky-500' },
];

function MacWindow({ app, zIndex, onClose, onMinimize, onFocus }: { app: AppId; zIndex: number; onClose: () => void; onMinimize: () => void; onFocus: () => void }) {
  const label = apps.find((item) => item.id === app)?.label || app;
  const content = app === 'chatgpt'
    ? <ChatGPTArchiveApp windowId="showcase-chatgpt" embedded onRequestClose={onClose} onRequestMinimize={onMinimize} />
    : app === 'claude'
      ? <ClaudeApp windowId="showcase-claude" embedded onRequestClose={onClose} onRequestMinimize={onMinimize} />
      : <RepositoryWorkspace />;

  return <section onMouseDown={onFocus} className="showcase-window absolute inset-x-3 top-12 bottom-20 overflow-hidden rounded-xl border border-white/50 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.24)] dark:border-white/10 dark:bg-zinc-950/95 sm:inset-x-10 sm:top-16 sm:bottom-24 max-sm:inset-x-0 max-sm:top-8 max-sm:bottom-0 max-sm:rounded-none max-sm:border-0 max-sm:shadow-none" style={{ zIndex }} aria-label={`${label} window`}>
    <header className="flex h-9 items-center border-b border-zinc-200/80 bg-zinc-100/80 px-3 dark:border-zinc-800 dark:bg-zinc-900/90 max-sm:h-12 max-sm:bg-white max-sm:px-4 dark:max-sm:bg-zinc-950"><div className="flex gap-2"><button aria-label={`Close ${label}`} onClick={onClose} className="flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57] transition-transform hover:scale-110 max-sm:h-8 max-sm:w-8 max-sm:bg-transparent max-sm:text-zinc-700 dark:max-sm:text-zinc-200"><X size={18} className="hidden max-sm:block" /></button><button aria-label={`Minimize ${label}`} onClick={onMinimize} className="flex h-3 w-3 items-center justify-center rounded-full bg-[#febc2e] transition-transform hover:scale-110 max-sm:hidden"><Minus size={8} className="opacity-0 hover:opacity-70" /></button><span className="h-3 w-3 rounded-full bg-[#28c840] max-sm:hidden" /></div><span className="flex-1 text-center text-xs font-medium text-zinc-500 dark:text-zinc-400 max-sm:text-sm max-sm:text-zinc-800 dark:max-sm:text-zinc-100">{label}</span><span className="w-12 max-sm:w-8" /></header>
    <div className="h-[calc(100%-2.25rem)] max-sm:h-[calc(100%-3rem)]">{content}</div>
  </section>;
}

export default function MacDesktop() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const openApp = (app: AppId) => setWindows((current) => {
    const maxZ = Math.max(...current.map((window) => window.zIndex), 20);
    const existing = current.find((window) => window.app === app);
    if (existing) return current.map((window) => window.app === app ? { ...window, minimized: false, zIndex: maxZ + 1 } : window);
    return [...current, { app, minimized: false, zIndex: maxZ + 1 }];
  });
  const focus = (app: AppId) => setWindows((current) => {
    const maxZ = Math.max(...current.map((window) => window.zIndex), 20);
    return current.map((window) => window.app === app ? { ...window, zIndex: maxZ + 1 } : window);
  });
  const close = (app: AppId) => setWindows((current) => current.filter((window) => window.app !== app));
  const minimize = (app: AppId) => setWindows((current) => current.map((window) => window.app === app ? { ...window, minimized: true } : window));

  return <main className="showcase-desktop relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(180,222,255,.82),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(230,190,245,.74),transparent_38%),linear-gradient(145deg,#a8d5ef,#dde2fb_55%,#c5d1ef)] text-zinc-900 dark:bg-[radial-gradient(circle_at_18%_12%,rgba(22,78,99,.8),transparent_36%),radial-gradient(circle_at_82%_78%,rgba(88,28,135,.45),transparent_38%),linear-gradient(145deg,#0b1220,#111827_55%,#19233a)] dark:text-zinc-100">
    <nav className="absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between bg-white/45 px-3 text-xs font-medium backdrop-blur-xl dark:bg-zinc-900/50"><div className="flex items-center gap-3"><span className="text-sm">●</span><span className="hidden sm:inline">Nature&apos;s Desktop</span><span className="hidden sm:inline text-zinc-500 dark:text-zinc-400">Archive</span></div><div className="text-zinc-600 dark:text-zinc-300">Read-only showcase</div></nav>
    <div className="absolute left-4 top-14 z-0 grid gap-4 sm:left-6 sm:top-16 max-sm:inset-x-6 max-sm:top-24 max-sm:grid-cols-2 max-sm:gap-x-5 max-sm:gap-y-8">{apps.map(({ id, label, icon: Icon, tint }) => <button key={id} onDoubleClick={() => openApp(id)} onClick={() => openApp(id)} className="group flex w-20 flex-col items-center gap-1 rounded-lg p-1 text-center text-xs font-medium text-zinc-800 outline-none transition-colors hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white dark:text-white dark:hover:bg-white/10 max-sm:w-full max-sm:gap-2 max-sm:rounded-2xl max-sm:bg-white/35 max-sm:py-5 max-sm:text-sm max-sm:backdrop-blur-sm"><span className={`flex h-12 w-12 items-center justify-center rounded-[13px] ${tint} text-white shadow-lg transition-transform duration-200 group-hover:scale-105 max-sm:h-14 max-sm:w-14`}><Icon size={25} strokeWidth={1.7} /></span><span className="line-clamp-2 drop-shadow-sm">{label}</span></button>)}</div>
    {windows.filter((window) => !window.minimized).map((window) => <MacWindow key={window.app} app={window.app} zIndex={window.zIndex} onClose={() => close(window.app)} onMinimize={() => minimize(window.app)} onFocus={() => focus(window.app)} />)}
    <div className="absolute inset-x-0 bottom-3 z-[100] flex justify-center max-sm:hidden"><div className="flex items-end gap-2 rounded-2xl border border-white/45 bg-white/45 px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,.2)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/55">{apps.map(({ id, label, icon: Icon, tint }) => <button key={id} onClick={() => openApp(id)} aria-label={`Open ${label}`} className="group flex h-11 w-11 items-center justify-center rounded-xl outline-none transition-transform duration-200 hover:-translate-y-1 hover:scale-110 focus-visible:ring-2 focus-visible:ring-white"><span className={`flex h-9 w-9 items-center justify-center rounded-[10px] ${tint} text-white shadow-sm`}><Icon size={20} strokeWidth={1.7} /></span></button>)}<span className="mx-1 h-8 w-px bg-zinc-500/20" /><button aria-label="Show desktop" onClick={() => setWindows((current) => current.map((window) => ({ ...window, minimized: true })))} className="flex h-10 w-8 items-center justify-center rounded-lg text-zinc-600 hover:bg-white/40 dark:text-zinc-300 dark:hover:bg-white/10"><X size={16} /></button></div></div>
  </main>;
}
