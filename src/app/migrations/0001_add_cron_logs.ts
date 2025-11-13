
-- This is a migration file. It is used to apply changes to the database.
-- It is written in SQL and is executed by the Supabase CLI.
--
-- To apply this migration:
-- 1. Ensure you have the Supabase CLI installed.
-- 2. Run `supabase link --project-ref <your-project-ref>` to link your project.
-- 3. Run `supabase db push` to apply the migration.

CREATE TABLE IF NOT EXISTS public.cron_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    status text NOT NULL,
    log_message text,
    offers_synced_count integer DEFAULT 0,
    PRIMARY KEY (id)
);

ALTER TABLE public.cron_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to cron logs"
ON public.cron_logs
FOR SELECT
USING (true);

CREATE POLICY "Disallow all writes to cron logs from client"
ON public.cron_logs
FOR ALL
USING (false)
WITH CHECK (false);

-- Add comments to the table and columns
COMMENT ON TABLE public.cron_logs IS 'Stores logs for automated cron jobs, like offer syncing.';
COMMENT ON COLUMN public.cron_logs.status IS 'The final status of the cron job run (e.g., success, failure).';
COMMENT ON COLUMN public.cron_logs.log_message IS 'A detailed log of the cron job execution.';
COMMENT ON COLUMN public.cron_logs.offers_synced_count IS 'The number of new or updated offers synced during the run.';

    