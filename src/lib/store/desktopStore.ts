import { create } from 'zustand';

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string; // Lucide icon name or image path
  x: number;
  y: number;
  type: 'app' | 'folder' | 'file';
  appId?: string; // If it's an app, which app to open
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
    { id: 'recycle-bin', title: 'Recycle Bin', icon: 'https://img.icons8.com/fluency/96/trash.png', x: 0, y: 0, type: 'app', appId: 'recycle-bin' },
    { id: 'this-pc', title: 'This PC', icon: 'https://img.icons8.com/fluency/96/workstation.png', x: 0, y: 1, type: 'app', appId: 'this-pc' },
    { id: 'claude', title: 'Claude AI', icon: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Claude_AI_logo.svg', x: 0, y: 2, type: 'app', appId: 'claude' },
    { id: 'github', title: 'GitHub', icon: 'https://img.icons8.com/fluency/96/github.png', x: 0, y: 3, type: 'app', appId: 'github' },
    { id: 'folder-1', title: 'Project Docs', icon: 'https://img.icons8.com/fluency/96/folder-invoices--v1.png', x: 1, y: 0, type: 'folder' },
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
