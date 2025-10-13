export function DailyChallengesIllustration() {
    return (
      <div className="relative w-48 h-32 flex items-center justify-center">
        {/* Person */}
        <div className="relative w-16 h-24">
          {/* Body */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-12 bg-gray-400 rounded-t-lg"></div>
          {/* Head */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-yellow-200 rounded-full"></div>
          {/* Arms */}
          <div className="absolute top-4 -left-4 w-8 h-3 bg-gray-400 rounded-full rotate-45"></div>
          <div className="absolute top-4 -right-4 w-8 h-3 bg-gray-400 rounded-full -rotate-45"></div>
        </div>
  
        {/* Money flying around */}
        <div className="absolute top-2 left-4 w-8 h-4 bg-green-500 rounded-sm -rotate-12"></div>
        <div className="absolute top-2 right-4 w-8 h-4 bg-green-500 rounded-sm rotate-12"></div>
        <div className="absolute top-10 left-0 w-8 h-4 bg-green-500 rounded-sm rotate-20"></div>
        <div className="absolute top-10 right-0 w-8 h-4 bg-green-500 rounded-sm -rotate-20"></div>
  
        {/* Coin stacks */}
        <div className="absolute bottom-0 left-2 w-10 h-8">
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-0"></div>
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-2"></div>
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-4"></div>
        </div>
        <div className="absolute bottom-0 right-2 w-10 h-8">
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-0"></div>
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-2"></div>
            <div className="w-full h-2 bg-yellow-400 rounded-full absolute bottom-4"></div>
        </div>
      </div>
    );
  }
  