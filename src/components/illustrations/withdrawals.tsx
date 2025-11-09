
export function WithdrawalsIllustration() {
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
        <filter id="shadow-withdraw" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="4" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.3"/>
        </filter>
        <linearGradient id="wallet-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))"/>
          <stop offset="100%" stopColor="#551A9A"/>
        </linearGradient>
        <linearGradient id="cash-grad-withdraw" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--secondary))"/>
          <stop offset="100%" stopColor="#32CD32"/>
        </linearGradient>
      </defs>

      <g filter="url(#shadow-withdraw)">
        {/* Wallet */}
        <path d="M40 80 C40 65, 50 60, 65 60 H190 C205 60, 215 65, 215 80 V180 C215 195, 205 200, 190 200 H65 C50 200, 40 195, 40 180 Z" fill="url(#wallet-grad)" />
        <path d="M40 85 H215 V95 C205 100, 50 100, 40 95 Z" fill="#4C1D95"/>
        
        {/* Wallet Button */}
        <circle cx="190" cy="82" r="8" fill="#F3F3F3" opacity="0.3"/>
        
        {/* Flying Dollar Bill */}
        <g transform="translate(90 30) rotate(15)">
          <path d="M-40 20 C-20 0, 20 0, 40 20 L40 50 C20 70, -20 70, -40 50 Z" fill="url(#cash-grad-withdraw)"/>
          <circle cx="0" cy="35" r="10" stroke="white" strokeWidth="2" strokeOpacity="0.7"/>
          <text x="0" y="40" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold" opacity="0.8">$</text>
        </g>

        {/* Flying Coins */}
        <circle cx="70" cy="55" r="15" fill="#FFD700" stroke="#DAA520" strokeWidth="3"/>
        <text x="70" y="60" textAnchor="middle" fill="#B8860B" fontSize="16" fontWeight="bold">$</text>

        <circle cx="195" cy="110" r="12" fill="#C0C0C0" stroke="#A9A9A9" strokeWidth="2"/>
        <text x="195" y="114" textAnchor="middle" fill="#696969" fontSize="12" fontWeight="bold">$</text>
        
        <circle cx="60" cy="130" r="18" fill="#FFD700" stroke="#DAA520" strokeWidth="3"/>
        <text x="60" y="136" textAnchor="middle" fill="#B8860B" fontSize="18" fontWeight="bold">$</text>
      </g>
    </svg>
  );
}
