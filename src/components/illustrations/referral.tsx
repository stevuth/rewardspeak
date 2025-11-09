export function ReferralIllustration() {
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
        <linearGradient
          id="btn-grad"
          x1="128"
          y1="90"
          x2="128"
          y2="170"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#6E26D9" />
          <stop offset="1" stopColor="#4A1C99" />
        </linearGradient>
        <linearGradient
          id="arrow-grad"
          x1="180"
          y1="30"
          x2="180"
          y2="140"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#8A2BE2" />
          <stop offset="1" stopColor="#5D1B99" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000" floodOpacity="0.3"/>
        </filter>
      </defs>

      <g filter="url(#shadow)">
        {/* Gear */}
        <path
          d="M107.5 73.5a16.5 16.5 0 1 0 33 0 16.5 16.5 0 1 0 -33 0z"
          fill="hsl(var(--primary))"
          stroke="#4A1C99"
          strokeWidth="3"
        />
        <path
          d="M124 57l-3.5 -10h-7l-3.5 10H98l-4.5 -13.5 8 -8L113 42l11-11 11.5 6.5 8 8L150 57h-12l-3.5-10-7.5-2.5-7.5 2.5L124 57z M124 89.5l-3.5 10h-7l-3.5 -10H98l-4.5 13.5 8 8L113 104l11 11 11.5 -6.5 8 -8L150 89.5h-12l-3.5 10-7.5 2.5-7.5-2.5L124 89.5z"
          fill="hsl(var(--primary))"
          transform="translate(0, -5)"
        />
        <circle cx="124" cy="73" r="8" fill="#4A1C99" />

        {/* Arrow */}
        <path
          d="M165 140 L 165 60 C 165 50 170 45 180 45 L 210 45 L 180 15 L 150 45 L 180 45 C 175 45 170 50 170 60 L 170 140 Z"
          fill="url(#arrow-grad)"
          transform="translate(-5, 0)"
        />
        <path
          d="M160 140 L 160 60 C 160 50 165 45 175 45 L 205 45 L 175 15 L 145 45 L 175 45 C 170 45 165 50 165 60 L 165 140 Z"
          fill="hsl(var(--primary))"
          transform="translate(-5, 0)"
        />

        {/* Button */}
        <rect
          x="40"
          y="95"
          width="180"
          height="70"
          rx="15"
          fill="#3D157F"
        />
        <rect
          x="45"
          y="90"
          width="170"
          height="70"
          rx="12"
          fill="url(#btn-grad)"
          stroke="#A45EFF"
          strokeWidth="2"
        />
        <text
          x="130"
          y="135"
          textAnchor="middle"
          fill="white"
          fontSize="32"
          fontWeight="bold"
          letterSpacing="2"
        >
          REFERRAL
        </text>

        {/* Cash */}
        <g transform="translate(100, 150) rotate(15)">
          <rect x="0" y="20" width="110" height="50" rx="5" fill="#15803d" />
          <rect x="0" y="15" width="110" height="50" rx="5" fill="#16a34a" />
          <rect x="0" y="10" width="110" height="50" rx="5" fill="#22c55e" />
          <rect x="0" y="5" width="110" height="50" rx="5" fill="#4ade80" />
          {/* Band */}
          <path d="M-5 25 H115 L105 55 H-15Z" fill="#facc15" />
          <text
            x="55"
            y="52"
            textAnchor="middle"
            fill="#b45309"
            fontSize="36"
            fontWeight="bold"
          >
            $
          </text>
        </g>

        {/* Crystals */}
        <path d="M50 180 l15 -20 l-20 -15 l-15 20z" fill="#8A2BE2" stroke="#4A1C99" strokeWidth="2" />
        <path d="M70 210 l15 -20 l-20 -15 l-15 20z" fill="#8A2BE2" stroke="#4A1C99" strokeWidth="2" />
      </g>
    </svg>
  );
}
