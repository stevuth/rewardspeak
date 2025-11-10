
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

// This function is no longer used but kept for reference or future re-integration.
function verifyHash(secretKey: string, url: string): boolean {
  const urlObj = new URL(url);
  const hash = urlObj.searchParams.get('hash');
  urlObj.searchParams.delete('hash');
  
  const reconstructedUrl = urlObj.toString();
  
  const hmac = crypto.createHmac('sha1', secretKey);
  hmac.update(reconstructedUrl);
  const generatedHash = hmac.digest('hex');
  
  return generatedHash === hash;
}

export async function GET(request: NextRequest) {
  const { nextUrl } = request;
  const fullUrl = nextUrl.toString();
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  const supabase = createSupabaseAdminClient();

  const userId = nextUrl.searchParams.get('user_id');
  const amount = nextUrl.searchParams.get('amount');
  const txnId = nextUrl.searchParams.get('txn_id');
  const payout = nextUrl.searchParams.get('payout');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');
  
  const pointsCredited = amount ? parseInt(amount, 10) : 0;
  const payoutUsd = parseFloat(payout || '0');

  try {
    if (txnId) {
        const { data: existingTxns, error: txnCheckError } = await supabase
            .from('transactions')
            .select('id')
            .eq('txn_id', txnId)
            .limit(1);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('Internal Server Error while checking transaction', { status: 500 });
        }

        if (existingTxns && existingTxns.length > 0) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }

    if (userId && pointsCredited > 0) {
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_id, points')
            .eq('user_id', userId)
            .single();

        if (profileError || !profile) {
            console.warn(`[POSTBACK_INVALID_USER] User with user_id ${userId} not found. Skipping credit, but logging transaction.`);
        } else {
            // --- Direct Logic Implementation ---
            // 1. Update user's points
            const newPoints = (profile.points || 0) + pointsCredited;
            const { error: updateError } = await supabase
                .from('profiles')
                .update({ points: newPoints })
                .eq('user_id', userId);

            if (updateError) {
                console.error(`[POSTBACK_DB_ERROR] Failed to update points for user ${userId}:`, updateError);
                // Even if points update fails, we still log the transaction attempt
            } else {
                console.log(`[POSTBACK_SUCCESS] Credited ${pointsCredited} points to user ${userId}. New balance: ${newPoints}.`);
            }
        }
    } else {
        console.warn(`[POSTBACK_INFO] Skipping user credit. Missing userId or amount is zero. UserID: ${userId}, Amount: ${pointsCredited}.`);
    }

    // Always log the transaction, regardless of whether the user was credited.
    const { error: logError } = await supabase.from('transactions').insert({
        user_id: userId,
        points_credited: pointsCredited,
        txn_id: txnId,
        offer_id: offerId,
        offer_name: offerName,
        payout_usd: payoutUsd,
        postback_url: fullUrl,
        ip_address: requestIp,
        status: userId && pointsCredited > 0 ? 'credited' : 'uncredited',
    });

    if (logError) {
        console.error('[POSTBACK_DB_ERROR] Failed to log transaction:', logError);
        // Do not fail the request here, as logging is secondary to acknowledging the postback.
    }

    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
