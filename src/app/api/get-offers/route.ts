
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from "@/utils/supabase/api";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  
  try {
    const { data: { user } } = await supabase.auth.getUser();

    const { data: config } = await supabase
      .from('site_config')
      .select('value')
      .eq('key', 'offer_payout_percentage')
      .single();
      
    const payoutPercentage = config ? Number(config.value) : 100;

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
