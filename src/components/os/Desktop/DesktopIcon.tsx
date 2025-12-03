"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { DesktopIcon as DesktopIconType } from "@/lib/store/desktopStore";

interface DesktopIconProps {
  icon: DesktopIconType;
  selected: boolean;
  onSelect: (multi: boolean) => void;
  onDoubleClick: () => void;
}

export default function DesktopIcon({
  icon,
  selected,
  onSelect,
  onDoubleClick,
}: DesktopIconProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: icon.id,
      data: { icon },
    });

  // Check if icon is a URL (simple check)
  const isUrl = icon.icon.startsWith('http') || icon.icon.startsWith('/');
  const IconComponent = !isUrl ? (LucideIcons as any)[icon.icon] || LucideIcons.File : null;

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: icon.x * 96 + 8, // 96px grid size, 8px padding
        top: icon.y * 96 + 8,
        ...style,
      }}
      {...listeners}
      {...attributes}
      className={cn(
        "w-[80px] h-[80px] flex flex-col items-center justify-center gap-1 rounded-sm border border-transparent hover:bg-white/10 transition-colors cursor-default group",
        selected && "bg-white/20 border-white/30",
        isDragging && "opacity-50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(e.ctrlKey || e.metaKey);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        onDoubleClick();
      }}
    >
      <div className="w-10 h-10 flex items-center justify-center drop-shadow-sm transition-transform group-hover:scale-105 relative">
        {isUrl ? (
            <img src={icon.icon} alt={icon.title} className="w-full h-full object-contain" draggable={false} />
        ) : (
            IconComponent && <IconComponent size={28} strokeWidth={1.5} className="text-blue-400" />
        )}
        {icon.shortcut && (
            <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-white rounded-sm shadow-sm flex items-center justify-center">
                <img src="https://img.icons8.com/material-rounded/24/000000/forward-arrow.png" alt="shortcut" className="w-2.5 h-2.5 opacity-60 -rotate-45" />
            </div>
        )}
      </div>
      <span
        className={cn(
          "text-[11px] text-white text-center px-1 rounded-sm line-clamp-2 drop-shadow-md select-none max-w-[72px] leading-tight break-words",
          selected ? "bg-blue-600/80" : "group-hover:text-white"
        )}
        style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
      >
        {icon.title}
      </span>
    </div>
  );
}
