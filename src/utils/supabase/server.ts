
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

// NOTE: This is a server-only client.
// It is used in Server Components, Server Actions, and Route Handlers.
// It can be used to make both authenticated and unauthenticated requests.
//
// Because it is a server-only client, it can make use of the `cookies`
// header from `next/headers` to securely manage user sessions.
export function createSupabaseServerClient(revalidate: boolean = false) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: CookieOptions) {
          try { 
            const cookieStore = cookies();
            cookieStore.set({ name, value, ...options });
            if (revalidate) {
                revalidatePath('/', 'layout');
            }
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        async remove(name: string, options: CookieOptions) {
          try { 
            const cookieStore = cookies();
            cookieStore.set({ name, value: '', ...options });
            if (revalidate) {
                revalidatePath('/', 'layout');
            }
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}
