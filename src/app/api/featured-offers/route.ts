
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    // Fetch the top 10 highest paying offers from the database
    const { data: featuredOffers, error } = await supabase
        .from('top_converting_offers')
        .select('*')
        .order('payout', { ascending: false })
        .limit(10);

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
