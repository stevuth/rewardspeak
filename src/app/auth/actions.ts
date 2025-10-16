
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';
  const emailRedirectTo = new URL('/auth/callback', siteUrl);

  // Pass the referral code as a query parameter in the redirect URL
  if (referralCode) {
    emailRedirectTo.searchParams.set('referral_code', referralCode);
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: emailRedirectTo.toString(),
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { message: error.message };
  }
  
  // The database trigger 'on_auth_user_created' handles profile creation.
  redirect('/auth/confirm?signup=true');
}

export async function login(
  state: { message: string },
  formData: FormData
): Promise<{ message:string }> {
  const supabase = createSupabaseServerClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard?login=true');
}
