
export const TimeWallLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        <linearGradient id="timewall-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E0E0E0" />
        </linearGradient>
      </defs>
      <text x="100" y="30" fontFamily="var(--font-sans), sans-serif" fontSize="28" fontWeight="bold" fill="url(#timewall-grad)" textAnchor="middle">
        TimeWall
      </text>
      <path d="M5 25 C 20 10, 40 10, 55 25 S 90 40, 100 25" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5"/>
      <path d="M195 25 C 180 40, 160 40, 145 25 S 110 10, 100 25" stroke="#FFFFFF" strokeWidth="2" fill="none" opacity="0.5"/>
    </svg>
);
  
export const TheoremReachLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <defs>
            <linearGradient id="theorem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="100%" stopColor="#D0D0FF" />
            </linearGradient>
        </defs>
        <text x="100" y="30" fontFamily="var(--font-sans), sans-serif" fontSize="22" fontWeight="bold" fill="url(#theorem-grad)" textAnchor="middle" letterSpacing="1">
            TheoremReach
        </text>
        <circle cx="30" cy="25" r="5" fill="#FFFFFF" opacity="0.7">
            <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="170" cy="25" r="5" fill="#FFFFFF" opacity="0.7">
            <animate attributeName="r" values="5;7;5" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
    </svg>
);

