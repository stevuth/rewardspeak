
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

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

  redirect('/dashboard?event=login');
}


export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabase = createSupabaseServerClient();

  // Use the standard signUp method which sends a confirmation email.
  // The database trigger 'handle_new_user_profile' will handle creating the profile
  // once the user is created in auth.users.
  const { error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      // Pass the referral code to the user metadata. The trigger will use this.
      data: {
        referral_code: referralCode,
      },
    },
  });

  if (error) {
    const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }

  // If signup is successful, redirect to the confirmation page.
  redirect('/auth/confirm');
}
