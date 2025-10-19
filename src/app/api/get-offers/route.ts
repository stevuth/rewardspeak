
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch offers from your database tables in parallel
    const [topOffersResponse, allOffersResponse] = await Promise.all([
      supabase.from('top_converting_offers').select('*'),
      supabase.from('all_offers').select('*')
    ]);

    if (topOffersResponse.error) throw topOffersResponse.error;
    if (allOffersResponse.error) throw allOffersResponse.error;

    const topOffers = topOffersResponse.data;
    const allOffers = allOffersResponse.data;

    return NextResponse.json({ topOffers, allOffers, user });
  } catch (error) {
    console.error("API route get-offers error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
