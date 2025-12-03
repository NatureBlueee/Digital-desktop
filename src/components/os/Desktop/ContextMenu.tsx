"use client";

import React from "react";
import { Menu, Item, Separator, Submenu, useContextMenu } from "react-contexify";
import "react-contexify/dist/ReactContexify.css";
import { RefreshCw, Monitor, Settings, View, Grid, SortAsc } from "lucide-react";

const MENU_ID = "desktop-context-menu";

export default function DesktopContextMenu() {
  return (
    <Menu id={MENU_ID} animation="scale">
      <Submenu
        label={
          <div className="flex items-center gap-2 text-sm">
            <View size={14} />
            <span>View</span>
          </div>
        }
      >
        <Item>Large icons</Item>
        <Item>Medium icons</Item>
        <Item>Small icons</Item>
        <Separator />
        <Item>Show desktop icons</Item>
      </Submenu>
      
      <Submenu
        label={
          <div className="flex items-center gap-2 text-sm">
            <SortAsc size={14} />
            <span>Sort by</span>
          </div>
        }
      >
        <Item>Name</Item>
        <Item>Size</Item>
        <Item>Item type</Item>
        <Item>Date modified</Item>
      </Submenu>

      <Item onClick={() => window.location.reload()}>
        <div className="flex items-center gap-2 text-sm">
          <RefreshCw size={14} />
          <span>Refresh</span>
        </div>
      </Item>
      
      <Separator />
      
      <Item>
        <div className="flex items-center gap-2 text-sm">
          <Monitor size={14} />
          <span>Display settings</span>
        </div>
      </Item>
      
      <Item>
        <div className="flex items-center gap-2 text-sm">
          <Settings size={14} />
          <span>Personalize</span>
        </div>
      </Item>
    </Menu>
  );
}

export { MENU_ID };
