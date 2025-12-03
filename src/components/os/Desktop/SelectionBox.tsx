import React from "react";

interface SelectionBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function SelectionBox({ x, y, width, height }: SelectionBoxProps) {
  if (width === 0 || height === 0) return null;

  return (
    <div
      className="absolute border border-blue-500 bg-blue-500/20 pointer-events-none z-50"
      style={{
        left: x,
        top: y,
        width,
        height,
      }}
    />
  );
}
