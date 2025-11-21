
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [sortFilter, setSortFilter] = useState('created_at-desc');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalOfferLimit, setTotalOfferLimit] = useState(1000);
  const { toast } = useToast();

  const fetchOffers = useCallback(async (pageNum: number, isNewSearch: boolean = false, silent: boolean = false) => {
    if (pageNum === 1 && !silent) {
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
        .or(`countries.cs.["ALL"],countries.cs.["${userCountry}"]`);

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      const [sortColumn, sortOrder] = sortFilter.split('-');
      query = query.order(sortColumn, { ascending: sortOrder === 'asc' });

      const { data: rawAllOffers, error: allOffersError } = await query.range(from, to);

      if (allOffersError) throw allOffersError;

      const transformedOffers = (rawAllOffers || []).map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));

      setAllOffers(prev => {
        const combined = isNewSearch ? transformedOffers : [...prev, ...transformedOffers];
        const uniqueMap = new Map();
        combined.forEach(offer => {
          if (!uniqueMap.has(offer.offer_id)) {
            uniqueMap.set(offer.offer_id, offer);
          }
        });
        return Array.from(uniqueMap.values());
      });

      const totalFetched = isNewSearch ? transformedOffers.length : allOffers.length + transformedOffers.length;
      if (transformedOffers.length < OFFERS_PER_PAGE || totalFetched >= currentTotalLimit) {
        setHasMore(false);
      }

    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
        variant: "destructive",
        title: "Can't Load Offers",
        description: "Our map is a bit foggy right now. Please try again in a moment.",
      });
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [searchQuery, sortFilter, toast, allOffers.length]);

  useEffect(() => {
    setAllOffers([]);
    setPage(1);
    setHasMore(true);
    fetchOffers(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortFilter]);

  // Real-time listener for offer updates
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const channel = supabase.channel('realtime:all_offers')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'all_offers' }, (payload) => {
        console.log('Change received!', payload);
        // Silent update: refresh the list without clearing it or showing a toast
        setPage(1);
        setHasMore(true);
        fetchOffers(1, true, true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, sortFilter]);

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

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-offers"
              placeholder="Search for offers..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-auto flex items-center gap-4">
            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger id="sort-filter" className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at-desc">Newest</SelectItem>
                <SelectItem value="payout-desc">Highest Reward</SelectItem>
                <SelectItem value="payout-asc">Lowest Reward</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>


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
