
export function SupportIllustration() {
    return (
      <svg
        width="200"
        height="200"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-48 h-48"
      >
        <defs>
            <filter id="glow-support" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="10" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
            </filter>
            <linearGradient id="peak-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.8)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.4)" />
            </linearGradient>
             <linearGradient id="flag-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--secondary) / 0.7)" />
            </linearGradient>
        </defs>

        {/* Mountain Peaks */}
        <g filter="url(#glow-support)">
            <path d="M50 200 L100 120 L150 200 Z" fill="url(#peak-grad)" />
            <path d="M120 200 L170 100 L220 200 Z" fill="url(#peak-grad)" opacity="0.8" />
        </g>

        {/* Mascot */}
        <g transform="translate(100 130)">
            <circle cx="28" cy="28" r="28" fill="hsl(var(--primary))" />
            <circle cx="20" cy="22" r="3" fill="white" />
            <circle cx="36" cy="22" r="3" fill="white" />
            <path d="M22 35 Q 28 40, 34 35" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </g>
        
        {/* Support Flag */}
        <g transform="translate(130 90)">
            <rect x="0" y="0" width="4" height="60" rx="2" fill="hsl(var(--muted-foreground))" />
            <path d="M4 5 L 4 35 L 54 20 L 4 5 Z" fill="url(#flag-grad)" />
            {/* Lifebuoy on flag */}
            <circle cx="29" cy="20" r="10" fill="none" stroke="white" strokeWidth="2.5" />
            <path d="M19 20 H39" stroke="white" strokeWidth="2" />
            <path d="M29 10 V30" stroke="white" strokeWidth="2" />
        </g>
        
        {/* Floating elements */}
        <circle cx="70" cy="100" r="4" fill="hsl(var(--secondary))" opacity="0.6" />
        <circle cx="200" cy="150" r="5" fill="hsl(var(--secondary))" opacity="0.7" />
        <path d="M180 80 L185 85 L180 90 L175 85Z" fill="hsl(var(--primary))" opacity="0.5" />

      </svg>
    );
  }
