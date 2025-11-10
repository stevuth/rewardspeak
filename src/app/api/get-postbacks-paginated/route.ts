
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
    // Step 1: Fetch transactions
    const { data: transactions, error, count } = await supabase
      .from('transactions')
      .select(`
        id,
        created_at,
        txn_id,
        offer_name,
        points_credited,
        user_payout_usd,
        user_id,
        postback_url
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("API route get-postbacks-paginated error (step 1):", error);
      throw error;
    }

    if (!transactions || transactions.length === 0) {
        return NextResponse.json({ transactions: [], count: 0 });
    }

    // Step 2: Gather unique user IDs
    const userIds = [...new Set(transactions.map(tx => tx.user_id).filter(Boolean))];

    let emailMap = new Map<string, string>();

    // Step 3: Fetch corresponding profiles
    if (userIds.length > 0) {
        const { data: profiles, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, email')
            .in('user_id', userIds);

        if (profileError) {
            console.error("API route get-postbacks-paginated error (step 2):", profileError);
        } else {
            emailMap = new Map(profiles.map(p => [p.user_id, p.email]));
        }
    }
    
    // Step 4: Combine the data
    const combinedData = transactions.map(tx => ({
        ...tx,
        user_email: tx.user_id ? emailMap.get(tx.user_id) || 'N/A' : 'N/A',
    }));

    return NextResponse.json({ transactions: combinedData, count: count || 0 });

  } catch (error) {
    console.error("API route get-postbacks-paginated unhandled error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch paginated transactions from the database.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
