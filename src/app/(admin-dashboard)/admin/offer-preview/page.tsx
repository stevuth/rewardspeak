
'use client';

import { useState, useEffect, useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import type { NotikOffer } from "@/lib/notik-api";
import { useToast } from "@/hooks/use-toast";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { Loader2, Search, Eye } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";

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

export default function OfferPreviewPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [featuredOffers, setFeaturedOffers] = useState<Offer[]>([]);
  const [topConvertingOffers, setTopConvertingOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [idFilter, setIdFilter] = useState('');
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const fetchOffers = async () => {
      setIsLoading(true);
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id;

        const { data: config } = await supabase.from('site_config').select('value').eq('key', 'offer_payout_percentage').single();
        const payoutPercentage = config ? Number(config.value) : 100;

        const { data: rawAllOffers, error: allOffersError } = await supabase.from('all_offers').select('*').eq('is_disabled', false);
        if (allOffersError) throw allOffersError;
        if (Array.isArray(rawAllOffers)) {
            const transformed = rawAllOffers.map((o: NotikOffer) => transformOffer(o, userId, payoutPercentage));
            setAllOffers(transformed);
        }

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
            
            const transformed = featuredOffersData.map((o: NotikOffer) => transformOffer(o, userId, payoutPercentage));
            const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
            
            setFeaturedOffers(featuredIds.map((id: string) => offerMap.get(id)).filter(Boolean) as Offer[]);
            setTopConvertingOffers(topConvertingIds.map((id: string) => offerMap.get(id)).filter(Boolean) as Offer[]);
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

  const filteredAllOffers = useMemo(() => {
    return allOffers.filter(offer => {
        const idMatch = idFilter ? offer.offer_id.toLowerCase().includes(idFilter.toLowerCase()) : true;
        const nameMatch = nameFilter ? offer.name.toLowerCase().includes(nameFilter.toLowerCase()) : true;
        return idMatch && nameMatch;
    });
  }, [allOffers, idFilter, nameFilter]);


  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferCarousel = (offers: Offer[], sectionTitle: string) => {
    if (offers.length > 0) {
        return (
          <Carousel opts={{ align: "start" }} className="w-full">
            <CarouselContent>
              {offers.map(offer => (
                <CarouselItem key={offer.offer_id} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6">
                  <OfferGridCard offer={offer} onOfferClick={handleOfferClick} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute top-1/2 -translate-y-1/2 -left-4 hidden lg:flex" />
            <CarouselNext className="absolute top-1/2 -translate-y-1/2 -right-4 hidden lg:flex" />
          </Carousel>
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

  const renderOfferGrid = (offers: Offer[]) => {
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
                <p className="text-muted-foreground">No offers found for the current filters.</p>
            </CardContent>
        </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12 h-96">
        <WavingMascotLoader text="Loading Previews..." />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Offer Preview"
        description={`This is how offers are displayed to users. Total enabled offers available: ${allOffers.length}.`}
        icon={Eye}
      />
      
       <section>
          <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
              Featured Offers Preview
          </h2>
          {renderOfferCarousel(featuredOffers, "Featured Offers")}
      </section>

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          Top Converting Offers Preview
        </h2>
        {renderOfferCarousel(topConvertingOffers, "Top Converting Offers")}
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight font-headline">
            All Enabled Offers Preview
            </h2>
            <span className="text-sm text-muted-foreground">
                Showing {filteredAllOffers.length} of {allOffers.length} offers
            </span>
        </div>
        <Card className="mb-6">
            <CardHeader>
                <CardTitle>Filter All Offers</CardTitle>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="id-filter">Filter by Offer ID</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="id-filter"
                            placeholder="Search by ID..."
                            value={idFilter}
                            onChange={(e) => setIdFilter(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="name-filter">Filter by Offer Name</Label>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            id="name-filter"
                            placeholder="Search by name..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
        {renderOfferGrid(filteredAllOffers)}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
