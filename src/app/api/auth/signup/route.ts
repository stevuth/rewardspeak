
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabase = createSupabaseApiClient(request);
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // The 'options' block is removed entirely to prevent conflicts with the
  // on_auth_user_created database trigger. The trigger will handle all
  // profile creation logic on its own.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Supabase signup error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  // The user is created, but email confirmation is pending.
  // The on_auth_user_created trigger in Supabase will handle creating the profile.
  return NextResponse.json({ success: true, user: data.user });
}
