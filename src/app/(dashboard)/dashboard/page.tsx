
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { offerWalls, popularOffers, user, type Offer } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { CheckCircle, ChevronRight, Clock, DollarSign, Users, Wallet } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
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
import { AnimatedCounter } from "@/components/animated-counter";
import { AuthToastProvider } from "@/components/auth/auth-toast-provider";
import { WelcomeBonusModal } from "@/components/welcome-bonus-modal";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const StatusBadge = ({ status }: { status: Offer["status"] }) => {
  if (status === "Completed") {
    return (
      <Badge className="bg-green-600/20 text-green-400 border-green-600/30 hover:bg-green-600/30">
        <CheckCircle className="mr-1 h-3 w-3" />
        Completed
      </Badge>
    );
  }
  return <Badge variant="secondary">{status}</Badge>;
};


export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);

  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowWelcomeModal(true);
    }
  }, [searchParams]);

  const surveyProviders = popularOffers.filter(
    (o) => o.category === "Survey"
  );
  
  const recentActivity = popularOffers
    .filter((o) => o.status === "Completed")
    .sort((a, b) => new Date(b.date!).getTime() - new Date(a.date!).getTime())
    .slice(0, 5);
    
  const totalAmountEarned = popularOffers
    .filter((o) => o.status === "Completed")
    .reduce((sum, o) => sum + o.points, 0) / 100;

  return (
    <div className="space-y-8">
      <AuthToastProvider />
      <WelcomeBonusModal isOpen={showWelcomeModal} onClose={() => setShowWelcomeModal(false)} />
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
                Popular Quests
              </h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/earn">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
            {popularOffers.length > 0 ? (
                <div className="space-y-4">
                {popularOffers.slice(0, 3).map((offer) => (
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
