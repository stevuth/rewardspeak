
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { OfferGridCard } from "@/components/offer-grid-card";
import type { NotikOffer } from "@/lib/notik-api";
import { useToast } from "@/hooks/use-toast";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Offer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined, payoutPercentage: number): Offer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  const percentage = payoutPercentage / 100;
  const markedUpPayout = Number(notikOffer.payout || 0) * percentage;
  
  const points = Math.round(markedUpPayout * 1000);

  const markedUpEvents = notikOffer.events?.map(event => ({
    ...event,
    payout: Number(event.payout || 0) * percentage,
  }));

  return {
    ...notikOffer,
    payout: markedUpPayout,
    events: markedUpEvents,
    points: points,
    imageHint: "offer logo",
    category: notikOffer.categories?.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
  }
}

export default function SpecialOffersPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([]);
  const [topConvertingOffers, setTopConvertingOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        let userCountry = 'US'; // Default to US if not found
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('country_code')
            .eq('user_id', user.id)
            .single();
          if (profile && profile.country_code) {
            userCountry = profile.country_code;
          }
        }

        const { data: config } = await supabase.from('site_config').select('value').eq('key', 'offer_payout_percentage').single();
        const payoutPercentage = config ? Number(config.value) : 100;

        const { data: featuredContent, error: featuredContentError } = await supabase.from('featured_content').select('content_type, offer_ids');
        if (featuredContentError) throw featuredContentError;

        const featuredIds = featuredContent?.find(c => c.content_type === 'featured_offers')?.offer_ids || [];
        const topConvertingIds = featuredContent?.find(c => c.content_type === 'top_converting_offers')?.offer_ids || [];
        
        if (featuredIds.length > 0) {
            const { data: offersData, error } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', featuredIds)
                .eq('is_disabled', false)
                .or(`countries.cs.{"ALL"},countries.cs.{"${userCountry}"}`);

            if (error) {
                console.error("Error fetching featured offers:", error);
            } else {
                const transformed = offersData.map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));
                const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
                setFeaturedOffers(featuredIds.map((id: string) => offerMap.get(id)).filter(Boolean) as Offer[]);
            }
        }
        
        if (topConvertingIds.length > 0) {
            const { data: offersData, error } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', topConvertingIds)
                .eq('is_disabled', false)
                .or(`countries.cs.{"ALL"},countries.cs.{"${userCountry}"}`);

            if (error) {
                console.error("Error fetching top converting offers:", error);
            } else {
                const transformed = offersData.map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));
                const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
                setTopConvertingOffers(topConvertingIds.map((id: string) => offerMap.get(id)).filter(Boolean) as Offer[]);
            }
        }


      } catch (error) {
        console.error("Error fetching special offers:", error);
        toast({
            variant: "destructive",
            title: "Error fetching offers",
            description: error instanceof Error ? error.message : "An unknown error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [toast]);

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferGrid = (offers: Offer[], title: string) => {
     if (offers.length > 0) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {offers.map((offer, index) => (
                  <OfferGridCard key={`${offer.offer_id}-${index}`} offer={offer} onOfferClick={handleOfferClick} />
                ))}
            </div>
        );
    }

    return (
        <Card className="text-center py-12">
            <CardContent>
                <p className="text-muted-foreground">No {title.toLowerCase()} are available right now.</p>
            </CardContent>
        </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Special Offers"
        description="Hand-picked offers and top-performing tasks just for you."
      />
      
       <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
              Featured Offers
          </h2>
          {renderOfferGrid(featuredOffers, "Featured Offers")}
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          Top Converting Offers
        </h2>
        {renderOfferGrid(topConvertingOffers, "Top Converting Offers")}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
