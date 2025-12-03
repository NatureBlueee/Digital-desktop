"use client";

import React, { useRef } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useDesktopStore, DesktopIcon as DesktopIconType } from "@/lib/store/desktopStore";
import DesktopIcon from "./DesktopIcon";
import SelectionBox from "./SelectionBox";
import { useSelection } from "@/hooks/useSelection";
import DesktopContextMenu, { MENU_ID } from "./ContextMenu";
import { useContextMenu } from "react-contexify";

const GRID_W = 75;
const GRID_H = 100;

export default function DesktopGrid() {
  const { icons, updateIconPosition, selectedIconIds, selectIcon, deselectAll, setSelectedIcons, openWindow } = useDesktopStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const { selectionBox, isSelecting, handleMouseDown } = useSelection(containerRef);
  const { show } = useContextMenu({ id: MENU_ID });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
        show({ event: e });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const iconId = active.id as string;
    const icon = icons.find((i: DesktopIconType) => i.id === iconId);

    if (icon) {
      const newPixelX = (icon.x * GRID_W) + delta.x;
      const newPixelY = (icon.y * GRID_H) + delta.y;
      
      const maxGridX = Math.floor((window.innerWidth - 10) / GRID_W);
      const maxGridY = Math.floor((window.innerHeight - 100) / GRID_H); // 100px buffer for taskbar

      const newGridX = Math.max(0, Math.min(Math.round(newPixelX / GRID_W), maxGridX));
      const newGridY = Math.max(0, Math.min(Math.round(newPixelY / GRID_H), maxGridY));
      
      updateIconPosition(iconId, newGridX, newGridY);
    }
  };

  // Handle selection box logic
  React.useEffect(() => {
    if (selectionBox) {
      const selected = icons.filter((icon: DesktopIconType) => {
        const iconX = icon.x * GRID_W + 2; // Reduced padding
        const iconY = icon.y * GRID_H + 2;
        const iconW = 70; // Adjusted width
        const iconH = 90; // Adjusted height

        return (
          iconX < selectionBox.startX + selectionBox.width &&
          iconX + iconW > selectionBox.startX &&
          iconY < selectionBox.startY + selectionBox.height &&
          iconY + iconH > selectionBox.startY
        );
      });
      
      setSelectedIcons(selected.map((i: DesktopIconType) => i.id));
    }
  }, [selectionBox, icons, setSelectedIcons]);

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div 
        ref={containerRef}
        className="w-full h-full relative" 
        id="desktop-grid"
        onMouseDown={handleMouseDown}
        onContextMenu={handleContextMenu}
        onClick={(e) => {
          if (e.target === e.currentTarget && !isSelecting) {
            deselectAll();
          }
        }}
      >
        <DesktopContextMenu />
        
        {selectionBox && (
          <SelectionBox
            x={selectionBox.startX}
            y={selectionBox.startY}
            width={selectionBox.width}
            height={selectionBox.height}
          />
        )}

        {icons.map((icon: DesktopIconType) => (
          <DesktopIcon
            key={icon.id}
            icon={icon}
            selected={selectedIconIds.includes(icon.id)}
            onSelect={(multi: boolean) => selectIcon(icon.id, multi)}
            onDoubleClick={() => {
                if (icon.appId) {
                    openWindow(icon.appId, icon.title);
                }
            }}
          />
        ))}
      </div>
    </DndContext>
  );
}
