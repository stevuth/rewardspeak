
import { NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createSupabaseServerClient();
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code);
    if (!sessionError) {
      // After session is created, try to create a profile.
      // The DB function will handle checking if the profile already exists.
      const { error: rpcError } = await supabase.rpc('create_profile_for_user');

      if (rpcError) {
        console.error('Error creating profile after verification:', rpcError);
        // Redirect to an error page or show a message.
        // For now, we will still redirect to dashboard but with an error.
        const redirectUrl = new URL(next, origin);
        redirectUrl.searchParams.set('profile_error', 'true');
        return NextResponse.redirect(redirectUrl);
      }

      // Add a query param to show a toast on the client
      const redirectUrl = new URL(next, origin);
      redirectUrl.searchParams.set('verified', 'true');
      return NextResponse.redirect(redirectUrl);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`);
}
