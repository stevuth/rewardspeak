
export function EmptyPodium() {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
            <svg width="128" height="128" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 drop-shadow-md">
                <defs>
                    <linearGradient id="podium-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.7)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.4)" />
                    </linearGradient>
                    <linearGradient id="podium-grad-2" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.6)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.3)" />
                    </linearGradient>
                    <linearGradient id="podium-grad-3" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary) / 0.5)" />
                        <stop offset="100%" stopColor="hsl(var(--primary) / 0.2)" />
                    </linearGradient>
                </defs>

                {/* Base */}
                <path d="M40 220 H216 V230 H40 Z" fill="hsl(var(--muted))" />

                {/* 2nd Place */}
                <path d="M50 160 H110 V220 H50 Z" fill="url(#podium-grad-2)" />
                <path d="M50 160 H110 L105 150 H55 Z" fill="hsl(var(--card))" />
                <path d="M110 160 V220 L115 215 V155 Z" fill="hsl(var(--border))" />

                {/* 1st Place */}
                <path d="M100 130 H160 V220 H100 Z" fill="url(#podium-grad-1)" />
                <path d="M100 130 H160 L155 120 H105 Z" fill="hsl(var(--card))" />
                <path d="M160 130 V220 L165 215 V125 Z" fill="hsl(var(--border))" />

                {/* 3rd Place */}
                <path d="M150 180 H210 V220 H150 Z" fill="url(#podium-grad-3)" />
                <path d="M150 180 H210 L205 170 H155 Z" fill="hsl(var(--card))" />
                <path d="M210 180 V220 L215 215 V175 Z" fill="hsl(var(--border))" />

                {/* Numbers */}
                <text x="80" y="195" fontFamily="sans-serif" fontSize="24" fontWeight="bold" fill="hsl(var(--card-foreground))" textAnchor="middle">2</text>
                <text x="130" y="180" fontFamily="sans-serif" fontSize="32" fontWeight="bold" fill="hsl(var(--card-foreground))" textAnchor="middle">1</text>
                <text x="180" y="205" fontFamily="sans-serif" fontSize="20" fontWeight="bold" fill="hsl(var(--card-foreground))" textAnchor="middle">3</text>
            </svg>
            <p className="font-semibold">The Podium Awaits</p>
            <p className="text-sm">Champions are made, not born. Start earning to claim a spot!</p>
        </div>
    );
}
