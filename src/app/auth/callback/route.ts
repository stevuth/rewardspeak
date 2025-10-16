
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

// This is a helper function to run inside the route handler
const handleReferral = async (supabase: any, referredUserId: string) => {
    // This is a client-side only operation, so we can't do it here.
    // The logic has been moved to the signup form itself.
    return;
};


export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // The database trigger 'on_auth_user_created' will handle profile creation automatically.
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('verified', 'true');
      
      // The referral logic needs to be handled differently.
      // We will now read from localStorage on the client side after signup.
      // This server-side route's primary job is just to verify the session.

      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error);
  }

  // return the user to an error page with instructions
  const redirectUrl = new URL('/auth/error', origin);
  redirectUrl.searchParams.set('message', 'Could not verify email. Please try again.');
  return NextResponse.redirect(redirectUrl);
}
