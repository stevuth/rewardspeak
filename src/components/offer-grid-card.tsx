
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
                <div className="flex justify-between items-center gap-1">
                    <Badge variant="secondary" className="text-[9px] capitalize px-1.5 py-0.5 leading-none shrink-0">
                        {offer.category?.toLowerCase() || 'Offer'}
                    </Badge>
                    <span className="text-xs font-bold text-secondary truncate text-right flex-1 min-w-0">
                        ${(points / 1000).toFixed(2)}
                    </span>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
