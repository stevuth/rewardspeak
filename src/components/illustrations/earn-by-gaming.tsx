
'use client';

import { motion } from "framer-motion";
import { Gamepad2, Loader2, Wifi, Signal, Battery } from "lucide-react";
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
  const usdValue = (payout * 1000) / 1000;

  return (
    <motion.div
      className="flex items-center gap-4 p-3 rounded-2xl bg-card/60"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
    >
      <SafeImage
        src={offer.image_url}
        alt={offer.name}
        width={64}
        height={64}
        className="rounded-xl w-16 h-16 object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-bold truncate text-white">{offer.name}</p>
        <p className="text-sm text-muted-foreground">{offer.categories?.find((c: string) => c.toLowerCase() === 'game') || 'Game'}</p>
        <p className="text-secondary font-bold text-lg mt-1">${usdValue.toFixed(2)} USD</p>
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
    <div className="relative w-full h-full flex items-center justify-center p-4">
      {/* Realistic Vertical Phone */}
      <motion.div
        className="relative z-10 w-80 h-[36rem] bg-card rounded-[3rem] border-4 border-border/50 p-2 shadow-2xl shadow-primary/10"
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        {/* Phone screen */}
        <div className="w-full h-full bg-background rounded-[2.5rem] overflow-hidden relative flex flex-col">
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-card rounded-b-xl z-20"></div>

            {/* Screen Content */}
            <div className="flex-shrink-0 px-4 pt-4">
                <div className="flex justify-between items-center text-white text-xs font-bold">
                    <span>09:41</span>
                    <div className="flex items-center gap-1">
                        <Signal size={14} />
                        <Wifi size={14} />
                        <Battery size={18} />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-white mt-4 mb-4">Games</h2>
            </div>
            
            <div className="flex-grow p-2 space-y-3 overflow-y-auto">
                {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-primary" />
                    <p className="text-xs text-muted-foreground">Loading Games...</p>
                </div>
                ) : offers && offers.length > 0 ? (
                offers.map((offer, index) => (
                    <GameOffer key={offer.offer_id || index} offer={offer} index={index} />
                ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
                        <Gamepad2 className="w-6 h-6 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">No game offers available right now.</p>
                </div>
                )}
            </div>
            {/* Home indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-muted-foreground/50 rounded-full"></div>
        </div>
      </motion.div>
    </div>
  );
};
