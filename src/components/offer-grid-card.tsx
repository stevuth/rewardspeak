
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
    <svg fill="currentColor" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
      <path d="M490.6 233.4c21.8-14.3 25.4-44.3 7.9-62s-44.3-25.4-62-7.9l-32.9 32.9C384 169.2 352.3 160 320 160H192c-32.3 0-64 9.2-83.6 28.4L75.5 221.3c-17.5 17.5-17.5 45.9 0 63.4s45.9 17.5 63.4 0l32.9-32.9c19.6-19.2 51.3-28.4 83.6-28.4H320c15.1 0 29.7 2.3 43.4 6.6l-85.6 85.6c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L405.3 328l-5.1 5.1c-14.3 14.3-17.9 35.8-9.4 54.3s29.6 28.5 50.3 24.6l56.2-10.6c24-4.5 42.4-22.9 46.9-46.9l10.6-56.2c3.9-20.7-5.7-41.8-24.6-50.3s-40-1.5-54.3 9.4l-5.1 5.1L490.6 233.4zM32 208c0-35.3 28.7-64 64-64h16v32H96c-17.7 0-32 14.3-32 32s14.3 32 32 32h16v32H96c-35.3 0-64-28.7-64-64zm421.3 7.5c-4.4-4.4-11.5-4.4-15.9 0L424 228.8l-11.1-11.1c-4.4-4.4-11.5-4.4-15.9 0s-4.4 11.5 0 15.9l11.1 11.1L396.8 258c-4.4 4.4-4.4 11.5 0 15.9s11.5 4.4 15.9 0l11.4-11.4 11.1 11.1c4.4 4.4 11.5 4.4 15.9 0s4.4-11.5 0-15.9L437.8 244l11.1-11.1c4.4-4.4 4.4-11.5-.1-15.4z" />
    </svg>
);


const PlatformIcons = ({ devices, platforms }: { devices?: string[], platforms?: string[] }) => {
  const safeDevices = devices?.map(d => d.toLowerCase()) || [];
  const safePlatforms = platforms?.map(p => p.toLowerCase()) || [];
  const iconsToShow = new Set<string>();

  // Rule: Show desktop icon if 'desktop' or 'all' is in devices.
  if (safeDevices.includes('desktop') || safeDevices.includes('all')) {
    iconsToShow.add('desktop');
  }

  // Rule: Show Android icon if 'android' is in platforms.
  if (safePlatforms.includes('android')) {
    iconsToShow.add('android');
  }
  
  // Rule: Show Apple icon if 'ios' is in platforms.
  if (safePlatforms.includes('ios')) {
    iconsToShow.add('ios');
  }

  // New Rule: If platforms is 'all', show both mobile icons.
  if (safePlatforms.includes('all')) {
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
