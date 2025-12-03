import React from "react";
import { cn } from "@/lib/utils";

export default function WeatherIcon({ className }: { className?: string }) {
  return (
    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M3.07572 19.8991C11.5727 19.8991 18.4609 13.1155 18.4609 4.74765C18.4609 3.08939 18.1904 1.49336 17.6905 0C24.7137 1.40334 30 7.518 30 14.8486C30 23.2165 23.1118 30 14.6148 30C7.80161 30 2.0228 25.6386 0 19.5962C0.993813 19.7948 2.0224 19.8991 3.07572 19.8991Z" fill="url(#paint0_linear_1615_1628)"/>
      <defs>
        <linearGradient id="paint0_linear_1615_1628" x1="17.8198" y1="18.3079" x2="24.7634" y2="25.3587" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FBDF00"/>
          <stop offset="1" stopColor="#FAAE00"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
