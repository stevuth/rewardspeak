import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import { getAllOffers as serverGetAllOffers, type NotikOffer } from '@/lib/notik-api';

// Helper function to split an array into chunks
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

async function syncOffersToDb(offers: NotikOffer[], supabase: any): Promise<{ error?: string, log: string }> {
  let log = "";
  try {
    const prepareOffersData = (offersToPrepare: NotikOffer[]) => {
      const uniqueOffersMap = new Map<string, NotikOffer>();
      for (const offer of offersToPrepare) {
        if (!uniqueOffersMap.has(offer.offer_id)) {
          uniqueOffersMap.set(offer.offer_id, offer);
        }
      }
      const uniqueOffers = Array.from(uniqueOffersMap.values());
      log += `Found ${uniqueOffers.length} unique offers out of ${offersToPrepare.length} total.\n`;

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

    const BATCH_SIZE = 500;
    const allOffersData = prepareOffersData(offers);
    const allOfferChunks = chunk(allOffersData, BATCH_SIZE);

    log += `Prepared ${allOffersData.length} unique offers. Splitting into ${allOfferChunks.length} chunk(s).\n`;

    for (let i = 0; i < allOfferChunks.length; i++) {
      const allChunk = allOfferChunks[i];
      log += `Upserting chunk ${i + 1}/${allOfferChunks.length} with ${allChunk.length} offers...\n`;
      const { error: allOffersError } = await supabase.from('all_offers').upsert(allChunk, { onConflict: 'offer_id' });
      if (allOffersError) {
        throw new Error(`DB chunk ${i + 1} upsert error: ${allOffersError.message}`);
      }
      log += `Chunk ${i + 1} upserted successfully.\n`;
    }

    log += "Database sync complete!\n";
    return { log };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during DB sync.";
    log += `❌ DB Sync failed: ${errorMessage}\n`;
    return { error: errorMessage, log };
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  let log = "Automated sync process initiated via API route...\n";

  try {
    const supabaseAdmin = createSupabaseAdminClient();

    const { offers: fetchedOffers, log: fetchLog } = await serverGetAllOffers();
    log += fetchLog;

    if (fetchedOffers.length === 0) {
      log += "No offers fetched. Sync process concluded.\n";
      await supabaseAdmin.from('cron_logs').insert({
          status: 'success',
          log_message: log,
          offers_synced_count: 0,
      });
      return NextResponse.json({ success: true, message: log });
    }

    const { error: syncError, log: syncLog } = await syncOffersToDb(fetchedOffers, supabaseAdmin);
    log += syncLog;

    if (syncError) {
      throw new Error(syncError);
    }
    
    await supabaseAdmin.from('cron_logs').insert({
        status: 'success',
        log_message: log,
        offers_synced_count: fetchedOffers.length,
    });
    
    return NextResponse.json({ success: true, message: log });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    log += `FATAL ERROR: ${errorMessage}\n`;
    console.error("[API CRON ERROR]", log);
    
    const supabaseAdmin = createSupabaseAdminClient();
    await supabaseAdmin.from('cron_logs').insert({
        status: 'failure',
        log_message: log,
        offers_synced_count: 0,
    });

    return NextResponse.json({ error: 'Cron job failed.', details: errorMessage }, { status: 500 });
  }
}
