
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
  
  if (!userId || !amountUSD) {
    console.warn('[POSTBACK_WARNING] Missing user_id or amount. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }

  // This is the user's reward in USD
  const userPayoutUsd = parseFloat(amountUSD);
  
  // Convert the user's USD reward to points (1000 points = $1)
  const pointsToCredit = Math.round(userPayoutUsd * 1000);

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

    // Call the RPC function to credit points and log the transaction.
    // The amount is passed as points, and other details are for logging.
    const { error: rpcError } = await supabase.rpc('process_withdrawal', {
      p_user_id: userId,
      p_email: 'postback@rewardspeak.com', // Email not available here, using placeholder
      p_amount_usd: -pointsToCredit, // Use negative to signify a credit, not a withdrawal
      p_method: 'offer_completion',
      p_wallet_address: JSON.stringify({
        offer_id: offerId,
        offer_name: offerName,
        txn_id: txnId,
        ip_address: requestIp,
        postback_url: fullUrl
      }),
    });
    
    if (rpcError) {
      console.error('[POSTBACK_RPC_ERROR] Error executing process_withdrawal RPC for offer credit:', rpcError);
      // Even with an error, we must return a success status to the partner.
      // The error is logged for internal review.
    } else {
      console.log(`[POSTBACK_SUCCESS] RPC process_withdrawal executed for user ${userId} with ${pointsToCredit} points.`);
    }

    // Always acknowledge the postback with a '1' to prevent retries.
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
