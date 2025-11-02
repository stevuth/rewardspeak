
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import type { NotikOffer } from "@/lib/notik-api";
import { syncOffers } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Offer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

const offerwalls = [
    {
        slug: "timewall",
        name: "TimeWall",
        description: "Complete tasks, surveys, and more to earn points.",
        logoUrl: "https://timewall.io/img/timewall_logo_on_dark.png",
        logoHint: "timewall logo",
        bgColor: "bg-green-500"
    },
    {
        slug: "theoremreach",
        name: "TheoremReach",
        description: "High-quality surveys for direct rewards.",
        logoUrl: "https://publishers.theoremreach.com/packs/images/logo-icon-4027a12eb2c56c5b9ca470636aa023c7.svg",
        logoHint: "theoremreach logo",
        bgColor: "bg-blue-500"
    }
]

const OfferwallCard = ({ wall }: { wall: typeof offerwalls[0] }) => (
    <Link href={`/offerwalls/${wall.slug}`} className="block group">
        <Card className={cn("relative overflow-hidden h-48 flex flex-col items-center justify-center text-white transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:shadow-xl", wall.bgColor)}>
            <Image
                src={wall.logoUrl}
                alt={`${wall.name} logo`}
                width={120}
                height={60}
                className="object-contain"
                data-ai-hint={wall.logoHint}
            />
            <div className="absolute bottom-4">
                 <div className="bg-black/20 text-white text-xs font-semibold px-4 py-1.5 rounded-md backdrop-blur-sm">
                    {wall.name}
                 </div>
            </div>
        </Card>
    </Link>
);


function transformOffer(notikOffer: NotikOffer, userId: string | undefined): Offer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  const totalPayout = notikOffer.payout || 0;
  
  const points = Math.round(totalPayout * 1000);

  return {
    ...notikOffer,
    payout: totalPayout,
    points: points,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
  }
}

export default function ClimbAndEarnPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const notikResponse = await fetch('/api/get-offers');

      if (!notikResponse.ok) {
        throw new Error('Failed to fetch Notik offers');
      }

      const notikData = await notikResponse.json();
      
      if (notikData.error) throw new Error(notikData.error);

      const { allOffers: rawAllOffers, user } = notikData;
      const userId = user?.id;

      let transformedNotikOffers: Offer[] = [];
      if (Array.isArray(rawAllOffers)) {
          transformedNotikOffers = rawAllOffers.map((o: NotikOffer) => transformOffer(o, userId));
          setAllOffers(transformedNotikOffers);
      } else {
          setAllOffers([]);
      }

    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
          variant: "destructive",
          title: "Error fetching offers",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleSyncOffers = async () => {
    setIsSyncing(true);
    toast({ title: "Syncing offers...", description: "Fetching the latest offers from our partners." });

    const result = await syncOffers();
    
    if (result.success) {
        toast({ title: "Sync complete!", description: "Offers have been updated successfully." });
        // Refetch offers from our DB after sync
        await fetchOffers();
    } else {
        toast({
            variant: "destructive",
            title: "Sync failed",
            description: result.error || "An unknown error occurred during sync.",
        });
    }
    
    setIsSyncing(false);
  };

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferGrid = (offers: Offer[], type: string) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Image
                    src="/logo.png?v=9"
                    alt="Loading..."
                    width={80}
                    height={80}
                    className="animate-pulse"
                />
            </div>
        );
    }

    if (offers.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {offers.map((offer) => (
                    <OfferGridCard key={offer.offer_id} offer={offer} onOfferClick={handleOfferClick} />
                ))}
            </div>
        );
    }

    return (
        <Card className="text-center py-12">
            <CardContent>
                <p className="text-muted-foreground">No {type} offers right now. Check back soon!</p>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <PageHeader
          title="Climb & Earn"
          description="Main earning hub that leads to all available earning opportunities."
        />
        <Button onClick={handleSyncOffers} disabled={isSyncing}>
          <RefreshCw className={`mr-2 h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync Offers'}
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search for offers..." className="pl-9" />
      </div>

       <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          Offer Providers
        </h2>
         <Carousel
            opts={{
              align: "start",
            }}
            className="w-full"
          >
            <CarouselContent>
              {offerwalls.map((wall) => (
                <CarouselItem key={wall.slug} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                  <OfferwallCard wall={wall} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 hidden lg:flex" />
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 hidden lg:flex" />
          </Carousel>
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          All Offers
        </h2>
        {renderOfferGrid(allOffers, 'offer')}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
