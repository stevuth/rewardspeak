
"use server";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { getAllOffers, type NotikOffer } from "@/lib/notik-api";
import { revalidatePath } from "next/cache";

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
                devices: offer.devices,
                categories: offer.categories,
                events: offer.events,
                is_disabled: false, // Default new offers to enabled
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
                .upsert(allChunk, { onConflict: 'offer_id', ignoreDuplicates: false });

            if (allOffersError) {
                log += `❌ Error upserting chunk ${i + 1}: ${allOffersError.message}\n`;
                console.error('❌ Error upserting all offers:', allOffersError);
                throw new Error(allOffersError.message);
            }
            log += `✅ Chunk ${i + 1} upserted successfully.\n`;
        }
        
        log += "Revalidating paths /earn, /dashboard, and /admin/offer-preview...\n";
        revalidatePath('/earn');
        revalidatePath('/dashboard');
        revalidatePath('/admin/offer-preview');
        revalidatePath('/admin/offers');
        log += "Sync complete!";
        return { success: true, log };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        log += `❌ Sync failed: ${errorMessage}`;
        console.error("Sync Offers Error:", errorMessage);
        return { success: false, error: errorMessage, log };
    }
}


export async function getFeaturedContent(contentType: 'featured_offers' | 'top_converting_offers'): Promise<{data: string[] | null, error: string | null}> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('featured_content')
        .select('offer_ids')
        .eq('content_type', contentType)
        .single();
    
    if (error) {
        if (error.code === 'PGRST116') { // "Not a single row was found"
            return { data: [], error: null }; // Return empty array if no entry exists yet
        }
        console.error("Error fetching featured content:", error);
        return { data: null, error: error.message };
    }
    return { data: data.offer_ids, error: null };
}

export async function updateFeaturedContent(contentType: 'featured_offers' | 'top_converting_offers', offerIds: string[]): Promise<{success: boolean, error?: string}> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase
        .from('featured_content')
        .upsert({
            content_type: contentType,
            offer_ids: offerIds,
            updated_at: new Date().toISOString()
        }, { onConflict: 'content_type' });

    if (error) {
        console.error("Error updating featured content:", error);
        return { success: false, error: error.message };
    }
    
    // Revalidate paths where this content is displayed
    revalidatePath('/dashboard');
    revalidatePath('/admin/offer-preview');

    return { success: true };
}

export async function setOfferDisabledStatus(offerId: string, isDisabled: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from('all_offers')
    .update({ is_disabled: isDisabled })
    .eq('offer_id', offerId);

  if (error) {
    console.error("Error updating offer status:", error);
    return { success: false, error: error.message };
  }

  // Revalidate all paths where offers might be displayed
  revalidatePath('/admin/offers', 'page');
  revalidatePath('/admin/offer-preview');
  revalidatePath('/dashboard');
  revalidatePath('/earn');

  return { success: true };
}

export async function getOfferPayoutPercentage(): Promise<{ data: number; error: string | null; }> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'offer_payout_percentage')
        .single();
    
    if (error) {
        // If the key doesn't exist, return a default of 100%
        if (error.code === 'PGRST116') { 
            return { data: 100, error: null };
        }
        console.error("Error fetching payout percentage:", error);
        return { data: 100, error: error.message };
    }
    
    return { data: Number(data.value), error: null };
}

export async function updateOfferPayoutPercentage(percentage: number): Promise<{ success: boolean; error?: string; }> {
    const supabase = createSupabaseAdminClient();
    if (percentage < 0 || percentage > 100) {
        return { success: false, error: "Percentage must be between 0 and 100." };
    }

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key: 'offer_payout_percentage',
            value: String(percentage),
        }, { onConflict: 'key' });
    
    if (error) {
        console.error("Error updating payout percentage:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/offers', 'page');
    revalidatePath('/admin/offer-preview', 'page');
    revalidatePath('/dashboard', 'page');
    revalidatePath('/earn', 'page');

    return { success: true };
}
