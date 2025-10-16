
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

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Signup error:", error);
    return { message: error.message };
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
