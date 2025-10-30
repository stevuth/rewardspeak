
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    // Define the curated list of offer names to feature
    const curatedOfferNames = [
        'Raid: Shadow Legends',
        'Richie Games',
        'Upside',
        'Bingo Vacation',
        'Crypto Miner Tycoon', // Assuming this is the full name for "crypto miner"
        'Slot Mate - Vegas Slot Casino', // Assuming this is the full name for "slot mate"
        'Binance',
        'TikTok'
    ];

    // Fetch offers that match the names in our curated list
    const { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .in('name', curatedOfferNames);

    if (error) {
        throw error;
    }

    // Ensure we don't have duplicate offers by name, selecting the one with the highest payout if duplicates exist.
    const uniqueOffers = Array.from(new Map(featuredOffers.map(offer => [offer.name, offer])).values());

    return NextResponse.json({ featuredOffers: uniqueOffers });

  } catch (error) {
    console.error("API route get-offers error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
