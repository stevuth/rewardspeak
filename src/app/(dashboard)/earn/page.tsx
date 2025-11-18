
'use client';

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import type { NotikOffer } from "@/lib/notik-api";
import { useToast } from "@/hooks/use-toast";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
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

const OFFERS_PER_PAGE = 30;

export default function EarnPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalOfferLimit, setTotalOfferLimit] = useState(1000);
  const { toast } = useToast();

  const fetchOffers = useCallback(async (pageNum: number, isNewSearch: boolean = false) => {
    if (pageNum === 1) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    
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
        
        const { data: limitConfig } = await supabase.from('site_config').select('value').eq('key', 'offer_display_limit').single();
        const currentTotalLimit = limitConfig ? Number(limitConfig.value) : 1000;
        setTotalOfferLimit(currentTotalLimit);

        const from = (pageNum - 1) * OFFERS_PER_PAGE;
        // Do not fetch more than the total limit
        if (from >= currentTotalLimit) {
            setHasMore(false);
            setIsLoading(false);
            setIsLoadingMore(false);
            return;
        }

        const to = Math.min(from + OFFERS_PER_PAGE - 1, currentTotalLimit - 1);


        let query = supabase
            .from('all_offers')
            .select('*', { count: 'exact' })
            .eq('is_disabled', false)
            .not('description', 'is', null)
            .neq('description', '')
            .neq('description', 'name')
            .or(`countries.cs.["ALL"],countries.cs.["${userCountry}"]`)
            .order('created_at', { ascending: false })
            .range(from, to);

        if (searchQuery) {
            query = query.ilike('name', `%${searchQuery}%`);
        }

        const { data: rawAllOffers, error: allOffersError } = await query;

        if (allOffersError) throw allOffersError;
        
        const transformedOffers = (rawAllOffers || []).map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));
        
        setAllOffers(prev => {
            if (isNewSearch) {
                return transformedOffers;
            }
            const existingIds = new Set(prev.map(o => o.offer_id));
            const newOffers = transformedOffers.filter(o => !existingIds.has(o.offer_id));
            return [...prev, ...newOffers];
        });
        
        const totalFetched = isNewSearch ? transformedOffers.length : allOffers.length + transformedOffers.length;
        if (transformedOffers.length < OFFERS_PER_PAGE || totalFetched >= currentTotalLimit) {
            setHasMore(false);
        }

    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
          variant: "destructive",
          title: "Error fetching offers",
          description: "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, toast, allOffers.length]);

  useEffect(() => {
    setAllOffers([]);
    setPage(1);
    setHasMore(true);
    fetchOffers(1, true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]); // fetchOffers is memoized, only re-run when searchQuery changes.

  const handleLoadMore = () => {
    if (!isLoadingMore && hasMore) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchOffers(nextPage);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 500) {
            handleLoadMore();
        }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore, hasMore, page]); 

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferGrid = (offers: Offer[]) => {
    if (isLoading && offers.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center py-12 gap-2 h-96">
                <WavingMascotLoader text="Finding the best offers..." />
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

    if (!isLoading && offers.length === 0) {
        return (
            <Card className="text-center py-12">
                <CardContent>
                    <p className="text-muted-foreground">No offers found. Try a different search!</p>
                </CardContent>
            </Card>
        );
    }
    
    return null;
  };

  return (
    <div className="space-y-8">
      <PageHeader
        description="Main earning hub that leads to all available earning opportunities."
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search for offers..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight font-headline">
            All Offers
          </h2>
        </div>
        {renderOfferGrid(allOffers)}
        {isLoadingMore && (
             <div className="flex justify-center items-center py-8">
                <WavingMascotLoader text="Loading more..." />
             </div>
        )}
        {!hasMore && allOffers.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
                <p>You've reached the end of the offers!</p>
            </div>
        )}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
