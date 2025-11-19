
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define public and auth-related routes
  const isPublicRoute = pathname === '/' || pathname.startsWith('/join')
  const isAuthRoute = pathname.startsWith('/auth')
  const isAdminLoginRoute = pathname === '/admin/login'
  const isSupportLoginRoute = pathname === '/support/login'
  
  // Define protected areas
  const isAdminArea = pathname.startsWith('/admin')
  const isSupportArea = pathname.startsWith('/support')
  const isDashboardArea = pathname.startsWith('/dashboard') || 
                          pathname.startsWith('/earn') ||
                          pathname.startsWith('/referrals') ||
                          pathname.startsWith('/leaderboard') ||
                          pathname.startsWith('/withdraw') ||
                          pathname.startsWith('/history') ||
                          pathname.startsWith('/settings') ||
                          pathname.startsWith('/help') ||
                          pathname.startsWith('/offerwalls')


  // --- Logic for Unauthenticated Users ---
  if (!user) {
    // If trying to access any protected area, redirect to the homepage to log in.
    if (isAdminArea || isSupportArea || isDashboardArea) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Otherwise, allow access to public/auth pages.
    return response
  }

  // --- Logic for Authenticated Users ---
  const isPrivilegedUser = user.email?.endsWith('@rewardspeak.com')

  // If a privileged user is on a public/auth/user-dashboard route, redirect to admin dashboard.
  if (isPrivilegedUser) {
    if (isPublicRoute || isAuthRoute || isDashboardArea) {
       return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
    // They are already in the admin/support area, so let them proceed.
    return response
  }

  // If a regular user is on a public/auth/admin/support route, redirect to user dashboard.
  if (!isPrivilegedUser) {
    if (isPublicRoute || isAuthRoute || isAdminArea || isSupportArea) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    // They are already in the user dashboard area, so let them proceed.
    return response
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
