
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache';

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

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // Pass the referral code in the user metadata.
      // The database trigger 'on_auth_user_created' will use this
      // to populate the profiles table.
      data: {
        referral_code: referralCode,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }
  
  if (!data.user) {
    return { message: "Signup successful, but no user data returned. Please verify your email.", success: true };
  }

  // Redirect to the confirmation page
  redirect('/auth/confirm');
}
