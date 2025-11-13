-- This migration enables the pg_cron extension and schedules the `sync-offers`
-- Edge Function to run every 15 minutes.

-- 1. Ensure the pg_cron extension is enabled.
-- It's safe to run this even if it's already enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
-- Grant usage to the postgres role if not already granted.
GRANT USAGE ON SCHEMA cron TO postgres;

-- 2. Grant permissions to the anon role to invoke the function.
-- This is necessary for the cron job, which runs as the `postgres` user,
-- to have permission to call the function.
GRANT USAGE ON SCHEMA net TO postgres;

-- 3. Define the webhook URL for the function.
-- Supabase automatically provides this endpoint for every deployed function.
-- We use the project's reference ID, which is a stable identifier.
-- The service_role key is required for authentication.
SELECT
    -- Unschedule the job first to ensure this script is repeatable.
    cron.unschedule('sync-offers-every-15-minutes'),
    -- Schedule the job to run every 15 minutes.
    cron.schedule(
        'sync-offers-every-15-minutes', -- The unique name for our job.
        '*/15 * * * *', -- Standard cron syntax for "every 15 minutes".
        $$
        SELECT
            net.http_post(
                url:='https://fxpdfkianxufsjsblgpi.supabase.co/functions/v1/sync-offers',
                headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxMDgwMDB9.ZLs_3Y12T2h47I4iBEs-YCL1e_i4iH5E2t3Qy3iSnjY"}'
            );
        $$
    );
