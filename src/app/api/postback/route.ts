
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userId = nextUrl.searchParams.get('user_id');
  const amountUSD = nextUrl.searchParams.get('amount'); // This is the USD amount from the partner
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');
  
  if (!userId) {
    console.warn('[POSTBACK_WARNING] No user_id provided. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }

  const payoutUsd = parseFloat(amountUSD || '0');
  // Convert the incoming USD amount to points (1000 points = $1)
  const pointsToCredit = Math.round(payoutUsd * 1000);

  try {
    // Check for duplicate transaction ID
    if (txnId) {
        const { data: existingTxn, error: txnCheckError } = await supabase
            .from('transactions')
            .select('id', { count: 'exact', head: true })
            .eq('txn_id', txnId);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('Internal Server Error while checking transaction', { status: 500 });
        }

        if (existingTxn && existingTxn.length > 0) {
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
      p_txn_id: txnId,
      p_offer_id: offerId,
      p_offer_name: offerName,
      p_payout_usd: payoutUsd, // Store the original USD amount
      p_postback_url: fullUrl,
      p_ip_address: requestIp,
    });
    
    if (rpcError) {
      // The RPC function handles cases where the user doesn't exist.
      // Any error here is unexpected.
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
