
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const referralCode = searchParams.get('referral_code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // The database trigger 'on_auth_user_created' handles profile creation.
      
      // If a referral code is present, process it.
      if (referralCode) {
        // We call the database function to record the referral.
        // It's a 'fire-and-forget' call; we don't need to await it.
        // The function is secure and handles all validation.
        supabase.rpc('record_referral', {
            referred_user_id: data.user.id,
            referral_code: referralCode
        }).then(({ error: rpcError }) => {
            if (rpcError) {
                console.error('Error recording referral:', rpcError);
            }
        });
      }

      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('verified', 'true');
      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error);
  }

  // return the user to an error page with instructions
  const redirectUrl = new URL('/auth/error', origin);
  redirectUrl.searchParams.set('message', 'Could not verify email. Please try again.');
  return NextResponse.redirect(redirectUrl);
}
