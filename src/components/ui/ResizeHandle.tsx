/**
 * ResizeHandle - 可拖拽调整面板大小的组件
 *
 * 使用方式:
 * <ResizeHandle
 *   direction="horizontal" // 水平拖拽（调整左右宽度）
 *   onResize={(delta) => setWidth(prev => prev + delta)}
 *   minSize={200}
 *   maxSize={500}
 * />
 */

import React, { useState, useCallback, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ResizeHandleProps {
  /** 拖拽方向: horizontal=左右, vertical=上下 */
  direction: 'horizontal' | 'vertical';
  /** 拖拽时的回调，delta 为变化量 */
  onResize: (delta: number) => void;
  /** 最小尺寸 */
  minSize?: number;
  /** 最大尺寸 */
  maxSize?: number;
  /** 当前尺寸（用于边界检测） */
  currentSize?: number;
  /** 自定义类名 */
  className?: string;
  /** 是否反向（用于右侧面板） */
  reverse?: boolean;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction,
  onResize,
  minSize = 100,
  maxSize = 800,
  currentSize,
  className,
  reverse = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setStartPos(direction === 'horizontal' ? e.clientX : e.clientY);
  }, [direction]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const currentPos = direction === 'horizontal' ? e.clientX : e.clientY;
      let delta = currentPos - startPos;

      // 反向时取反
      if (reverse) {
        delta = -delta;
      }

      // 边界检测
      if (currentSize !== undefined) {
        const newSize = currentSize + delta;
        if (newSize < minSize || newSize > maxSize) {
          return;
        }
      }

      onResize(delta);
      setStartPos(currentPos);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    // 拖拽时改变光标
    document.body.style.cursor = direction === 'horizontal' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, startPos, direction, onResize, minSize, maxSize, currentSize, reverse]);

  return (
    <div
      onMouseDown={handleMouseDown}
      className={cn(
        "flex-shrink-0 transition-colors group",
        direction === 'horizontal'
          ? "w-1 cursor-col-resize hover:bg-blue-500/50"
          : "h-1 cursor-row-resize hover:bg-blue-500/50",
        isDragging && "bg-blue-500",
        className
      )}
    >
      {/* 增大点击区域 */}
      <div
        className={cn(
          "relative",
          direction === 'horizontal'
            ? "w-3 h-full -ml-1"
            : "h-3 w-full -mt-1"
        )}
      />
    </div>
  );
};

/**
 * useResizable - 管理可调整大小的 Hook
 */
export function useResizable(
  initialSize: number,
  options: {
    minSize?: number;
    maxSize?: number;
    direction?: 'horizontal' | 'vertical';
  } = {}
) {
  const { minSize = 100, maxSize = 800 } = options;
  const [size, setSize] = useState(initialSize);

  const handleResize = useCallback((delta: number) => {
    setSize(prev => {
      const newSize = prev + delta;
      return Math.min(Math.max(newSize, minSize), maxSize);
    });
  }, [minSize, maxSize]);

  const reset = useCallback(() => {
    setSize(initialSize);
  }, [initialSize]);

  return {
    size,
    setSize,
    handleResize,
    reset,
    resizeProps: {
      onResize: handleResize,
      currentSize: size,
      minSize,
      maxSize,
    },
  };
}

export default ResizeHandle;
