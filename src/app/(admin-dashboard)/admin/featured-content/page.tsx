
'use client';

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { updateFeaturedContent, getFeaturedContent } from "@/app/actions";
import { Star } from "lucide-react";
import { WavingMascotLoader } from "@/components/waving-mascot-loader";

export const runtime = 'edge';

export default function FeaturedContentPage() {
  const [featuredOfferIds, setFeaturedOfferIds] = useState('');
  const [topConvertingOfferIds, setTopConvertingOfferIds] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadFeaturedContent() {
      setIsLoading(true);
      const featured = await getFeaturedContent('featured_offers');
      const topConverting = await getFeaturedContent('top_converting_offers');
      
      if (featured.data) {
        setFeaturedOfferIds(featured.data.join(', '));
      }
      if (topConverting.data) {
        setTopConvertingOfferIds(topConverting.data.join(', '));
      }
      
      if(featured.error || topConverting.error) {
        toast({
            variant: "destructive",
            title: "Error loading content",
            description: featured.error || topConverting.error,
        });
      }
      setIsLoading(false);
    }
    loadFeaturedContent();
  }, [toast]);

  const handleSave = async () => {
    setIsSaving(true);
    
    const featuredIds = featuredOfferIds.split(',').map(id => id.trim()).filter(Boolean);
    const topConvertingIds = topConvertingOfferIds.split(',').map(id => id.trim()).filter(Boolean);

    const results = await Promise.all([
        updateFeaturedContent('featured_offers', featuredIds),
        updateFeaturedContent('top_converting_offers', topConvertingIds)
    ]);

    const hasError = results.some(r => !r.success);

    if (hasError) {
        const errorMessage = results.find(r => r.error)?.error || "An unknown error occurred.";
        toast({
            variant: "destructive",
            title: "Failed to save",
            description: errorMessage,
        });
    } else {
        toast({
            title: "Content saved!",
            description: "Featured and top converting offers have been updated.",
        });
    }

    setIsSaving(false);
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <WavingMascotLoader text="Loading Content..." />
        </div>
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Manage Featured Content"
        description="Manually set the offers that appear in the 'Featured' and 'Top Converting' sections."
      />
      <Card>
        <CardHeader>
          <CardTitle>Featured Offers</CardTitle>
          <CardDescription>
            Enter a comma-separated list of Offer IDs to display in the main "Featured Offers" carousel on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="featured-ids">Featured Offer IDs</Label>
            <Textarea
              id="featured-ids"
              placeholder="offer_id_1, offer_id_2, offer_id_3"
              value={featuredOfferIds}
              onChange={(e) => setFeaturedOfferIds(e.target.value)}
              className="font-mono"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Top Converting Offers</CardTitle>
          <CardDescription>
            Enter a comma-separated list of Offer IDs to display in the "Top Converting Offers" list on the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="top-converting-ids">Top Converting Offer IDs</Label>
            <Textarea
              id="top-converting-ids"
              placeholder="offer_id_4, offer_id_5, offer_id_6"
              value={topConvertingOfferIds}
              onChange={(e) => setTopConvertingOfferIds(e.target.value)}
               className="font-mono"
            />
          </div>
        </CardContent>
      </Card>

       <div className="flex justify-end">
         <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <WavingMascotLoader messages={["Saving..."]} /> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
