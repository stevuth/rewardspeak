
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import type { NotikOffer } from "@/lib/notik-api";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

type Offer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined): Offer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  // Safely calculate total payout
  const totalPayout =
    Array.isArray(notikOffer.events) && notikOffer.events.length > 0
      ? notikOffer.events.reduce((sum, event) => sum + (event?.payout || 0), 0)
      : notikOffer.payout;
  
  const points = Math.round(totalPayout * 1000);

  return {
    ...notikOffer,
    payout: totalPayout, // Ensure the base payout reflects the total
    points: points,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
  }
}

export default function ClimbAndEarnPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [gameOffers, setGameOffers] = useState<Offer[]>([]);
  const [quickTasks, setQuickTasks] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/get-offers');
        if (!response.ok) {
          throw new Error('Failed to fetch offers');
        }
        const { rawOffers, user } = await response.json();
        const userId = user?.id;

        if (Array.isArray(rawOffers)) {
            const transformed = rawOffers.map((o: NotikOffer) => transformOffer(o, userId));
            setAllOffers(transformed);
            setGameOffers(transformed.filter((o) => o.category === "Game"));
            setQuickTasks(transformed.filter((o) => o.category === "App" || o.category === "Quiz"));
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, []);

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
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
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
      <PageHeader
        title="Climb & Earn"
        description="Main earning hub that leads to all available earning opportunities."
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search for offers..." className="pl-9" />
      </div>

      <section>
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="popular">Popular Offers</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="quick_tasks">Quick Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-6">
            {renderOfferGrid(allOffers, 'popular')}
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            {renderOfferGrid(gameOffers, 'game')}
          </TabsContent>
          <TabsContent value="quick_tasks" className="mt-6">
            {renderOfferGrid(quickTasks, 'quick task')}
          </TabsContent>
        </Tabs>
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
