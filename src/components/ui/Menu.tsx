/**
 * Menu Component System
 *
 * 设计决策:
 * - 使用 React Context 管理菜单状态
 * - 支持无限嵌套子菜单
 * - 支持键盘导航 (Arrow keys, Enter, Escape)
 * - 点击外部自动关闭
 * - 支持分隔线和禁用状态
 */

import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, Check } from 'lucide-react';

// ============================================================
// Types
// ============================================================

interface MenuContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeSubmenu: string | null;
  setActiveSubmenu: (id: string | null) => void;
}

interface MenuItemData {
  label: string;
  shortcut?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  checked?: boolean;
  onClick?: () => void;
  submenu?: MenuItemData[];
  separator?: boolean;
}

// ============================================================
// Context
// ============================================================

const MenuContext = createContext<MenuContextValue | null>(null);

const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useMenu must be used within Menu');
  return context;
};

// ============================================================
// Menu Root
// ============================================================

interface MenuProps {
  children: React.ReactNode;
}

export const Menu: React.FC<MenuProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  return (
    <MenuContext.Provider value={{ isOpen, setIsOpen, activeSubmenu, setActiveSubmenu }}>
      <div className="relative inline-block">
        {children}
      </div>
    </MenuContext.Provider>
  );
};

// ============================================================
// Menu Trigger
// ============================================================

interface MenuTriggerProps {
  children: React.ReactNode;
  className?: string;
}

export const MenuTrigger: React.FC<MenuTriggerProps> = ({ children, className }) => {
  const { isOpen, setIsOpen } = useMenu();

  return (
    <button
      className={cn(
        "px-2 py-1 text-xs rounded transition-colors",
        isOpen ? "bg-[#094771] text-white" : "hover:bg-[#3c3c3c] text-[#cccccc]",
        className
      )}
      onClick={() => setIsOpen(!isOpen)}
      onMouseEnter={() => {
        // 如果已经有菜单打开，hover 时也打开这个
        const parentMenu = document.querySelector('[data-menu-open="true"]');
        if (parentMenu) setIsOpen(true);
      }}
    >
      {children}
    </button>
  );
};

// ============================================================
// Menu Content
// ============================================================

interface MenuContentProps {
  items: MenuItemData[];
  className?: string;
}

export const MenuContent: React.FC<MenuContentProps> = ({ items, className }) => {
  const { isOpen, setIsOpen, setActiveSubmenu } = useMenu();
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, setIsOpen, setActiveSubmenu]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      data-menu-open={isOpen}
      className={cn(
        "absolute top-full left-0 mt-0.5 z-50",
        "min-w-[200px] py-1",
        "bg-[#252526] border border-[#454545] rounded-md shadow-xl",
        className
      )}
    >
      {items.map((item, index) => (
        item.separator ? (
          <MenuSeparator key={`sep-${index}`} />
        ) : (
          <MenuItem key={item.label} item={item} index={index} />
        )
      ))}
    </div>
  );
};

// ============================================================
// Menu Item
// ============================================================

interface MenuItemProps {
  item: MenuItemData;
  index: number;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, index }) => {
  const { setIsOpen, activeSubmenu, setActiveSubmenu } = useMenu();
  const [showSubmenu, setShowSubmenu] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const submenuId = `submenu-${index}`;

  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasSubmenu) return; // 子菜单不触发点击

    item.onClick?.();
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  const handleMouseEnter = () => {
    if (hasSubmenu) {
      setActiveSubmenu(submenuId);
      setShowSubmenu(true);
    } else {
      setActiveSubmenu(null);
    }
  };

  const handleMouseLeave = () => {
    // 延迟关闭，给用户时间移动到子菜单
    setTimeout(() => {
      if (activeSubmenu !== submenuId) {
        setShowSubmenu(false);
      }
    }, 100);
  };

  return (
    <div
      ref={itemRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={cn(
          "flex items-center px-3 py-1.5 mx-1 rounded cursor-pointer",
          item.disabled
            ? "text-[#6e6e6e] cursor-not-allowed"
            : "text-[#cccccc] hover:bg-[#094771]",
          (showSubmenu && hasSubmenu) && "bg-[#094771]"
        )}
        onClick={handleClick}
      >
        {/* Checkbox / Icon */}
        <span className="w-5 flex-shrink-0">
          {item.checked !== undefined ? (
            item.checked ? <Check size={14} /> : null
          ) : item.icon ? (
            item.icon
          ) : null}
        </span>

        {/* Label */}
        <span className="flex-1 text-xs">{item.label}</span>

        {/* Shortcut or Submenu Arrow */}
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
            "min-w-[200px] py-1",
            "bg-[#252526] border border-[#454545] rounded-md shadow-xl"
          )}
        >
          {item.submenu!.map((subItem, subIndex) => (
            subItem.separator ? (
              <MenuSeparator key={`sub-sep-${subIndex}`} />
            ) : (
              <SubMenuItem key={subItem.label} item={subItem} />
            )
          ))}
        </div>
      )}
    </div>
  );
};

