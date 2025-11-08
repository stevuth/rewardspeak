
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers }});
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) { return request.cookies.get(name)?.value },
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

  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/';
  const isAdminLoginRoute = request.nextUrl.pathname === '/admin/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  // --- Unauthenticated User ---
  if (!user) {
    // Allow access to admin login page
    if (isAdminLoginRoute) {
      return response;
    }
    // If trying to access any other admin route, redirect to admin login
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    // Allow access to all other public/auth routes
    return response;
  }

  // --- Authenticated User ---
  const isAdminUser = user.email?.endsWith('@rewardspeak.com');

  // If a non-admin tries to access ANY admin route (including login), redirect to user dashboard
  if (isAdminRoute && !isAdminUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If an admin is logged in and tries to access the admin login page, redirect them to the admin dashboard
  if (isAdminUser && isAdminLoginRoute) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // If a regular user tries to access a public/auth route, redirect them to the user dashboard
  if (!isAdminUser && isAuthRoute) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow admins to access admin routes and regular users to access non-admin/non-auth routes
  return response;
}
