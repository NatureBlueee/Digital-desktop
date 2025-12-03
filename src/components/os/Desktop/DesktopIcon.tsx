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
        left: icon.x * 75 + 2, // 75px grid width
        top: icon.y * 100 + 2, // 100px grid height
        ...style,
      }}
      {...listeners}
      {...attributes}
      className={cn(
        "w-[74px] h-[100px] flex flex-col items-center justify-start pt-2 gap-0.5 cursor-default group outline-none",
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
      {/* Inner Content Wrapper for Selection/Hover State */}
      <div className={cn(
          "flex flex-col items-center justify-center p-1 rounded-[2px] transition-colors border border-transparent",
          selected ? "bg-white/20 border-white/10" : "group-hover:bg-white/10"
      )}>
          <div className="w-12 h-12 flex items-center justify-center drop-shadow-sm transition-transform relative mb-1">
            {isUrl ? (
                <img src={icon.icon} alt={icon.title} className="w-full h-full object-contain" draggable={false} />
            ) : (
                IconComponent && <IconComponent size={32} strokeWidth={1.5} className="text-blue-400" />
            )}
          </div>
          <span
            className={cn(
              "text-[12px] text-white text-center px-1 rounded-[2px] line-clamp-2 drop-shadow-md select-none max-w-[72px] leading-[1.1] break-words",
              selected ? "" : "group-hover:text-white"
            )}
            style={{ textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}
          >
            {icon.title}
          </span>
      </div>
    </div>
  );
}
