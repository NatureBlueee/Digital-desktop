import React from "react";

export default function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <foreignObject x="-47" y="-50" width="124" height="124">
            <div style={{backdropFilter:"blur(25px)", clipPath:"url(#bgblur_0_1604_1626_clip_path)", height:"100%", width:"100%"}}></div>
        </foreignObject>
        <circle data-figma-bg-blur-radius="50" cx="15" cy="12" r="10.5" stroke="#1F1F1F" strokeWidth="3"/>
        <path d="M1.50003 26.5L7.50003 19.5" stroke="#1F1F1F" strokeWidth="3" strokeLinecap="round"/>
        <defs>
            <clipPath id="bgblur_0_1604_1626_clip_path" transform="translate(47 50)"><circle cx="15" cy="12" r="10.5"/></clipPath>
        </defs>
    </svg>
  );
}
