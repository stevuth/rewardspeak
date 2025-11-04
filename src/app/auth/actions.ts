
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { createSupabaseAdminClient } from '@/utils/supabase/admin'

export async function login(prevState: { message: string }, formData: FormData) {
  const supabase = createSupabaseServerClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { message: 'Email and password are required.' };
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { message: error.message };
  }
  
  return { success: true, userEmail: data.user?.email || '' };
}

export async function signup(prevState: { message: string }, formData: FormData) {
    const supabase = createSupabaseServerClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Email and password are required.' };
    }

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            // emailRedirectTo is not needed if email confirmation is disabled in Supabase settings
        },
    });

    if (error) {
        console.error("Signup Auth Error:", error.message);
        return { message: error.message };
    }
    
    // The on_auth_user_created trigger in Supabase will handle profile creation.
    // We just need to check if the user was created.
    if (!data.user) {
        return { message: 'Could not create user.' };
    }
    
    // We assume the trigger will grant the welcome bonus.
    // If signups complete but points are not granted, the trigger is the issue.

    return { success: true, isNewUser: true, userEmail: data.user.email || '' };
}
