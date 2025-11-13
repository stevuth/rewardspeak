-- This migration file enables required extensions and schedules the 'sync-offers' edge function.
-- To apply this migration, run the following command in your terminal:
-- npx supabase db push

-- 1. Enable pg_cron for scheduling tasks
create extension if not exists "pg_cron" with schema "extensions";
grant usage on schema cron to postgres;

-- 2. Enable pg_net for making HTTP requests from within the database
create extension if not exists "pg_net" with schema "extensions";
grant usage on schema net to postgres;

-- 3. Unschedule any existing job with the same name to make this script re-runnable.
-- The `if_exists` parameter is set to true, so it won't throw an error if the job doesn't exist.
select cron.unschedule(job_name := 'sync-offers-every-15-minutes', if_exists := true);

-- 4. Schedule the 'sync-offers' function to run every 15 minutes.
-- This calls the function via an HTTP POST request.
-- Note: Replace 'YOUR_SUPABASE_PROJECT_URL' with your actual project URL.
-- Note: Replace 'YOUR_SUPABASE_ANON_KEY' with your actual anon key.
select
  cron.schedule(
    'sync-offers-every-15-minutes',
    '*/15 * * * *', -- This cron expression means "every 15 minutes"
    $$
    select
      net.http_post(
        url := 'https://fxpdfkianxufsjsblgpi.supabase.co/functions/v1/sync-offers',
        headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5NDZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"}'::jsonb,
        body := '{}'::jsonb
      ) as request_id;
    $$
  );
