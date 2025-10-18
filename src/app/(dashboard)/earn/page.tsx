import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Metadata } from "next";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { getOffers, type NotikOffer } from "@/lib/notik-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export const metadata: Metadata = {
  title: "Climb & Earn",
  description: "Main earning hub that leads to all available earning opportunities.",
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined): any {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  // Determine the primary payout value
  const payoutValue = notikOffer.payout_usd !== undefined ? notikOffer.payout_usd : notikOffer.payout;
  const points = Math.round(parseFloat(String(payoutValue)) * 100);

  return {
    id: notikOffer.offer_id,
    title: notikOffer.name,
    partner: notikOffer.network,
    points: points,
    imageUrl: notikOffer.image_url,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game", // Simplified category
    clickUrl: clickUrl,
    description: notikOffer.description,
    countries: notikOffer.countries,
    platforms: notikOffer.platforms,
  }
}

export default async function ClimbAndEarnPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const rawOffers = await getOffers();
  
  const popularOffers = rawOffers.map(offer => transformOffer(offer, user?.id));

  const gameOffers = popularOffers.filter(o => o.category === "Game");
  const quickTasks = popularOffers.filter(o => o.category !== "Game" && o.category !== "Survey").slice(0, 12); // Example, adjust as needed

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
             {popularOffers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {popularOffers.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} />
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
                        <OfferGridCard key={offer.id} offer={offer} />
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
                        <OfferGridCard key={offer.id} offer={offer} />
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
