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
        <circle cx="50" cy="50" r="8" fill="#14B8A6" />
        <rect x="200" y="60" width="16" height="16" rx="4" fill="#FACC15" />
        <path d="M70 190 L80 210 L60 210 Z" fill="#38BDF8" />
        <rect x="20" y="150" width="12" height="12" rx="2" fill="#FFFFFF" />
        <circle cx="220" cy="180" r="10" fill="#EC4899" />
        <path d="M180 30 L190 50 L170 50 Z" fill="#FACC15" transform="rotate(45 180 30)" />
        <path d="M100 20L105 30L95 30" stroke="#818CF8" strokeWidth="3" />
        <path d="M230 110 C 240 120, 230 130, 220 120" stroke="#A78BFA" strokeWidth="2" fill="none" />
        <path d="M30 90 C 40 80, 50 90, 40 100" stroke="#F472B6" strokeWidth="2" fill="none" />
        <line x1="140" y1="230" x2="160" y2="220" stroke="#60A5FA" strokeWidth="3" />
        <line x1="190" y1="230" x2="170" y2="240" stroke="#FACC15" strokeWidth="3" />
        <path d="M128 40 L133 45 L128 50 L123 45Z" fill="#4ADE80" />
      </svg>
      {/* Gift Box */}
      <div className="relative">
        <div className="w-32 h-24 bg-red-500 rounded-lg shadow-lg flex items-center justify-center">
          {/* Dots */}
          <div className="absolute w-full h-full grid grid-cols-4 gap-2 p-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-3 h-3 rounded-full bg-yellow-300 opacity-75" />
            ))}
          </div>
        </div>
        {/* Lid */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-6 bg-red-500 rounded-t-lg border-b-2 border-red-600"></div>
        {/* Ribbon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-[112px] bg-red-400/70"></div>
        {/* Bow */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <svg width="60" height="40" viewBox="0 0 78 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M39 16C39 16 31.5 2.5 19.5 1C7.5 -0.5 1 12 1 21C1 29.5 10.5 35.5 19.5 34C28.5 32.5 39 16 39 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M39 16C39 16 46.5 2.5 58.5 1C70.5 -0.5 77 12 77 21C77 29.5 67.5 35.5 58.5 34C49.5 32.5 39 16 39 16Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
}