import { create } from 'zustand';

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string; // Lucide icon name or image path
  x: number;
  y: number;
  type: 'app' | 'folder' | 'file';
  appId?: string; // If it's an app, which app to open
  shortcut?: boolean;
}

export interface WindowState {
  id: string;
  title: string;
  appId: string;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
}

interface DesktopState {
  icons: DesktopIcon[];
  selectedIconIds: string[];
  windows: WindowState[];
  activeWindowId: string | null;
  
  setIcons: (icons: DesktopIcon[]) => void;
  updateIconPosition: (id: string, x: number, y: number) => void;
  selectIcon: (id: string, multi: boolean) => void;
  setSelectedIcons: (ids: string[]) => void;
  deselectAll: () => void;
  
  openWindow: (appId: string, title: string) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

export const useDesktopStore = create<DesktopState>((set) => ({
  icons: [
    { id: 'this-pc', title: '此电脑', icon: '/icons/this_pc_icon__windows_11__by_satellitedish555_dgv3zid.png', x: 0, y: 0, type: 'app', appId: 'this-pc' },
    { id: 'github-desktop', title: 'GitHub Desktop', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Github-desktop-logo-symbol.svg/2048px-Github-desktop-logo-symbol.svg.png', x: 0, y: 1, type: 'app', appId: 'github', shortcut: true },
    { id: 'notion', title: 'Notion', icon: '/icons/notion.png', x: 0, y: 2, type: 'app', appId: 'notion', shortcut: true },
    { id: 'recycle-bin', title: '回收站', icon: '/icons/trash.png', x: 0, y: 3, type: 'app', appId: 'recycle-bin' },
    { id: 'wechat', title: '微信', icon: '/icons/wechat.png', x: 0, y: 4, type: 'app', appId: 'wechat', shortcut: true },
    { id: 'antigravity', title: 'Antigravity', icon: '/icons/antigravity.png', x: 0, y: 5, type: 'app', appId: 'antigravity', shortcut: true },
    { id: 'google-drive', title: 'Google Drive', icon: 'https://upload.wikimedia.org/wikipedia/commons/d/da/Google_Drive_logo.png', x: 0, y: 6, type: 'app', appId: 'google-drive', shortcut: true },
    { id: 'control-panel', title: '控制面板', icon: 'https://img.icons8.com/fluency/96/control-panel.png', x: 0, y: 7, type: 'app', appId: 'control-panel', shortcut: true },
    { id: 'cursor', title: 'Cursor', icon: '/icons/cursor-ai-code-icon.svg', x: 0, y: 8, type: 'app', appId: 'cursor', shortcut: true },
    { id: 'claude', title: 'Claude', icon: '/icons/claude-ai-icon.svg', x: 0, y: 9, type: 'app', appId: 'claude', shortcut: true },
    { id: 'new-folder', title: '新建文件夹', icon: 'https://img.icons8.com/fluency/96/folder-invoices--v1.png', x: 1, y: 0, type: 'folder' },
  ],
  selectedIconIds: [],
  windows: [],
  activeWindowId: null,

  setIcons: (icons: DesktopIcon[]) => set({ icons }),
  updateIconPosition: (id: string, x: number, y: number) =>
    set((state: DesktopState) => ({
      icons: state.icons.map((icon: DesktopIcon) =>
        icon.id === id ? { ...icon, x, y } : icon
      ),
    })),
  setSelectedIcons: (ids: string[]) => set({ selectedIconIds: ids }),
  selectIcon: (id: string, multi: boolean) =>
    set((state: DesktopState) => ({
      selectedIconIds: multi
        ? state.selectedIconIds.includes(id)
          ? state.selectedIconIds.filter((i: string) => i !== id)
          : [...state.selectedIconIds, id]
        : [id],
    })),
  deselectAll: () => set({ selectedIconIds: [] }),

  openWindow: (appId: string, title: string) =>
    set((state: DesktopState) => {
      const existingWindow = state.windows.find((w) => w.appId === appId);
      if (existingWindow) {
        return {
          activeWindowId: existingWindow.id,
          windows: state.windows.map((w) =>
            w.id === existingWindow.id ? { ...w, isMinimized: false, zIndex: state.windows.length + 1 } : w
          ),
        };
      }
      const newWindow: WindowState = {
        id: Math.random().toString(36).substring(7),
        appId,
        title,
        zIndex: state.windows.length + 1,
        isMinimized: false,
        isMaximized: false,
      };
      return {
        windows: [...state.windows, newWindow],
        activeWindowId: newWindow.id,
      };
    }),
  closeWindow: (id: string) =>
    set((state: DesktopState) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  minimizeWindow: (id: string) =>
    set((state: DesktopState) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    })),
  maximizeWindow: (id: string) =>
    set((state: DesktopState) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
    })),
  focusWindow: (id: string) =>
    set((state: DesktopState) => {
      const maxZ = Math.max(...state.windows.map((w) => w.zIndex), 0);
      return {
        activeWindowId: id,
        windows: state.windows.map((w) =>
          w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w
        ),
      };
    }),
}));
