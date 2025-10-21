
"use client";

export function HeroIllustration() {
  return (
    <div className="relative w-[32rem] h-80 rounded-2xl bg-card border-2 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute w-full h-20 bottom-0 bg-gradient-to-t from-card to-transparent"></div>
      
      {/* Floating Cards */}
      <div className="absolute top-10 left-10 w-48 h-28 rounded-lg bg-background/80 backdrop-blur-sm border border-border p-3 shadow-lg animate-float-slow">
         <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-full bg-yellow-400"></div>
            <div>
                <div className="w-20 h-2 bg-muted rounded-full"></div>
                <div className="w-12 h-2 bg-muted/50 rounded-full mt-1"></div>
            </div>
         </div>
         <div className="w-full h-2 bg-green-500 rounded-full my-3"></div>
         <div className="w-3/4 h-2 bg-muted rounded-full"></div>
      </div>

      <div className="absolute bottom-12 right-8 w-56 h-36 rounded-lg bg-background/80 backdrop-blur-sm border border-border p-3 shadow-lg animate-float-fast">
        <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-blue-500"></div>
                <div>
                    <div className="w-24 h-2.5 bg-muted rounded-full"></div>
                    <div className="w-16 h-2 bg-muted/50 rounded-full mt-1.5"></div>
                </div>
            </div>
            <div className="w-10 h-4 bg-primary/20 rounded-full"></div>
        </div>
        <div className="flex justify-between items-center mt-4">
             <div className="text-primary font-bold text-lg">+5,000</div>
             <div className="w-20 h-8 bg-primary rounded-md"></div>
        </div>
      </div>

       <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 p-3 shadow-lg animate-float-medium flex items-center justify-center">
        <div className="text-center">
            <div className="font-bold text-2xl text-primary">XP</div>
            <div className="w-12 h-1.5 bg-primary/50 rounded-full mx-auto mt-1"></div>
        </div>
       </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 7s ease-in-out infinite;
        }
        .bg-grid-pattern {
            background-image: linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(to right, hsl(var(--border)) 1px, hsl(var(--card)) 1px);
            background-size: 2rem 2rem;
        }
      `}</style>
    </div>
  );
}


    
