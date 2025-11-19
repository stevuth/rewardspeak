
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
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers }});
          response.cookies.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers }});
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Define protected user routes
  const protectedUserRoutes = [
    '/dashboard',
    '/earn',
    '/referrals',
    '/leaderboard',
    '/withdraw',
    '/history',
    '/settings',
    '/help',
  ];

  const isProtectedRoute = protectedUserRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith('/auth') || pathname.startsWith('/join');
  const isHomePage = pathname === '/';
  
  // Admin and Support portals are not protected by this middleware anymore,
  // as they handle their own sessionless authentication.
  const isAdminPortal = pathname.startsWith('/admin');
  const isSupportPortal = pathname.startsWith('/support');

  if (isAdminPortal || isSupportPortal) {
    // Let requests to admin/support portals pass through without session checks.
    // Their own layouts/pages will handle auth.
    return response;
  }

  if (!user && isProtectedRoute) {
    // If user is not logged in and tries to access a protected route, redirect to homepage to log in.
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (user && (isAuthRoute || isHomePage)) {
    // If a logged-in user tries to access auth pages or the homepage, redirect them to their dashboard.
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

    