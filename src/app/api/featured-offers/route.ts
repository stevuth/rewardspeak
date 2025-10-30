
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    // Define the curated list of full, exact offer names to feature
    const curatedOfferNames = [
        'Raid: Shadow Legends',
        'Richie Games',
        'Upside',
        'Bingo Vacation',
        'Crypto Miner Tycoon', // Corrected full name
        'Slot Mate - Vegas Slot Casino', // Corrected full name
        'Binance',
        'TikTok'
    ];

    // Fetch offers that match the names in our curated list
    let { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .in('name', curatedOfferNames);

    if (error) {
        throw error;
    }
    
    // Fallback: If no curated offers are found, fetch the top 8 highest paying offers.
    if (!featuredOffers || featuredOffers.length === 0) {
        const { data: topOffers, error: topOffersError } = await supabase
            .from('top_converting_offers')
            .select('*')
            .order('payout', { ascending: false })
            .limit(8);

        if (topOffersError) {
            throw topOffersError;
        }
        featuredOffers = topOffers;
    }


    // Ensure we don't have duplicate offers by name, selecting the one with the highest payout if duplicates exist.
    const uniqueOffersMap = new Map();
    if (featuredOffers) {
        for (const offer of featuredOffers) {
            if (!uniqueOffersMap.has(offer.name) || uniqueOffersMap.get(offer.name).payout < offer.payout) {
                uniqueOffersMap.set(offer.name, offer);
            }
        }
    }
    const uniqueOffers = Array.from(uniqueOffersMap.values());

    return NextResponse.json({ featuredOffers: uniqueOffers }, { headers: { 'Cache-Control': 'no-store' } });

  } catch (error) {
    console.error("API route get-offers error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
