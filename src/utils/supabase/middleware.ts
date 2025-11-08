
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

  // refreshing the auth token
  const { data: { user } } = await supabase.auth.getUser();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAuthRoute = request.nextUrl.pathname.startsWith('/auth') || request.nextUrl.pathname === '/';

  // If a user is not logged in:
  if (!user) {
    // And is trying to access a protected route (not auth or homepage), redirect to homepage
    if (!isAuthRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    // Otherwise, allow access to public/auth pages
    return response;
  }

  // If a user is logged in:
  const isAdminUser = user.email?.endsWith('@rewardspeak.com');

  // And tries to access an admin route but is not an admin, redirect to dashboard
  if (isAdminRoute && !isAdminUser) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // And is an admin and accessing an admin route, allow it
  if (isAdminRoute && isAdminUser) {
    return response;
  }

  // And tries to access a public/auth route, redirect to dashboard
  if (isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // For all other cases of logged-in users, allow access
  return response;
}
