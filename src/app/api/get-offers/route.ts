
import { NextResponse } from 'next/server';
import { getOffers, type NotikOffer } from "@/lib/notik-api";
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET() {
  try {
    const supabase = createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const rawOffers = await getOffers();

    return NextResponse.json({ rawOffers, user });
  } catch (error) {
    console.error("API route get-offers error:", error);
    return NextResponse.json({ error: "Failed to fetch offers" }, { status: 500 });
  }
}
