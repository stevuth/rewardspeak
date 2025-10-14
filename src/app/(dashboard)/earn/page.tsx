import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { offerWalls, popularOffers, quickTasks } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";


export const metadata: Metadata = {
  title: "Earn Points",
  description: "Browse offers and tasks to earn points.",
};

export default function EarnPage() {
    const surveyProviders = popularOffers.filter(o => o.category === "Survey");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Find Quests to Earn"
        description="Choose from a variety of ways to earn."
      />

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
                className="basis-1/3 md:basis-1/4 lg:basis-1/6"
              >
                <Card className="overflow-hidden text-center flex flex-col items-center justify-center p-4 h-full bg-card hover:bg-muted/50 transition-colors">
                  <Image
                    src={wall.logo}
                    alt={`${wall.name} logo`}
                    width={48}
                    height={48}
                    className="rounded-lg mb-2"
                    data-ai-hint={wall.hint}
                  />
                  <span className="text-xs font-medium">{wall.name}</span>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4 hidden md:flex" />
          <CarouselNext className="-right-4 hidden md:flex" />
        </Carousel>
      </div>

       <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight font-headline">
            Survey Providers
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {surveyProviders.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
           {surveyProviders.length === 0 && (
            <Card className="text-center py-12 col-span-full">
              <CardContent>
                <p className="text-muted-foreground">
                  No surveys available right now. Check back soon!
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <section>
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="popular">Popular Offers</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="quick_tasks">Quick Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-6">
             <div className="space-y-4">
                {popularOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
             </div>
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            <div className="space-y-4">
                {popularOffers.filter(o => o.category === "Game").map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            {popularOffers.filter(o => o.category === "Game").length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No game offers available right now. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
          <TabsContent value="quick_tasks" className="mt-6">
            <div className="space-y-4">
                {quickTasks.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
