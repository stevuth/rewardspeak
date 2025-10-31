
'use client';

import { SafeImage } from "../safe-image";

const GameOffer = ({
  imageUrl,
  imageHint,
  title,
  reward,
}: {
  imageUrl: string;
  imageHint: string;
  title: string;
  reward: string;
}) => (
  <div className="flex items-center gap-3 p-2 rounded-lg">
    <SafeImage
      src={imageUrl}
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

const defaultOffers = [
    { image_url: "https://picsum.photos/seed/game1/48/48", name: "Alice's Mergeland", payout: 9.00 },
    { image_url: "https://picsum.photos/seed/game2/48/48", name: "Age of Coins: Master Of Spins", payout: 12.40 },
    { image_url: "https://picsum.photos/seed/game3/48/48", name: "Coin Master", payout: 8.90 },
    { image_url: "https://picsum.photos/seed/game4/48/48", name: "Lords Mobile: Kingdom Wars", payout: 15.50 },
];

export function EarnByGamingIllustration({ offers }: { offers?: any[] }) {
  const displayOffers = (offers && offers.length > 0) ? offers : defaultOffers;
  
  return (
    <div className="relative w-72 h-[450px] flex items-center justify-center">
      {/* Phone Body */}
      <div className="relative w-full h-full bg-card rounded-[40px] border-4 border-border shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-background rounded-b-xl z-20"></div>
        {/* Screen Content */}
        <div className="absolute inset-x-0 top-6 bottom-2 rounded-[30px] bg-background p-4 space-y-2">
            <div className="flex justify-between items-center px-2 py-2">
                 <p className="text-muted-foreground text-xs">09:41</p>
                 {/* Icons for status bar */}
            </div>
            <h2 className="text-foreground text-2xl font-bold px-2 mb-2">Games</h2>
            <div className="space-y-2">
                 {displayOffers.map((offer, index) => (
                    <GameOffer 
                        key={offer.offer_id || index}
                        imageUrl={offer.image_url} 
                        imageHint="game logo" 
                        title={offer.name} 
                        reward={`$${(offer.payout || 0).toFixed(2)} USD`} 
                    />
                 ))}
            </div>
        </div>
      </div>
    </div>
  );
}
