-- This migration enables the pg_cron extension and schedules the 'sync-offers'
-- Edge Function to run every 15 minutes.

-- 1. Enable the pg_cron extension if it's not already enabled.
create extension if not exists pg_cron with schema extensions;

-- 2. Grant usage permissions to the postgres role.
grant usage on schema cron to postgres;
grant all on all tables in schema cron to postgres;

-- 3. Schedule the function to run every 15 minutes.
-- The 'on conflict do update' clause makes this command idempotent,
-- meaning it's safe to run multiple times. It will either create the job or update it.
SELECT cron.schedule(
    'sync-offers-every-15-minutes', -- The unique name for our job
    '*/15 * * * *',                 -- The schedule: every 15 minutes
    $$
    select
        net.http_get(
            -- The URL of the Edge Function to invoke
            url:='https://fxpdfkianxufsjsblgpi.supabase.co/functions/v1/sync-offers'
        );
    $$
)
ON CONFLICT (jobname) DO UPDATE
SET
    schedule = EXCLUDED.schedule,
    command = EXCLUDED.command;
