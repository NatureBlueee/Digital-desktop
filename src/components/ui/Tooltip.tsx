/**
 * Tooltip Component
 *
 * 设计决策:
 * - 延迟显示（防止鼠标快速划过时闪烁）
 * - 支持多个位置（top, bottom, left, right）
 * - 自动检测边界并调整位置
 * - 支持快捷键显示
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

// ============================================================
// Types
// ============================================================

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  shortcut?: string;
  position?: TooltipPosition;
  delay?: number;
  disabled?: boolean;
  className?: string;
}

// ============================================================
// Tooltip Component
// ============================================================

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  content,
  shortcut,
  position = 'bottom',
  delay = 500,
  disabled = false,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [actualPosition, setActualPosition] = useState(position);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const showTooltip = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // 边界检测和位置调整
  useEffect(() => {
    if (!isVisible || !tooltipRef.current || !triggerRef.current) return;

    const tooltip = tooltipRef.current;
    const trigger = triggerRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();

    let newPosition = position;

    // 检测是否超出边界
    if (position === 'top' && triggerRect.top - tooltipRect.height < 10) {
      newPosition = 'bottom';
    } else if (position === 'bottom' && triggerRect.bottom + tooltipRect.height > window.innerHeight - 10) {
      newPosition = 'top';
    } else if (position === 'left' && triggerRect.left - tooltipRect.width < 10) {
      newPosition = 'right';
    } else if (position === 'right' && triggerRect.right + tooltipRect.width > window.innerWidth - 10) {
      newPosition = 'left';
    }

    if (newPosition !== actualPosition) {
      setActualPosition(newPosition);
    }
  }, [isVisible, position, actualPosition]);

  // 清理
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positionClasses: Record<TooltipPosition, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#3c3c3c] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#3c3c3c] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#3c3c3c] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#3c3c3c] border-y-transparent border-l-transparent',
  };

  return (
    <div
      ref={triggerRef}
      className={cn("relative inline-flex", className)}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={cn(
            "absolute z-50 pointer-events-none",
            "px-2 py-1.5 rounded",
            "bg-[#3c3c3c] border border-[#454545] shadow-lg",
            "text-xs text-[#cccccc] whitespace-nowrap",
            "animate-in fade-in-0 zoom-in-95 duration-100",
            positionClasses[actualPosition]
          )}
          role="tooltip"
        >
          <div className="flex items-center gap-2">
            <span>{content}</span>
            {shortcut && (
              <span className="text-[#858585] bg-[#2d2d2d] px-1 rounded text-[10px]">
                {shortcut}
              </span>
            )}
          </div>

          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowClasses[actualPosition]
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
