
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from '@/utils/supabase/api';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  
  if (code) {
    const supabase = createSupabaseApiClient(request);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      // Check if the user is new by looking at the confirmation timestamp.
      // This is a heuristic: if confirmed within the last 10 seconds, they are likely a new user.
      const isNewUser = data.user.email_confirmed_at && (new Date().getTime() - new Date(data.user.email_confirmed_at).getTime() < 10000);

      // If it's a new user verification, redirect to the elegant 'verified' page.
      if (isNewUser) {
        return NextResponse.redirect(`${origin}/auth/verified`);
      }

      // For all other cases (e.g., password reset, regular login), redirect to the original 'next' URL.
      const redirectUrl = new URL(next, origin);
      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error);
  }

  // If there's an error or no code, redirect to a generic error page.
  const errorUrl = new URL('/auth/error', origin);
  errorUrl.searchParams.set('message', 'Could not verify your request. The link may have expired. Please try again.');
  return NextResponse.redirect(errorUrl);
}
