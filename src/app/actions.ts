
"use server";

import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { createSupabaseServerClient } from "@/utils/supabase/server";
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
            // Filter for unique offers based on offer_id to prevent upsert conflicts
            const uniqueOffersMap = new Map<string, NotikOffer>();
            for (const offer of offers) {
                if (!uniqueOffersMap.has(offer.offer_id)) {
                    uniqueOffersMap.set(offer.offer_id, offer);
                }
            }
            const uniqueOffers = Array.from(uniqueOffersMap.values());

            log += `Found ${uniqueOffers.length} unique offers out of ${offers.length} total.\n`;

            return uniqueOffers.map(offer => ({
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

export async function getOfferDisplayLimit(): Promise<{ data: number; error: string | null; }> {
    const supabase = createSupabaseAdminClient();
    const { data, error } = await supabase
        .from('site_config')
        .select('value')
        .eq('key', 'offer_display_limit')
        .single();
    
    if (error) {
        // If the key doesn't exist, return a default
        if (error.code === 'PGRST116') { 
            return { data: 1000, error: null };
        }
        console.error("Error fetching offer display limit:", error);
        return { data: 1000, error: error.message };
    }
    
    return { data: Number(data.value), error: null };
}

export async function updateOfferDisplayLimit(limit: number): Promise<{ success: boolean; error?: string; }> {
    const supabase = createSupabaseAdminClient();
    if (limit <= 0) {
        return { success: false, error: "Limit must be a positive number." };
    }

    const { error } = await supabase
        .from('site_config')
        .upsert({
            key: 'offer_display_limit',
            value: String(limit),
        }, { onConflict: 'key' });
    
    if (error) {
        console.error("Error updating offer display limit:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/offers', 'page');
    revalidatePath('/earn', 'page');

    return { success: true };
}

type WithdrawalPayload = {
    amount: number;
    method: 'paypal' | 'usdt';
    walletAddress: string;
};

export async function processWithdrawalRequest(payload: WithdrawalPayload): Promise<{ success: boolean, error?: string }> {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, error: "You must be logged in to make a withdrawal." };
    }

    const adminSupabase = createSupabaseAdminClient();

    const { error: rpcError } = await adminSupabase.rpc('process_withdrawal', {
        p_user_id: user.id,
        p_email: user.email!,
        p_amount_usd: payload.amount,
        p_method: payload.method,
        p_wallet_address: payload.walletAddress,
    });
    
    if (rpcError) {
        console.error("Error in process_withdrawal RPC:", rpcError);
        const errorMessage = rpcError.message.includes("Not enough points") 
            ? "Insufficient balance for this withdrawal." 
            : "An unexpected error occurred. Please try again later.";
        return { success: false, error: errorMessage };
    }

    revalidatePath('/withdraw'); // Revalidate the withdrawal page to update history
    revalidatePath('/dashboard', 'layout'); // Revalidate layout to update user points

    return { success: true };
}

type GetWithdrawalRequestsParams = {
    page: number;
    limit: number;
    email?: string;
    method?: string;
    status?: string;
}

export async function getWithdrawalRequests({ page, limit, email, method, status }: GetWithdrawalRequestsParams): Promise<{requests: any[] | null, count: number | null}> {
    const supabase = createSupabaseAdminClient();
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
        .from('withdrawal_requests')
        .select('*', { count: 'exact' });

    if (email) {
        query = query.ilike('email', `%${email}%`);
    }
    if (method && method !== 'all') {
        query = query.eq('method', method);
    }
    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

    if (error) {
        console.error("Error fetching withdrawal requests:", error);
        return { requests: null, count: 0 };
    }

    return { requests: data, count };
}

export async function getAllWithdrawalRequestsForCSV({ email, method, status }: Omit<GetWithdrawalRequestsParams, 'page' | 'limit'>): Promise<{requests: any[] | null, error?: string}> {
    const supabase = createSupabaseAdminClient();

    let query = supabase
        .from('withdrawal_requests')
        .select('*');

    if (email) {
        query = query.ilike('email', `%${email}%`);
    }
    if (method && method !== 'all') {
        query = query.eq('method', method);
    }
    if (status && status !== 'all') {
        query = query.eq('status', status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) {
        console.error("Error fetching all withdrawal requests for CSV:", error);
        return { requests: null, error: error.message };
    }
    
    return { requests: data };
}


export async function updateWithdrawalRequestStatus(id: string, status: 'completed' | 'rejected'): Promise<{success: boolean, error?: string}> {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.rpc('update_withdrawal_status', {
        request_id: id,
        new_status: status
    });

    if (error) {
        console.error("Error calling update_withdrawal_status RPC:", error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/withdrawals');
    revalidatePath('/withdraw');
    revalidatePath('/dashboard', 'layout');

    return { success: true };
}


export async function updateBulkWithdrawalRequestStatus(ids: string[], status: 'completed' | 'rejected'): Promise<{ success: boolean; processed: number; failed: number; error?: string }> {
    const supabase = createSupabaseAdminClient();
    let processed = 0;
    let failed = 0;

    for (const id of ids) {
        const { error } = await supabase.rpc('update_withdrawal_status', {
            request_id: id,
            new_status: status
        });

        if (error) {
            failed++;
            console.error(`Error in bulk update for request ID ${id}:`, error);
        } else {
            processed++;
        }
    }

    if (processed > 0) {
        revalidatePath('/admin/withdrawals');
        revalidatePath('/withdraw');
        revalidatePath('/dashboard', 'layout');
    }

    if (failed > 0) {
        return {
            success: false,
            processed,
            failed,
            error: `Failed to update ${failed} out of ${ids.length} requests.`
        };
    }

    return { success: true, processed, failed };
}

export async function updatePassword(newPassword: string): Promise<{ success: boolean; error?: string }> {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
        console.error("Error updating password:", error);
        return { success: false, error: error.message };
    }

    return { success: true };
}

// This server action is no longer used for avatar uploads.
// The logic has been moved to the /api/avatar/upload route handler.
export async function uploadAvatar(formData: FormData): Promise<{ success: boolean, error?: string, url?: string }> {
    console.error("uploadAvatar server action is deprecated. Use /api/avatar/upload instead.");
    return { success: false, error: 'This function is deprecated.' };
}
