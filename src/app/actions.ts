
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

// Helper to split an array into chunks
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}


export async function syncOffers(): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();

    try {
        // Fetch offers from both Notik endpoints in parallel
        const [topOffers, allOffers] = await Promise.all([
            getOffers(),
            getAllOffers()
        ]);

        // Helper function to remove duplicates based on offer_id
        const getUniqueOffers = (offers: any[]) => {
            const seen = new Map();
            return offers.filter(offer => {
                const offerId = offer.offer_id;
                if (seen.has(offerId)) {
                    return false;
                } else {
                    seen.set(offerId, true);
                    return true;
                }
            });
        };

        const BATCH_SIZE = 500;

        // Upsert top converting offers
        if (topOffers.length > 0) {
            const uniqueTopOffers = getUniqueOffers(topOffers);
            const topOffersData = uniqueTopOffers.map(offer => ({
                offer_id: offer.offer_id,
                name: offer.name,
                description: offer.description || offer.name, // Fallback to name if description is empty
                click_url: offer.click_url,
                image_url: offer.image_url,
                network: offer.network,
                payout: offer.payout,
                countries: offer.countries,
                platforms: offer.platforms,
                categories: offer.categories,
                events: offer.events,
            }));
            
            const topOfferChunks = chunk(topOffersData, BATCH_SIZE);
            for (const topChunk of topOfferChunks) {
                const { error: topOffersError } = await supabase
                    .from('top_converting_offers')
                    .upsert(topChunk, { onConflict: 'offer_id' });

                if (topOffersError) {
                    console.error('Error upserting a chunk of top converting offers:', topOffersError);
                    throw new Error(topOffersError.message);
                }
            }
        }

        // Upsert all offers
        if (allOffers.length > 0) {
            const uniqueAllOffers = getUniqueOffers(allOffers);
            const allOffersData = uniqueAllOffers.map(offer => ({
                offer_id: offer.offer_id,
                name: offer.name,
                description: offer.description || offer.name, // Fallback to name if description is empty
                click_url: offer.click_url,
                image_url: offer.image_url,
                network: offer.network,
                payout: offer.payout,
                countries: offer.countries,
                platforms: offer.platforms,
                categories: offer.categories,
                events: offer.events,
            }));

            const allOfferChunks = chunk(allOffersData, BATCH_SIZE);
            for (const allChunk of allOfferChunks) {
                const { error: allOffersError } = await supabase
                    .from('all_offers')
                    .upsert(allChunk, { onConflict: 'offer_id' });

                if (allOffersError) {
                    console.error('Error upserting a chunk of all offers:', allOffersError);
                    throw new Error(allOffersError.message);
                }
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
