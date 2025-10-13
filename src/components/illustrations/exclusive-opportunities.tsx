export function ExclusiveOpportunitiesIllustration() {
    return (
      <div className="relative w-48 h-32">
        {/* Laptop */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-40 h-24 bg-gray-700 rounded-lg border-2 border-gray-600 flex items-center justify-center">
          <div className="w-36 h-20 bg-black/50 rounded-md p-1">
             <div className="w-full h-full bg-primary/20 opacity-50 rounded-sm"></div>
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-gray-800 rounded-b-lg"></div>
  
        {/* Person */}
        <div className="absolute bottom-4 left-8 w-12 h-16">
          <div className="absolute bottom-0 w-8 h-8 bg-gray-400 rounded-t-full"></div>
          <div className="absolute -top-2 left-2 w-6 h-6 bg-yellow-200 rounded-full"></div>
        </div>
  
        {/* Money */}
        <div className="absolute top-0 left-10 w-8 h-4 bg-green-500 rounded-sm -rotate-12 opacity-80"></div>
        <div className="absolute top-8 right-2 w-8 h-4 bg-green-500 rounded-sm rotate-12 opacity-80"></div>
        <div className="absolute bottom-16 left-0 w-8 h-4 bg-green-500 rounded-sm rotate-20 opacity-80"></div>

        {/* Coins */}
        <div className="absolute top-2 right-8 w-5 h-5 bg-yellow-400 rounded-full opacity-90"></div>
        <div className="absolute bottom-12 left-2 w-5 h-5 bg-yellow-400 rounded-full opacity-90"></div>

      </div>
    );
  }
  