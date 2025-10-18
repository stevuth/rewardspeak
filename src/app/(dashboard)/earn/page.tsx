
'use client';

import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { NotikOffer } from "@/lib/notik-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";
import { useState, useEffect } from "react";
import { OfferMilestoneModal } from "@/components/offer-milestone-modal";

type Offer = {
  id: string;
  title: string;
  partner: string;
  points: number;
  imageUrl: string;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
  description: string;
  countries: string[];
  platforms: string[];
  events?: { id: number; name: string; payout: number }[];
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined): Offer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  const payoutValue = notikOffer.payout_usd !== undefined ? notikOffer.payout_usd : notikOffer.payout;
  const points = Math.round(parseFloat(String(payoutValue)) * 100);

  return {
    id: notikOffer.offer_id,
    title: notikOffer.name,
    partner: notikOffer.network,
    points: points,
    imageUrl: notikOffer.image_url,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
    description: notikOffer.description,
    countries: notikOffer.countries,
    platforms: notikOffer.platforms,
    events: notikOffer.events,
  }
}

export default function ClimbAndEarnPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);

  useEffect(() => {
    const fetchOffersAndUser = async () => {
      // In a real client component, you'd use createBrowserClient, but for this structure, we'll fetch on server and pass down
      // This is a simplified fetch on client for demonstration
      const res = await fetch('/api/offers');
      const { offers: rawOffers, user } = await res.json();
      
      setUserId(user?.id);
      
      const transformed = rawOffers.map((offer: NotikOffer) => transformOffer(offer, user?.id));
      setOffers(transformed);
    };

    // We can't use top-level await in client components, so we create a server-side API route
    // to fetch the data and then call it from the client.
    // For now, let's pretend we have this API and populate the state.
    // This part is complex to refactor fully without a real API route.
    // We will simulate the data fetching.
    const getInitialData = async () => {
        const response = await fetch('/api/get-offers');
        const data = await response.json();
        const transformedOffers = data.rawOffers.map((o: NotikOffer) => transformOffer(o, data.user?.id));
        setOffers(transformedOffers);
    }
    getInitialData().catch(console.error);

  }, []);

  const gameOffers = offers.filter(o => o.category === "Game");
  const quickTasks = offers.filter(o => o.category !== "Game" && o.category !== "Survey").slice(0, 12);

  return (
    <div className="space-y-8">
      {selectedOffer && (
        <OfferMilestoneModal
          offer={selectedOffer}
          isOpen={!!selectedOffer}
          onClose={() => setSelectedOffer(null)}
        />
      )}
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
             {offers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {offers.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} onCardClick={() => setSelectedOffer(offer)} />
                    ))}
                </div>
             ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No popular offers right now. Check back soon!</p>
                    </CardContent>
                </Card>
             )}
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            {gameOffers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {gameOffers.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} onCardClick={() => setSelectedOffer(offer)} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No game offers available right now. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
          <TabsContent value="quick_tasks" className="mt-6">
            {quickTasks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {quickTasks.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} onCardClick={() => setSelectedOffer(offer)} />
                    ))}
                </div>
            ) : (
                 <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No quick tasks available right now. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
