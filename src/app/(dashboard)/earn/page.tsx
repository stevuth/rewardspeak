import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import { offerWalls, popularOffers, quickTasks } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import type { Metadata } from "next";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


export const metadata: Metadata = {
  title: "Climb & Earn",
  description: "Main earning hub that leads to all available earning opportunities.",
};

export default function ClimbAndEarnPage() {
    const surveyProviders = popularOffers.filter(o => o.category === "Survey");
    const gameOffers = popularOffers.filter(o => o.category === "Game");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Climb & Earn"
        description="Main earning hub that leads to all available earning opportunities."
      />
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search for offers..." className="pl-9" />
      </div>

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
                className="basis-1/2 md:basis-1/3 lg:basis-1/5"
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

      <section>
        <Tabs defaultValue="popular" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="popular">Popular Offers</TabsTrigger>
            <TabsTrigger value="games">Games</TabsTrigger>
            <TabsTrigger value="quick_tasks">Quick Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-6">
             {popularOffers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {popularOffers.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} />
                    ))}
                </div>
             ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No popular offers right now. Check back soon!</p>
                    </CardContent>
                </Card>
             )}
          </TabsContent>
          <TabsContent value="games" className="mt-6">
            {gameOffers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {gameOffers.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} />
                    ))}
                </div>
            ) : (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No game offers available right now. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
          <TabsContent value="quick_tasks" className="mt-6">
            {quickTasks.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {quickTasks.map((offer) => (
                        <OfferGridCard key={offer.id} offer={offer} />
                    ))}
                </div>
            ) : (
                 <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No quick tasks available right now. Check back soon!</p>
                    </CardContent>
                </Card>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
