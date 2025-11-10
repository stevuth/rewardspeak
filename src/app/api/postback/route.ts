
'use server';

import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

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

  if (!txnId) {
    console.warn('[POSTBACK_WARNING] Missing required txn_id. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 });
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id')
      .eq('user_id', userIdParam) // CORRECTED: Querying the correct 'user_id' column
      .single();

    if (profileError || !profile) {
      console.error(`[POSTBACK_USER_ERROR] Could not find a profile with user_id: ${userIdParam}`, profileError);
      return new NextResponse('1', { status: 200 });
    }
    const actualUserId = profile.user_id;
    
    // Check for duplicate transaction
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

    const transactionData = {
      user_id: actualUserId,
      offer_id: offerId,
      offer_name: offerName,
      txn_id: txnId,
      ip_address: requestIp,
      postback_url: fullUrl,
      amount_usd: userAmount,
      payout_usd: totalPayout,
    };

    const { data, error: transactionError } = await supabase
      .from('transactions')
      .insert(transactionData)
      .select()
      .single();

    if (transactionError) {
      console.error('❌ Supabase Insert Error:', {
        message: transactionError.message,
        details: transactionError.details,
        hint: transactionError.hint,
        code: transactionError.code,
      });
      console.error('📦 Attempted data:', JSON.stringify(transactionData, null, 2));

      return new NextResponse('Error logging transaction', { status: 500 });
    }

    // Call the RPC to add points to the user's profile
    const { error: rpcError } = await supabase.rpc('add_points', {
      p_user_id: actualUserId,
      p_points_to_add: Math.round(userAmount * 1000)
    });

    if (rpcError) {
        console.error('❌ RPC Error calling add_points:', {
            message: rpcError.message,
            details: rpcError.details,
            hint: rpcError.hint,
            code: rpcError.code
        });
        // Note: The transaction is logged, but points failed. This should be monitored.
    } else {
        console.log(`[POINTS_SUCCESS] Credited ${Math.round(userAmount * 1000)} points to user ${actualUserId}.`);
    }

    console.log(`[POSTBACK_SUCCESS] Created transaction for user ${actualUserId}.`);
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
