
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

  const payoutAsFloat = parseFloat(amountUSD);
  if (isNaN(payoutAsFloat)) {
    console.warn('[POSTBACK_WARNING] Invalid amount value received. Cannot parse to a number.', { amount: amountUSD });
    return new NextResponse('1', { status: 200 });
  }

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

    // Since we have the correct user_id, let's call a single RPC to handle the update and get the current points.
    const { data: updatedProfile, error: rpcError } = await supabase
      .rpc('credit_points_and_get_profile', {
          p_user_id: userId,
          p_points_to_add: Math.round(payoutAsFloat * 1000)
      })
      .single();

    if (rpcError || !updatedProfile) {
        console.error(`[POSTBACK_RPC_ERROR] Could not credit points for user: ${userId}`, rpcError);
        return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
    }

    // 4. Log the transaction using the correct user_id (UUID)
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: Math.round(payoutAsFloat * 1000), // Ensure amount is an integer for points
        payout_usd: payoutAsFloat,
        offer_id: offerId,
        offer_name: offerName,
        txn_id: txnId,
        ip_address: requestIp,
        postback_url: fullUrl,
        type: 'credit',
      });

    if (transactionError) {
      console.error(`[POSTBACK_LOG_ERROR] Failed to log transaction for user_id: ${userId}`, transactionError);
    } else {
      console.log(`[POSTBACK_SUCCESS] Credited points to user ${userId}. New balance: ${updatedProfile.points}.`);
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
