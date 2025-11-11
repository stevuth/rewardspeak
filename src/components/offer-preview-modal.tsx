
"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SafeImage } from "@/components/safe-image";
import type { NotikOffer } from "@/lib/notik-api";
import { Badge } from "@/components/ui/badge";
import { usePathname } from "next/navigation";

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

const OfferHeader = ({
  offer,
  onClose,
}: {
  offer: Offer;
  onClose: () => void;
}) => (
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
          <p className="text-sm text-muted-foreground">from {offer.network}</p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 rounded-lg p-px bg-transparent shadow-[0_0_10px_theme(colors.primary.DEFAULT)] ring-offset-background transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground hover:-translate-y-0.5 active:scale-95 z-10"
      >
        <div className="bg-background/80 text-secondary hover:bg-background/70 px-2 py-1 rounded-[7px] transition-all">
          <span className="text-xs uppercase tracking-wider font-bold">Close</span>
        </div>
        <span className="sr-only">Close</span>
      </button>
    </div>
  </div>
);

export function OfferPreviewModal({
  isOpen,
  onClose,
  offer,
}: OfferPreviewModalProps) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

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
  const allowedCountries = offer.countries || ["ALL"];

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

            <div className="flex-grow overflow-y-auto min-h-0 pb-24">
              <div className="p-4 sm:p-6 space-y-4">
                <div className="p-4 bg-black/20 rounded-lg border border-border">
                  <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Description
                  </h3>
                  <div
                    className="text-sm text-muted-foreground prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: offer.description }}
                  />
                </div>
                
                {isAdmin && (
                  <div className="p-4 bg-black/20 rounded-lg border border-border">
                    <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Allowed Countries
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {allowedCountries.map((country) => (
                        <Badge key={country} variant="outline">{country}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="font-semibold text-primary pt-2">Milestones</h3>
                
                <div className="space-y-3">
                  {hasMilestones ? (
                    offer.events?.map((event, index) => {
                      const points = Math.round((event.payout || 0) * 1000);
                      const usdValue = event.payout || 0;
                      return (
                        <div
                          key={`${event.id}-${event.name}-${index}`}
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
                    })
                  ) : (
                    <div className="text-center py-8 text-muted-foreground text-sm bg-black/20 rounded-lg">
                      <p className="font-semibold">One-Step Offer</p>
                      <p className="mt-1">
                        Complete the main objective to earn the full reward.
                      </p>
                    </div>
                  )}

                  <div className="mt-6 pt-4 border-t border-border/50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="text-left">
                        <p className="text-xs text-muted-foreground">
                          Total Reward
                        </p>
                        <p className="text-lg font-bold text-accent truncate">
                          {totalPoints.toLocaleString()} Pts ($
                          {totalUSD.toFixed(2)})
                        </p>
                      </div>
                      <Button
                        onClick={handleStartOffer}
                        size="default"
                        className="font-bold bg-accent text-accent-foreground hover:bg-accent/80 hover:shadow-[0_0_12px_hsl(var(--accent))] transition-all w-full sm:w-auto shrink-0"
                      >
                        Start Offer
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
