
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache';
import { createSupabaseAdminClient } from '@/utils/supabase/admin';
import crypto from 'crypto';

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
    return { message: 'Email and password are required.', success: false };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      // The user's email will be sent to the confirmation URL set in your Supabase project.
      emailRedirectTo: `/auth/callback`,
      // Pass the referral code as metadata so the trigger can access it.
      data: {
        referral_code: referralCode,
      }
    },
  });

  if (error) {
    console.error("Signup Error:", error);
    const friendlyMessage = error.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${error.message}`;
    return { message: friendlyMessage, success: false };
  }
  
  // On success, Supabase sends a confirmation email.
  // We redirect the user to a page telling them to check their inbox.
  redirect('/auth/confirm');
}
