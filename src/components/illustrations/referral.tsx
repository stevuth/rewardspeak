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
      <g>
        {/* Rising Arrow */}
        <path
          d="M178.5 48.5L208.5 18.5L238.5 48.5"
          stroke="hsl(var(--primary))"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M208.5 27.5V118.5C208.5 127.332 201.332 134.5 192.5 134.5H168.5"
          stroke="hsl(var(--primary))"
          strokeWidth="18"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Gear */}
        <path
          d="M136.33 37.1C133.47 31.62 127.58 28 121 28C114.42 28 108.53 31.62 105.67 37.1L101.44 45.1C97.16 45.93 93.13 47.65 89.56 50.12L81.71 46.54C76.24 43.83 69.8 44.98 65.81 49.33L60.33 55.33C56.34 59.68 56.16 66.19 59.94 70.3L64.26 74.95C61.56 78.69 59.62 82.91 58.61 87.54L50.54 90.99C44.98 93.28 42.41 99.58 44.13 105.2L48.13 118.9C49.85 124.52 55.02 128.29 60.71 128.29C61.12 128.29 61.53 128.27 61.94 128.22L70.54 127.11C72.06 131.56 74.52 135.68 77.74 139.2L73.61 146.99C70.62 152.47 72.18 159.21 77.29 162.5L83.81 166.33C88.92 169.62 95.84 168.27 99.44 163.5L104.29 157C108.13 158.91 112.35 160.1 116.82 160.5L118.82 169.21C121.11 174.77 127.41 177.34 133.03 175.62L146.71 171.62C152.33 169.9 156.1 164.73 156.1 159C156.1 158.59 156.08 158.18 156.03 157.77L154.92 149.17C159.37 147.65 163.49 145.19 167.11 141.97L174.9 146.1C180.38 149 187.12 147.44 190.41 142.33L194.24 135.81C197.53 130.7 196.18 123.78 191.5 120.18L184.99 115.33C186.9 111.49 188.09 107.27 188.5 102.8L197.21 100.8C202.77 98.51 205.34 92.21 203.62 86.59L199.62 72.91C197.9 67.29 192.73 63.52 187 63.52C186.59 63.52 186.18 63.54 185.77 63.59L177.17 64.7C175.65 60.25 173.19 56.13 169.97 52.91L174.1 45.12C177 39.64 175.44 32.9 170.33 29.61L163.81 25.78C158.7 22.49 151.78 23.84 148.18 28.52L143.33 35.03C139.49 35.85 135.71 37.1 132.33 38.1L136.33 37.1Z" fill="hsl(var(--primary))" fillOpacity="0.8"/>
        
        {/* Referral Button */}
        <rect
          x="30"
          y="76"
          width="170"
          height="60"
          rx="12"
          fill="hsl(var(--primary))"
        />
        <rect
          x="32"
          y="78"
          width="166"
          height="56"
          rx="10"
          fill="url(#buttonGradient)"
        />
        <text
          x="115"
          y="114"
          textAnchor="middle"
          fill="white"
          fontSize="24"
          fontWeight="bold"
          letterSpacing="2"
        >
          REFERRAL
        </text>

        {/* Crystals */}
        <path d="M50 160 l20 -25 l-25 -15 l-15 25z" fill="hsl(var(--primary))" opacity="0.9" />
        <path d="M75 185 l25 -30 l-30 -18 l-20 30z" fill="hsl(var(--primary))" opacity="0.9" />
        
        {/* Money Stack */}
        <g transform="translate(130, 150) rotate(-15)">
            <rect x="0" y="25" width="100" height="50" rx="5" fill="#22C55E" />
            <rect x="0" y="20" width="100" height="50" rx="5" fill="#22C55E" />
            <rect x="0" y="15" width="100" height="50" rx="5" fill="#22C55E" />
            <rect x="0" y="10" width="100" height="50" rx="5" fill="#22C55E" />
            <rect x="0" y="5" width="100" height="50" rx="5" fill="#16A34A" />
            <rect x="0" y="0" width="100" height="50" rx="5" fill="#16A34A" />

            {/* Band */}
            <path d="M-5 25 H105 L95 55 H-15Z" fill="#FBBF24" />
            <text x="50" y="47" textAnchor="middle" fill="#CA8A04" fontSize="36" fontWeight="bold">
            $
            </text>
        </g>
      </g>
      <defs>
        <linearGradient id="buttonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 0.8}} />
            <stop offset="100%" style={{stopColor: "hsl(var(--primary))", stopOpacity: 1}} />
        </linearGradient>
      </defs>
    </svg>
  );
}
