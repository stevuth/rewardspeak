

"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { NotikOffer } from "@/lib/notik-api";
import { SafeImage } from "./safe-image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Apple, Monitor } from "lucide-react";

type Offer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

const AndroidIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" height="1em" width="1em" {...props}>
    <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM12 5c-1.66 0-3 1.34-3 3h6c0-1.66-1.34-3-3-3z" />
    <path d="M10.3 6.1L8.5 3.5 M13.7 6.1L15.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const PlatformIcons = ({ devices, platforms }: { devices?: string[], platforms?: string[] }) => {
  const safeDevices = devices?.map(d => d.toLowerCase()) || [];
  const safePlatforms = platforms?.map(p => p.toLowerCase()) || [];
  const iconsToShow = new Set<string>();

  // If devices field is empty, rely solely on platforms field
  if (safeDevices.length === 0) {
    if (safePlatforms.includes('android')) iconsToShow.add('android');
    if (safePlatforms.includes('ios')) iconsToShow.add('ios');
    if (safePlatforms.includes('all')) {
      iconsToShow.add('android');
      iconsToShow.add('ios');
    }
  } else {
    // Original logic when devices field is not empty
    if (safeDevices.includes('all')) {
      iconsToShow.add('desktop');
      iconsToShow.add('android');
      iconsToShow.add('ios');
    } else {
      if (safeDevices.includes('desktop')) {
        iconsToShow.add('desktop');
      }
      if (safePlatforms.includes('android')) {
        iconsToShow.add('android');
      }
      if (safePlatforms.includes('ios')) {
        iconsToShow.add('ios');
      }
      if (safePlatforms.includes('all')) {
        iconsToShow.add('android');
        iconsToShow.add('ios');
      }
    }
  }

  if (iconsToShow.size === 0) return null;

  return (
    <div className="absolute top-3 right-3 flex items-center gap-2">
      {iconsToShow.has('desktop') && (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#15002B] border border-[#8A2BE2]/30 text-white shadow-sm transition-transform hover:scale-105">
          <Monitor key="desktop" className="w-4 h-4" />
        </div>
      )}
      {iconsToShow.has('android') && (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#15002B] border border-[#8A2BE2]/30 text-white shadow-sm transition-transform hover:scale-105">
          <AndroidIcon key="android" className="w-4 h-4" />
        </div>
      )}
      {iconsToShow.has('ios') && (
        <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-[#15002B] border border-[#8A2BE2]/30 text-white shadow-sm transition-transform hover:scale-105">
          <Apple key="ios" className="w-4 h-4" />
        </div>
      )}
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
