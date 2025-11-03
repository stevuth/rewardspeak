
"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { NotikOffer } from "@/lib/notik-api";
import { SafeImage } from "./safe-image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Apple, Monitor } from "lucide-react";

type Offer = NotikOffer & {
  points?: number;
  imageHint?: string;
  category?: string;
  clickUrl?: string;
};

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="currentColor" viewBox="0 0 16 16" height="1em" width="1em" {...props}>
      <path d="M11 2a1 1 0 0 1 1 1v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9H3a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h1V3a1 1 0 0 1 1-1zM4.09 3.35l-.13.13a.5.5 0 0 0 0 .7l.13.13.13.13a.5.5 0 0 0 .7 0l.13-.13.13-.13a.5.5 0 0 0 0-.7l-.13-.13-.13-.13a.5.5 0 0 0-.7 0zM11 3.35a.5.5 0 0 0-.7 0l-.13.13-.13.13a.5.5 0 0 0 0 .7l.13.13.13.13a.5.5 0 0 0 .7 0l.13-.13.13-.13a.5.5 0 0 0 0-.7l-.13-.13zM2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1z" />
    </svg>
);


const PlatformIcons = ({ devices, platforms }: { devices?: string[], platforms?: string[] }) => {
  const safeDevices = devices?.map(d => d.toLowerCase()) || [];
  const safePlatforms = platforms?.map(p => p.toLowerCase()) || [];
  const iconsToShow = new Set<string>();

  // Rule 1: Desktop icon visibility
  if (safeDevices.includes('desktop') || safeDevices.includes('all')) {
    iconsToShow.add('desktop');
  }

  // Rule 2: Android icon visibility
  if (safePlatforms.includes('android') || safePlatforms.includes('all')) {
    iconsToShow.add('android');
  }
  
  // Rule 3: Apple icon visibility
  if (safePlatforms.includes('ios') || safePlatforms.includes('all')) {
    iconsToShow.add('ios');
  }
  
  if (iconsToShow.size === 0) return null;

  return (
    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-2 py-1">
      {iconsToShow.has('desktop') && <Monitor key="desktop" className="w-4 h-4" />}
      {iconsToShow.has('android') && <AndroidIcon key="android" className="w-4 h-4" />}
      {iconsToShow.has('ios') && <Apple key="ios" className="w-4 h-4" />}
    </div>
  );
};


export function OfferGridCard({ offer, onOfferClick }: { offer: Offer, onOfferClick: (offer: Offer) => void }) {
  const points = offer.points || Math.round((offer.payout || 0) * 1000);
  const usdValue = (points / 1000).toFixed(2);
  const category = offer.category || (offer.categories?.includes("SURVEY") ? "Survey" : "Game");
  
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
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                 <PlatformIcons devices={offer.devices} platforms={offer.platforms} />
            </div>
            <CardContent className="p-3 flex-grow flex flex-col bg-card/50">
                <h3 className="font-bold text-sm truncate flex-grow text-foreground">{offer.name}</h3>
                <div className="flex justify-between items-center mt-2">
                    <Badge variant={category === 'Game' ? 'default' : 'secondary'} className="text-xs capitalize">
                        {category.toLowerCase()}
                    </Badge>
                    <span className="text-sm font-bold text-secondary">
                        ${usdValue}
                    </span>
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
