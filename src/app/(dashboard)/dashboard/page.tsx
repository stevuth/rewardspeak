
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { offerWalls, user, type Offer } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import { cn } from "@/lib/utils";
import { WelcomeBonusModal } from "@/components/welcome-bonus-modal";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { showLoginToast } from "@/lib/reward-toast";
import { NotikOffer } from "@/lib/notik-api";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

type DashboardOffer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined): DashboardOffer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }
  const points = Math.round((notikOffer.payout || 0) * 1000);
  return {
    ...notikOffer,
    points: points,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
  }
}

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [featuredOffers, setFeaturedOffers] = useState<DashboardOffer[]>([]);
  const [topConvertingOffers, setTopConvertingOffers] = useState<DashboardOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
        setIsLoading(true);
        const supabase = createSupabaseBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Fetch IDs
        const { data: featuredContent } = await supabase.from('featured_content').select('content_type, offer_ids');
        const featuredIds = featuredContent?.find(c => c.content_type === 'featured_offers')?.offer_ids || [];
        const topConvertingIds = featuredContent?.find(c => c.content_type === 'top_converting_offers')?.offer_ids || [];
        const allIds = [...new Set([...featuredIds, ...topConvertingIds])];
        
        // Fetch offers based on IDs
        if (allIds.length > 0) {
            const { data: offersData, error } = await supabase
                .from('all_offers')
                .select('*')
                .in('offer_id', allIds);

            if (error) {
                console.error("Error fetching dashboard offers:", error);
            } else {
                const transformed = offersData.map(o => transformOffer(o as NotikOffer, user?.id));
                setFeaturedOffers(transformed.filter(o => featuredIds.includes(o.offer_id)));
                setTopConvertingOffers(transformed.filter(o => topConvertingIds.includes(o.offer_id)));
            }
        }
        setIsLoading(false);
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    const event = searchParams.get('event');
    const userEmail = searchParams.get('user_email');
    
    if (searchParams.get('verified') === 'true') {
      setShowWelcomeModal(true);
    } else if (event === 'login') {
        showLoginToast(userEmail);
    }
    
    const paramsExist = event || searchParams.has('verified') || searchParams.has('user_email');
    if (paramsExist) {
        setTimeout(() => {
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }, 100);
    }

  }, [searchParams]);
    
  const recentActivity: Offer[] = []; // This needs to be connected to real data

  return (
    <div className="space-y-8">
      <WelcomeBonusModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
      <PageHeader
        title="Peak Dashboard"
        description="Welcome back! Here's a look at your recent activity."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div>
            <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
                Featured Offers
            </h2>
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent>
                {offerWalls.map((wall) => (
                  <CarouselItem
                    key={wall.name}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4"
                  >
                    <Card className="overflow-hidden text-center flex flex-col items-center justify-center p-4 h-full bg-card hover:bg-muted/50 transition-colors">
                      <Image
                        src={wall.logo}
                        alt={`${wall.name} logo`}
                        width={56}
                        height={56}
                        className="rounded-lg mb-2"
                        data-ai-hint={wall.hint}
                      />
                      <span className="text-sm font-medium mt-1">{wall.name}</span>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 hidden lg:flex" />
              <CarouselNext className="-right-4 hidden lg:flex" />
            </Carousel>
          </div>
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight font-headline">
                Top Converting Offers
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/earn">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {isLoading ? (
                 <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : topConvertingOffers.length > 0 ? (
                <div className="space-y-4">
                {topConvertingOffers.slice(0, 3).map((offer) => (
                    <OfferCard key={offer.offer_id} offer={offer} />
                ))}
                </div>
            ) : (
                <Card className="text-center py-12 col-span-full">
                  <CardContent>
                    <p className="text-muted-foreground">
                      No top offers right now. Check back soon!
                    </p>
                  </CardContent>
                </Card>
            )}
          </div>
        </div>

        <div className="space-y-8">
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
                    <TableHead className="text-right">Points</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivity.length > 0 ? (
                    recentActivity.map((offer) => (
                      <TableRow key={offer.id}>
                        <TableCell>
                            <div className="font-medium">{offer.title}</div>
                            <div className="text-xs text-muted-foreground">{offer.partner}</div>
                        </TableCell>
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
                      <TableCell colSpan={2} className="text-center h-24">
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
