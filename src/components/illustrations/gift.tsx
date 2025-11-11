
export function GiftIllustration() {
  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Confetti */}
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 256 256"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple geometric shapes for confetti */}
        <circle cx="50" cy="50" r="8" fill="hsl(var(--primary))" />
        <rect x="200" y="60" width="16" height="16" rx="4" fill="hsl(var(--secondary))" />
        <path d="M70 190 L80 210 L60 210 Z" fill="hsl(var(--accent))" />
        <rect x="20" y="150" width="12" height="12" rx="2" fill="#FFFFFF" />
        <circle cx="220" cy="180" r="10" fill="hsl(var(--primary))" />
        <path d="M180 30 L190 50 L170 50 Z" fill="hsl(var(--secondary))" transform="rotate(45 180 30)" />
        <path d="M100 20L105 30L95 30" stroke="hsl(var(--accent))" strokeWidth="3" />
        <path d="M230 110 C 240 120, 230 130, 220 120" stroke="hsl(var(--primary))" strokeWidth="2" fill="none" />
        <path d="M30 90 C 40 80, 50 90, 40 100" stroke="hsl(var(--secondary))" strokeWidth="2" fill="none" />
        <line x1="140" y1="230" x2="160" y2="220" stroke="hsl(var(--accent))" strokeWidth="3" />
        <line x1="190" y1="230" x2="170" y2="240" stroke="hsl(var(--secondary))" strokeWidth="3" />
        <path d="M128 40 L133 45 L128 50 L123 45Z" fill="hsl(var(--primary))" />
      </svg>
      {/* Gift Box */}
      <div className="relative">
        <div className="w-40 h-32 bg-primary rounded-lg shadow-lg flex items-center justify-center">
          {/* Ribbon vertical */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[148px] bg-secondary/70"></div>
          {/* Ribbon horizontal */}
           <div className="absolute top-1/2 left-0 -translate-y-1/2 w-40 h-8 bg-secondary/70"></div>
        </div>
        {/* Lid */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-8 bg-primary rounded-t-lg border-b-4 border-purple-800">
           {/* Lid Ribbon */}
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-full bg-secondary/70"></div>
        </div>
        {/* Bow */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2">
          <svg width="80" height="60" viewBox="0 0 78 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 16C39 16 31.5 2.5 19.5 1C7.5 -0.5 1 12 1 21C1 29.5 10.5 35.5 19.5 34C28.5 32.5 39 16 39 16Z" fill="hsl(var(--secondary))" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M39 16C39 16 46.5 2.5 58.5 1C70.5 -0.5 77 12 77 21C77 29.5 67.5 35.5 58.5 34C49.5 32.5 39 16 39 16Z" fill="hsl(var(--secondary))" stroke="hsl(var(--secondary-foreground))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
