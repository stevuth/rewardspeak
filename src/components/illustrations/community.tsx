
'use client';

import { useState, useEffect } from 'react';

type AnimationProps = {
    dur: string;
    begin: string;
};

export function CommunityIllustration() {
  const [animationProps, setAnimationProps] = useState<AnimationProps[]>([]);

  useEffect(() => {
    // This code runs only on the client, after the initial render, to avoid hydration mismatch.
    const newAnimationProps = Array(6).fill(null).map(() => ({
        dur: `${3 + Math.random() * 3}s`, // duration between 3s and 6s
        begin: `${Math.random() * 2}s`, // start delay up to 2s
    }));
    setAnimationProps(newAnimationProps);
  }, []);

  const userPositions = [
    { cx: 50, cy: 50 },
    { cx: 206, cy: 50 },
    { cx: 50, cy: 206 },
    { cx: 206, cy: 206 },
    { cx: 128, cy: 30 },
    { cx: 128, cy: 226 },
  ];

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
        <radialGradient id="network-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="0.5" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
        </radialGradient>
        <linearGradient id="user-icon-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--card-foreground))" />
            <stop offset="100%" stopColor="hsl(var(--muted-foreground))" />
        </linearGradient>
      </defs>

      {/* Central Network Hub */}
      <circle cx="128" cy="128" r="40" fill="url(#network-grad)" />
      <circle cx="128" cy="128" r="20" fill="none" stroke="hsl(var(--secondary))" strokeWidth="1.5" strokeDasharray="4 4" />
      <circle cx="128" cy="128" r="30" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />

      {/* Users and Connections */}
      {userPositions.map((pos, i) => {
        const anims = animationProps[i] || { dur: '4s', begin: '0s' }; // Default for SSR
        const isHorizontal = pos.cy === 128;
        const xOffset = isHorizontal ? (pos.cx < 128 ? -8 : 8) : 0;
        const yOffset = !isHorizontal ? (pos.cy < 128 ? -8 : 8) : 0;
        
        return (
            <g key={i}>
                {/* Connection Line */}
                <path d={`M128 128 C ${(128 + pos.cx)/2} ${(128 + pos.cy)/2}, ${pos.cx} ${pos.cy}, ${pos.cx} ${pos.cy}`} stroke="hsl(var(--border))" strokeWidth="1" fill="none" strokeOpacity="0.5"/>

                {/* User Icon */}
                <g transform={`translate(${pos.cx - 16}, ${pos.cy - 16})`}>
                    <circle cx="16" cy="16" r="16" fill="url(#user-icon-grad)" stroke="hsl(var(--primary) / 0.5)" strokeWidth="1.5" />
                    <path d="M16 19 C 13 24, 19 24, 16 19" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none" />
                    <circle cx="16" cy="12" r="4" fill="hsl(var(--primary))" />
                </g>

                {/* Animated Earning Coin ($) */}
                <text
                    x={pos.cx + xOffset}
                    y={pos.cy + yOffset}
                    fill="hsl(var(--secondary))"
                    fontSize="20"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="central"
                >
                    $
                    <animateMotion
                        dur={anims.dur}
                        repeatCount="indefinite"
                        path={`M0,0 C ${-(pos.cx - 128)/2},${-(pos.cy - 128)/2}, ${-(pos.cx-128)},${-(pos.cy-128)}, ${-(pos.cx-128)},${-(pos.cy-128)}`}
                        begin={anims.begin}
                    />
                    <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.8;1" dur={anims.dur} repeatCount="indefinite" begin={anims.begin} />
                </text>
            </g>
        )
      })}
    </svg>
  );
}
