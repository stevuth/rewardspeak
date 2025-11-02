
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { NotikOffer } from "@/lib/notik-api";
import { SafeImage } from "./safe-image";

type Offer = NotikOffer & {
  points?: number;
  imageHint?: string;
  category?: string;
  clickUrl?: string;
};

export function OfferGridCard({ offer, onOfferClick }: { offer: Offer, onOfferClick: (offer: Offer) => void }) {
  const points = offer.points || 0;
  
  return (
    <div onClick={() => onOfferClick(offer)} className="cursor-pointer h-full">
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 group bg-card border-border hover:border-primary/50 flex flex-col h-full">
            <div className="relative">
                <SafeImage
                  src={offer.image_url}
                  alt={offer.name}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover"
                  data-ai-hint={offer.imageHint}
                />
            </div>
            <CardContent className="p-2 flex-grow flex flex-col">
                <h3 className="font-semibold text-sm truncate flex-grow mb-1">{offer.name}</h3>
                <div className="flex justify-between items-center rounded-md bg-primary/20 px-2 py-1">
                    <span className="text-xs font-bold text-primary-foreground/80 capitalize">
                        {offer.category?.toLowerCase() || 'Offer'}
                    </span>
                    <span className="text-xs font-bold text-secondary">
                        ${(points / 1000).toFixed(2)}
                    </span>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
