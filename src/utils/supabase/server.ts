
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export function createSupabaseServerClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { 
            cookieStore.set({ name, value, ...options });
            // Revalidate path to ensure the new cookie is available for subsequent server actions.
            revalidatePath('/', 'layout');
          } catch (error) {
            // This can happen in server components, safe to ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try { 
            cookieStore.set({ name, value: '', ...options });
            // Revalidate path to ensure the cookie is removed for subsequent server actions.
            revalidatePath('/', 'layout');
          } catch (error) {
            // This can happen in server components, safe to ignore.
          }
        },
      },
    }
  );
}
