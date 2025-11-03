
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const supabase = createSupabaseServerClient();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    const { data, error, count } = await supabase
      .from('all_offers')
      .select('*', { count: 'exact' })
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
