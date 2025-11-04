
'use server'

import { revalidatePath } from 'next/cache'
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
  
  revalidatePath('/', 'layout');
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
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return { message: `Database error creating profile: ${profileError.message}` };
    }
    
    const supabase = createSupabaseServerClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { message: signInError.message };
    }

    revalidatePath('/', 'layout');
    return { success: true, isNewUser: true };
}
