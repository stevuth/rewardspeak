
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userId = nextUrl.searchParams.get('user_id');
  const amountParam = nextUrl.searchParams.get('amount'); // User's share (e.g., 1.2)
  const payoutParam = nextUrl.searchParams.get('payout'); // Total payout (e.g., 2)
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name') || 'N/A';
  
  if (!userId || !amountParam) {
    console.warn('[POSTBACK_WARNING] Missing user_id or amount. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }
  
  const userAmountFloat = parseFloat(amountParam);
  if (isNaN(userAmountFloat)) {
    console.warn('[POSTBACK_WARNING] Invalid user amount value received. Cannot parse to a number.', { amount: amountParam });
    return new NextResponse('1', { status: 200 });
  }

  // Parse the total payout, defaulting to 0 if it's not present or invalid
  const totalPayoutFloat = parseFloat(payoutParam || '0');

  try {
    // Check for duplicate transaction ID
    if (txnId) {
        const { count, error: txnCheckError } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('txn_id', txnId);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            // Still acknowledge to prevent retries but log the server error
            return new NextResponse('1', { status: 200 });
        }

        if (count && count > 0) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }

    // Since we are not storing points directly, we must still credit the user's balance.
    // The user's point balance is updated based on the `amount` (user's share).
    const pointsToCredit = Math.round(userAmountFloat * 1000);
    const { error: rpcError } = await supabase.rpc('add_points', {
      user_id_input: userId,
      points_to_add: pointsToCredit
    });

    if (rpcError) {
      console.error(`[POSTBACK_CREDIT_ERROR] Could not credit points for user_id: ${userId} via RPC.`, rpcError);
      return new NextResponse('1', { status: 200 });
    }
    
    // Log the transaction with the exact values from the postback
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount_usd: userAmountFloat,      // User's share from 'amount'
        payout_usd: totalPayoutFloat,     // Total payout from 'payout'
        offer_id: offerId,
        offer_name: offerName,
        txn_id: txnId,
        ip_address: requestIp,
        postback_url: fullUrl,
      });

    if (transactionError) {
      console.error(`[POSTBACK_LOG_ERROR] Failed to log transaction for user_id: ${userId}`, transactionError);
    } else {
      console.log(`[POSTBACK_SUCCESS] Credited ${pointsToCredit} points to user ${userId}.`);
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
