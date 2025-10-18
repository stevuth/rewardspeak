
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { NotikOffer } from "@/lib/notik-api";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

type Offer = NotikOffer & {
  points?: number;
  imageHint?: string;
  category?: string;
  events: { name: string; payout: number; id: number }[];
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
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 30,
      duration: 0.3
    },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.2,
    },
  },
};

export function OfferPreviewModal({ isOpen, onClose, offer }: OfferPreviewModalProps) {
  if (!offer) return null;

  // Safely calculate total payout
  const totalPayout =
    (offer.events && offer.events.length > 0)
      ? offer.events.reduce((sum, event) => sum + (event?.payout || 0), 0)
      : (offer.payout || 0);

  const totalPoints = Math.round(totalPayout * 1000);
  const totalUSD = totalPayout;

  const handleStartOffer = () => {
    if (offer.click_url) {
      window.open(offer.click_url, "_blank", "noopener,noreferrer");
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
            className="relative flex flex-col bg-[#15002B] text-[#F2F2F2] rounded-2xl shadow-2xl w-[95vw] sm:max-w-2xl h-[95vh] sm:h-auto sm:max-h-[90vh] overflow-hidden border border-primary/20"
          >
            {/* Header */}
            <div className="relative flex-shrink-0 p-4 sm:p-6 border-b border-primary/20">
              <div className="flex items-center gap-4">
                <SafeImage
                  src={offer.image_url}
                  alt={offer.name}
                  width={64}
                  height={64}
                  className="rounded-lg border-2 border-primary/30"
                  data-ai-hint={offer.imageHint}
                />
                <div className="flex-1">
                  <h2 className="text-lg sm:text-xl font-bold font-headline truncate">
                    {offer.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    from {offer.network}
                  </p>
                </div>
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>

            {/* Scrollable Body */}
            <ScrollArea className="flex-1">
                <div className="p-4 sm:p-6 space-y-4">
                    <div className="p-4 bg-black/20 rounded-lg border border-border">
                        <h3 className="font-semibold text-primary mb-2 flex items-center gap-2"><Info className="h-4 w-4"/>Description</h3>
                        <p className="text-sm text-muted-foreground">{offer.description}</p>
                    </div>

                    <h3 className="font-semibold text-primary pt-2">Milestones</h3>
                    {hasMilestones ? (
                        <div className="space-y-3">
                        {offer.events.map((event) => {
                            const points = Math.round(event.payout * 1000);
                            const usdValue = event.payout;
                            return (
                            <div
                                key={event.id}
                                className="bg-black/20 p-4 rounded-lg border border-border transition-all hover:border-primary/50"
                            >
                                <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-semibold">{event.name}</p>
                                    <p className="text-xs text-muted-foreground mt-1">Complete this step to earn</p>
                                </div>
                                <div className="text-right flex-shrink-0 ml-4">
                                    <p className="font-bold text-accent">
                                    +{points.toLocaleString()} Pts
                                    </p>
                                    <p className="text-xs text-muted-foreground">(${usdValue.toFixed(2)})</p>
                                </div>
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground text-sm bg-black/20 rounded-lg">
                            <p className="font-semibold">One-Step Offer</p>
                            <p className="mt-1">Complete the main objective to earn the full reward.</p>
                        </div>
                    )}
                </div>
            </ScrollArea>

            {/* Footer */}
            <div className="flex-shrink-0 p-4 sm:p-6 border-t border-primary/20 bg-gradient-to-t from-black/30 to-transparent">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-xs text-muted-foreground">Total Reward</p>
                  <p className="text-xl font-bold text-accent">
                    {totalPoints.toLocaleString()} Pts (${totalUSD.toFixed(2)})
                  </p>
                </div>
                <Button
                  onClick={handleStartOffer}
                  size="lg"
                  className="w-full sm:w-auto font-bold bg-accent text-accent-foreground hover:bg-accent/80 hover:shadow-[0_0_12px_theme(colors.accent)] transition-all"
                >
                  Start Offer
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
