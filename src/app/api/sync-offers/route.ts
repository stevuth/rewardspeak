
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from "@/utils/supabase/admin";
import type { NotikOffer } from "@/lib/notik-api";

export const runtime = 'edge';

// Helper to split an array into chunks
function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export async function POST(request: NextRequest) {
    const supabase = createSupabaseAdminClient();
    let log = "";
    
    const { offers: allOffers } = await request.json();

    if (!allOffers || !Array.isArray(allOffers) || allOffers.length === 0) {
        return NextResponse.json({ success: false, log: "No offers provided in the request body." }, { status: 400 });
    }

    try {
        const prepareOffersData = (offers: NotikOffer[]) => {
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
                created_at: new Date().toISOString(),
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
        
        log += "Sync complete!";
        return NextResponse.json({ success: true, log });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "An unknown error occurred during offer sync.";
        log += `❌ Sync failed: ${errorMessage}`;
        console.error("Sync Offers Error:", errorMessage);
        return NextResponse.json({ success: false, error: errorMessage, log }, { status: 500 });
    }
}
