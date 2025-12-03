import React from "react";
import { cn } from "@/lib/utils";

export default function FileExplorerIcon({ className }: { className?: string }) {
  return (
    <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="0.5" y="3.5" width="29" height="23" rx="1.5" fill="url(#paint0_linear_1615_1639)" stroke="url(#paint1_linear_1615_1639)"/>
      <path d="M0 1C0 0.447715 0.447715 0 1 0H9.93381C10.2851 0 10.6106 0.184299 10.7913 0.485504L12.5913 3.4855C12.9912 4.15203 12.5111 5 11.7338 5H0V1Z" fill="#E09F00"/>
      <path d="M5 21C5 19.8954 5.89543 19 7 19H23C24.1046 19 25 19.8954 25 21V27H5V21Z" fill="#036ABB"/>
      <path d="M22 22.5H8" stroke="#114A8B"/>
      <defs>
        <linearGradient id="paint0_linear_1615_1639" x1="15" y1="3" x2="15" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFCF4D"/>
          <stop offset="1" stopColor="#F4B509"/>
        </linearGradient>
        <linearGradient id="paint1_linear_1615_1639" x1="15" y1="3" x2="15" y2="27" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD04E"/>
          <stop offset="1" stopColor="#F4B509"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
