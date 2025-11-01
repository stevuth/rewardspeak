-- This migration creates permissive Row-Level Security (RLS) policies
-- to allow the service_role full access to the offers tables. This is
-- necessary for the admin functions, like syncOffers, to work correctly.

-- Ensure RLS is enabled on the tables before applying these policies.
-- You can do this in the Supabase dashboard under Authentication -> Policies.

-- Drop existing policies if they conflict (optional, but good for cleanup)
DROP POLICY IF EXISTS "Allow all for service_role on all_offers" ON public.all_offers;
DROP POLICY IF EXISTS "Allow all for service_role on top_converting_offers" ON public.top_converting_offers;

-- Policies for all_offers table
CREATE POLICY "Allow all for service_role on all_offers"
ON public.all_offers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policies for top_converting_offers table
CREATE POLICY "Allow all for service_role on top_converting_offers"
ON public.top_converting_offers
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);
