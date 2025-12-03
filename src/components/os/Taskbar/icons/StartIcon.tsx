import React from "react";

export default function StartIcon({ className }: { className?: string }) {
  return (
    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M1.70588 0C0.76375 0 0 0.763748 0 1.70588V13.576H13.7663V0H1.70588ZM27.2941 0C28.2362 0 29 0.763748 29 1.70588V13.576H15.2337V0H27.2941ZM0 27.2941C0 28.2362 0.76375 29 1.70588 29H13.7663V14.9975H0V27.2941ZM27.2941 29C28.2362 29 29 28.2362 29 27.2941V14.9975H15.2337V29H27.2941Z" fill="url(#paint0_linear_1604_1620)"/>
        <defs>
            <linearGradient id="paint0_linear_1604_1620" x1="-0.104819" y1="-0.0355391" x2="29.4853" y2="28.4967" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8AECF6"/>
                <stop offset="0.376995" stopColor="#24B8E7"/>
                <stop offset="1" stopColor="#3774C4"/>
            </linearGradient>
        </defs>
    </svg>
  );
}
