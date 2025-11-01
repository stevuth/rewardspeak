-- This file contains SQL commands to create Row-Level Security (RLS) policies
-- that allow the 'service_role' (used by the Supabase admin client) to perform
-- all actions on the specified tables. This is necessary for administrative
-- functions like syncing offers from an external API.

-- To apply this policy, copy the content of this file and run it in the
-- Supabase SQL Editor for your project.

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
