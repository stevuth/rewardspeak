
'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
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
  
  const userEmail = data.user?.email || '';

  revalidatePath('/', 'layout');
  redirect(`/dashboard?event=login&user_email=${encodeURIComponent(userEmail)}`);
}

export async function signup(prevState: { message: string }, formData: FormData) {
    const supabaseAdmin = createSupabaseAdminClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { message: 'Email and password are required.' };
    }

    // Step 1: Create the user in the auth schema using the admin client
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm the email for simplicity
    });

    if (authError) {
        console.error("Signup Auth Error:", authError.message);
        return { message: authError.message };
    }
    
    if (!authData.user) {
        return { message: 'Could not create user.' };
    }

    const userId = authData.user.id;

    // Step 2: Manually insert the profile into the public.profiles table
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({ 
            user_id: userId,
            email: email,
            points: 1000 // Welcome bonus
        });

    if (profileError) {
        console.error("Signup Profile Error:", profileError.message);
        // If profile insertion fails, we should probably delete the auth user
        // to avoid having an orphaned auth user without a profile.
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return { message: `Database error creating profile: ${profileError.message}` };
    }
    
    // Step 3: Log the user in now that they are fully created
    const supabase = createSupabaseServerClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      return { message: signInError.message };
    }

    revalidatePath('/', 'layout');
    redirect('/dashboard?verified=true');
}
