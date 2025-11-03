
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
        <path d="M30,3H2v13h2V5c0-1.1,0.9-2,2-2h2c1.3,0,2.5,0.5,3.4,1.4l0.4,0.4c-1.2,1.3-2,3-2.4,4.8L6.4,13.1C5,12.5,4,11.4,4,10V5 c0-0.6-0.4-1-1-1S2,4.4,2,5v8h2v2H2v8c0,0.6,0.4,1,1,1s1-0.4,1-1v-5h20v5c0,0.6,0.4,1,1,1s1-0.4,1-1v-8h-2v-2h2V8 c0-0.6-0.4-1-1-1s-1,0.4-1,1v5h-2.1c-0.5-2.2-0.1-4.5,1-6.4l0.4-0.4C26.1,4.3,27.7,3.4,29.4,3H30z"/>
    </svg>
);


const PlatformIcons = ({ platforms }: { platforms?: string[] }) => {
  if (!platforms || platforms.length === 0) return null;

  const uniqueIcons = new Set<string>();
  platforms.forEach(p => {
    const platform = p.toLowerCase();
    if (platform.includes('android')) uniqueIcons.add('android');
    if (platform.includes('ios')) uniqueIcons.add('ios');
    if (platform.includes('desktop') || platform.includes('web')) uniqueIcons.add('desktop');
  });

  if (uniqueIcons.size === 0) return null;

  return (
    <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white rounded-full px-2 py-1">
      {Array.from(uniqueIcons).map(iconKey => {
         switch (iconKey) {
            case 'desktop': return <Monitor key="desktop" className="w-4 h-4" />;
            case 'android': return <AndroidIcon key="android" className="w-4 h-4" />;
            case 'ios': return <Apple key="ios" className="w-4 h-4" />;
            default: return null;
         }
      })}
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
                 <PlatformIcons platforms={offer.platforms} />
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
