
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const { email, password, referral_code } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        referral_code: referral_code || null,
      },
    },
  });

  if (error) {
    console.error("Supabase signup error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // The user is created, but email confirmation is pending.
  // The on_auth_user_created trigger in Supabase will handle creating the profile.
  return NextResponse.json({ success: true, user: data.user });
}
