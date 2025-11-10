
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

// Helper function to verify the HMAC-SHA1 hash
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

  // --- Process Optional Parameters ---
  const userId = nextUrl.searchParams.get('user_id');
  const amount = nextUrl.searchParams.get('amount');
  const txnId = nextUrl.searchParams.get('txn_id');
  const payout = nextUrl.searchParams.get('payout');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');
  
  const pointsCredited = amount ? parseInt(amount, 10) : 0;
  const payoutUsd = parseFloat(payout || '0');

  try {
    // --- Duplicate Transaction Prevention (only if txnId is present) ---
    if (txnId) {
        // FIX: Use .maybeSingle() or a list query to prevent 406 error.
        // A direct query is better here.
        const { data: existingTxns, error: txnCheckError } = await supabase
            .from('transactions')
            .select('id')
            .eq('txn_id', txnId);

        if (txnCheckError) {
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('Internal Server Error', { status: 500 });
        }

        if (existingTxns && existingTxns.length > 0) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }

    // --- User Balance Update (only if userId and amount are present) ---
    if (userId && pointsCredited > 0) {
        // **FIX:** Check if the user exists before attempting to credit points.
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('user_id')
            .eq('user_id', userId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error(`[POSTBACK_DB_ERROR] Error checking for user profile ${userId}:`, profileError);
            return new NextResponse('Internal Server Error while checking user', { status: 500 });
        }

        if (!profile) {
            console.warn(`[POSTBACK_INVALID] User with user_id ${userId} not found. Skipping credit, but logging transaction.`);
        } else {
            // User exists, proceed with crediting points.
            const { error: rpcError } = await supabase.rpc('credit_user_points', {
                p_user_id: userId,
                p_points_to_add: pointsCredited,
                p_txn_id: txnId,
                p_offer_id: offerId,
                p_offer_name: offerName,
                p_payout_usd: payoutUsd,
                p_postback_url: fullUrl,
                p_ip_address: requestIp,
            });
            
            if (rpcError) {
                console.error('[POSTBACK_DB_ERROR] Error calling credit_user_points RPC:', rpcError);
                return new NextResponse('Internal Server Error during RPC call', { status: 500 });
            } else {
                console.log(`[POSTBACK_SUCCESS] Credited ${pointsCredited} points to user ${userId} for txn_id ${txnId || 'N/A'}.`);
            }
        }
    } else {
         // This block handles cases where userId is missing or amount is zero.
         // We will still log the transaction for debugging purposes.
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
        // If user was found and credited, status is 'credited', otherwise 'uncredited'.
        status: userId && pointsCredited > 0 ? 'credited' : 'uncredited',
    });

    if (logError) {
        console.error('[POSTBACK_DB_ERROR] Failed to log transaction:', logError);
        // Do not fail the whole request, but log the error.
    }

    // --- Success Response ---
    // Acknowledge the postback to prevent the partner from retrying.
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
