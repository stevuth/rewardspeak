
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
  
  // Convert the incoming USD amount to points (1000 points = $1)
  const userRewardUSD = amount ? parseFloat(amount) : 0;
  const pointsCredited = Math.round(userRewardUSD * 1000);
  const payoutUsd = parseFloat(payout || '0');

  try {
    // Check for duplicate transaction ID
    if (txnId) {
        const { data: existingTxn, error: txnCheckError } = await supabase
            .from('transactions')
            .select('id')
            .eq('txn_id', txnId)
            .limit(1);

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
      p_points_to_add: pointsCredited,
      p_txn_id: txnId,
      p_offer_id: offerId,
      p_offer_name: offerName,
      p_payout_usd: payoutUsd,
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
      console.log(`[POSTBACK_SUCCESS] RPC credit_user_points executed for user ${userId} with ${pointsCredited} points.`);
    }

    // Always acknowledge the postback with a '1' to prevent retries.
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
