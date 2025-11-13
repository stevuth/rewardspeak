-- This migration file enables required extensions and schedules the offer sync function.

-- Enable the pg_cron extension for scheduling tasks.
-- This allows us to run functions on a timer.
create extension if not exists "pg_cron" with schema "extensions";

-- Enable the pg_net extension for making HTTP requests.
-- This is required by the cron job to call the API route.
create extension if not exists "pg_net" with schema "extensions";

-- Grant usage permissions to the postgres role for the new schemas.
grant usage on schema cron to postgres;
grant usage on schema net to postgres;

-- IMPORTANT: The service_role key must be added as a secret named `SUPABASE_SERVICE_ROLE_KEY`
-- in the project's secrets settings for this to work.

-- First, delete any existing job with the same name to ensure idempotency.
-- This makes the migration safe to re-run.
DELETE FROM cron.job WHERE jobname = 'sync-offers-every-15-minutes';

-- Schedule the 'sync-offers' function to run every 15 minutes.
-- The function is triggered via an HTTP POST request to its endpoint.
-- We are using the service_role key to bypass RLS for this internal task.
SELECT cron.schedule(
    'sync-offers-every-15-minutes',
    '*/15 * * * *',
    $$
    select
        net.http_post(
            url:='http://localhost:54321/functions/v1/sync-offers',
            headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"}'
        )
    $$
);
