
"use client";

import { SafeImage } from "@/components/safe-image";
import { Star } from "lucide-react";

export function FeaturedOfferCard({ offer, scale }: { offer: any, scale: number }) {
  if (!offer) {
    return (
      <div className="relative w-full max-w-xs h-64 rounded-2xl bg-card border-2 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden flex items-center justify-center p-8 text-center">
        <p className="text-muted-foreground">Could not load a featured offer.</p>
      </div>
    );
  }

  const totalPayout = offer.payout || 0;

  return (
    <div
      className="relative w-48 h-64 rounded-2xl bg-card/80 border border-border/50 shadow-lg overflow-hidden group transition-transform duration-300 ease-in-out"
      style={{ transform: `scale(${scale})` }}
    >
      <SafeImage
        src={offer.image_url}
        alt={offer.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-bold truncate">{offer.name}</h3>
        <p className="text-xs text-white/80 truncate">{offer.description}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-bold text-secondary text-lg">
            ${totalPayout.toFixed(2)}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold bg-black/50 px-2 py-1 rounded-full">
            <Star className="w-3 h-3 text-yellow-400" fill="currentColor" />
            <span>5.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
