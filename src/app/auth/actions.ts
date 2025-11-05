
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

  // Step 1: Create the user in the auth.users table, passing referral code in metadata
  const { data: { user }, error: signupError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Set to true to bypass email confirmation
    user_metadata: {
        referral_code: referralCode
    }
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
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      user_id: user.id,
      email: user.email,
      referral_code: referralCode, // Use the referralCode from the form directly
      points: 1000, // Award 1000 points ($1) welcome bonus
    });

  if (profileError) {
    console.error('Error creating profile:', profileError);
    // IMPORTANT: If profile creation fails, we must delete the auth user to prevent orphaned accounts.
    await supabaseAdmin.auth.admin.deleteUser(user.id);
    return { 
      message: `A database error occurred while creating your profile. Please try again.`, 
      success: false 
    };
  }

  // Since we created the user with email_confirm: true, we can now log them in directly.
  const supabase = createSupabaseServerClient();
  const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

  if (loginError) {
      return { message: `Account created, but login failed: ${loginError.message}`, success: false };
  }

  // Redirect to the dashboard with a welcome event
  redirect('/dashboard?verified=true');
}
