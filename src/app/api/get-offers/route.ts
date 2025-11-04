
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = createSupabaseServerClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch the payout percentage
    const { data: config } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'offer_payout_percentage')
      .single();
      
    const payoutPercentage = config ? Number(config.value) : 100;

    // Fetch only enabled offers from your database table
    const { data: allOffers, error: allOffersError } = await supabase
      .from('all_offers')
      .select('*')
      .eq('is_disabled', false);

    if (allOffersError) throw allOffersError;

    return NextResponse.json({ allOffers, user, payoutPercentage });
  } catch (error) {
    console.error("API route get-offers error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
