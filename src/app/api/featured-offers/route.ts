
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    const curatedOfferNames = [
        'Video Poker',
        'Upside',
        'Richie Games',
        'RAID Shadow Legends',
        'Crypto Miner',
        'Slot Mate',
    ];

    const { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .in('name', curatedOfferNames)
        .order('payout', { ascending: false });

    if (error) {
        throw error;
    }

    const uniqueOffers = Array.from(new Map(featuredOffers.map(offer => [offer.name, offer])).values());

    return NextResponse.json({ featuredOffers: uniqueOffers });

  } catch (error) {
    console.error("API route get-offers error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
