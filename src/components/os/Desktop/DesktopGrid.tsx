"use client";

import React, { useRef } from "react";
import { DndContext, DragEndEvent, useSensor, useSensors, PointerSensor } from "@dnd-kit/core";
import { useDesktopStore, DesktopIcon as DesktopIconType } from "@/lib/store/desktopStore";
import DesktopIcon from "./DesktopIcon";
import SelectionBox from "./SelectionBox";
import { useSelection } from "@/hooks/useSelection";
import DesktopContextMenu, { MENU_ID } from "./ContextMenu";
import { useContextMenu } from "react-contexify";

const GRID_SIZE = 96;

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
      const newPixelX = (icon.x * GRID_SIZE) + delta.x;
      const newPixelY = (icon.y * GRID_SIZE) + delta.y;
      const newGridX = Math.max(0, Math.round(newPixelX / GRID_SIZE));
      const newGridY = Math.max(0, Math.round(newPixelY / GRID_SIZE));
      updateIconPosition(iconId, newGridX, newGridY);
    }
  };

  // Handle selection box logic
  React.useEffect(() => {
    if (selectionBox) {
      const selected = icons.filter((icon: DesktopIconType) => {
        const iconX = icon.x * GRID_SIZE + 8;
        const iconY = icon.y * GRID_SIZE + 8;
        const iconW = 80;
        const iconH = 80;

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
