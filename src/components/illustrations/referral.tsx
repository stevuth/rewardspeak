
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
        <path d="M100 155 L200 135 L205 150 L105 170 Z" fill="#15803D"/>
        <path d="M100 165 L200 145 L205 160 L105 180 Z" fill="#15803D"/>
        <path d="M100 175 L200 155 L205 170 L105 190 Z" fill="#15803D"/>
        <path d="M98 152 L198 132 L203 147 L103 167 Z" fill="url(#cash-grad)"/>
        <path d="M98 162 L198 142 L203 157 L103 177 Z" fill="url(#cash-grad)"/>
        <path d="M98 172 L198 152 L203 167 L103 187 Z" fill="url(#cash-grad)"/>

        {/* Money Band */}
        <path d="M130 143 L175 133 L185 163 L140 173 Z" fill="url(#band-grad)"/>
        <path d="M157 159 C 158 156, 162 155, 164 156 C 166 157, 167 161, 166 163 C 165 165, 161 166, 159 165 C 157 164, 156 161, 157 159 Z" fill="#FDE047"/>
        <path d="M148.5 156.5C148.5 153.186 150.91 150.5 154 150.5C155.59 150.5 157.034 151.216 158 152.317V148.5H161V158.85C161 162.164 158.59 164.5 155.5 164.5C152.41 164.5 150 161.814 150 158.5H153C153 160.157 154.12 161.5 155.5 161.5C156.88 161.5 158 160.157 158 158.5V158H157.5C156.035 158 154.767 157.643 153.832 156.963L153.5 156.75V156.5H148.5V153.5H153.5V155.5C154.439 155.857 155.561 156 157 156H158V155.317C157.034 154.216 155.59 153.5 154 153.5C152.067 153.5 150.5 154.843 150.5 156.5H148.5Z" fill="#FDE047"/>

        {/* Crystals */}
        <path d="M60 180 l15 -20 l15 20 l-15 20 z" fill="url(#crystal-grad)" />
        <path d="M60 180 l15 20 l-15 20" fill="#6B21A8" />
        <path d="M85 200 l12 -16 l12 16 l-12 16 z" fill="url(#crystal-grad)" />
        <path d="M85 200 l12 16 l-12 16" fill="#6B21A8" />
      </g>
    </svg>
  );
}
