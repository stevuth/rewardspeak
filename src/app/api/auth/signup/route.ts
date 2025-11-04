
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseApi = createSupabaseApiClient(request);
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // This is the standard, default Supabase signup call.
  // It relies entirely on the on_auth_user_created trigger in the database
  // to create the user profile.
  const { data, error } = await supabaseApi.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Supabase signup auth error:", error.message);
    // The error you are seeing is originating from Supabase and being returned here.
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  
  if (!data.user) {
    console.error("Supabase signup did not return a user.");
    return NextResponse.json({ error: "Could not create user." }, { status: 500 });
  }

  // Return success response, user will need to confirm their email
  return NextResponse.json({ success: true, user: data.user });
}
