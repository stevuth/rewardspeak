
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

  // Define protected areas
  const isAdminArea = pathname.startsWith('/admin');
  const isSupportArea = pathname.startsWith('/support');
  const isDashboardArea = !isAdminArea && !isSupportArea && pathname !== '/' && !pathname.startsWith('/auth') && !pathname.startsWith('/join');

  // --- Logic for Unauthenticated Users ---
  if (!user) {
    // If an unauthenticated user tries to access any protected area, redirect them to the homepage to log in.
    if (isAdminArea || isSupportArea || isDashboardArea) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    // Allow access to public pages (/, /join) and auth pages (/auth/...).
    return response;
  }

  // --- Logic for Authenticated Users ---
  const isPrivilegedUser = user.email?.endsWith('@rewardspeak.com');

  if (isPrivilegedUser) {
    // If a privileged user tries to access the regular user dashboard, redirect them to the admin dashboard.
    if (isDashboardArea) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
  } else {
    // If a regular user tries to access admin or support areas, redirect them to their dashboard.
    if (isAdminArea || isSupportArea) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }
  
  // For all other cases (e.g., admin on admin page, user on user page), allow the request to proceed.
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
