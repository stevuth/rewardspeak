
"use client";

import { SafeImage } from "./safe-image";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function FeaturedOfferCard({ offer }: { offer: any }) {

    if (!offer) {
        return (
            <div className="relative w-full max-w-lg h-56 rounded-2xl bg-card border-2 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden flex items-center justify-center p-8 text-center">
                <p className="text-muted-foreground">Could not load a featured offer. Please check back later!</p>
            </div>
        );
    }

    const totalPoints = Math.round(offer.payout * 1000);

    return (
        <div className="relative w-full max-w-lg h-auto rounded-2xl bg-card border-2 border-primary/20 shadow-xl shadow-primary/10 overflow-hidden group">
            <div className="p-6 flex flex-col sm:flex-row items-center gap-6">
                <SafeImage
                    src={offer.image_url}
                    alt={offer.name}
                    width={128}
                    height={128}
                    className="rounded-xl border-4 border-primary/30 flex-shrink-0 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex-1 text-center sm:text-left">
                    <Badge variant="secondary" className="mb-2">Featured Offer</Badge>
                    <h3 className="text-xl font-bold font-headline text-foreground mb-1">{offer.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{offer.description}</p>
                    <div className="flex items-center justify-center sm:justify-start gap-4">
                        <div className="text-left">
                            <p className="text-xs text-muted-foreground">REWARD</p>
                            <p className="text-xl font-bold text-accent">{totalPoints.toLocaleString()} Pts</p>
                        </div>
                        <Button className="font-bold bg-accent text-accent-foreground hover:bg-accent/80">
                            Start Earning
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
