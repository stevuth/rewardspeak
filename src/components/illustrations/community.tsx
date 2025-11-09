
export function CommunityIllustration() {
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
          <feGaussianBlur stdDeviation="12" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="core-grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity="1" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
        </radialGradient>
      </defs>

      {/* Central Glowing Orb */}
      <g filter="url(#glow-community)">
        <circle cx="128" cy="128" r="40" fill="url(#core-grad)" />
      </g>
      
      {/* Abstract Person Figures and connections */}
      {[0, 60, 120, 180, 240, 300].map(angle => (
        <g key={angle} transform={`rotate(${angle} 128 128)`}>
          {/* Connection line */}
          <path d="M128 128 C128 80, 90 60, 60 60" stroke="hsl(var(--border))" strokeWidth="2" fill="none" strokeOpacity="0.5"/>

          {/* Person Head */}
          <circle cx="60" cy="60" r="12" fill="hsl(var(--card))" stroke="hsl(var(--primary))" strokeWidth="2"/>
          {/* Person Body Arc */}
          <path d="M48 78 C54 88, 66 88, 72 78" stroke="hsl(var(--primary))" strokeWidth="3" fill="none" strokeLinecap="round" />
        </g>
      ))}

      {/* Floating accent elements */}
      <circle cx="50" cy="100" r="4" fill="hsl(var(--secondary))" opacity="0.7" />
      <circle cx="200" cy="80" r="5" fill="hsl(var(--secondary))" opacity="0.8" />
      <circle cx="210" cy="180" r="3" fill="hsl(var(--secondary))" opacity="0.6" />
      <circle cx="80" cy="200" r="4" fill="hsl(var(--secondary))" opacity="0.7" />
      
    </svg>
  );
}
