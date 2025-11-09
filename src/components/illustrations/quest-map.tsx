
export function QuestMap() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-md">
                <defs>
                    <linearGradient id="mapGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--card))" />
                        <stop offset="100%" stopColor="hsl(var(--background))" />
                    </linearGradient>
                </defs>
                {/* Map Paper */}
                <path d="M40 40 L216 40 L216 216 L40 216 Z" fill="url(#mapGrad)" stroke="hsl(var(--border))" strokeWidth="2" />

                {/* Compass Rose */}
                <g transform="translate(180 70)">
                    <circle cx="0" cy="0" r="15" fill="hsl(var(--muted))" />
                    <path d="M0 -12 L5 0 L0 12 L-5 0Z" fill="hsl(var(--primary))" />
                    <path d="M-12 0 L0 5 L12 0 L0 -5Z" fill="hsl(var(--muted-foreground))" />
                    <circle cx="0" cy="0" r="2" fill="hsl(var(--primary))" />
                </g>

                {/* Path */}
                <path d="M80 180 C100 160, 120 190, 140 170 C160 150, 180 130, 160 110 C140 90, 100 110, 80 130" stroke="hsl(var(--secondary))" strokeWidth="3" strokeDasharray="6 6" fill="none" />

                {/* Start Point */}
                <g transform="translate(80 180)">
                    <circle cx="0" cy="0" r="10" fill="hsl(var(--secondary))" />
                    <circle cx="0" cy="0" r="5" fill="hsl(var(--secondary-foreground))" />
                </g>
                <text x="80" y="205" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="14" fontWeight="bold">You Are Here</text>

                {/* Mountain Icon */}
                <path d="M80 130 L90 110 L100 130 Z" fill="hsl(var(--muted))" />
                <path d="M95 120 L105 100 L115 120 Z" fill="hsl(var(--muted))" />
            </svg>
            <p className="font-semibold">A New Journey Awaits</p>
            <p className="text-sm">Complete your first quest to start your history log.</p>
        </div>
    );
}
