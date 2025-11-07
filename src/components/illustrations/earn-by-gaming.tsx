
'use client';

import { motion } from "framer-motion";
import { Gamepad2, Loader2 } from "lucide-react";
import Image from 'next/image';
import { SafeImage } from "../safe-image";

type GameOfferProps = {
  offer: any;
  index: number;
};

const GameOffer = ({ offer, index }: GameOfferProps) => {
  if (!offer) {
    return null;
  }
  
  const payout = offer.payout || 0;
  const points = Math.round(payout * 1000);

  return (
    <motion.div
      className="flex items-center gap-2 bg-black/30 backdrop-blur-sm p-1.5 rounded-lg border border-white/10"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
    >
      <SafeImage
        src={offer.image_url}
        alt={offer.name}
        width={40}
        height={40}
        className="rounded-md w-10 h-10 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold truncate">{offer.name}</p>
        <p className="text-primary font-bold text-xs">+{points.toLocaleString()} Pts</p>
      </div>
    </motion.div>
  );
};


type EarnByGamingIllustrationProps = {
  offers: any[];
  isLoading: boolean;
};

export const EarnByGamingIllustration = ({ offers, isLoading }: EarnByGamingIllustrationProps) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-card/50 rounded-2xl overflow-hidden p-4">
       <div className="absolute inset-0 z-0 opacity-10">
        <Image 
            src="https://picsum.photos/seed/gaming-bg/600/400"
            alt="Gaming background"
            fill
            className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/50 to-background"></div>
       </div>

      <motion.div
        className="relative z-10 w-48 h-[20.5rem] bg-gray-900/80 backdrop-blur-lg rounded-3xl border-4 border-gray-700 p-2.5"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <div className="w-full h-full bg-black rounded-xl overflow-hidden">
          <div className="h-full w-full p-2 space-y-2 overflow-y-auto">
             <div className="flex items-center gap-2 text-primary font-bold p-1">
                <Gamepad2 className="w-5 h-5"/>
                <h3 className="text-sm">Top Game Offers</h3>
            </div>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <p className="text-xs text-muted-foreground">Loading Offers...</p>
              </div>
            ) : offers && offers.length > 0 ? (
              offers.map((offer, index) => (
                <GameOffer key={offer.offer_id || index} offer={offer} index={index} />
              ))
            ) : (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                    <Gamepad2 className="w-6 h-6 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">No offers available right now.</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

    