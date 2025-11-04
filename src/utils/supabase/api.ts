
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

// This client is used for Route Handlers (API routes) and Server Actions.
// It can't use `cookies()` from `next/headers` because that's only for Server Components.
// Instead, it needs the `request` object to be passed in to manage cookies.
export function createSupabaseApiClient(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers }});
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // If the cookie is set, update the request cookies and re-create the response
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers }})
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          // If the cookie is removed, update the request cookies and re-create the response
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers }})
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )
}
