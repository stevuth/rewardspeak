
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export function createSupabaseServerClient(revalidate: boolean = false) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieStore = cookies();
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try { 
            const cookieStore = cookies();
            cookieStore.set({ name, value, ...options });
            if (revalidate) {
                revalidatePath('/', 'layout');
            }
          } catch (error) {
            // This can happen in server components, safe to ignore.
          }
        },
        remove(name: string, options: CookieOptions) {
          try { 
            const cookieStore = cookies();
            cookieStore.set({ name, value: '', ...options });
            if (revalidate) {
                revalidatePath('/', 'layout');
            }
          } catch (error) {
            // This can happen in server components, safe to ignore.
          }
        },
      },
    }
  );
}
