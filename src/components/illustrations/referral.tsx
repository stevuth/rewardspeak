
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
        <filter id="plaque-shadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="4" dy="8" stdDeviation="8" floodColor="#000" floodOpacity="0.5"/>
        </filter>
        <linearGradient id="arrow-grad" x1="160" y1="18" x2="220" y2="105" gradientUnits="userSpaceOnUse">
          <stop stopColor="#9045FF"/>
          <stop offset="1" stopColor="#551A9A"/>
        </linearGradient>
        <linearGradient id="plaque-main" x1="128" y1="70" x2="128" y2="160" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6E26D9"/>
          <stop offset="1" stopColor="#551A9A"/>
        </linearGradient>
        <linearGradient id="plaque-highlight" x1="45" y1="78" x2="200" y2="155" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8A45FF" stopOpacity="1"/>
          <stop offset="1" stopColor="#8A45FF" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="cash-grad" x1="130" y1="130" x2="130" y2="230" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2DBB65"/>
          <stop offset="1" stopColor="#1E8E49"/>
        </linearGradient>
         <linearGradient id="band-grad" x1="150" y1="160" x2="150" y2="200" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFD966"/>
          <stop offset="1" stopColor="#F4B000"/>
        </linearGradient>
      </defs>

      {/* Arrow */}
      <path d="M211.23,17.9C211.23,17.9 220.73,63.4 180.23,103.9C139.73,144.4 68.23,131.9 68.23,131.9L96.23,116.9C96.23,116.9 152.23,122.4 182.73,91.9C213.23,61.4 207.23,24.4 207.23,24.4L245.23,49.9L254.23,9.9L211.23,17.9Z" fill="url(#arrow-grad)" />
      
      {/* Gear */}
      <path d="M165.73,61.3C164.73,59.6 162.73,58.5 160.73,58.3L154.63,57.5C152.23,57.2 150.23,55.5 149.53,53.2L148.43,47.3C147.93,45.2 146.23,43.4 144.13,42.8L138.43,41.4C136.13,40.8 134.03,42 132.83,43.9L129.23,49.8C128.03,51.7 125.73,52.7 123.43,52.4L117.53,51.5C115.33,51.2 113.43,49.7 112.53,47.6L111.43,41.7C110.63,39.6 108.43,38.2 106.23,38.5L100.33,39.4C98.03,39.7 96.23,41.6 95.73,43.9L94.63,49.8C93.83,51.9 91.93,53.4 89.73,53.8L84.03,55.2C81.73,55.8 79.93,57.7 79.63,60L79.03,65.9C78.73,68.2 79.73,70.5 81.63,71.7L87.53,75.3C89.43,76.5 90.43,78.8 90.13,81.1L89.53,87C89.23,89.3 90.13,91.6 92.03,92.8L97.93,96.4C99.83,97.6 102.13,97.3 103.83,96.1L109.53,92.2C111.23,91 113.53,90.7 115.63,91.3L121.33,92.7C123.63,93.3 125.73,92.1 126.93,90.2L130.53,84.3C131.73,82.4 134.03,81.4 136.33,81.7L142.23,82.6C144.43,82.9 146.33,84.4 147.23,86.5L148.33,92.4C149.13,94.5 150.93,96 153.13,96.4L158.83,97.8C161.13,98.4 163.23,97.2 164.43,95.3L168.03,89.4C169.23,87.5 169.23,85.1 168.03,83.2L165.73,79.3L165.73,61.3Z" fill="#4A1C99" />
      <circle cx="124" cy="69" r="10" fill="#6E26D9"/>
      
      {/* Plaque */}
      <g filter="url(#plaque-shadow)">
        <path d="M40 85C40 79.4772 44.4772 75 50 75H206C211.523 75 216 79.4772 216 85V151C216 156.523 211.523 161 206 161H50C44.4772 161 40 156.523 40 151V85Z" fill="#3D157F"/>
        <path d="M44 82C44 78.6863 46.6863 76 50 76H206C209.314 76 212 78.6863 212 82V154C212 157.314 209.314 160 206 160H50C46.6863 160 44 157.314 44 154V82Z" fill="url(#plaque-main)"/>
        <path d="M44 82C44 78.6863 46.6863 76 50 76H206C209.314 76 212 78.6863 212 82V154C212 157.314 209.314 160 206 160H50C46.6863 160 44 157.314 44 154V82Z" fill="url(#plaque-highlight)" fillOpacity="0.8"/>
        <text
          x="128"
          y="126"
          textAnchor="middle"
          fill="white"
          fontSize="36"
          fontWeight="bold"
          letterSpacing="2"
        >REFERRAL</text>
      </g>
      
      {/* Little Lines */}
      <rect x="68" y="172" width="40" height="3" rx="1.5" fill="#4A1C99"/>
      <rect x="68" y="182" width="25" height="3" rx="1.5" fill="#4A1C99"/>
      
      {/* Crystals */}
      <g transform="translate(48 200)">
        <path d="M15 0L30 15L15 30L0 15Z" fill="#6E26D9"/>
        <path d="M15 0L0 15L15 30" fill="#4A1C99"/>
      </g>
      <g transform="translate(88 215) scale(0.8)">
        <path d="M15 0L30 15L15 30L0 15Z" fill="#6E26D9"/>
        <path d="M15 0L0 15L15 30" fill="#4A1C99"/>
      </g>

      {/* Cash */}
      <g transform="translate(10, 5)">
          <path d="M125,130 L210,130 L210,140 L125,140Z" fill="#1A7F40"/>
          <path d="M125,145 L210,145 L210,155 L125,155Z" fill="#1A7F40"/>
          <path d="M125,160 L210,160 L210,170 L125,170Z" fill="#1A7F40"/>
          <path d="M125,175 L210,175 L210,185 L125,185Z" fill="#1A7F40"/>
          <path d="M125,190 L210,190 L210,200 L125,200Z" fill="#1A7F40"/>
          <path d="M125,205 L210,205 L210,215 L125,215Z" fill="#1A7F40"/>
          <path d="M123,125 L208,125 L208,135 L123,135Z" fill="url(#cash-grad)"/>
          <path d="M123,140 L208,140 L208,150 L123,150Z" fill="url(#cash-grad)"/>
          <path d="M123,155 L208,155 L208,165 L123,165Z" fill="url(#cash-grad)"/>
          <path d="M123,170 L208,170 L208,180 L123,180Z" fill="url(#cash-grad)"/>
          <path d="M123,185 L208,185 L208,195 L123,185Z" fill="url(#cash-grad)"/>
          <path d="M123,200 L208,200 L208,210 L123,200Z" fill="url(#cash-grad)"/>
      </g>
      
      {/* Money Band */}
      <path d="M142,162 L202,162 L202,192 L142,192Z" fill="#D49E00"/>
      <path d="M140,160 L200,160 L200,190 L140,190Z" fill="url(#band-grad)"/>
      <path d="M162 182 C 160.5 179, 161 175, 163 173 C 165 171, 169 171.5, 170 173 C 171 174.5, 172.5 175, 173.5 175 C 175.5 175, 177 173, 177 171 C 177 169, 175 167.5, 172.5 167.5 C 169.5 167.5, 167 169.5, 167 172 C 167 174.5, 169 176, 171.5 176 C 174 176, 175.5 177.5, 175.5 180 C 175.5 182.5, 174 184, 171.5 184 C 169 184, 168 182.5, 168 180.5" fill="#A17400" stroke="#FFF" strokeWidth="2.5" />
    </svg>
  );
}
