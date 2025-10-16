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
      // Add a query param to show a toast on the client
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('verified', 'true');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}
