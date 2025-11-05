
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
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabaseAdmin = createSupabaseAdminClient();

  // Step 1: Create the user in auth.users
  const { data: { user }, error: signupError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm user's email
  });

  if (signupError) {
    console.error("Admin Signup Error:", signupError);
    const friendlyMessage = signupError.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${signupError.message}`;
    return { message: friendlyMessage, success: false };
  }

  if (!user) {
    return { message: 'User creation failed unexpectedly. Please try again.', success: false };
  }
  
  // Step 2: Manually insert the user's profile into the public.profiles table
  // This is the robust, explicit, and definitive way to create the profile.
  try {
    const profileData: { user_id: string; email: string; points: number; referral_code?: string } = {
      user_id: user.id,
      email: user.email!,
      points: 1000, // Award 1000 points ($1) welcome bonus
    };

    // **THE FIX**: Only add the referral_code to the insert object if it actually has a value.
    // This prevents errors if the column doesn't allow nulls.
    if (referralCode) {
      profileData.referral_code = referralCode;
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    if (profileError) {
      // This is a critical database error. We must log it and delete the orphaned auth user.
      console.error('CRITICAL: Error creating profile:', profileError);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { 
        message: `A database error occurred while creating your profile. Please contact support. (Code: ${profileError.code})`, 
        success: false 
      };
    }
  } catch (e: any) {
      console.error('CRITICAL: Unhandled exception during profile creation:', e);
      await supabaseAdmin.auth.admin.deleteUser(user.id);
      return { message: `An unexpected server error occurred. Please try again.`, success: false };
  }


  // Step 3: Log the user in with a standard client.
  const supabase = createSupabaseServerClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
      // This is unlikely but possible. The user exists, they just need to log in manually.
      return { message: `Account created, but automatic login failed. Please try logging in manually.`, success: false };
  }

  // Redirect to the dashboard with a welcome event
  redirect('/dashboard?verified=true');
}
