"use client";

import React, { useState, useEffect } from "react";
import { useDesktopStore } from "@/lib/store/desktopStore";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import { ChevronUp, Wifi, Volume2, Battery } from "lucide-react";
import { format } from "date-fns";

export default function Taskbar() {
  const { windows, activeWindowId, minimizeWindow, focusWindow, openWindow } = useDesktopStore();
  const [currentTime, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Pinned apps configuration
  const pinnedApps = [
    { id: 'start', icon: 'https://img.icons8.com/fluency/96/windows-11.png', title: 'Start' },
    { id: 'search', icon: 'https://img.icons8.com/fluency/96/search.png', title: 'Search' },
    { id: 'task-view', icon: 'https://img.icons8.com/fluency/96/task-view.png', title: 'Task View' },
    { id: 'wechat', icon: '/icons/wechat.png', title: 'WeChat' },
    { id: 'file-explorer', icon: 'https://img.icons8.com/fluency/96/folder-invoices--v1.png', title: 'File Explorer' },
    { id: 'github', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Github-desktop-logo-symbol.svg/2048px-Github-desktop-logo-symbol.svg.png', title: 'GitHub' },
    { id: 'chrome', icon: 'https://img.icons8.com/fluency/96/chrome.png', title: 'Google Chrome' },
    { id: 'notion', icon: '/icons/notion.png', title: 'Notion' },
    { id: 'cursor', icon: '/icons/cursor-ai-code-icon.svg', title: 'Cursor' },
    { id: 'arc', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Arc_Browser_logo.png/600px-Arc_Browser_logo.png', title: 'Arc Browser' },
  ];

  const handleAppClick = (appId: string) => {
    if (appId === 'start') {
        // Toggle start menu (future)
        return;
    }
    if (appId === 'search') {
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
      openWindow(appId, pinnedApps.find(p => p.id === appId)?.title || appId);
    }
  };

  return (
    <div className="absolute bottom-0 w-full h-[60px] bg-[#e1ebff]/90 backdrop-blur-[35px] flex items-center justify-between px-4 z-50 select-none border-t border-white/40 font-[Segoe_UI] antialiased">
      
      {/* Left: Start, Search, Widgets, Apps (Left Aligned) */}
      <div className="flex items-center gap-[26px] h-full pl-2">
        {/* Start Button */}
        <button 
            className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors group relative"
            title="Start"
        >
            <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:scale-105">
                <path fillRule="evenodd" clipRule="evenodd" d="M1.70588 0C0.76375 0 0 0.763748 0 1.70588V13.576H13.7663V0H1.70588ZM27.2941 0C28.2362 0 29 0.763748 29 1.70588V13.576H15.2337V0H27.2941ZM0 27.2941C0 28.2362 0.76375 29 1.70588 29H13.7663V14.9975H0V27.2941ZM27.2941 29C28.2362 29 29 28.2362 29 27.2941V14.9975H15.2337V29H27.2941Z" fill="url(#paint0_linear_1604_1620)"/>
                <defs>
                    <linearGradient id="paint0_linear_1604_1620" x1="-0.104819" y1="-0.0355391" x2="29.4853" y2="28.4967" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#8AECF6"/>
                        <stop offset="0.376995" stopColor="#24B8E7"/>
                        <stop offset="1" stopColor="#3774C4"/>
                    </linearGradient>
                </defs>
            </svg>
        </button>

        {/* Search Bar */}
        <div className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors cursor-pointer group">
             <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80 group-hover:scale-105 transition-transform">
                <foreignObject x="-47" y="-50" width="124" height="124">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{backdropFilter:"blur(25px)", clipPath:"url(#bgblur_0_1604_1626_clip_path)", height:"100%", width:"100%"}}></div>
                </foreignObject>
                <circle data-figma-bg-blur-radius="50" cx="15" cy="12" r="10.5" stroke="#1F1F1F" strokeWidth="3"/>
                <path d="M1.50003 26.5L7.50003 19.5" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round"/>
                <defs>
                    <clipPath id="bgblur_0_1604_1626_clip_path" transform="translate(47 50)"><circle cx="15" cy="12" r="10.5"/></clipPath>
                </defs>
            </svg>
        </div>

        {/* Widgets (Moon/Weather) */}
        <div className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors cursor-pointer group">
             <img src="https://img.icons8.com/fluency/96/partly-cloudy-night.png" alt="Widgets" className="w-[28px] h-[28px] opacity-80 group-hover:scale-105 transition-transform" />
        </div>

        {/* Chat */}
        <div className="h-10 w-10 flex items-center justify-center rounded-md hover:bg-white/50 transition-colors cursor-pointer group">
             <img src="https://img.icons8.com/fluency/96/chat-message.png" alt="Chat" className="w-[26px] h-[26px] opacity-80 group-hover:scale-105 transition-transform" />
        </div>

        {/* Pinned Apps */}
        {pinnedApps.map((app) => {
            if (app.id === 'start' || app.id === 'search' || app.id === 'task-view') return null;

            const isOpen = windows.some(w => w.appId === app.id);
            const isActive = windows.some(w => w.appId === app.id && w.id === activeWindowId);

            // Custom SVG for File Explorer
            if (app.id === 'file-explorer') {
                return (
                    <button
                        key={app.id}
                        onClick={() => handleAppClick(app.id)}
                        className={cn(
                            "h-10 flex items-center justify-center rounded-md transition-all relative group px-1",
                            isActive ? "bg-white/60 shadow-sm" : "hover:bg-white/40"
                        )}
                        title={app.title}
                    >
                        <svg width="30" height="30" viewBox="0 0 86 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn("transition-transform duration-200", isActive ? "scale-100" : "group-hover:scale-110")} preserveAspectRatio="xMidYMid meet">
                            <rect x="0.5" y="5" width="29" height="23" rx="1.5" fill="url(#paint0_linear_19_6717)" stroke="url(#paint1_linear_19_6717)"/>
                            <g clipPath="url(#clip0_19_6717)">
                                <path d="M83.0759 22.329C82.6759 22.5381 82.2634 22.7225 81.8407 22.8809C80.4953 23.3843 79.0701 23.6408 77.6337 23.6379C72.0884 23.6379 67.2579 19.8235 67.2579 14.9286C67.265 14.272 67.4472 13.6293 67.7856 13.0667C68.1241 12.5041 68.6066 12.042 69.1833 11.7282C64.1677 11.9391 62.8786 17.1657 62.8786 20.2278C62.8786 28.8856 70.8579 29.7633 72.577 29.7633C73.504 29.7633 74.902 29.4938 75.7411 29.229L75.8946 29.1774C79.1234 28.0612 81.876 25.879 83.6993 22.9899C83.7551 22.9019 83.7801 22.7978 83.7702 22.6941C83.7602 22.5903 83.716 22.4929 83.6445 22.4171C83.573 22.3413 83.4783 22.2914 83.3753 22.2755C83.2723 22.2595 83.167 22.2783 83.0759 22.329Z" fill="url(#paint2_linear_19_6717)"/>
                                <path opacity="0.35" d="M83.0759 22.329C82.6759 22.5381 82.2634 22.7225 81.8407 22.8809C80.4953 23.3843 79.0701 23.6408 77.6337 23.6379C72.0884 23.6379 67.2579 19.8235 67.2579 14.9286C67.265 14.272 67.4472 13.6293 67.7856 13.0667C68.1241 12.5041 68.6066 12.042 69.1833 11.7282C64.1677 11.9391 62.8786 17.1657 62.8786 20.2278C62.8786 28.8856 70.8579 29.7633 72.577 29.7633C73.504 29.7633 74.902 29.4938 75.7411 29.229L75.8946 29.1774C79.1234 28.0612 81.876 25.879 83.6993 22.9899C83.7551 22.9019 83.7801 22.7978 83.7702 22.6941C83.7602 22.5903 83.716 22.4929 83.6445 22.4171C83.573 22.3413 83.4783 22.2914 83.3753 22.2755C83.2723 22.2595 83.167 22.2783 83.0759 22.329Z" fill="url(#paint3_radial_19_6717)"/>
                                <path d="M68.3877 28.2914C67.3424 27.6427 66.4366 26.7926 65.7228 25.7906C64.9093 24.676 64.3495 23.3969 64.0826 22.0431C63.8158 20.6892 63.8483 19.2934 64.1781 17.9534C64.5078 16.6135 65.1267 15.3619 65.9914 14.2865C66.856 13.2111 67.9455 12.3379 69.1834 11.7281C69.549 11.5558 70.1736 11.2441 71.0045 11.2594C71.5898 11.2636 72.1662 11.4034 72.6886 11.6677C73.2109 11.932 73.6649 12.3137 74.015 12.7828C74.4882 13.4147 74.7491 14.1802 74.7603 14.9695C74.7603 14.9449 77.6267 5.64139 65.3853 5.64139C60.2408 5.64139 56.0103 10.5234 56.0103 14.8066C55.99 17.0724 56.4748 19.3142 57.4295 21.3691C58.9896 24.6979 61.7179 27.3379 65.0962 28.7877C68.4745 30.2375 72.2676 30.3962 75.7552 29.2336C74.5341 29.6186 73.244 29.7342 71.9738 29.5723C70.7037 29.4105 69.4838 28.9751 68.3982 28.2961L68.3877 28.2914Z" fill="url(#paint4_linear_19_6717)"/>
                                <path opacity="0.41" d="M68.3877 28.2914C67.3424 27.6427 66.4366 26.7926 65.7228 25.7906C64.9093 24.676 64.3495 23.3969 64.0826 22.0431C63.8158 20.6892 63.8483 19.2934 64.1781 17.9534C64.5078 16.6135 65.1267 15.3619 65.9914 14.2865C66.856 13.2111 67.9455 12.3379 69.1834 11.7281C69.549 11.5558 70.1736 11.2441 71.0045 11.2594C71.5898 11.2636 72.1662 11.4034 72.6886 11.6677C73.2109 11.932 73.6649 12.3137 74.015 12.7828C74.4882 13.4147 74.7491 14.1802 74.7603 14.9695C74.7603 14.9449 77.6267 5.64139 65.3853 5.64139C60.2408 5.64139 56.0103 10.5234 56.0103 14.8066C55.99 17.0724 56.4748 19.3142 57.4295 21.3691C58.9896 24.6979 61.7179 27.3379 65.0962 28.7877C68.4745 30.2375 72.2676 30.3962 75.7552 29.2336C74.5341 29.6186 73.244 29.7342 71.9738 29.5723C70.7037 29.4105 69.4838 28.9751 68.3982 28.2961L68.3877 28.2914Z" fill="url(#paint5_radial_19_6717)"/>
                                <path d="M73.8485 17.4445C73.7536 17.5676 73.4618 17.7375 73.4618 18.1078C73.4618 18.4137 73.661 18.7078 74.0149 18.9551C75.7 20.1269 78.877 19.9723 78.8852 19.9723C80.1339 19.9693 81.3589 19.6313 82.4325 18.9937C83.5155 18.3614 84.4144 17.4568 85.0399 16.3697C85.6655 15.2827 85.9959 14.051 85.9985 12.7969C86.0289 10.1707 85.061 8.42461 84.6696 7.65117C82.1864 2.79375 76.8262 7.34346e-08 70.9973 7.34346e-08C67.0553 -0.000389715 63.2717 1.55097 60.4646 4.31856C57.6575 7.08614 56.0527 10.8475 55.9973 14.7891C56.0536 10.507 60.3098 7.04883 65.3723 7.04883C65.7825 7.04883 68.1215 7.08867 70.2942 8.2289C72.209 9.23437 73.2122 10.4484 73.9094 11.652C74.6336 12.9023 74.7625 14.482 74.7625 15.1113C74.7625 15.7406 74.4415 16.6734 73.8485 17.4445Z" fill="url(#paint6_radial_19_6717)"/>
                                <path d="M73.8485 17.4445C73.7536 17.5676 73.4618 17.7375 73.4618 18.1078C73.4618 18.4137 73.661 18.7078 74.0149 18.9551C75.7 20.1269 78.877 19.9723 78.8852 19.9723C80.1339 19.9693 81.3589 19.6313 82.4325 18.9937C83.5155 18.3614 84.4144 17.4568 85.0399 16.3697C85.6655 15.2827 85.9959 14.051 85.9985 12.7969C86.0289 10.1707 85.061 8.42461 84.6696 7.65117C82.1864 2.79375 76.8262 7.34346e-08 70.9973 7.34346e-08C67.0553 -0.000389715 63.2717 1.55097 60.4646 4.31856C57.6575 7.08614 56.0527 10.8475 55.9973 14.7891C56.0536 10.507 60.3098 7.04883 65.3723 7.04883C65.7825 7.04883 68.1215 7.08867 70.2942 8.2289C72.209 9.23437 73.2122 10.4484 73.9094 11.652C74.6336 12.9023 74.7625 14.482 74.7625 15.1113C74.7625 15.7406 74.4415 16.6734 73.8485 17.4445Z" fill="url(#paint7_radial_19_6717)"/>
                                </g>
                                <defs>
                                    <linearGradient id="paint0_linear_19_6717" x1="15" y1="4.5" x2="15" y2="28.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFCF4D"/>
                                        <stop offset="1" stopColor="#F4B509"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_19_6717" x1="15" y1="4.5" x2="15" y2="28.5" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#FFD04E"/>
                                        <stop offset="1" stopColor="#F4B509"/>
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_19_6717" x1="62.8786" y1="20.7481" x2="83.7778" y2="20.7481" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#0C59A4"/>
                                        <stop offset="1" stopColor="#114A8B"/>
                                    </linearGradient>
                                    <radialGradient id="paint3_radial_19_6717" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(74.4216 20.9128) scale(11.1773 10.6185)">
                                        <stop offset="0.72" stopOpacity="0"/>
                                        <stop offset="0.95" stopOpacity="0.53"/>
                                        <stop offset="1"/>
                                    </radialGradient>
                                    <linearGradient id="paint4_linear_19_6717" x1="73.8966" y1="11.6824" x2="60.8431" y2="25.9008" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#1B9DE2"/>
                                        <stop offset="0.16" stopColor="#1595DF"/>
                                        <stop offset="0.67" stopColor="#0680D7"/>
                                        <stop offset="1" stopColor="#0078D4"/>
                                    </linearGradient>
                                    <radialGradient id="paint5_radial_19_6717" cx="0" cy="0" r="1" gradientTransform="matrix(2.51789 -16.6181 -13.4288 -2.01431 64.2702 23.3213)" gradientUnits="userSpaceOnUse">
                                        <stop offset="0.76" stopOpacity="0"/>
                                        <stop offset="0.95" stopOpacity="0.5"/>
                                        <stop offset="1"/>
                                    </radialGradient>
                                    <radialGradient id="paint6_radial_19_6717" cx="0" cy="0" r="1" gradientTransform="matrix(-0.94889 23.7223 50.5284 1.89778 59.0281 5.55197)" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#35C1F1"/>
                                        <stop offset="0.11" stopColor="#34C1ED"/>
                                        <stop offset="0.23" stopColor="#2FC2DF"/>
                                        <stop offset="0.31" stopColor="#2BC3D2"/>
                                        <stop offset="0.67" stopColor="#36C752"/>
                                    </radialGradient>
                                    <radialGradient id="paint7_radial_19_6717" cx="0" cy="0" r="1" gradientTransform="matrix(3.19397 10.9507 8.89748 -2.62362 84.1308 9.07103)" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#66EB6E"/>
                                        <stop offset="1" stopColor="#66EB6E" stopOpacity="0"/>
                                    </radialGradient>
                                    <clipPath id="clip0_19_6717">
                                        <rect width="30" height="30" fill="white" transform="translate(56)"/>
                                    </clipPath>
                                </defs>
                            </svg>
                            {isOpen && (
                                <div className={cn(
                                    "absolute bottom-0.5 w-1.5 h-1 rounded-full transition-all duration-300",
                                    isActive ? "w-4 bg-[#005FB8] h-[3px]" : "bg-gray-400 group-hover:bg-gray-500"
                                )} />
                            )}
                        </button>
                    );
                }

            const isUrl = app.icon.startsWith('http') || app.icon.startsWith('/');
            const Icon = !isUrl ? (LucideIcons as any)[app.icon] || LucideIcons.AppWindow : null;
            
            return (
                <button
                    key={app.id}
                    onClick={() => handleAppClick(app.id)}
                    className={cn(
                        "h-10 w-10 flex items-center justify-center rounded-md transition-all relative group",
                        isActive ? "bg-white/60 shadow-sm" : "hover:bg-white/40"
                    )}
                    title={app.title}
                >
                    {isUrl ? (
                        <img src={app.icon} alt={app.title} className={cn(
                            "w-[30px] h-[30px] object-contain transition-transform duration-200",
                            isActive ? "scale-100" : "group-hover:scale-110"
                        )} />
                    ) : (
                        Icon && <Icon size={30} strokeWidth={1.5} className={cn(
                            "transition-transform duration-200",
                            isActive ? "text-blue-600" : "text-gray-700 group-hover:scale-110"
                        )} />
                    )}
                    
                    {/* Active Indicator Line */}
                    {isOpen && (
                        <div className={cn(
                            "absolute bottom-0.5 w-1.5 h-1 rounded-full transition-all duration-300",
                            isActive ? "w-4 bg-[#005FB8] h-[3px]" : "bg-gray-400 group-hover:bg-gray-500"
                        )} />
                    )}
                </button>
            );
        })}
      </div>

      {/* Right: System Tray */}
      <div className="flex items-center gap-[10px] h-full px-2">
        {/* Chevron */}
        <div className="flex items-center justify-center h-8 w-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            <ChevronUp size={20} className="text-gray-600" />
        </div>

        {/* Network/Volume/Battery Group */}
        <div className="flex items-center gap-[10px] px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors">
            {/* Wifi (User Provided) */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.832 7.38355C17.2414 7.79294 17.6283 8.26104 17.9651 8.74899C18.1219 8.97626 18.0648 9.28765 17.8376 9.4445C17.6103 9.60136 17.2989 9.54428 17.142 9.31701C16.8389 8.87776 16.4906 8.45628 16.1249 8.09066C12.7619 4.72759 7.30926 4.72759 3.9462 8.09066C3.59796 8.4389 3.25337 8.86025 2.93919 9.31314C2.78178 9.54003 2.47025 9.59636 2.24336 9.43896C2.01647 9.28155 1.96014 8.97002 2.11754 8.74313C2.46401 8.24371 2.84593 7.77671 3.23909 7.38355C6.99268 3.62996 13.0785 3.62996 16.832 7.38355ZM14.5964 9.35699C15.0687 9.82932 15.4782 10.403 15.7902 11.013C15.9159 11.2589 15.8186 11.5601 15.5727 11.6859C15.3269 11.8116 15.0256 11.7143 14.8999 11.4684C14.6341 10.9488 14.2854 10.4603 13.8893 10.0641C11.7609 7.93576 8.31021 7.93576 6.18187 10.0641C5.7685 10.4775 5.43254 10.9425 5.17393 11.4538C5.04929 11.7002 4.74849 11.7989 4.50208 11.6742C4.25567 11.5496 4.15695 11.2488 4.28159 11.0024C4.58783 10.397 4.9862 9.84555 5.47476 9.35699C7.99363 6.83813 12.0775 6.83813 14.5964 9.35699ZM12.8874 11.8541C13.2417 12.2084 13.5336 12.6442 13.7368 13.1079C13.8476 13.3608 13.7324 13.6557 13.4795 13.7665C13.2265 13.8773 12.9317 13.7621 12.8208 13.5092C12.6665 13.157 12.4443 12.8252 12.1803 12.5613C10.9958 11.3768 9.07534 11.3768 7.89084 12.5613C7.62814 12.824 7.41534 13.1432 7.25978 13.4987C7.14909 13.7517 6.85427 13.867 6.60128 13.7563C6.3483 13.6456 6.23295 13.3508 6.34365 13.0978C6.54778 12.6313 6.83011 12.2078 7.18374 11.8541C8.75876 10.2791 11.3124 10.2791 12.8874 11.8541ZM10.9627 13.7868C11.4698 14.2938 11.4698 15.116 10.9627 15.623C10.4557 16.1301 9.63355 16.1301 9.12648 15.623C8.61942 15.116 8.61942 14.2938 9.12648 13.7868C9.63355 13.2797 10.4557 13.2797 10.9627 13.7868Z" fill="#212121"/>
            </svg>
            
            <Volume2 size={20} className="text-gray-700" />
            
            {/* Battery (User Provided) */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="scale-90">
                <path d="M17.0001 6C18.657 6 20.0001 7.34315 20.0001 9V10H21.0004C21.1825 10 21.3533 10.0487 21.5004 10.1338C21.7993 10.3067 22.0004 10.6299 22.0004 11V13C22.0004 13.3701 21.7993 13.6933 21.5004 13.8662C21.3533 13.9513 21.1825 14 21.0004 14H20.0001V15C20.0001 16.6569 18.657 18 17.0001 18H4.99976C3.34291 18 1.99976 16.6569 1.99976 15V9C1.99976 7.34315 3.34291 6 4.99976 6H17.0001ZM16.9982 7.5H4.99976C4.22006 7.5 3.57931 8.09489 3.50662 8.85554L3.49976 9V15C3.49976 15.7797 4.09464 16.4204 4.8553 16.4931L4.99976 16.5H16.9982C17.7779 16.5 18.4187 15.9051 18.4914 15.1445L18.4982 15V9C18.4982 8.2203 17.9033 7.57955 17.1427 7.50687L16.9982 7.5ZM6.00008 9H16.0001C16.5129 9 16.9356 9.38604 16.9934 9.88338L17.0001 10V14C17.0001 14.5128 16.6141 14.9355 16.1167 14.9933L16.0001 15H6.00008C5.48725 15 5.06457 14.614 5.00681 14.1166L5.00008 14V10C5.00008 9.48717 5.38612 9.06449 5.88346 9.00673L6.00008 9H16.0001H6.00008Z" fill="#212121"/>
            </svg>
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end justify-center px-2 h-8 hover:bg-white/50 rounded-md cursor-default transition-colors min-w-[70px]">
            <span className="text-[12px] text-gray-800 leading-none font-normal">{format(currentTime, 'HH:mm')}</span>
            <span className="text-[12px] text-gray-800 leading-none mt-0.5 font-normal">{format(currentTime, 'yyyy/MM/dd')}</span>
        </div>

        {/* Show Desktop Line */}
        <div className="w-0.5 h-4 border-l border-gray-400/30 ml-2 hover:bg-white/50 cursor-pointer" title="Show Desktop"></div>
      </div>
    </div>
  );
}
