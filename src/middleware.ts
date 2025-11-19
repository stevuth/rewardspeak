
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

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/' || request.nextUrl.pathname.startsWith('/join');
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login'
  const isSupportLoginRoute = request.nextUrl.pathname === '/support/login'
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isSupportRoute = request.nextUrl.pathname.startsWith('/support')

  // If user is not logged in
  if (!user) {
    // Allow access to login pages and public routes, otherwise redirect.
    if (isAuthRoute || isAdminLoginRoute || isSupportLoginRoute) {
      return response
    }
    // For any other protected route, redirect to the main sign-in page
    return NextResponse.redirect(new URL('/', request.url))
  }
  
  // If user is logged in
  const isPrivilegedUser = user.email?.endsWith('@rewardspeak.com')

  // If a non-privileged user tries to access admin or support, redirect to dashboard
  if ((isAdminRoute || isSupportRoute) && !isPrivilegedUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If a logged-in user tries to access a public auth page (like / or /auth/confirm), redirect to their respective dashboard.
  if (isAuthRoute) {
      if (isPrivilegedUser) {
        // Redirect to admin dashboard if they land on a public page
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
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
