
'use client';

import { useState, useEffect } from 'react';

type AnimationProps = {
    dur: string;
    begin: string;
};

export function CommunityIllustration() {
  const [animationProps, setAnimationProps] = useState<AnimationProps[]>([]);

  useEffect(() => {
    // This code now runs only on the client, after the initial render.
    const newAnimationProps = Array(8).fill(null).map(() => ({
        dur: `${2 + Math.random() * 2}s`,
        begin: `${Math.random()}s`,
    }));
    setAnimationProps(newAnimationProps);
  }, []);

  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 256 256"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto"
    >
      <defs>
        <filter id="glow-community" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="10" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="globe-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.8" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id="user-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card-foreground))" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
        </linearGradient>
      </defs>

      {/* Central Globe */}
      <g filter="url(#glow-community)">
        <circle cx="128" cy="128" r="50" fill="url(#globe-grad)" />
        <path d="M128 78 C 100 90, 100 166, 128 178" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M128 78 C 156 90, 156 166, 128 178" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M90 100 C 110 95, 146 95, 166 100" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" opacity="0.3"/>
        <path d="M90 156 C 110 161, 146 161, 166 156" stroke="hsl(var(--background))" strokeWidth="1.5" fill="none" opacity="0.3"/>
      </g>
      
      {/* Users and connections */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const x = 128 + 90 * Math.cos(angle * Math.PI / 180);
        const y = 128 + 90 * Math.sin(angle * Math.PI / 180);
        const anims = animationProps[i] || { dur: '3s', begin: '0s' }; // Default values for SSR

        return (
            <g key={angle}>
                <path d={`M128 128 C ${(128 + x)/2} ${(128 + y)/2}, ${x} ${y}, ${x} ${y}`} stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeOpacity="0.7"/>
                
                {/* User Icon */}
                <g transform={`translate(${x-12}, ${y-12})`}>
                    <circle cx="12" cy="12" r="12" fill="url(#user-grad)" stroke="hsl(var(--primary))" strokeWidth="1"/>
                    <path d="M12 15 C 10 19, 14 19, 12 15" stroke="hsl(var(--primary))" strokeWidth="1" fill="none"/>
                    <circle cx="12" cy="9" r="3" fill="hsl(var(--primary))" opacity="0.8"/>
                </g>

                {/* Animated Earning Coin */}
                <circle cx="128" cy="128" r="3" fill="hsl(var(--secondary))">
                    <animateMotion
                        dur={anims.dur}
                        repeatCount="indefinite"
                        path={`M0,0 C ${(x - 128)/2} ${(y - 128)/2}, ${x - 128} ${y-128}, ${x - 128} ${y-128}`}
                        begin={anims.begin}
                    />
                </circle>
            </g>
        )
      })}
    </svg>
  );
}
