
export function EmptyTreasureChest() {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-lg">
            <defs>
                <linearGradient id="chestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary) / 0.8)" />
                    <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
                </linearGradient>
                <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--muted))" />
                    <stop offset="100%" stopColor="hsl(var(--border))" />
                </linearGradient>
            </defs>
            {/* Chest Body */}
            <path d="M40 120 H216 V200 H40 Z" fill="url(#chestGrad)" />
            <path d="M40 120 L216 120 L221 115 L45 115 Z" fill="hsl(var(--border))" />
            <path d="M216 120 V200 L221 195 V115 Z" fill="hsl(var(--border))" />
            {/* Metal Bands */}
            <rect x="30" y="110" width="196" height="15" fill="url(#metalGrad)" />
            <rect x="30" y="195" width="196" height="15" fill="url(#metalGrad)" />
            <rect x="60" y="110" width="10" height="100" fill="url(#metalGrad)" />
            <rect x="186" y="110" width="10" height="100" fill="url(#metalGrad)" />
            
            {/* Lid */}
            <path d="M45 115 C 45 70, 211 70, 211 115 Z" fill="url(#chestGrad)" />
            <path d="M45 115 C 45 70, 211 70, 211 115 L 206 113 C 206 75, 50 75, 50 113 Z" fill="hsl(var(--border))" />
            <rect x="40" y="105" width="176" height="15" fill="url(#metalGrad)" />

            {/* Lock */}
            <circle cx="128" cy="150" r="15" fill="url(#metalGrad)" />
            <rect x="123" y="152" width="10" height="10" rx="2" fill="hsl(var(--background))" />

            {/* Empty state sparkles */}
            <path d="M128 90 L133 100 L128 110 L123 100Z" fill="hsl(var(--secondary))" opacity="0.8" />
            <path d="M110 75 L113 80 L110 85 L107 80Z" fill="hsl(var(--secondary))" opacity="0.6" />
            <path d="M150 80 L153 85 L150 90 L147 85Z" fill="hsl(var(--secondary))" opacity="0.6" />
        </svg>
        <p className="font-semibold">Your Cabin is Empty</p>
        <p className="text-sm">Start earning and cash out your rewards here.</p>
      </div>
    );
}
