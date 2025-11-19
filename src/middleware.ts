
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

  const { pathname } = request.nextUrl;

  const isPublicRoute = pathname === '/' || pathname.startsWith('/join');
  const isAuthRoute = pathname.startsWith('/auth');
  const isAdminLoginRoute = pathname === '/admin/login';
  const isSupportLoginRoute = pathname === '/support/login';
  
  const isAdminDashboard = pathname.startsWith('/admin');
  const isSupportDashboard = pathname.startsWith('/support');

  if (!user) {
    if (isPublicRoute || isAuthRoute || isAdminLoginRoute || isSupportLoginRoute) {
      return response;
    }
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is logged in
  const isPrivilegedUser = user.email?.endsWith('@rewardspeak.com');
  const onPublicOrLoginPage = isPublicRoute || isAuthRoute || isAdminLoginRoute || isSupportLoginRoute;
  
  if (onPublicOrLoginPage) {
      if(isPrivilegedUser) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  if (!isPrivilegedUser && (isAdminDashboard || isSupportDashboard)) {
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
