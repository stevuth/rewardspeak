
import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseApiClient } from '@/utils/supabase/api';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  
  const redirectUrl = new URL(next, origin);

  if (code) {
    const supabase = createSupabaseApiClient(request);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!error && data.user) {
      redirectUrl.searchParams.set('event', 'login');
      redirectUrl.searchParams.set('user_email', data.user.email || '');

      const isNewUser = data.user.email_confirmed_at && (new Date().getTime() - new Date(data.user.email_confirmed_at).getTime() < 5000);
      if (isNewUser) {
        redirectUrl.searchParams.set('verified', 'true');
      }

      return NextResponse.redirect(redirectUrl);
    }

    console.error('Error exchanging code for session:', error);
  }

  redirectUrl.pathname = '/auth/error';
  redirectUrl.searchParams.set('message', 'Could not verify email. Please try again.');
  return NextResponse.redirect(redirectUrl);
}
