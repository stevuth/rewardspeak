
'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { OfferGridCard } from "@/components/offer-grid-card";
import type { NotikOffer } from "@/lib/notik-api";
import { useToast } from "@/hooks/use-toast";
import { OfferPreviewModal } from "@/components/offer-preview-modal";

type Offer = NotikOffer & {
  points: number;
  imageHint: string;
  category: "Survey" | "Game" | "App" | "Quiz";
  clickUrl: string;
};

function transformOffer(notikOffer: NotikOffer, userId: string | undefined): Offer {
  let clickUrl = notikOffer.click_url;
  if (userId) {
    clickUrl = clickUrl.replace('[user_id]', userId);
  }

  const totalPayout = notikOffer.payout || 0;
  
  const points = Math.round(totalPayout * 1000);

  return {
    ...notikOffer,
    payout: totalPayout,
    points: points,
    imageHint: "offer logo",
    category: notikOffer.categories.includes("SURVEY") ? "Survey" : "Game",
    clickUrl: clickUrl,
  }
}

export default function OfferPreviewPage() {
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const notikResponse = await fetch('/api/get-offers');

      if (!notikResponse.ok) {
        throw new Error('Failed to fetch offers');
      }

      const notikData = await notikResponse.json();
      
      if (notikData.error) throw new Error(notikData.error);

      const { allOffers: rawAllOffers, user } = notikData;
      const userId = user?.id;

      let transformedNotikOffers: Offer[] = [];
      if (Array.isArray(rawAllOffers)) {
          transformedNotikOffers = rawAllOffers.map((o: NotikOffer) => transformOffer(o, userId));
          setAllOffers(transformedNotikOffers);
      } else {
          setAllOffers([]);
      }

    } catch (error) {
      console.error("Error fetching offers:", error);
      toast({
          variant: "destructive",
          title: "Error fetching offers",
          description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleOfferClick = (offer: Offer) => {
    setSelectedOffer(offer);
  };

  const handleCloseModal = () => {
    setSelectedOffer(null);
  };
  
  const renderOfferGrid = (offers: Offer[]) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-12">
                <Image
                    src="/logo.png?v=9"
                    alt="Loading..."
                    width={80}
                    height={80}
                    className="animate-pulse"
                />
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

    return (
        <Card className="text-center py-12">
            <CardContent>
                <p className="text-muted-foreground">No offers to display. Try syncing offers first.</p>
            </CardContent>
        </Card>
    );
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Offer Preview"
        description="This is how offers are displayed to users on the 'Climb & Earn' page."
      />

      <section>
        <h2 className="text-xl font-bold tracking-tight mb-4 font-headline">
          All Offers Preview
        </h2>
        {renderOfferGrid(allOffers)}
      </section>
      
      <OfferPreviewModal 
        isOpen={!!selectedOffer}
        onClose={handleCloseModal}
        offer={selectedOffer}
      />
    </div>
  );
}
