
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
  const supabase = createSupabaseServerClient();
  
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // The trigger will use this data to populate the referral_code in the profiles table.
      data: {
        referral_code: referralCode,
      },
      // Auto-confirm user for simplicity
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    // Provide a more user-friendly error message
    const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }
  
  redirect('/auth/confirm');
}

