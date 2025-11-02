
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

export async function syncOffers(): Promise<{ success: boolean; error?: string, log?: string }> {
    const supabase = createSupabaseAdminClient();
    let log = "Sync process started...\n";

    try {
        log += "Fetching all offers from the API...\n";
        const { offers: allOffers, log: apiLog } = await getAllOffers();
        log += apiLog;
        log += `Fetched ${allOffers.length} offers from the API.\n`;
        
        if (allOffers.length === 0) {
            log += "No offers to sync. Exiting.\n";
            revalidatePath('/earn');
            return { success: true, log };
        }

        const prepareOffersData = (offers: NotikOffer[]) => {
            return offers.map(offer => ({
                offer_id: offer.offer_id,
                name: offer.name,
                description: offer.description || "",
                click_url: offer.click_url,
                image_url: offer.image_url,
                network: offer.network,
                payout: offer.payout,
                countries: offer.countries,
                platforms: offer.platforms,
                categories: offer.categories,
                events: offer.events,
            }));
        };

        const BATCH_SIZE = 500;
        const allOffersData = prepareOffersData(allOffers);
        const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

        log += `Prepared ${allOffersData.length} unique offers for database update. Splitting into ${allOfferChunks.length} chunk(s).\n`;

        for (let i = 0; i < allOfferChunks.length; i++) {
            const allChunk = allOfferChunks[i];
            log += `Upserting chunk ${i + 1}/${allOfferChunks.length} with ${allChunk.length} offers...\n`;
            const { error: allOffersError } = await supabase
                .from('all_offers')
                .upsert(allChunk, { onConflict: 'offer_id' });

            if (allOffersError) {
                log += `❌ Error upserting chunk ${i + 1}: ${allOffersError.message}\n`;
                console.error('❌ Error upserting all offers:', allOffersError);
                throw new Error(allOffersError.message);
            }
            log += `✅ Chunk ${i + 1} upserted successfully.\n`;
        }
        
        log += "Revalidating path /earn...\n";
        revalidatePath('/earn');
        log += "Sync complete!";
        return { success: true, log };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        log += `❌ Sync failed: ${errorMessage}`;
        console.error("Sync Offers Error:", errorMessage);
        return { success: false, error: errorMessage, log };
    }
}
