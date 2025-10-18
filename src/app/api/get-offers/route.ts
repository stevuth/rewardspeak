
import { NextResponse } from 'next/server';
import { getOffers, getAllOffers, type NotikOffer } from "@/lib/notik-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch both sets of offers in parallel
    const [topOffers, allOffersRaw] = await Promise.all([
      getOffers(),
      getAllOffers(),
    ]);

    // Create a Map to store unique offers by their offer_id
    const offerMap = new Map<string, NotikOffer>();

    // Add all offers to the map first to ensure the most comprehensive data is stored
    allOffersRaw.forEach(offer => {
      offerMap.set(offer.offer_id, offer);
    });

    // Add top offers. If an offer already exists, it will be overwritten, which is fine.
    // This ensures top offers are included if they weren't in the 'all' list for some reason.
    topOffers.forEach(offer => {
      offerMap.set(offer.offer_id, offer);
    });

    // Convert the map values back to an array to get a unique list of offers
    const allOffers = Array.from(offerMap.values());

    return NextResponse.json({ topOffers, allOffers, user });
  } catch (error) {
    console.error("API route get-offers error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
