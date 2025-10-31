
"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import type { NotikOffer } from "@/lib/notik-api";

type Offer = NotikOffer & {
  points?: number;
  imageHint?: string;
  category?: string;
  clickUrl?: string;
  events?: { name: string; payout: number; id: number }[];
};

type OfferPreviewModalProps = {
  isOpen: boolean;
  onClose: () => void;
  offer: Offer | null;
};

const backdropVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 30, duration: 0.3 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.2 },
  },
};

const OfferHeader = ({ offer, onClose }: { offer: Offer; onClose: () => void }) => (
    <div className="flex-shrink-0 p-4 sm:p-6 border-b border-primary/20">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 min-w-0">
                <SafeImage
                    src={offer.image_url}
                    alt={offer.name}
                    width={64}
                    height={64}
                    className="rounded-lg border-2 border-primary/30 flex-shrink-0"
                    data-ai-hint={offer.imageHint}
                />
                <div className="flex-1 min-w-0">
                    <h2 className="text-lg sm:text-xl font-bold font-headline truncate">
                        {offer.name}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        from {offer.network}
                    </p>
                </div>
            </div>
            <button
                onClick={onClose}
                className="flex-shrink-0 rounded-md px-2 py-1 bg-black/20 ring-offset-background transition-all hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground font-semibold text-[#39FF14] hover:text-[#8A2BE2] hover:-translate-y-0.5 active:scale-95 z-10"
            >
                <span className="text-xs uppercase tracking-wider">Close</span>
                <span className="sr-only">Close</span>
            </button>
        </div>
    </div>
);

const OfferFooter = ({
  totalPoints,
  totalUSD,
  onStartOffer,
}: {
  totalPoints: number;
  totalUSD: number;
  onStartOffer: () => void;
}) => (
  <div className="flex-shrink-0 w-full flex items-center justify-between gap-4 p-4 border-t border-primary/20 bg-gradient-to-t from-black/30 to-transparent">
    <div className="text-left">
      <p className="text-xs text-muted-foreground">Total Reward</p>
      <p className="text-lg font-bold text-accent truncate">
        {totalPoints.toLocaleString()} Pts (${totalUSD.toFixed(2)})
      </p>
    </div>
    <Button
      onClick={onStartOffer}
      size="lg"
      className="font-bold bg-accent text-accent-foreground hover:bg-accent/80 hover:shadow-[0_0_12px_theme(colors.accent)] transition-all shrink-0"
    >
      Start Offer
    </Button>
  </div>
);

export function OfferPreviewModal({
  isOpen,
  onClose,
  offer,
}: OfferPreviewModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!offer) return null;

  const totalPayout =
    offer.events && offer.events.length > 0
      ? offer.events.reduce((sum, event) => sum + (event?.payout || 0), 0)
      : offer.payout || 0;

  const totalPoints = Math.round(totalPayout * 1000);
  const totalUSD = totalPayout;

  const handleStartOffer = () => {
    if (offer.clickUrl) {
      window.open(offer.clickUrl, "_blank", "noopener,noreferrer");
    }
    onClose();
  };

  const hasMilestones = offer.events && offer.events.length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0E001A]/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariants}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col bg-[#15002B] text-[#F2F2F2] rounded-2xl shadow-2xl w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-hidden border border-primary/20"
          >
            <OfferHeader offer={offer} onClose={onClose} />

            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6 space-y-4 pb-24">
                <div className="p-4 bg-black/20 rounded-lg border border-border">
                  <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Instructions
                  </h3>
                  <div
                    className="text-sm text-muted-foreground prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: offer.description }}
                  />
                </div>

                <h3 className="font-semibold text-primary pt-2">Milestones</h3>
                {hasMilestones ? (
                  <div className="space-y-3">
                    {offer.events?.map((event) => {
                      const points = Math.round((event.payout || 0) * 1000);
                      const usdValue = event.payout || 0;
                      return (
                        <div
                          key={event.id}
                          className="bg-black/20 p-4 rounded-lg border border-border transition-all hover:border-primary/50"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{event.name}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                Complete this step to earn
                              </p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              <p className="font-bold text-accent">
                                +{points.toLocaleString()} Pts
                              </p>
                              <p className="text-xs text-muted-foreground">
                                (${usdValue.toFixed(2)})
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm bg-black/20 rounded-lg">
                    <p className="font-semibold">One-Step Offer</p>
                    <p className="mt-1">
                      Complete the main objective to earn the full reward.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <OfferFooter
              totalPoints={totalPoints}
              totalUSD={totalUSD}
              onStartOffer={handleStartOffer}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
