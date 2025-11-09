
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from "@/utils/supabase/api";

export async function GET(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  try {
    // The `profiles!inner(*)` syntax was causing an error if a user_id in transactions
    // did not have a corresponding entry in profiles. This is a more robust way to join.
    // The `profiles(email)` syntax correctly performs a left join.
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
        postback_url,
        profiles ( email )
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw error;
    }
    
    // Flatten the data to make it easier to work with on the client
    const flattenedData = data.map(tx => {
        const profile = Array.isArray(tx.profiles) ? tx.profiles[0] : tx.profiles;
        return {
            ...tx,
            user_email: profile?.email || tx.user_id, // Fallback to user_id if email is not found
            profiles: undefined, // Remove the nested object
        }
    });

    return NextResponse.json({ transactions: flattenedData, count: count || 0 });
  } catch (error) {
    console.error("API route get-postbacks-paginated error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch paginated transactions from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
