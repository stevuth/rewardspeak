
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(prevState: { message: string, success?: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { message: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard?event=login')
}

export async function signup(prevState: { message: string, success?: boolean }, formData: FormData) {
  const supabase = createSupabaseServerClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const referralCode = formData.get('referral_code') as string | null;


  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  // The database trigger 'on_auth_user_created' will now handle profile creation automatically.
  // We only need to sign the user up here.
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
        data: {
            referral_code: referralCode,
        }
    }
  })

  if (error) {
    return { message: error.message, success: false }
  }

  revalidatePath('/', 'layout')
  redirect('/auth/confirm')
}
