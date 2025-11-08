
import { createClient } from '@supabase/supabase-js'

// This admin client is used for server-side operations that require
// elevated privileges, bypassing Row-Level Security.
// It uses the SERVICE_ROLE_KEY, which should be kept secret.
// This client should only be used in server-side code (Server Actions, Route Handlers).
export function createSupabaseAdminClient() {
  
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase URL or service role key is not set in environment variables.');
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  )
}
