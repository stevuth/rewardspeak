
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
    const supabaseAdmin = createSupabaseAdminClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Email and password are required.' };
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
    });

    if (authError) {
        console.error("Signup Auth Error:", authError.message);
        return { message: authError.message };
    }
    
    if (!authData.user) {
        return { message: 'Could not create user.' };
    }

    const userId = authData.user.id;

    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({ 
            user_id: userId,
            email: email,
            points: 1000 // Welcome bonus
        });

    if (profileError) {
        console.error("Signup Profile Error:", profileError.message);
        // If profile creation fails, we must delete the auth user to allow them to try again.
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return { message: `Database error creating profile: ${profileError.message}` };
    }
    
    // After successful signup and profile creation, sign the user in.
    const supabase = createSupabaseServerClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // This is unlikely but possible. We don't delete the user here as they already exist.
      return { message: `Signup successful, but login failed: ${signInError.message}` };
    }

    return { success: true, isNewUser: true };
}
