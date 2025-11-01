-- This policy allows all operations for users with the 'service_role'.
-- The service_role is used by the Supabase admin client, which is necessary for server-side
-- administrative tasks like syncing offers from an external API.
-- This does NOT compromise your security for regular user access.

-- Drop existing policies if they exist, to start fresh.
DROP POLICY IF EXISTS "Enable all access for service_role" ON public.all_offers;
DROP POLICY IF EXISTS "Enable all access for service_role" ON public.top_converting_offers;

-- Create a permissive policy for the 'all_offers' table.
CREATE POLICY "Enable all access for service_role"
ON public.all_offers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create a permissive policy for the 'top_converting_offers' table.
CREATE POLICY "Enable all access for service_role"
ON public.top_converting_offers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Note: Ensure that Row-Level Security (RLS) is enabled on both tables
-- in your Supabase dashboard for these policies to take effect.
