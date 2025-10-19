
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/utils/supabase/server';

export async function signup(
  state: { message: string },
  formData: FormData
): Promise<{ message: string }> {
  const supabase = createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
    const emailRedirectTo = new URL('/auth/callback', siteUrl);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: emailRedirectTo.toString(),
        data: {
          referral_code: referralCode || null
        }
      },
    });

    if (error) {
      // Don't throw, return the error message in the state
      return { message: error.message };
    }
    
    // On success, redirect to the confirmation page
    redirect('/auth/confirm');

  } catch (error) {
    // Catch any other unexpected errors
    return { message: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}

export async function login(
  state: { message: string },
  formData: FormData
): Promise<{ message:string }> {
  const supabase = createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Don't throw, return the error message in the state
      return { message: error.message };
    }

    const userEmail = data.user?.email || '';

    // On success, revalidate and redirect
    revalidatePath('/', 'layout');
    redirect(`/dashboard?event=login&user_email=${encodeURIComponent(userEmail)}`);

  } catch (error) {
    // Catch any other unexpected errors
    return { message: error instanceof Error ? error.message : "An unexpected error occurred." };
  }
}
