
export function PhoneWithOffersIllustration() {
  return (
    <div className="relative w-64 h-96 sm:w-72 sm:h-[450px] flex items-center justify-center">
      {/* Phone Body */}
      <div className="relative w-full h-full bg-[#1A0033] rounded-[40px] border-4 border-[#240046] shadow-2xl shadow-primary/20 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#15002B] rounded-b-xl z-20"></div>
        {/* Screen Content */}
        <div className="absolute inset-x-2 top-8 bottom-2 rounded-[30px] bg-gradient-to-b from-[#15002B] to-background p-3 space-y-3 overflow-y-auto no-scrollbar">
          {/* Offer Card 1 */}
          <div className="w-full h-24 bg-card/80 rounded-2xl flex items-center p-3 gap-3 animate-slide-up-1">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
              <div className="w-full h-3 bg-muted rounded-full"></div>
              <div className="w-3/4 h-3 bg-muted/50 rounded-full"></div>
              <div className="w-1/2 h-4 bg-secondary rounded-full"></div>
            </div>
          </div>
          {/* Offer Card 2 */}
          <div className="w-full h-24 bg-card/80 rounded-2xl flex items-center p-3 gap-3 animate-slide-up-2">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
              <div className="w-full h-3 bg-muted rounded-full"></div>
              <div className="w-3/4 h-3 bg-muted/50 rounded-full"></div>
              <div className="w-1/2 h-4 bg-secondary rounded-full"></div>
            </div>
          </div>
          {/* Offer Card 3 */}
          <div className="w-full h-24 bg-card/80 rounded-2xl flex items-center p-3 gap-3 animate-slide-up-3">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
              <div className="w-full h-3 bg-muted rounded-full"></div>
              <div className="w-3/4 h-3 bg-muted/50 rounded-full"></div>
              <div className="w-1/2 h-4 bg-secondary rounded-full"></div>
            </div>
          </div>
           {/* Offer Card 4 */}
           <div className="w-full h-24 bg-card/80 rounded-2xl flex items-center p-3 gap-3 animate-slide-up-4">
            <div className="w-16 h-16 bg-primary/20 rounded-lg flex-shrink-0"></div>
            <div className="flex-grow space-y-2">
              <div className="w-full h-3 bg-muted rounded-full"></div>
              <div className="w-3/4 h-3 bg-muted/50 rounded-full"></div>
              <div className="w-1/2 h-4 bg-secondary rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slide-up-1 { animation: slide-up 0.5s ease-out 0.2s backwards; }
        .animate-slide-up-2 { animation: slide-up 0.5s ease-out 0.4s backwards; }
        .animate-slide-up-3 { animation: slide-up 0.5s ease-out 0.6s backwards; }
        .animate-slide-up-4 { animation: slide-up 0.5s ease-out 0.8s backwards; }
      `}</style>
    </div>
  );
}
