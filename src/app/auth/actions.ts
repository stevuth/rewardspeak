
'use server'

import { createSupabaseServerClient } from '@/utils/supabase/server'
import { createSupabaseAdminClient } from '@/utils/supabase/admin'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(prevState: { message: string }, formData: FormData) {
  const supabase = createSupabaseServerClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Email and password are required.' }
  }

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { message: error.message, success: false }
  }

  return { message: 'Logged in successfully.', success: true }
}

export async function signup(prevState: { message: string }, formData: FormData) {
  const supabaseAdmin = createSupabaseAdminClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { message: 'Email and password are required.', success: false }
  }

  // 1. Create the user in the auth.users table
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm email for simplicity
  })

  if (authError) {
    console.error('Error creating auth user:', authError.message)
    return { message: authError.message, success: false }
  }

  const user = authData.user
  if (!user) {
    return { message: 'User could not be created.', success: false }
  }

  // 2. Manually insert the profile into the public.profiles table
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      user_id: user.id,
      email: user.email,
      points: 1000 // Welcome bonus
    })

  if (profileError) {
    console.error('Error creating profile:', profileError.message)
    // If profile creation fails, we should delete the auth user we just created
    await supabaseAdmin.auth.admin.deleteUser(user.id)
    return { message: `Database error: Could not create user profile. ${profileError.message}`, success: false }
  }

  // 3. Sign the user in to create a session
  const supabase = createSupabaseServerClient()
  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
  if (signInError) {
    console.error('Sign in after signup failed:', signInError.message)
    return { message: `Account created, but automatic login failed. Please try logging in manually.`, success: false }
  }

  return { message: 'Signed up successfully!', success: true }
}
