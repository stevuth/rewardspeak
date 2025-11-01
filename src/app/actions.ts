
"use server";

import {
  optimizeSEOMetaTags,
  type OptimizeSEOMetaTagsInput,
  type OptimizeSEOMetaTagsOutput,
} from "@/ai/flows/optimize-seo-meta-tags";
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { getAllOffers, getOffers, type NotikOffer } from "@/lib/notik-api";
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


export async function syncOffers(): Promise<{ success: boolean; error?: string }> {
    console.log("=============================================");
    console.log("🚀 LOOK HERE! SYNC OFFERS LOGS WILL APPEAR BELOW 🚀");
    console.log("=============================================");
    console.log("Starting offer sync process...");
    const supabase = createSupabaseAdminClient();

    try {
        const [topOffers, allOffers] = await Promise.all([
            getOffers(),
            getAllOffers()
        ]);
        
        console.log(`Fetched ${topOffers.length} top converting offers.`);
        console.log(`Fetched ${allOffers.length} total offers.`);

        // 🔍 CHECK: What does the first offer look like?
        if (topOffers.length > 0) {
            console.log("📊 First top offer:", JSON.stringify(topOffers[0], null, 2));
        }
        if (allOffers.length > 0) {
            console.log("📊 First all offer:", JSON.stringify(allOffers[0], null, 2));
        }

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
                    countries: offer.countries, // This should now be a safe, standardized array
                    platforms: offer.platforms,
                    categories: offer.categories,
                    events: offer.events,
                };
                
                return prepared;
            });
        };

        const BATCH_SIZE = 500;

        // Upsert top converting offers
        if (topOffers.length > 0) {
            const topOffersData = prepareOffersData(topOffers);
            console.log("📤 About to insert top offer:", JSON.stringify(topOffersData[0], null, 2));
            
            const topOfferChunks = chunk(topOffersData, BATCH_SIZE);

            for (const topChunk of topOfferChunks) {
                const { data, error: topOffersError } = await supabase
                    .from('top_converting_offers')
                    .upsert(topChunk, { onConflict: 'offer_id' })
                    .select('offer_id, countries')
                    .limit(1);

                if (topOffersError) {
                    console.error('❌ Error upserting top converting offers:', topOffersError);
                    throw new Error(topOffersError.message);
                }
                
                // 🔍 CHECK: What did Supabase actually store?
                if (data && data.length > 0) {
                    console.log("✅ Supabase stored (top):", data[0]);
                }
            }
            console.log(`Successfully upserted ${topOffersData.length} top converting offers.`);
        }

        // Similar for all offers...
        if (allOffers.length > 0) {
            const allOffersData = prepareOffersData(allOffers);
            console.log("📤 About to insert all offer:", JSON.stringify(allOffersData[0], null, 2));

            const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

            for (const allChunk of allOfferChunks) {
                const { data, error: allOffersError } = await supabase
                    .from('all_offers')
                    .upsert(allChunk, { onConflict: 'offer_id' })
                    .select('offer_id, countries')
                    .limit(1);

                if (allOffersError) {
                    console.error('❌ Error upserting all offers:', allOffersError);
                    throw new Error(allOffersError.message);
                }
                
                // 🔍 CHECK: What did Supabase actually store?
                if (data && data.length > 0) {
                    console.log("✅ Supabase stored (all):", data[0]);
                }
            }
            console.log(`Successfully upserted ${allOffersData.length} total offers.`);
        }
        
        console.log("Offer sync process completed. Revalidating /earn path.");
        revalidatePath('/earn');
        return { success: true };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        console.error("Sync Offers Error:", errorMessage);
        return { success: false, error: errorMessage };
    }
}
