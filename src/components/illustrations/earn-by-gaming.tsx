
'use client';

import { SafeImage } from "../safe-image";
import { WavingMascotLoader } from "../waving-mascot-loader";

const GameOffer = ({
  image_url,
  imageHint,
  title,
  reward,
}: {
  image_url: string;
  imageHint: string;
  title: string;
  reward: string;
}) => (
  <div className="flex items-center gap-3 p-2 rounded-lg">
    <SafeImage
      src={image_url}
      alt={title}
      width={48}
      height={48}
      className="rounded-lg"
      data-ai-hint={imageHint}
    />
    <div className="flex-grow">
      <p className="font-semibold text-white text-sm">{title}</p>
      <p className="text-xs text-gray-400">Game</p>
    </div>
    <p className="font-bold text-secondary text-sm">{reward}</p>
  </div>
);

export function EarnByGamingIllustration({ offers }: { offers?: any[] }) {
  const displayOffers = offers || [];
  
  return (
    <div className="relative w-72 h-[450px] flex items-center justify-center">
      {/* Phone Body */}
      <div className="relative w-full h-full bg-card rounded-[40px] border-4 border-border shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-b-xl z-20"></div>
        {/* Screen Content */}
        <div className="absolute inset-x-0 top-6 bottom-2 rounded-[30px] bg-background p-4 space-y-2">
            <div className="flex justify-between items-center px-2 py-1">
                 <p className="text-muted-foreground text-xs">09:41</p>
                 {/* Icons for status bar */}
            </div>
            <h2 className="text-foreground text-2xl font-bold px-2 mb-2">Games</h2>
            <div className="space-y-2">
                 {displayOffers.length > 0 ? (
                    displayOffers.map((offer) => (
                        <GameOffer 
                            key={offer.offer_id}
                            image_url={offer.image_url} 
                            imageHint="game logo" 
                            title={offer.name} 
                            reward={`$${(offer.payout || 0).toFixed(2)} USD`} 
                        />
                    ))
                 ) : (
                    <div className="h-48 flex flex-col items-center justify-center text-center">
                        <WavingMascotLoader text="Loading Games..." />
                    </div>
                 )}
            </div>
        </div>
      </div>
    </div>
  );
}
