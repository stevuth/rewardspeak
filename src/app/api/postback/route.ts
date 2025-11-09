
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

// Notik's official IP address for postbacks
// This is commented out as it's a likely source of 403 errors if Notik uses multiple IPs.
// const NOTIK_IP = '192.53.121.112';

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

  // --- 1. IP Whitelisting (Disabled for broader compatibility) ---
  const requestIp = (request.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0].trim();
  
  // if (requestIp !== NOTIK_IP) {
  //   console.warn(`[POSTBACK_DENIED] Blocked IP: ${requestIp}. Expected: ${NOTIK_IP}`);
  //   return new NextResponse('Forbidden', { status: 403 });
  // }

  // --- 2. Hash Verification ---
  const secretKey = process.env.NOTIK_SECRET_KEY;
  if (!secretKey) {
    console.error('[POSTBACK_ERROR] NOTIK_SECRET_KEY is not set in environment variables.');
    return new NextResponse('Internal Server Error', { status: 500 });
  }
  
  if (!verifyHash(secretKey, fullUrl)) {
      console.warn(`[POSTBACK_DENIED] Invalid hash for URL: ${fullUrl}`);
      return new NextResponse('Forbidden: Invalid hash', { status: 403 });
  }

  // --- 3. Process Optional Parameters ---
  const userId = nextUrl.searchParams.get('user_id');
  const amount = nextUrl.searchParams.get('amount');
  const txnId = nextUrl.searchParams.get('txn_id');
  const payout = nextUrl.searchParams.get('payout');
  const offerId = nextUrl.searchParams.get('offer_id');
  const offerName = nextUrl.searchParams.get('offer_name');

  const pointsCredited = amount ? parseInt(amount, 10) : 0;
  if (isNaN(pointsCredited)) {
    console.warn(`[POSTBACK_INVALID] Invalid amount parameter. URL: ${fullUrl}`);
    return new NextResponse('Bad Request: Invalid amount', { status: 400 });
  }

  const payoutUsd = parseFloat(payout || '0');
  const supabase = createSupabaseAdminClient();

  try {
    // --- 4. Duplicate Transaction Prevention (only if txnId is present) ---
    if (txnId) {
        const { data: existingTxn, error: txnCheckError } = await supabase
        .from('transactions')
        .select('id')
        .eq('txn_id', txnId)
        .single();

        if (txnCheckError && txnCheckError.code !== 'PGRST116') { // PGRST116 means 'Not a single row was found'
            console.error('[POSTBACK_DB_ERROR] Error checking for existing transaction:', txnCheckError);
            return new NextResponse('Internal Server Error', { status: 500 });
        }

        if (existingTxn) {
            console.log(`[POSTBACK_DUPLICATE] Duplicate txn_id received: ${txnId}. Acknowledging without crediting.`);
            return new NextResponse('1', { status: 200 });
        }
    } else {
        console.warn(`[POSTBACK_WARNING] No txn_id provided. Cannot check for duplicate transactions. URL: ${fullUrl}`);
    }


    // --- 5. User Balance Update (only if userId and amount are present) ---
    if (userId && pointsCredited > 0) {
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
            if (rpcError.message.includes('violates foreign key constraint')) {
                console.warn(`[POSTBACK_INVALID] User with user_id ${userId} not found.`);
                // Still acknowledge success to the partner, but log the issue.
            } else {
                console.error('[POSTBACK_DB_ERROR] Error calling credit_user_points RPC:', rpcError);
                return new NextResponse('Internal Server Error', { status: 500 });
            }
        } else {
            console.log(`[POSTBACK_SUCCESS] Credited ${pointsCredited} points to user ${userId} for txn_id ${txnId || 'N/A'}.`);
        }
    } else {
        console.warn(`[POSTBACK_INFO] Skipping user credit. Missing userId or amount is zero. UserID: ${userId}, Amount: ${pointsCredited}. URL: ${fullUrl}`);
        // Log the transaction even if we can't credit a user
        const { error: logError } = await supabase.from('transactions').insert({
            user_id: userId,
            points_credited: pointsCredited,
            txn_id: txnId,
            offer_id: offerId,
            offer_name: offerName,
            payout_usd: payoutUsd,
            postback_url: fullUrl,
            ip_address: requestIp,
            status: 'uncredited',
        });
        if (logError) {
            console.error('[POSTBACK_DB_ERROR] Failed to log uncredited transaction:', logError);
        }
    }

    // --- 6. Success Response ---
    // Acknowledge the postback even if some optional parameters were missing.
    return new NextResponse('1', { status: 200 });

  } catch (error) {
    console.error('[POSTBACK_UNHANDLED_ERROR] Unhandled exception:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
