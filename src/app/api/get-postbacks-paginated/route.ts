
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
      .from('transactions')
      .select(`
        id,
        created_at,
        txn_id,
        offer_name,
        points_credited,
        payout_usd,
        user_id,
        profiles (
            email
        )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    
    // The result from supabase with a join is a bit nested.
    // Let's flatten it for easier consumption on the client.
    const flattenedData = data.map(tx => {
        const profile = Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles;
        return {
            ...tx,
            user_email: profile?.email || tx.user_id,
            profiles: undefined, // remove the nested object
        }
    });

    return NextResponse.json({ transactions: flattenedData, count: count || 0 });
  } catch (error) {
    console.error("API route get-postbacks-paginated error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch paginated transactions from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
