import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { offerWalls, popularOffers } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PageHeader } from "@/components/page-header";

export default function DashboardPage() {
  const surveyProviders = popularOffers.filter(
    (o) => o.category === "Survey"
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Earn"
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

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold tracking-tight font-headline">
            Survey Providers
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/earn">
              View all <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {surveyProviders.slice(0, 3).map((offer) => (
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
        <div className="space-y-4">
          {popularOffers.slice(0, 3).map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </div>
      </div>
    </div>
  );
}
