
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
            <feDropShadow dx="4" dy="6" stdDeviation="8" floodColor="#000" floodOpacity="0.4"/>
        </filter>
        <linearGradient id="arrow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A45CFF"/>
          <stop offset="100%" stopColor="#6C2BD9"/>
        </linearGradient>
        <linearGradient id="plaque-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#8A2BE2"/>
          <stop offset="100%" stopColor="#551A9A"/>
        </linearGradient>
        <linearGradient id="cash-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399"/>
            <stop offset="100%" stopColor="#10B981"/>
        </linearGradient>
        <linearGradient id="band-grad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24"/>
            <stop offset="100%" stopColor="#F59E0B"/>
        </linearGradient>
        <linearGradient id="crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C084FC" />
            <stop offset="100%" stopColor="#7E22CE" />
        </linearGradient>
      </defs>

      <g filter="url(#shadow)">
        {/* Gear */}
        <path d="M152.6,78.3l-8.5-1.4c-3.9-0.6-7.3-3-9.1-6.5l-4.3-8.5c-1.8-3.5-5.5-5.5-9.4-4.9l-9.1,1.4c-3.9,0.6-6.7,3.6-7.3,7.5l-1.4,9.1c-0.6,3.9-3.2,7-6.9,8.2l-9.1,3.6c-3.7,1.5-6.1,5.1-5.8,9.1l1.4,9.1c0.3,3.9,2.7,7.3,6.2,8.8l8.5,3.6c3.5,1.5,5.8,4.9,5.8,8.8l-0.3,9.1c-0.3,3.9,2.1,7.6,5.8,9.1l9.1,3.6c3.7,1.2,7.8-0.3,9.9-3.6l4.3-8.5c1.8-3.5,5.2-5.8,9.1-5.8l9.1,0.3c3.9,0.3,7.3-2.1,8.8-5.8l3.6-8.8c1.5-3.7,0.3-7.8-3.3-9.9l-8.5-4.3c-3.5-1.8-5.8-5.2-5.8-9.1l0.3-9.1c0.3-3.9-2.1-7.6-5.8-9.1z" fill="#4C1D95"/>
        
        {/* Arrow */}
        <path d="M218,22c-2-2-5-2.5-8-1.5l-35,11.7c-8.9,2.9-15,11.5-15,20.8v45c21-12,35-35,35-61C225,32,223,26,218,22z" fill="#4C1D95"/>
        <path d="M215,25c-4-4-10-4-14,0L168,58c-8.5,8.5-9.4,22-2.1,31.5c11.5,15-2,40-20,52c-15,10-45,16-70,10" stroke="url(#arrow-grad)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        
        {/* Plaque */}
        <rect x="50" y="80" width="160" height="70" rx="15" fill="url(#plaque-grad)" />
        <rect x="54" y="84" width="152" height="62" rx="12" stroke="#A45CFF" strokeOpacity="0.5" strokeWidth="2" fill="none"/>
        <text x="130" y="125" textAnchor="middle" fill="white" fontSize="28" fontWeight="bold" letterSpacing="2">REFERRAL</text>

        {/* Cash Stack */}
        <g transform="translate(100, 130) rotate(-15 50 25)">
            <rect x="0" y="0" width="100" height="50" rx="5" fill="#15803D" />
            <rect x="2" y="2" width="96" height="46" rx="3" fill="url(#cash-grad)" />
            {/* Bill details */}
            <circle cx="50" cy="25" r="12" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.5" />
            <text x="50" y="30" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold" fillOpacity="0.7">$</text>
            {/* Stack effect */}
            <path d="M 0 5 C 20 10, 80 10, 100 5" fill="none" stroke="#10B981" strokeWidth="2" />
            <path d="M 0 45 C 20 40, 80 40, 100 45" fill="none" stroke="#10B981" strokeWidth="2" />

            <path d="M-2 5 L-2 45" stroke="#14532D" strokeWidth="4" strokeLinecap="round"/>
            <path d="M-5 8 L-5 42" stroke="#14532D" strokeWidth="3" strokeLinecap="round"/>

            {/* Band */}
            <rect x="35" y="-5" width="30" height="60" rx="3" fill="url(#band-grad)" />
            <text x="50" y="30" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold" fillOpacity="0.5">$$</text>
        </g>

        {/* Crystals */}
        <path d="M60 180 l15 -20 l15 20 l-15 20 z" fill="url(#crystal-grad)" />
        <path d="M60 180 l15 20 l-15 20" fill="#6B21A8" />
        <path d="M85 200 l12 -16 l12 16 l-12 16 z" fill="url(#crystal-grad)" />
        <path d="M85 200 l12 16 l-12 16" fill="#6B21A8" />
      </g>
    </svg>
  );
}
