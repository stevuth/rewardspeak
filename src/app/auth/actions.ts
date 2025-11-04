
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache';
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

  return { message: "Successfully logged in.", success: true };
}

export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  // Use the non-admin client for the initial signup with email confirmation
  const { data: { user }, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (signupError) {
    console.error("Signup Error:", signupError);
    const friendlyMessage = signupError.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${signupError.message}`;
    return { message: friendlyMessage, success: false };
  }
  
  if (!user) {
    return { message: "Signup successful, but no user data returned. Please verify your email.", success: true };
  }

  // IMPORTANT: Use the ADMIN client to insert into the profiles table, bypassing RLS.
  // This is the manual, robust way of creating the profile.
  const supabaseAdmin = createSupabaseAdminClient();
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      user_id: user.id,
      email: user.email,
      referral_code: referralCode
    });

  if (profileError) {
      console.error('Error creating profile:', profileError);
      // Even if profile creation fails, the user was created in auth.
      // We should inform them to contact support.
      return { message: `Your account was created, but we couldn't set up your profile. Please contact support. Error: ${profileError.message}`, success: false };
  }


  // Redirect to the confirmation page
  redirect('/auth/confirm');
}
