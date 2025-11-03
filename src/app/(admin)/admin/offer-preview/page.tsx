
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import type { NotikOffer } from "@/lib/notik-api";
import { useToast } from "@/hooks/use-toast";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";

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

export default function OfferPreviewPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
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
        const userId = user?.id;

        // Fetch all offers for the main grid
        const { data: rawAllOffers, error: allOffersError } = await supabase.from('all_offers').select('*');
        if (allOffersError) throw allOffersError;
        if (Array.isArray(rawAllOffers)) {
            const transformed = rawAllOffers.map((o: NotikOffer) => transformOffer(o, userId));
            setAllOffers(transformed);
        }

        // Fetch featured content IDs
        const { data: featuredContent, error: featuredContentError } = await supabase.from('featured_content').select('content_type, offer_ids');
        if (featuredContentError) throw featuredContentError;

        const featuredIds = featuredContent?.find(c => c.content_type === 'featured_offers')?.offer_ids || [];
        const topConvertingIds = featuredContent?.find(c => c.content_type === 'top_converting_offers')?.offer_ids || [];
        const allFeaturedIds = [...new Set([...featuredIds, ...topConvertingIds])];

        if (allFeaturedIds.length > 0) {
            const { data: featuredOffersData, error: featuredOffersError } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', allFeaturedIds);

            if (featuredOffersError) throw featuredOffersError;
            
            const transformed = featuredOffersData.map((o: NotikOffer) => transformOffer(o, userId));
            const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
            
            setFeaturedOffers(featuredIds.map((id: string) => offerMap.get(id)).filter(Boolean));
            setTopConvertingOffers(topConvertingIds.map((id: string) => offerMap.get(id)).filter(Boolean));
        }

      } catch (error) {
        console.error("Error fetching offers for preview:", error);
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
  
  const renderOfferGrid = (offers: Offer[], sectionTitle: string) => {
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
                <p className="text-muted-foreground">{sectionTitle} section is empty. Add IDs in "Featured Content".</p>
            </CardContent>
        </Card>
    );
  };

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
        title="Offer Preview"
        description={`This is how offers are displayed to users. Total offers available: ${allOffers.length}.`}
      />
      
       <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
              Featured Offers Preview
          </h2>
          {renderOfferGrid(featuredOffers, "Featured Offers")}
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          Top Converting Offers Preview
        </h2>
        {renderOfferGrid(topConvertingOffers, "Top Converting Offers")}
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          All Offers Preview
        </h2>
        {renderOfferGrid(allOffers, "All Offers")}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
