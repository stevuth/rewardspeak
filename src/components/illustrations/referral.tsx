
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
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.4"/>
        </filter>
        <linearGradient id="arrow-grad" x1="180" y1="15" x2="180" y2="140" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8A2BE2"/>
          <stop offset="1" stopColor="#5D1B99"/>
        </linearGradient>
        <linearGradient id="plaque-grad" x1="128" y1="70" x2="128" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E26D9"/>
          <stop offset="1" stopColor="#4A1C99"/>
        </linearGradient>
        <linearGradient id="plaque-border-grad" x1="128" y1="65" x2="128" y2="165" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A45EFF"/>
          <stop offset="1" stopColor="#5D1B99"/>
        </linearGradient>
      </defs>

      <g filter="url(#shadow)">
        {/* Gear */}
        <path
          d="M141.5,43.3c-1.9-3.4-5.3-5.8-9.3-6.4l-8.6-1.3c-4.4-0.7-8-4-8.9-8.3l-1.9-8.4c-0.9-4-3.9-7-8-7.9l-8.4-1.9c-4.4-1-8.5,1.1-10.4,4.5l-4.2,7.3c-1.9,3.4-5.3,5.8-9.3,6.4l-8.6,1.3c-4.4,0.7-8,4-8.9,8.3l-1.9,8.4c-0.9,4,0.7,8.2,4.1,10.6l7.3,5.2c3.4,2.4,5.1,6.8,4.1,10.6l-1.9,8.4c-0.9,4,0.7,8.2,4.1,10.6l7.3,5.2c3.4,2.4,7.6,2.4,11,0l7.3-5.2c3.4-2.4,5.1-6.8,4.1-10.6l-1.9-8.4c-0.9-4,0.7-8.2,4.1-10.6l7.3-5.2c3.4-2.4,5.1-6.8,4.1-10.6l-1.9-8.4c-0.9-4,0.7-8.2,4.1-10.6l7.3-5.2c3.4-2.4,3.4-7.2,0-9.6l-7.3-5.2z M124,85c-6.6,0-12-5.4-12-12s5.4-12,12-12s12,5.4,12,12S130.6,85,124,85z"
          fill="#4A1C99"
          transform="translate(15, 10)"
        />
        
        {/* Arrow */}
        <path d="M194.2,21.3l-34.6,34.6c-3.1,3.1-3.1,8.2,0,11.3l0,0c3.1,3.1,8.2,3.1,11.3,0L195.8,42l0.2-0.2c25.4-25.4,66.5-25.4,91.9,0l0,0c25.4,25.4,25.4,66.5,0,91.9l-0.2,0.2l-24.9,24.9c-3.1,3.1-3.1,8.2,0,11.3l0,0c3.1,3.1,8.2,3.1,11.3,0l34.6-34.6C347.1,97.1,347.1,39.7,308.8,11.4l0,0C270.4-16.9,212.6-16.9,174.2,21.3z"
         transform="scale(0.5) translate(100, -20)" fill="url(#arrow-grad)" />

        {/* Plaque */}
        <rect x="30" y="75" width="188" height="88" rx="15" fill="#3D157F"/>
        <rect x="30" y="70" width="188" height="88" rx="15" fill="url(#plaque-grad)"/>
        <rect x="34" y="74" width="180" height="80" rx="12" fill="transparent" stroke="url(#plaque-border-grad)" strokeWidth="3"/>
        <text
          x="124"
          y="120"
          textAnchor="middle"
          fill="white"
          fontSize="36"
          fontWeight="bold"
          letterSpacing="1"
        >
          REFERRAL
        </text>

        {/* Lines */}
        <rect x="55" y="175" width="40" height="3" rx="1.5" fill="#4A1C99"/>
        <rect x="55" y="185" width="30" height="3" rx="1.5" fill="#4A1C99"/>

        {/* Cash Stack */}
        <g transform="translate(110, 140)">
            <path d="M-5 45L85 10L95 25L5 60Z" fill="#14532d"/>
            <path d="M-5 40L85 5L95 20L5 55Z" fill="#166534"/>
            <path d="M-5 35L85 0L95 15L5 50Z" fill="#15803d"/>
            <path d="M0 30L90 -5L100 10L10 45Z" fill="#16a34a"/>
            <path d="M5 25L95 -10L105 5L15 40Z" fill="#22c55e"/>

            {/* Money Band */}
            <path d="M22 43L52 31L72 39L42 51Z" fill="#b45309"/>
            <path d="M20 40L50 28L70 36L40 48Z" fill="#facc15"/>
            <path d="M38 34.5c1.5-3,5-4,8-3l1,0.3c5,1.7,7.3,7,5,11.5l-1,1.5c-2.3,4.5-7.7,6.5-12,4.5l-1-0.5C33.5,47.3,32.8,42,35,37.5Z" fill="#fbbf24"/>
            <path d="M47 34.5c-2.5-0.5-5,1.5-6,3.5s-0.5,5,1.5,6c2.5,0.5,5-1.5,6-3.5S49.5,35,47,34.5z" fill="#fcd34d" />
        </g>

        {/* Crystals */}
        <g transform="translate(30, 185)">
            <path d="M15 0L30 15L15 30L0 15Z" fill="#6E26D9"/>
            <path d="M15 0L0 15L15 30" fill="#4A1C99"/>
        </g>
        <g transform="translate(60, 205)">
            <path d="M10 0L20 10L10 20L0 10Z" fill="#6E26D9"/>
            <path d="M10 0L0 10L10 20" fill="#4A1C99"/>
        </g>
      </g>
    </svg>
  );
}
