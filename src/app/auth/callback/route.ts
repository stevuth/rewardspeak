
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // The database trigger 'on_auth_user_created' handles profile creation and
      // the subsequent 'on_profile_created' trigger handles recording the referral.
      // No application-level action is needed here for referrals.
      
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
