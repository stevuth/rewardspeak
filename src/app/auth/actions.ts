
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

  redirect('/dashboard?event=login');
}

// This helper function generates a unique 5-character ID and ensures it doesn't already exist.
async function generateUniqueShortId(supabaseAdmin: any): Promise<string> {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let isUnique = false;
    let shortId = '';
    let attempts = 0;

    while (!isUnique && attempts < 10) { // Add a circuit breaker
        shortId = '';
        for (let i = 0; i < 5; i++) {
            shortId += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        const { data, error } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', shortId)
            .single();

        if (error && error.code === 'PGRST116') { // 'PGRST116' means no rows found, so the ID is unique.
            isUnique = true;
        } else if (data) {
            // ID exists, loop will run again.
            attempts++;
        } else if (error) {
           // An actual database error occurred
           throw new Error(`Database error while checking for unique ID: ${error.message}`);
        }
    }
    
    if (!isUnique) {
      throw new Error("Failed to generate a unique ID after multiple attempts.");
    }

    return shortId;
}


export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const referralCode = formData.get('referral_code') as string | null;

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false };
  }

  const supabase = createSupabaseServerClient();

  // Step 1: Use the standard signUp method which sends a confirmation email
  const { data: { user }, error: signupError } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      // Pass the referral code to the user metadata. The trigger will need this.
      data: {
        referral_code: referralCode,
      },
    },
  });

  if (signupError) {
    const friendlyMessage = signupError.message.includes('unique constraint')
        ? 'A user with this email already exists.'
        : `Signup failed: ${signupError.message}`;
    return { message: friendlyMessage, success: false };
  }

  if (!user) {
    return { message: 'An unknown error occurred: user was not created.', success: false };
  }

  // If signup is successful, redirect to the confirmation page.
  // The database trigger 'on_auth_user_created' will handle creating the profile.
  redirect('/auth/confirm');
}
