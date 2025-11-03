
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
    <svg fill="currentColor" viewBox="0 0 32 32" height="1em" width="1em" {...props}>
        <path d="M28,19.4v-2.8c0-1.9-1.2-3.5-2.9-4.2l-1.3-0.5c-0.4-1.4-1-2.7-1.8-3.9l0.7-1.4c1.1-2,0.6-4.6-1.1-6l-2-2 c-1.7-1.4-4.2-1.6-6.2-0.5l-1.5,0.8C10.5,0.4,8.8,0,7,0H5C2.2,0,0,2.2,0,5v2c0,1.8,1.2,3.3,2.8,3.9L4,11.3c0.4,1.4,1,2.7,1.8,3.9 l-0.7,1.4c-1.1,2-0.6,4.6,1.1,6l2,2c1.7,1.4,4.2,1.6,6.2,0.5l1.5-0.8c1.4,0.7,2.9,1.1,4.5,1.1h2C25.8,25,28,22.8,28,20V19.4z M5,3c1.1,0,2,0.9,2,2s-0.9,2-2,2S3,6.1,3,5S3.9,3,5,3z M23,22c-1.1,0-2-0.9-2-2s0.9-2,2-2s2,0.9,2,2S24.1,22,23,22z"/>
    </svg>
);


const PlatformIcons = ({ devices, platforms }: { devices?: string[], platforms?: string[] }) => {
  const safeDevices = devices?.map(d => d.toLowerCase()) || [];
  const safePlatforms = platforms?.map(p => p.toLowerCase()) || [];
  const iconsToShow = new Set<string>();

  // Rule 1: Show desktop icon if 'desktop' or 'all' is in devices.
  if (safeDevices.includes('desktop') || safeDevices.includes('all')) {
    iconsToShow.add('desktop');
  }

  // Rule 2: Show Android icon if 'android' is in platforms.
  if (safePlatforms.includes('android')) {
    iconsToShow.add('android');
  }
  
  // Rule 3: Show Apple icon if 'ios' is in platforms.
  if (safePlatforms.includes('ios')) {
    iconsToShow.add('ios');
  }
  
  // Also show mobile icons if devices contains 'all'
  if (safeDevices.includes('all')) {
      iconsToShow.add('android');
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
