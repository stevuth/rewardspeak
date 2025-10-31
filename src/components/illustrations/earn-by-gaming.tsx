
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

export function EarnByGamingIllustration() {
  return (
    <div className="relative w-72 h-[450px] flex items-center justify-center">
      {/* Phone Body */}
      <div className="relative w-full h-full bg-[#1C1C1E] rounded-[40px] border-4 border-gray-800 shadow-2xl shadow-black/50 overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20"></div>
        {/* Screen Content */}
        <div className="absolute inset-x-0 top-6 bottom-2 rounded-[30px] bg-black p-4 space-y-2">
            <div className="flex justify-between items-center px-2 py-4">
                 <p className="text-white text-xs">09:41</p>
                 {/* Icons for status bar */}
            </div>
            <h2 className="text-white text-2xl font-bold px-2 mb-4">Games</h2>
            <div className="space-y-3">
                 <GameOffer imageUrl="https://picsum.photos/seed/game1/48/48" imageHint="fantasy rabbit character" title="Alice's Mergeland" reward="$9.00 USD" />
                 <GameOffer imageUrl="https://picsum.photos/seed/game2/48/48" imageHint="fox character adventure" title="Age of Coins: Master Of Spins" reward="$12.40 USD" />
                 <GameOffer imageUrl="https://picsum.photos/seed/game3/48/48" imageHint="pig character cartoon" title="Coin Master" reward="$8.90 USD" />
                 <GameOffer imageUrl="https://picsum.photos/seed/game4/48/48" imageHint="warrior character fantasy" title="Lords Mobile: Kingdom Wars" reward="$15.50 USD" />
            </div>
        </div>
      </div>
    </div>
  );
}
