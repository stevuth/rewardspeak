
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import { getAllOffers as serverGetAllOffers } from "@/lib/notik-api";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    console.error("CRON_SECRET is not set in environment variables.");
    return NextResponse.json({ error: 'Cron secret not configured.' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();
  let log = "Automated sync process started...\n";

  try {
    const { offers: fetchedOffers, log: fetchLog } = await serverGetAllOffers();
    log += fetchLog;

    if (fetchedOffers.length === 0) {
      log += "No offers fetched. Exiting.\n";
      await supabase.from('cron_logs').insert({
          status: 'success',
          log_message: log,
          offers_synced_count: 0,
      });
      return NextResponse.json({ success: true, message: log });
    }

    log += `Fetched ${fetchedOffers.length} offers. Saving to database...\n`;
    
    const { error: syncError, log: syncLog } = await syncOffersToDb(fetchedOffers, supabase);

    log += syncLog;

    if (syncError) {
      throw new Error(syncError);
    }
    
    await supabase.from('cron_logs').insert({
        status: 'success',
        log_message: log,
        offers_synced_count: fetchedOffers.length,
    });
    
    return NextResponse.json({ success: true, message: log });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    log += `FATAL ERROR: ${errorMessage}\n`;
    console.error("[CRON-JOB-ERROR]", log);
    
    await supabase.from('cron_logs').insert({
        status: 'failure',
        log_message: log,
        offers_synced_count: 0,
    });

    return NextResponse.json({ error: 'Cron job failed.', details: errorMessage }, { status: 500 });
  }
}

// This is the sync logic, adapted for server-side use.
async function syncOffersToDb(allOffers: any[], supabase: any): Promise<{ error?: string, log: string }> {
  let log = "";

  try {
    const prepareOffersData = (offers: any[]) => {
      const uniqueOffersMap = new Map<string, any>();
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
        created_at: new Date().toISOString(),
      }));
    };
    
    const chunk = <T>(array: T[], size: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    };

    const BATCH_SIZE = 500;
    const allOffersData = prepareOffersData(allOffers);
    const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

    log += `Prepared ${allOffersData.length} unique offers for database update. Splitting into ${allOfferChunks.length} chunk(s).\n`;

    for (let i = 0; i < allOfferChunks.length; i++) {
      const allChunk = allOfferChunks[i];
      log += `Upserting chunk ${i + 1}/${allOfferChunks.length} with ${allChunk.length} offers...\n`;
      const { error: allOffersError } = await supabase.from('all_offers').upsert(allChunk, { onConflict: 'offer_id' });
      if (allOffersError) {
        log += `❌ Error upserting chunk ${i + 1}: ${allOffersError.message}\n`;
        throw new Error(allOffersError.message);
      }
      log += `✅ Chunk ${i + 1} upserted successfully.\n`;
    }
    
    log += "Sync complete!";
    return { log };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during DB sync.";
    log += `❌ DB Sync failed: ${errorMessage}`;
    return { error: errorMessage, log };
  }
}
