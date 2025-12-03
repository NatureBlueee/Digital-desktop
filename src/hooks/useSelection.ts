"use client";

import { useState, useEffect, useCallback } from "react";

interface SelectionBox {
  startX: number;
  startY: number;
  width: number;
  height: number;
}

export function useSelection(containerRef: React.RefObject<HTMLElement>) {
  const [selectionBox, setSelectionBox] = useState<SelectionBox | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target !== containerRef.current) return;
      
      // Only left click
      if (e.button !== 0) return;

      // CRITICAL: Only start selection if clicking directly on the grid container
      // This prevents conflict with dragging icons
      if (e.target !== containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const startX = e.clientX - rect.left;
      const startY = e.clientY - rect.top;

      setIsSelecting(true);
      setSelectionBox({
        startX,
        startY,
        width: 0,
        height: 0,
      });
    },
    [containerRef]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isSelecting || !selectionBox || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;

      const width = Math.abs(currentX - selectionBox.startX);
      const height = Math.abs(currentY - selectionBox.startY);
      const x = Math.min(currentX, selectionBox.startX);
      const y = Math.min(currentY, selectionBox.startY);

      setSelectionBox({
        startX: x,
        startY: y,
        width,
        height,
      });
    },
    [isSelecting, selectionBox, containerRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsSelecting(false);
    setSelectionBox(null);
  }, []);

  useEffect(() => {
    if (isSelecting) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isSelecting, handleMouseMove, handleMouseUp]);

  return {
    selectionBox,
    isSelecting,
    handleMouseDown,
  };
}
