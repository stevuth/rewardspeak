import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OfferCard } from "@/components/offer-card";
import { offerWalls, popularOffers, quickTasks } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Earn Points",
  description: "Browse offers and tasks to earn points.",
};

export default function EarnPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Earn Points"
        description="Choose from a variety of ways to earn."
      />

      <section>
        <h2 className="text-2xl font-bold tracking-tight mb-4">Offer Walls</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {offerWalls.map((wall) => (
            <Card key={wall.name} className="flex flex-col">
              <CardHeader className="flex-row items-center gap-4">
                <Image
                  src={wall.logo}
                  alt={`${wall.name} logo`}
                  width={40}
                  height={40}
                  className="rounded-lg"
                  data-ai-hint={wall.hint}
                />
                <div>
                  <CardTitle>{wall.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <p className="text-sm text-muted-foreground mb-4">
                  {wall.description}
                </p>
                <Button className="w-full">
                  Visit <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <Tabs defaultValue="popular">
          <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
            <TabsTrigger value="popular">Popular Offers</TabsTrigger>
            <TabsTrigger value="surveys">Surveys</TabsTrigger>
            <TabsTrigger value="quick_tasks">Quick Tasks</TabsTrigger>
          </TabsList>
          <TabsContent value="popular" className="mt-6">
             <div className="space-y-4">
                {popularOffers.map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
             </div>
          </TabsContent>
          <TabsContent value="surveys" className="mt-6">
            <div className="space-y-4">
                {popularOffers.filter(o => o.category === "Survey").map((offer) => (
                    <OfferCard key={offer.id} offer={offer} />
                ))}
            </div>
            {popularOffers.filter(o => o.category === "Survey").length === 0 && (
                <Card className="text-center py-12">
                    <CardContent>
                        <p className="text-muted-foreground">No surveys available right now. Check back soon!</p>
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
