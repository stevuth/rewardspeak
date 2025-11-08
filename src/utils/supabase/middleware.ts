
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
  const isSupportLoginRoute = request.nextUrl.pathname === '/support/login';
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isSupportRoute = request.nextUrl.pathname.startsWith('/support');
  

  // --- Unauthenticated User ---
  if (!user) {
    // Allow access to login pages
    if (isAdminLoginRoute || isSupportLoginRoute) {
      return response;
    }
    // If trying to access any other protected route, redirect to the appropriate login page
    if (isAdminRoute) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
     if (isSupportRoute) {
      return NextResponse.redirect(new URL('/support/login', request.url));
    }
    // Allow access to all other public/auth routes
    return response;
  }

  // --- Authenticated User ---
  const isPrivilegedUser = user.email?.endsWith('@rewardspeak.com');

  // If a non-privileged user tries to access ANY admin or support route, redirect to user dashboard
  if ((isAdminRoute || isSupportRoute) && !isPrivilegedUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If a privileged user is logged in and tries to access a login page, redirect them to the relevant dashboard
  if (isPrivilegedUser && isAdminLoginRoute) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }
   if (isPrivilegedUser && isSupportLoginRoute) {
    return NextResponse.redirect(new URL('/support/dashboard', request.url));
  }

  // If a regular user tries to access a public/auth route, redirect them to the user dashboard
  if (!isPrivilegedUser && isAuthRoute) {
     return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Allow privileged users to access admin/support routes and regular users to access non-protected routes
  return response;
}