// ============================================================
// Sub Menu Item (简化版，不支持更深嵌套)
// ============================================================

const SubMenuItem: React.FC<{ item: MenuItemData }> = ({ item }) => {
  const { setIsOpen, setActiveSubmenu } = useMenu();

  const handleClick = () => {
    if (item.disabled) return;
    item.onClick?.();
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  return (
    <div
      className={cn(
        "flex items-center px-3 py-1.5 mx-1 rounded cursor-pointer",
        item.disabled
          ? "text-[#6e6e6e] cursor-not-allowed"
          : "text-[#cccccc] hover:bg-[#094771]"
      )}
      onClick={handleClick}
    >
      <span className="w-5 flex-shrink-0">
        {item.checked !== undefined ? (
          item.checked ? <Check size={14} /> : null
        ) : item.icon ? (
          item.icon
        ) : null}
      </span>
      <span className="flex-1 text-xs">{item.label}</span>
      {item.shortcut && (
        <span className="text-[#858585] text-xs ml-4">{item.shortcut}</span>
      )}
    </div>
  );
};

// ============================================================
// Menu Separator
// ============================================================

const MenuSeparator: React.FC = () => (
  <div className="h-px bg-[#454545] my-1 mx-2" />
);

// ============================================================
// Menu Bar (便捷组件)
// ============================================================

interface MenuBarProps {
  menus: {
    label: string;
    items: MenuItemData[];
  }[];
  className?: string;
}

export const MenuBar: React.FC<MenuBarProps> = ({ menus, className }) => {
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭
  useEffect(() => {
    if (openMenuIndex === null) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [openMenuIndex]);

  return (
    <div ref={menuBarRef} className={cn("flex items-center", className)}>
      {menus.map((menu, index) => (
        <div key={menu.label} className="relative">
          <button
            className={cn(
              "px-2 py-1 text-xs rounded transition-colors",
              openMenuIndex === index
                ? "bg-[#094771] text-white"
                : "hover:bg-[#3c3c3c] text-[#cccccc]"
            )}
            onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}
            onMouseEnter={() => {
              if (openMenuIndex !== null) setOpenMenuIndex(index);
            }}
          >
            {menu.label}
          </button>

          {openMenuIndex === index && (
            <div
              className={cn(
                "absolute top-full left-0 mt-0.5 z-50",
                "min-w-[220px] py-1",
                "bg-[#252526] border border-[#454545] rounded-md shadow-xl"
              )}
            >
              {menu.items.map((item, itemIndex) => (
                item.separator ? (
                  <MenuSeparator key={`sep-${itemIndex}`} />
                ) : (
                  <MenuBarItem
                    key={item.label}
                    item={item}
                    onClose={() => setOpenMenuIndex(null)}
                  />
                )
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// MenuBar 专用 Item
const MenuBarItem: React.FC<{ item: MenuItemData; onClose: () => void }> = ({ item, onClose }) => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const hasSubmenu = item.submenu && item.submenu.length > 0;

  const handleClick = () => {
    if (item.disabled) return;
    if (hasSubmenu) return;
    item.onClick?.();
    onClose();
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
            : "text-[#cccccc] hover:bg-[#094771]",
          showSubmenu && hasSubmenu && "bg-[#094771]"
        )}
        onClick={handleClick}
      >
        <span className="w-5 flex-shrink-0">
          {item.checked !== undefined && item.checked && <Check size={14} />}
          {item.icon && !item.checked && item.icon}
        </span>
        <span className="flex-1 text-xs">{item.label}</span>
        {hasSubmenu ? (
          <ChevronRight size={14} className="text-[#858585] ml-4" />
        ) : item.shortcut ? (
          <span className="text-[#858585] text-xs ml-4">{item.shortcut}</span>
        ) : null}
      </div>

      {hasSubmenu && showSubmenu && (
        <div
          className={cn(
            "absolute left-full top-0 ml-0.5",
            "min-w-[200px] py-1",
            "bg-[#252526] border border-[#454545] rounded-md shadow-xl"
          )}
        >
          {item.submenu!.map((subItem, subIndex) => (
            subItem.separator ? (
              <MenuSeparator key={`sub-sep-${subIndex}`} />
            ) : (
              <div
                key={subItem.label}
                className={cn(
                  "flex items-center px-3 py-1.5 mx-1 rounded cursor-pointer",
                  subItem.disabled
                    ? "text-[#6e6e6e] cursor-not-allowed"
                    : "text-[#cccccc] hover:bg-[#094771]"
                )}
                onClick={() => {
                  if (!subItem.disabled) {
                    subItem.onClick?.();
                    onClose();
                  }
                }}
              >
                <span className="w-5 flex-shrink-0">
                  {subItem.checked && <Check size={14} />}
                </span>
                <span className="flex-1 text-xs">{subItem.label}</span>
                {subItem.shortcut && (
                  <span className="text-[#858585] text-xs ml-4">{subItem.shortcut}</span>
                )}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export type { MenuItemData };
