
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const referralCode = nextUrl.searchParams.get('user_id'); // This is the short ID from the profiles table
  const amountUSD = nextUrl.searchParams.get('amount');
  const txnId = nextUrl.searchParams.get('txn_id');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');
  
  if (!referralCode || !amountUSD) {
    console.warn('[POSTBACK_WARNING] Missing user_id (referral code) or amount. Cannot process postback.', { url: fullUrl });
    return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
  }

  const payoutAsFloat = parseFloat(amountUSD);
  if (isNaN(payoutAsFloat)) {
    console.warn('[POSTBACK_WARNING] Invalid amount value received. Cannot parse to a number.', { amount: amountUSD });
    return new NextResponse('1', { status: 200 });
  }
  const pointsToCredit = Math.round(payoutAsFloat * 1000);

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

    // 1. Fetch the user's profile using the referral code to get the actual user_id (UUID)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('user_id, points')
      .eq('id', referralCode) // 'id' is the short referral code
      .single();

    if (profileError || !profile || !profile.user_id) {
      console.error(`[POSTBACK_USER_ERROR] Could not find profile for referral code: ${referralCode}`, profileError);
      return new NextResponse('1', { status: 200 }); // Acknowledge to prevent retries
    }

    const userId = profile.user_id; // The correct UUID for the user

    // 2. Calculate new point total
    const currentPoints = profile.points || 0;
    const newTotalPoints = currentPoints + pointsToCredit;

    // 3. Update the user's profile with the new point total
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ points: newTotalPoints })
      .eq('user_id', userId);

    if (updateError) {
      console.error(`[POSTBACK_UPDATE_ERROR] Failed to update points for user_id: ${userId}`, updateError);
      return new NextResponse('1', { status: 200 });
    }

    // 4. Log the transaction using the correct user_id (UUID)
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: userId,
        amount: pointsToCredit,
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
      console.log(`[POSTBACK_SUCCESS] Credited ${pointsToCredit} points to user ${userId}.`);
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
