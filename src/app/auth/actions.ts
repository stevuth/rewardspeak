
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { createSupabaseAdminClient } from '@/utils/supabase/admin';

export async function login(prevState: { message: string, success?: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { message: error.message, success: false }
  }

  return { message: 'Login successful!', success: true };
}

export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  const supabaseAdmin = createSupabaseAdminClient();

  // 1. Create the user in Supabase Auth
  const { data: { user }, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // Auto-confirm user for simplicity
  });

  if (signUpError) {
    console.error("Admin Signup Error:", signUpError);
    return { message: `Error creating user: ${signUpError.message}`, success: false };
  }

  if (!user) {
    return { message: 'User was not created, but no error was reported.', success: false };
  }
  
  // 2. Manually create the profile in the public.profiles table
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({ 
      user_id: user.id, 
      points: 1000, // Welcome bonus
      referral_code: referralCode,
    });
  
  if (profileError) {
    console.error("Profile Creation Error:", profileError);
    // If profile creation fails, we must delete the auth user to avoid orphans
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return { message: `Database error saving new user: ${profileError.message}`, success: false };
  }

  // 3. Log the user in by creating a session for them
  const supabase = createSupabaseServerClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (loginError) {
     return { message: `User created, but login failed: ${loginError.message}`, success: false };
  }
  
  redirect('/dashboard?verified=true');
}
