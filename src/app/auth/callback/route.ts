
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';
import { showLoginToast } from '@/lib/reward-toast';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  
  // Create a URL object for the destination, so we can add parameters
  const redirectUrl = new URL(next, origin);

  if (code) {
    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // The database trigger 'on_profile_created' handles recording the referral.
      
      // Add a parameter to the URL to signal a successful login/verification event
      redirectUrl.searchParams.set('event', 'login');
      redirectUrl.searchParams.set('user_email', data.user.email || '');

      // Add a parameter if it's a first-time verification
      // Check if email_confirmed_at is recent (e.g., within the last 5 seconds)
      const isNewUser = data.user.email_confirmed_at && (new Date().getTime() - new Date(data.user.email_confirmed_at).getTime() < 5000);
      if (isNewUser) {
        redirectUrl.searchParams.set('verified', 'true');
      }

      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error);
  }

  // return the user to an error page with instructions
  redirectUrl.pathname = '/auth/error';
  redirectUrl.searchParams.set('message', 'Could not verify email. Please try again.');
  return NextResponse.redirect(redirectUrl);
}
