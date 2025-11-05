

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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabaseAdmin = createSupabaseAdminClient();

  // Create the user in the auth system first
  const { data: { user }, error: signupError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true, // You can set this to false to require email verification
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

  // Now, manually create the corresponding profile
  try {
    const profileData: { user_id: string; email: string; points: number; referral_code?: string, id: string } = {
      id: crypto.randomUUID(),
      user_id: user.id,
      email: user.email!,
      points: 1000, // Welcome bonus
    };

    if (referralCode) {
      profileData.referral_code = referralCode;
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      // This is a critical error, might need manual intervention or cleanup
      console.error('CRITICAL: User created but profile insertion failed:', profileError);
      // You might want to delete the user here to allow them to retry
      // await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { message: `Profile creation failed: ${profileError.message}. Please contact support.`, success: false };
    }
  } catch (e: any) {
    return { message: `An unexpected error occurred: ${e.message}`, success: false };
  }
  
  // Since we used an admin client, we need to manually sign in the user to create a session
  const supabase = createSupabaseServerClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

  if (signInError) {
      // This is unlikely but possible
      return { message: `Account created, but login failed: ${signInError.message}. Please try logging in manually.`, success: false };
  }
  
  redirect('/dashboard?verified=true');
}
