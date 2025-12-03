"use client";

import React, { useState, useEffect } from "react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import { cn } from "@/lib/utils";
import { ChevronUp, Wifi, Volume2, Battery } from "lucide-react";
import { format } from "date-fns";

export default function Taskbar() {
  const { windows, activeWindowId, minimizeWindow, focusWindow, openWindow } = useDesktopStore();
  const [currentTime, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pinned apps matching Figma design
  const pinnedApps = [
    { id: 'file-explorer', title: 'File Explorer', appId: 'file-explorer' },
    { id: 'github', title: 'GitHub', appId: 'github' },
    { id: 'chrome', title: 'Chrome', appId: 'chrome' },
    { id: 'notion', title: 'Notion', appId: 'notion' },
    { id: 'cursor', title: 'Cursor', appId: 'cursor' },
    { id: 'arc', title: 'Arc', appId: 'arc' },
  ];

  const handleAppClick = (appId: string) => {
    if (appId === 'start' || appId === 'search' || appId === 'task-view') {
      return;
    }

    const appWindows = windows.filter(w => w.appId === appId);
    if (appWindows.length > 0) {
      const activeAppWindow = appWindows.find(w => w.id === activeWindowId);
      if (activeAppWindow) {
        minimizeWindow(activeAppWindow.id);
      } else {
        focusWindow(appWindows[0].id);
      }
    } else {
      openWindow(appId, appId);
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#E1EBFF]/90 backdrop-blur-[35px] select-none">
      {/* Apps - Left Aligned */}
      <div className="absolute left-[22px] top-1/2 -translate-y-1/2 flex items-center gap-[26px]">
        {/* Start Button */}
        <button
          className="w-[29px] h-[29px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Start"
        >
          <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M1.70588 0C0.76375 0 0 0.763748 0 1.70588V13.576H13.7663V0H1.70588ZM27.2941 0C28.2362 0 29 0.763748 29 1.70588V13.576H15.2337V0H27.2941ZM0 27.2941C0 28.2362 0.76375 29 1.70588 29H13.7663V14.9975H0V27.2941ZM27.2941 29C28.2362 29 29 28.2362 29 27.2941V14.9975H15.2337V29H27.2941Z" fill="url(#paint0_linear_taskbar)"/>
            <defs>
              <linearGradient id="paint0_linear_taskbar" x1="-0.104819" y1="-0.0355391" x2="29.4853" y2="28.4967" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8AECF6"/>
                <stop offset="0.376995" stopColor="#24B8E7"/>
                <stop offset="1" stopColor="#3774C4"/>
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Search */}
        <button
          className="w-[27px] h-[28px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Search"
        >
          <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="15" cy="12.75" r="10.5" stroke="#1F1F1F" strokeWidth="3"/>
            <path d="M7 21.25L1 27.25" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round"/>
          </svg>
        </button>

        {/* Desktop Manager / Task View */}
        <button
          className="w-[30px] h-[28px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Task View"
        >
          <svg width="30" height="28" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="8" width="23" height="20" rx="2" fill="url(#paint0_linear_desktop)"/>
            <rect x="7.5" y="0" width="23" height="21" rx="2" fill="white" fillOpacity="0.6"/>
            <defs>
              <linearGradient id="paint0_linear_desktop" x1="12" y1="8" x2="12" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#5E5E5E"/>
                <stop offset="1" stopColor="#404040"/>
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Weather/Night Mode */}
        <button
          className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Widgets"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M17.5758 19.3991C26.0731 19.3991 32.9609 12.6155 32.9609 4.24762C32.9609 2.58945 32.6897 0.993359 32.1909 -0.5C39.2144 0.903255 44.5 6.51801 44.5 13.8486C44.5 22.2165 37.6122 29 29.1149 29C22.3019 29 16.5234 24.6386 14.5 18.5962C15.494 18.7948 16.5225 18.8991 17.5758 18.8991Z" fill="url(#paint0_linear_weather)"/>
            <defs>
              <linearGradient id="paint0_linear_weather" x1="32.3203" y1="17.8079" x2="39.2628" y2="24.8587" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FBDF00"/>
                <stop offset="1" stopColor="#FAAE00"/>
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* Chat */}
        <button
          className="w-[28px] h-[27px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Chat"
        >
          <svg width="28" height="27" viewBox="0 0 28 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M14.5078 28C21.9644 28 28.0078 21.9558 28.0078 14.5C28.0078 7.04416 21.9644 1 14.5078 1C7.05117 1 1.00781 7.04416 1.00781 14.5C1.00781 16.4844 1.43594 18.3688 2.20469 20.0659C2.30977 20.2988 2.33203 20.5621 2.25625 20.8062L0.546875 26.2746C0.3125 27.025 0.996094 27.74 1.75625 27.54L7.07422 26.1406C7.33672 26.0713 7.61641 26.1139 7.85234 26.2482C9.81719 27.3633 12.0883 28 14.5078 28Z" fill="url(#paint0_linear_chat)" stroke="url(#paint1_linear_chat)"/>
            <rect x="6" y="8" width="12" height="12" rx="1" fill="white"/>
            <path d="M22.2 9.6L19.4 11.7C19.1484 11.8889 19 12.1852 19 12.5V16.382C19 16.7607 19.2141 17.107 19.5516 17.2764L22.2758 18.6382C22.609 18.8044 23 18.5627 23 18.191V10C23 9.58799 22.5293 9.35277 22.2 9.6Z" fill="white"/>
            <defs>
              <linearGradient id="paint0_linear_chat" x1="6" y1="3.5" x2="25" y2="28.5001" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8874BE"/>
                <stop offset="1" stopColor="#6163CB"/>
              </linearGradient>
              <linearGradient id="paint1_linear_chat" x1="5.5" y1="2" x2="25" y2="27.0001" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8B76BD"/>
                <stop offset="1" stopColor="#5E62CC"/>
              </linearGradient>
            </defs>
          </svg>
        </button>

        {/* File Explorer */}
        <button
          onClick={() => handleAppClick('file-explorer')}
          className={cn(
            "w-[30px] h-[27px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors relative",
            windows.some(w => w.appId === 'file-explorer' && w.id === activeWindowId) && "bg-white/60"
          )}
          title="File Explorer"
        >
          <svg width="30" height="27" viewBox="0 0 30 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="0.5" y="4.5" width="29" height="23" rx="1.5" fill="url(#paint0_linear_explorer)" stroke="url(#paint1_linear_explorer)"/>
            <path d="M0 2C0 1.44772 0.447715 1 1 1H9.93301C10.2851 1 10.6101 1.18426 10.7912 1.48548L12.5913 4.48548C12.9912 5.15201 12.5112 6 11.7331 6H0V2Z" fill="#E09F00"/>
            <path d="M5 22C5 20.8954 5.89543 20 7 20H23C24.1046 20 25 20.8954 25 22V28H5V22Z" fill="#036ABB"/>
            <path d="M22 23.5H8" stroke="#114A8B"/>
            <defs>
              <linearGradient id="paint0_linear_explorer" x1="15" y1="4" x2="15" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFCF4D"/>
                <stop offset="1" stopColor="#F4B509"/>
              </linearGradient>
              <linearGradient id="paint1_linear_explorer" x1="15" y1="4" x2="15" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FFD04E"/>
                <stop offset="1" stopColor="#F4B509"/>
              </linearGradient>
            </defs>
          </svg>
          {windows.some(w => w.appId === 'file-explorer') && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-[3px] bg-black/50 rounded-full" />
          )}
        </button>

        {/* Microsoft Edge */}
        <button
          className="w-[30px] h-[30px] flex items-center justify-center hover:bg-white/50 rounded-md transition-colors"
          title="Microsoft Edge"
        >
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <clipPath id="clip0_edge"><rect width="30" height="30" fill="white"/></clipPath>
            <g clipPath="url(#clip0_edge)">
              <path d="M27.084 22.329C26.684 22.5381 26.271 22.7225 25.848 22.8809C24.503 23.3843 23.078 23.6408 21.641 23.6379C16.096 23.6379 11.266 19.8235 11.266 14.9286C11.273 14.272 11.455 13.6293 11.793 13.0667C12.132 12.5041 12.614 12.042 13.191 11.7282C8.175 11.9391 6.886 17.1657 6.886 20.2278C6.886 28.8856 14.866 29.7633 16.585 29.7633C17.512 29.7633 18.91 29.4938 19.749 29.229L19.902 29.1774C23.131 28.0612 25.884 25.879 27.707 22.9899C27.763 22.9019 27.788 22.7978 27.778 22.6941C27.768 22.5903 27.724 22.4929 27.652 22.4171C27.581 22.3413 27.486 22.2914 27.383 22.2755C27.28 22.2595 27.175 22.2783 27.084 22.329Z" fill="url(#paint0_linear_edge)"/>
              <path opacity="0.35" d="M27.084 22.329C26.684 22.5381 26.271 22.7225 25.848 22.8809C24.503 23.3843 23.078 23.6408 21.641 23.6379C16.096 23.6379 11.266 19.8235 11.266 14.9286C11.273 14.272 11.455 13.6293 11.793 13.0667C12.132 12.5041 12.614 12.042 13.191 11.7282C8.175 11.9391 6.886 17.1657 6.886 20.2278C6.886 28.8856 14.866 29.7633 16.585 29.7633C17.512 29.7633 18.91 29.4938 19.749 29.229L19.902 29.1774C23.131 28.0612 25.884 25.879 27.707 22.9899C27.763 22.9019 27.788 22.7978 27.778 22.6941C27.768 22.5903 27.724 22.4929 27.652 22.4171C27.581 22.3413 27.486 22.2914 27.383 22.2755C27.28 22.2595 27.175 22.2783 27.084 22.329Z" fill="url(#paint1_radial_edge)"/>
              <path d="M12.395 28.2914C11.35 27.6427 10.444 26.7926 9.731 25.7906C8.917 24.676 8.357 23.3969 8.09 22.0431C7.823 20.6892 7.856 19.2934 8.186 17.9534C8.516 16.6135 9.134 15.3619 9.999 14.2865C10.864 13.2111 11.953 12.3379 13.191 11.7281C13.557 11.5558 14.181 11.2441 15.012 11.2594C15.598 11.2636 16.174 11.4034 16.696 11.6677C17.219 11.932 17.673 12.3137 18.023 12.7828C18.496 13.4147 18.757 14.1802 18.768 14.9695C18.768 14.9449 21.634 5.64139 9.393 5.64139C4.248 5.64139 0.018 10.5234 0.018 14.8066C-0.002 17.0724 0.483 19.3142 1.437 21.3691C2.997 24.6979 5.726 27.3379 9.104 28.7877C12.482 30.2375 16.275 30.3962 19.763 29.2336C18.542 29.6186 17.252 29.7342 15.982 29.5723C14.711 29.4105 13.491 28.9751 12.406 28.2961L12.395 28.2914Z" fill="url(#paint2_linear_edge)"/>
              <path d="M17.856 17.4445C17.761 17.5676 17.469 17.7375 17.469 18.1078C17.469 18.4137 17.669 18.7078 18.023 18.9551C19.708 20.1269 22.885 19.9723 22.893 19.9723C24.142 19.9693 25.367 19.6313 26.44 18.9937C27.523 18.3614 28.422 17.4568 29.048 16.3697C29.673 15.2827 30.004 14.051 30.006 12.7969C30.037 10.1707 29.069 8.42461 28.677 7.65117C26.194 2.79375 20.834 0 15.005 0C11.063 -0.000389715 7.279 1.55097 4.472 4.31856C1.665 7.08614 0.060 10.8475 0.005 14.7891C0.061 10.507 4.318 7.04883 9.38 7.04883C9.79 7.04883 12.129 7.08867 14.302 8.2289C16.217 9.23437 17.22 10.4484 17.917 11.652C18.641 12.9023 18.77 14.482 18.77 15.1113C18.77 15.7406 18.449 16.6734 17.856 17.4445Z" fill="url(#paint3_radial_edge)"/>
            </g>
            <defs>
              <linearGradient id="paint0_linear_edge" x1="6.886" y1="20.7481" x2="27.786" y2="20.7481" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0C59A4"/>
                <stop offset="1" stopColor="#114A8B"/>
              </linearGradient>
              <radialGradient id="paint1_radial_edge" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(18.429 20.9128) scale(11.1773 10.6185)">
                <stop offset="0.72" stopOpacity="0"/>
                <stop offset="0.95" stopOpacity="0.53"/>
                <stop offset="1"/>
              </radialGradient>
              <linearGradient id="paint2_linear_edge" x1="17.904" y1="11.6824" x2="4.851" y2="25.9008" gradientUnits="userSpaceOnUse">
                <stop stopColor="#1B9DE2"/>
                <stop offset="0.16" stopColor="#1595DF"/>
                <stop offset="0.67" stopColor="#0680D7"/>
                <stop offset="1" stopColor="#0078D4"/>
              </linearGradient>
              <radialGradient id="paint3_radial_edge" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(3.036 5.552) rotate(4.94) scale(53.56)">
                <stop stopColor="#35C1F1"/>
                <stop offset="0.11" stopColor="#34C1ED"/>
                <stop offset="0.23" stopColor="#2FC2DF"/>
                <stop offset="0.31" stopColor="#2BC3D2"/>
                <stop offset="0.67" stopColor="#36C752"/>
              </radialGradient>
            </defs>
          </svg>
        </button>
      </div>

      {/* System Tray - Right Aligned */}
      <div className="absolute right-[29px] top-1/2 -translate-y-1/2 flex items-center gap-0">
        {/* Overflow Button */}
        <button className="w-8 h-10 flex items-center justify-center hover:bg-white/[0.06] rounded-sm transition-colors">
          <ChevronUp size={12} className="text-black"/>
        </button>

        {/* Quick Settings */}
        <button className="h-10 px-2 flex items-center gap-1 hover:bg-white/[0.06] rounded-sm transition-colors">
          <Wifi size={20} className="text-black"/>
          <Volume2 size={20} className="text-black"/>
          <Battery size={20} className="text-black"/>
        </button>

        {/* Clock */}
        <button className="h-10 min-w-[68px] px-2 flex items-center justify-end hover:bg-white/[0.06] rounded-sm transition-colors">
          <div className="text-right">
            <div className="text-[12px] leading-4 text-black font-normal">{format(currentTime, 'HH:mm')}</div>
            <div className="text-[12px] leading-4 text-black font-normal">{format(currentTime, 'MM/dd/yyyy')}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
