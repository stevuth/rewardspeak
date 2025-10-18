
import { NextResponse } from 'next/server';
import { getOffers, getAllOffers, type NotikOffer } from "@/lib/notik-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Fetch both sets of offers
    const topOffers = await getOffers();
    const allOffers = await getAllOffers();

    return NextResponse.json({ topOffers, allOffers, user });
  } catch (error) {
    console.error("API route get-offers error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
