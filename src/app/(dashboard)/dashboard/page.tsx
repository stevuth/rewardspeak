
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { WelcomeBonusModal } from "@/components/welcome-bonus-modal";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { NotikOffer } from "@/lib/notik-api";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import { OfferPreviewModal } from "@/components/offer-preview-modal";
import { OfferGridCard } from "@/components/offer-grid-card";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";
import { LoginSuccessModal } from "@/components/login-success-modal";
import type { User } from "@supabase/supabase-js";

type DashboardOffer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined, payoutPercentage: number): DashboardOffer {
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

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [featuredOffers, setFeaturedOffers] = useState<DashboardOffer[]>([]);
  const [topConvertingOffers, setTopConvertingOffers] = useState<DashboardOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOffer, setSelectedOffer] = useState<DashboardOffer | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
        setIsLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

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

        const { data: featuredContent } = await supabase.from('featured_content').select('content_type, offer_ids');
        const featuredIds = featuredContent?.find(c => c.content_type === 'featured_offers')?.offer_ids || [];
        const topConvertingIds = featuredContent?.find(c => c.content_type === 'top_converting_offers')?.offer_ids || [];
        
        if (featuredIds.length > 0) {
            const { data: offersData, error } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', featuredIds)
                .eq('is_disabled', false)
                .not('description', 'is', null)
                .neq('description', '')
                .neq('description', 'name')
                .or(`countries.cs.["ALL"],countries.cs.["${userCountry}"]`);

            if (error) {
                console.error("Error fetching featured dashboard offers:", error);
            } else {
                const transformed = offersData.map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));
                const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
                setFeaturedOffers(featuredIds.map((id: string) => offerMap.get(id)).filter(Boolean) as DashboardOffer[]);
            }
        }

        if (topConvertingIds.length > 0) {
            const { data: offersData, error } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', topConvertingIds)
                .eq('is_disabled', false)
                .not('description', 'is', null)
                .neq('description', '')
                .neq('description', 'name')
                .or(`countries.cs.["ALL"],countries.cs.["${userCountry}"]`);

            if (error) {
                console.error("Error fetching top converting dashboard offers:", error);
            } else {
                const transformed = offersData.map((o: NotikOffer) => transformOffer(o, user?.id, payoutPercentage));
                const offerMap = new Map(transformed.map(o => [o.offer_id, o]));
                setTopConvertingOffers(topConvertingIds.map((id: string) => offerMap.get(id)).filter(Boolean) as DashboardOffer[]);
            }
        }

        setIsLoading(false);
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const event = searchParams.get('event');
    
    if (searchParams.get('verified') === 'true') {
      setShowWelcomeModal(true);
    } else if (event === 'login') {
        setShowLoginModal(true);
    }
    
    const paramsExist = event || searchParams.has('verified');
    if (paramsExist) {
        setTimeout(() => {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }, 100);
    }

  }, [searchParams]);
    
  const handleOfferClick = (offer: DashboardOffer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferCarousel = (offers: DashboardOffer[], sectionTitle: string) => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12 h-64">
          <WavingMascotLoader text="Finding Offers..." />
        </div>
      );
    }
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
          <p className="text-muted-foreground">No {sectionTitle.toLowerCase()} right now. Check back soon!</p>
        </CardContent>
      </Card>
    );
  };

  const recentActivity: any[] = []; // This needs to be connected to real data
  const userName = user?.email?.split('@')[0];
  const welcomeMessage = userName ? `Welcome back, ${userName}!` : 'Welcome back!';

  return (
    <div className="space-y-8">
      <WelcomeBonusModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
      <LoginSuccessModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} />
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
      <PageHeader
        title="Peak Dashboard"
        description={welcomeMessage}
      />
      
      <div className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight font-headline">
                Featured Offers
            </h2>
          </div>
          {renderOfferCarousel(featuredOffers, "Featured Offers")}
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold tracking-tight font-headline">
              Top Converting Offers
            </h2>
          </div>
          {renderOfferCarousel(topConvertingOffers, "Top Converting Offers")}
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest completed quests.</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
               <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Quest</TableHead>
                    <TableHead className="hidden sm:table-cell">Partner</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                            <div className="font-medium">{offer.name}</div>
                            <div className="text-xs text-muted-foreground sm:hidden">{offer.network}</div>
                        </TableCell>
                         <TableCell className="hidden sm:table-cell">{offer.network}</TableCell>
                         <TableCell className="hidden md:table-cell">{new Date().toLocaleDateString()}</TableCell>
                        <TableCell
                          className={cn("text-right font-bold", "text-secondary")}
                        >
                          +
                          {offer.points.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center h-24">
                        No recent activity.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
