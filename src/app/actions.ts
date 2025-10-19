
"use server";

import {
  optimizeSEOMetaTags,
  type OptimizeSEOMetaTagsInput,
  type OptimizeSEOMetaTagsOutput,
} from "@/ai/flows/optimize-seo-meta-tags";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { getAllOffers, getOffers } from "@/lib/notik-api";
import { revalidatePath } from "next/cache";

type ActionResult = {
  success: boolean;
  data?: OptimizeSEOMetaTagsOutput;
  error?: string;
};

export async function runSeoOptimizer(
  data: OptimizeSEOMetaTagsInput
): Promise<ActionResult> {
  try {
    const result = await optimizeSEOMetaTags(data);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error optimizing SEO tags:", error);
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return { success: false, error: errorMessage };
  }
}


export async function syncOffers(): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();

    try {
        // Fetch offers from both Notik endpoints in parallel
        const [topOffers, allOffers] = await Promise.all([
            getOffers(),
            getAllOffers()
        ]);

        // Upsert top converting offers
        if (topOffers.length > 0) {
            const topOffersData = topOffers.map(offer => ({
                offer_id: offer.offer_id,
                name: offer.name,
                description: offer.description,
                click_url: offer.click_url,
                image_url: offer.image_url,
                network: offer.network,
                payout: offer.payout,
                countries: offer.countries,
                platforms: offer.platforms,
                categories: offer.categories,
                events: offer.events,
            }));
            const { error: topOffersError } = await supabase
                .from('top_converting_offers')
                .upsert(topOffersData, { onConflict: 'offer_id' });

            if (topOffersError) {
                console.error('Error upserting top converting offers:', topOffersError);
                throw new Error(topOffersError.message);
            }
        }

        // Upsert all offers
        if (allOffers.length > 0) {
            const allOffersData = allOffers.map(offer => ({
                offer_id: offer.offer_id,
                name: offer.name,
                description: offer.description,
                click_url: offer.click_url,
                image_url: offer.image_url,
                network: offer.network,
                payout: offer.payout,
                countries: offer.countries,
                platforms: offer.platforms,
                categories: offer.categories,
                events: offer.events,
            }));

            const { error: allOffersError } = await supabase
                .from('all_offers')
                .upsert(allOffersData, { onConflict: 'offer_id' });

            if (allOffersError) {
                console.error('Error upserting all offers:', allOffersError);
                throw new Error(allOffersError.message);
            }
        }
        
        // Revalidate the path to show the new data
        revalidatePath('/earn');
        return { success: true };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        console.error("Sync Offers Error:", errorMessage);
        return { success: false, error: errorMessage };
    }
}
