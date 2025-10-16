
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

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (signUpError) {
    return { message: signUpError.message };
  }

  if (!signUpData.user) {
    return { message: 'Signup successful, but no user data returned. Please try logging in.' };
  }

  // Call the database function to generate a unique ID
  const { data: uniqueId, error: rpcError } = await supabase
    .rpc('generate_unique_id');

  if (rpcError) {
      console.error('Error generating unique ID:', rpcError);
      return { message: `User created, but failed to generate unique ID: ${rpcError.message}` };
  }

  // Create a profile for the new user with the generated ID
  const { error: profileError } = await supabase.from('profiles').insert({
    user_id: signUpData.user.id,
    id: uniqueId,
  });

  if (profileError) {
    // This is a critical error, we should ideally delete the created user
    // or have a cleanup mechanism. For now, we'll return the error.
    console.error('Error creating profile:', profileError);
    return { message: `User created, but failed to create profile: ${profileError.message}` };
  }


  // Redirect to a page that tells the user to check their email
  redirect('/auth/confirm?signup=true');
}

export async function login(
  state: { message: string },
  formData: FormData
): Promise<{ message: string }> {
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
