/**
 * ContextMenu Component
 *
 * 设计决策:
 * - 通过 onContextMenu 事件触发
 * - 位置跟随鼠标右键点击位置
 * - 自动处理边界检测（防止超出屏幕）
 * - 支持嵌套子菜单
 * - ESC 或点击外部关闭
 */

import React, { useState, useEffect, useRef, createContext, useContext, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Check } from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface ContextMenuItemData {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  danger?: boolean;
  onClick?: () => void;
  submenu?: ContextMenuItemData[];
  separator?: boolean;
}

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
}

// ============================================================
// Context
// ============================================================

interface ContextMenuContextValue {
  close: () => void;
}

const ContextMenuContext = createContext<ContextMenuContextValue | null>(null);

// ============================================================
// Hook: useContextMenu
// ============================================================

export function useContextMenu() {
  const [state, setState] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
  });

  const open = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 计算位置，考虑边界
    let x = e.clientX;
    let y = e.clientY;

    // 简单的边界检测（假设菜单最大 250px 宽，300px 高）
    const menuWidth = 250;
    const menuHeight = 300;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 10;
    }
    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 10;
    }

    setState({ isOpen: true, x, y });
  }, []);

  const close = useCallback(() => {
    setState(prev => ({ ...prev, isOpen: false }));
  }, []);

  return { state, open, close };
}

// ============================================================
// ContextMenu Component
// ============================================================

interface ContextMenuProps {
  state: ContextMenuState;
  items: ContextMenuItemData[];
  onClose: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({ state, items, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!state.isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // 延迟添加监听器，防止触发右键的点击立即关闭菜单
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('contextmenu', handleClickOutside);
    }, 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('contextmenu', handleClickOutside);
    };
  }, [state.isOpen, onClose]);

  if (!state.isOpen) return null;

  return (
    <ContextMenuContext.Provider value={{ close: onClose }}>
      <div
        ref={menuRef}
        className={cn(
          "fixed z-[100]",
          "min-w-[200px] py-1",
          "bg-[#252526] border border-[#454545] rounded-md shadow-2xl"
        )}
        style={{ left: state.x, top: state.y }}
      >
        {items.map((item, index) => (
          item.separator ? (
            <ContextMenuSeparator key={`sep-${index}`} />
          ) : (
            <ContextMenuItem key={`${item.label}-${index}`} item={item} />
          )
        ))}
      </div>
    </ContextMenuContext.Provider>
  );
};

// ============================================================
// ContextMenuItem
// ============================================================

const ContextMenuItem: React.FC<{ item: ContextMenuItemData }> = ({ item }) => {
  const context = useContext(ContextMenuContext);
  const [showSubmenu, setShowSubmenu] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasSubmenu) return;

    item.onClick?.();
    context?.close();
  };

  return (
    <div
      className="relative"
      onMouseEnter={() => hasSubmenu && setShowSubmenu(true)}
      onMouseLeave={() => setShowSubmenu(false)}
    >
      <div
        className={cn(
          "flex items-center px-3 py-1.5 mx-1 rounded cursor-pointer",
          item.disabled
            ? "text-[#6e6e6e] cursor-not-allowed"
            : item.danger
              ? "text-red-400 hover:bg-red-500/20"
              : "text-[#cccccc] hover:bg-[#094771]",
          showSubmenu && hasSubmenu && "bg-[#094771]"
        )}
        onClick={handleClick}
      >
        {/* Icon */}
        <span className="w-5 flex-shrink-0">
          {item.checked !== undefined ? (
            item.checked ? <Check size={14} /> : null
          ) : item.icon ? (
            <span className="text-[#858585]">{item.icon}</span>
          ) : null}
        </span>

        {/* Label */}
        <span className="flex-1 text-xs">{item.label}</span>

        {/* Shortcut or Arrow */}
        {hasSubmenu ? (
          <ChevronRight size={14} className="text-[#858585] ml-4" />
        ) : item.shortcut ? (
          <span className="text-[#858585] text-xs ml-4">{item.shortcut}</span>
        ) : null}
      </div>

      {/* Submenu */}
      {hasSubmenu && showSubmenu && (
        <div
          className={cn(
            "absolute left-full top-0 ml-0.5",
            "min-w-[180px] py-1",
            "bg-[#252526] border border-[#454545] rounded-md shadow-xl"
          )}
        >
          {item.submenu!.map((subItem, subIndex) => (
            subItem.separator ? (
              <ContextMenuSeparator key={`sub-sep-${subIndex}`} />
            ) : (
              <ContextMenuSubItem key={subItem.label} item={subItem} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// ContextMenuSubItem
// ============================================================

const ContextMenuSubItem: React.FC<{ item: ContextMenuItemData }> = ({ item }) => {
  const context = useContext(ContextMenuContext);

  const handleClick = () => {
    if (item.disabled) return;
    item.onClick?.();
    context?.close();
  };

  return (
    <div
      className={cn(
        "flex items-center px-3 py-1.5 mx-1 rounded cursor-pointer",
        item.disabled
          ? "text-[#6e6e6e] cursor-not-allowed"
          : item.danger
            ? "text-red-400 hover:bg-red-500/20"
            : "text-[#cccccc] hover:bg-[#094771]"
      )}
      onClick={handleClick}
    >
      <span className="w-5 flex-shrink-0">
        {item.checked && <Check size={14} />}
        {item.icon && !item.checked && <span className="text-[#858585]">{item.icon}</span>}
      </span>
      <span className="flex-1 text-xs">{item.label}</span>
      {item.shortcut && (
        <span className="text-[#858585] text-xs ml-4">{item.shortcut}</span>
      )}
    </div>
  );
};

// ============================================================
// ContextMenuSeparator
// ============================================================

const ContextMenuSeparator: React.FC = () => (
  <div className="h-px bg-[#454545] my-1 mx-2" />
);

export type { ContextMenuItemData };
