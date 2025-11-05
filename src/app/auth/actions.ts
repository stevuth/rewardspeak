
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

  return { message: "Successfully logged in.", success: true };
}

export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabase = createSupabaseServerClient();

  // Use the standard signUp method which sends a confirmation email
  const { data: { user }, error: signupError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        referral_code: referralCode, // Pass referral code in metadata
      },
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
    return { message: 'An unknown error occurred during signup.', success: false };
  }
  
  // After successful signup, redirect to a page that tells the user to check their email.
  redirect('/auth/confirm');
}
