
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error) {
      // The database trigger 'on_auth_user_created' will now handle profile creation automatically.
      // No need to call RPC here anymore.
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
