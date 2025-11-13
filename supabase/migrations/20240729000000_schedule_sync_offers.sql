-- This migration schedules the 'sync-offers' edge function to run every 15 minutes.
-- It uses the pg_cron extension, which must be enabled on your Supabase project.

-- 1. Unschedule any existing job with the same name to avoid duplicates.
-- The 'if exists' flag prevents an error if the job doesn't exist yet.
select cron.unschedule('sync-offers-every-15-minutes');

-- 2. Schedule the new job.
select
  cron.schedule(
    -- A unique name for the cron job.
    'sync-offers-every-15-minutes',
    -- The schedule expression: '*/15 * * * *' means "at every 15th minute".
    '*/15 * * * *',
    -- The command to execute. This is a POST request to our edge function.
    $$
    select
      net.http_post(
        -- The URL of the edge function to invoke.
        url:= supabase_url() || '/functions/v1/sync-offers',
        -- The required headers for authentication.
        headers:=jsonb_build_object(
            'Authorization', 'Bearer ' || supabase_service_role_key(),
            'Content-Type', 'application/json'
        )
      ) as request_id;
    $$
  );
