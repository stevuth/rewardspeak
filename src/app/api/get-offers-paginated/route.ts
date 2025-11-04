
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from "@/utils/supabase/api";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const offerId = searchParams.get('offerId');
  const offerName = searchParams.get('offerName');

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    let query = supabase
      .from('all_offers')
      .select('*', { count: 'exact' });

    if (offerId) {
      query = query.ilike('offer_id', `%${offerId}%`);
    }
    
    if (offerName) {
      query = query.ilike('name', `%${offerName}%`);
    }

    const { data, error, count } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    
    return NextResponse.json({ offers: data, count: count || 0 });
  } catch (error) {
    console.error("API route get-offers-paginated error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch paginated offers from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
