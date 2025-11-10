
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userIdParam = nextUrl.searchParams.get('user_id');
  const userAmountParam = nextUrl.searchParams.get('amount'); // User's share (e.g., 1.2)
  const totalPayoutParam = nextUrl.searchParams.get('payout'); // Total payout (e.g., 2)
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name') || 'N/A';
  
  if (!userIdParam || !userAmountParam) {
    console.warn('[POSTBACK_WARNING] Missing user_id or amount. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }
  
  const userAmountFloat = parseFloat(userAmountParam);
  if (isNaN(userAmountFloat)) {
    console.warn('[POSTBACK_WARNING] Invalid user amount value received. Cannot parse to a number.', { amount: userAmountParam });
    return new NextResponse('1', { status: 200 });
  }

  // Parse the total payout, defaulting to 0 if it's not present or invalid
  const totalPayoutFloat = parseFloat(totalPayoutParam || '0');

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('id', userIdParam)
      .single();

    if (profileError || !profile) {
      console.error(`[POSTBACK_USER_ERROR] Could not find a profile with referral code (id): ${userIdParam}`, profileError);
      return new NextResponse('1', { status: 200 });
    }
    const actualUserId = profile.user_id;
    
    // Check for duplicate transaction ID
    if (txnId) {
        const { count, error: txnCheckError } = await supabase
            .from('transactions')
            .select('*', { count: 'exact', head: true })
            .eq('txn_id', txnId);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('1', { status: 200 });
        }

        if (count && count > 0) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }
    
    // Log the transaction with the exact values from the postback
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: actualUserId,
        amount_usd: userAmountFloat,      // User's share from 'amount'
        payout_usd: totalPayoutFloat,     // Total payout from 'payout'
        offer_id: offerId,
        offer_name: offerName,
        txn_id: txnId,
        ip_address: requestIp,
        postback_url: fullUrl,
      });

    if (transactionError) {
      console.error(`[POSTBACK_LOG_ERROR] Failed to log transaction for user_id: ${actualUserId}`, transactionError);
    } else {
      console.log(`[POSTBACK_SUCCESS] Logged transaction for user ${actualUserId}.`);
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
