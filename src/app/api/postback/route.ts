
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userId = nextUrl.searchParams.get('user_id');
  const amountUSD = nextUrl.searchParams.get('amount');
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');
  const originalPayoutUSD = nextUrl.searchParams.get('payout');
  
  if (!userId) {
    console.warn('[POSTBACK_WARNING] No user_id provided. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }

  // This is the user's reward in USD
  const userPayoutUsd = parseFloat(amountUSD || '0');
  
  // Convert the user's USD reward to points (1000 points = $1)
  const pointsToCredit = Math.round(userPayoutUsd * 1000);

  // Original payout from the partner, if available
  const offerPayout = parseFloat(originalPayoutUSD || '0');

  try {
    // Check for duplicate transaction ID
    if (txnId) {
        const { count, error: txnCheckError } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('txn_id', txnId);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('Internal Server Error while checking transaction', { status: 500 });
        }

        if (count && count > 0) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }

    // Call the RPC function to credit points and log the transaction in one go.
    const { error: rpcError } = await supabase.rpc('credit_user_points', {
      p_user_id: userId,
      p_points_to_add: pointsToCredit,
      p_user_payout_usd: userPayoutUsd, // This is the user's earnings in USD
      p_offer_payout_usd: offerPayout, // This is the original offer payout
      p_txn_id: txnId,
      p_offer_id: offerId,
      p_offer_name: offerName,
      p_postback_url: fullUrl,
      p_ip_address: requestIp,
    });
    
    if (rpcError) {
      console.error('[POSTBACK_RPC_ERROR] Error executing credit_user_points RPC:', rpcError);
      // Even with an error, we must return a success status to Notik.
      // The error is logged for internal review.
    } else {
      console.log(`[POSTBACK_SUCCESS] RPC credit_user_points executed for user ${userId} with ${pointsToCredit} points.`);
    }

    // Always acknowledge the postback with a '1' to prevent retries.
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
