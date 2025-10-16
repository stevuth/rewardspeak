

'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { type Offer } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy, limit } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


const RecentActivitySkeleton = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Quest</TableHead>
          <TableHead className="text-right">Points</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {[...Array(3)].map((_, i) => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-3 w-20" />
            </TableCell>
            <TableCell className="text-right">
              <Skeleton className="h-4 w-12 ml-auto" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
);

const FeaturedPartnersSkeleton = () => (
    <div className="flex space-x-4">
        {[...Array(4)].map((_, i) => (
            <div key={i} className="w-1/4">
                 <Card className="overflow-hidden text-center flex flex-col items-center justify-center p-4 h-full">
                    <Skeleton className="h-14 w-14 rounded-lg mb-2" />
                    <Skeleton className="h-4 w-20 mt-1" />
                </Card>
            </div>
        ))}
    </div>
);

const PopularQuestsSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <Card key={i} className="p-3">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-16 w-16 rounded-lg" />
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div>
                            <Skeleton className="h-4 w-40 mb-2" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                         <div className="flex items-center justify-between gap-4">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-9 w-24" />
                        </div>
                    </div>
                </div>
            </Card>
        ))}
    </div>
)


export default function DashboardPage() {
  const firestore = useFirestore();

  const offerWallsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'offer-walls');
  }, [firestore]);

  const popularOffersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, "offers"),
      where("isPopular", "==", true),
      limit(3)
    );
  }, [firestore]);

  const recentActivityQuery = useMemoFirebase(() => {
      if (!firestore) return null;
      return query(
          collection(firestore, "offers"), // Assuming completed offers are in 'offers' with a status
          where("status", "==", "Completed"),
          orderBy("date", "desc"),
          limit(5)
      )
  }, [firestore]);

  const { data: offerWalls, isLoading: isLoadingOfferWalls } = useCollection(offerWallsQuery);
  const { data: popularOffers, isLoading: isLoadingPopularOffers } = useCollection<Offer>(popularOffersQuery);
  const { data: recentActivity, isLoading: isLoadingRecentActivity } = useCollection<Offer>(recentActivityQuery);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Peak Dashboard"
        description="Welcome back! Here's a look at your recent activity."
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
            <div>
            <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
                Featured Partners
            </h2>
            {isLoadingOfferWalls ? <FeaturedPartnersSkeleton /> : (
                <Carousel
                opts={{
                    align: "start",
                    loop: false,
                }}
                className="w-full"
                >
                <CarouselContent>
                    {offerWalls?.map((wall) => (
                    <CarouselItem
                        key={wall.id}
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
            )}
          </div>
            <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold tracking-tight font-headline">
                Popular Quests
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/earn">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {isLoadingPopularOffers ? <PopularQuestsSkeleton /> : (
                 popularOffers && popularOffers.length > 0 ? (
                    <div className="space-y-4">
                    {popularOffers.map((offer) => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))}
                    </div>
                ) : (
                    <Card className="text-center py-12 col-span-full">
                    <CardContent>
                        <p className="text-muted-foreground">
                        No popular quests right now. Check back soon!
                        </p>
                    </CardContent>
                    </Card>
                )
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
               {isLoadingRecentActivity ? <RecentActivitySkeleton /> : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Quest</TableHead>
                        <TableHead className="text-right">Points</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {recentActivity && recentActivity.length > 0 ? (
                        recentActivity.map((offer) => (
                        <TableRow key={offer.id}>
                            <TableCell>
                                <div className="font-medium">{offer.title}</div>
                                <div className="text-xs text-muted-foreground">{offer.partner}</div>
                            </TableCell>
                            <TableCell
                            className={cn("text-right font-bold", "text-primary")}
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
               )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
