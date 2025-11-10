
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import { randomUUID } from 'crypto';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userIdParam = nextUrl.searchParams.get('user_id');
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name') || 'N/A';
  
  const userAmountParam = nextUrl.searchParams.get('amount');
  const totalPayoutParam = nextUrl.searchParams.get('payout');
  
  let userAmount = parseFloat(userAmountParam || '0');
  if (!isFinite(userAmount)) {
    userAmount = 0;
  }
  
  let totalPayout = parseFloat(totalPayoutParam || '0');
  if (!isFinite(totalPayout)) {
    totalPayout = 0;
  }

  if (!userIdParam) {
    console.warn('[POSTBACK_WARNING] Missing user_id. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 });
  }

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
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without processing.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }

    const transactionData = {
      id: randomUUID(), // Generate a unique ID for the primary key
      user_id: actualUserId,
      offer_id: offerId,
      offer_name: offerName,
      txn_id: txnId,
      ip_address: requestIp,
      postback_url: fullUrl,
      amount_usd: userAmount,
      payout_usd: totalPayout,
    };

    const { error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData);

    if (transactionError) {
      console.error(`[POSTBACK_LOG_ERROR] Failed to log transaction for user_id: ${actualUserId}`, {
        error: transactionError,
        data: transactionData
      });
      return new NextResponse('Error logging transaction', { status: 500 });
    } else {
      console.log(`[POSTBACK_SUCCESS] Logged transaction for user ${actualUserId}.`);
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
