-- This migration enables the necessary extensions and schedules the 'sync-offers' Edge Function.

-- Enable pg_cron, a cron-based job scheduler for PostgreSQL.
create extension if not exists "pg_cron" with schema "extensions";

-- Enable pg_net, which allows PostgreSQL to make HTTP requests.
create extension if not exists "pg_net" with schema "extensions";

-- Grant the postgres role permission to use the pg_net extension.
-- This is necessary for the cron job to be able to make HTTP requests.
grant usage on schema net to postgres, anon, authenticated, service_role;


-- Schedule the 'sync-offers' function to run every 15 minutes.
-- The 'sync-offers-every-15-minutes' is a unique name for the job.
-- '*/15 * * * *' is the cron expression for "every 15 minutes".
-- The command invokes the 'sync-offers' Edge Function using an HTTP POST request.
-- cron.schedule is idempotent: if a job with the same name exists, it will be updated.
-- This avoids errors on subsequent runs of the migration.
select
    cron.schedule(
        'sync-offers-every-15-minutes',
        '*/15 * * * *',
        $$
        select
            net.http_post(
                url:='http://localhost:54321/functions/v1/sync-offers',
                headers:='{"Content-Type": "application/json"}'::jsonb,
                body:='{}'::jsonb
            ) as request_id;
        $$
    );
