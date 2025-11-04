
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import { createSupabaseApiClient } from '@/utils/supabase/api';
import { NextResponse, type NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const supabaseApi = createSupabaseApiClient(request);
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  // Step 1: Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabaseApi.auth.signUp({
    email,
    password,
  });

  if (authError) {
    console.error("Supabase signup auth error:", authError.message);
    return NextResponse.json({ error: authError.message }, { status: 400 });
  }
  
  if (!authData.user) {
    console.error("Supabase signup did not return a user.");
    return NextResponse.json({ error: "Could not create user." }, { status: 500 });
  }

  // Step 2: Manually create the user profile using the admin client
  // This bypasses the on_auth_user_created trigger, which seems to be the source of the issue.
  const supabaseAdmin = createSupabaseAdminClient();
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ 
        user_id: authData.user.id,
        email: authData.user.email,
        points: 1000 // Awarding the 1000 points ($1) welcome bonus
    });

  if (profileError) {
      console.error("Error creating user profile:", profileError.message);
      // Even if profile creation fails, the auth user was created.
      // In a real-world scenario, you might want to handle this more gracefully,
      // e.g., by deleting the auth user or queuing a retry for profile creation.
      return NextResponse.json({ error: `User created but profile creation failed: ${profileError.message}` }, { status: 500 });
  }

  // Return success response, user will need to confirm their email
  return NextResponse.json({ success: true, user: authData.user });
}
