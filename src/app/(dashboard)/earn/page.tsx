
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, RefreshCw } from "lucide-react";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import type { NotikOffer } from "@/lib/notik-api";
import { syncOffers } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

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

  // The payout is now consistently a number from the API handler
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
  const [gameOffers, setGameOffers] = useState<Offer[]>([]);
  const [quickTasks, setQuickTasks] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/get-offers');
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const { allOffers: rawAllOffers, topOffers: rawTopOffers, user } = data;
      const userId = user?.id;

      if (Array.isArray(rawAllOffers)) {
          const transformed = rawAllOffers.map((o: NotikOffer) => transformOffer(o, userId));
          setAllOffers(transformed);
      } else {
          setAllOffers([]);
      }

      if (Array.isArray(rawTopOffers)) {
          const transformed = rawTopOffers.map((o: NotikOffer) => transformOffer(o, userId));
          setGameOffers(transformed.filter((o) => o.category === "Game"));
          setQuickTasks(transformed.filter((o) => o.category === "App" || o.category === "Quiz"));
      } else {
          setGameOffers([]);
          setQuickTasks([]);
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
        <Tabs defaultValue="all_offers" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="all_offers">All offers</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="quick_tasks">Quick Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="all_offers" className="mt-6">
            {renderOfferGrid(allOffers, 'offer')}
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
