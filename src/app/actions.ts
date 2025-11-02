
"use server";

import {
  optimizeSEOMetaTags,
  type OptimizeSEOMetaTagsInput,
  type OptimizeSEOMetaTagsOutput,
} from "@/ai/flows/optimize-seo-meta-tags";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { getAllOffers, type NotikOffer } from "@/lib/notik-api";
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

// Helper to introduce a delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


export async function syncOffers(): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseAdminClient();

    try {
        // Fetch all offers
        const allOffers = await getAllOffers();
        
        const prepareOffersData = (offers: NotikOffer[]) => {
            const seen = new Map();
            const uniqueOffers = offers.filter(offer => {
                const offerId = offer.offer_id;
                if (seen.has(offerId)) {
                    return false;
                } else {
                    seen.set(offerId, true);
                    return true;
                }
            });

            return uniqueOffers.map(offer => {
                const prepared = {
                    offer_id: offer.offer_id,
                    name: offer.name,
                    description: offer.description || offer.name,
                    click_url: offer.click_url,
                    image_url: offer.image_url,
                    network: offer.network,
                    payout: offer.payout,
                    countries: offer.countries,
                    platforms: offer.platforms,
                    categories: offer.categories,
                    events: offer.events,
                };
                
                return prepared;
            });
        };

        const BATCH_SIZE = 500;

        // Upsert all offers...
        if (allOffers.length > 0) {
            const allOffersData = prepareOffersData(allOffers);
            const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

            for (const allChunk of allOfferChunks) {
                const { error: allOffersError } = await supabase
                    .from('all_offers')
                    .upsert(allChunk, { onConflict: 'offer_id' });

                if (allOffersError) {
                    console.error('❌ Error upserting all offers:', allOffersError);
                    throw new Error(allOffersError.message);
                }
            }
        }
        
        revalidatePath('/earn');
        return { success: true };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        console.error("Sync Offers Error:", errorMessage);
        return { success: false, error: errorMessage };
    }
}
