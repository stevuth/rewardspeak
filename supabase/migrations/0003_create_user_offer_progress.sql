-- Migration to create the user_offer_progress table
-- This table will store the state of each offer a user has started.

CREATE TABLE IF NOT EXISTS public.user_offer_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
    offer_id TEXT NOT NULL,
    offer_details JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'in-progress' CHECK (status IN ('in-progress', 'completed')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_event_ids TEXT[] DEFAULT '{}',

    -- A user can only have one progress entry per offer
    UNIQUE (user_id, offer_id)
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_user_offer_progress_user_id ON public.user_offer_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_offer_progress_status ON public.user_offer_progress(status);

-- Enable Row Level Security
ALTER TABLE public.user_offer_progress ENABLE ROW LEVEL SECURITY;

-- Policies for RLS
-- Users can only see their own offer progress
CREATE POLICY "Allow users to read their own offer progress"
ON public.user_offer_progress
FOR SELECT
USING (auth.uid() = user_id);

-- Disallow direct client-side modifications
CREATE POLICY "Disallow client-side writes to offer progress"
ON public.user_offer_progress
FOR ALL
USING (false)
WITH CHECK (false);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_user_offer_progress_update()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function on update
CREATE TRIGGER on_user_offer_progress_update
BEFORE UPDATE ON public.user_offer_progress
FOR EACH ROW
EXECUTE FUNCTION public.handle_user_offer_progress_update();

-- Add comments for clarity
COMMENT ON TABLE public.user_offer_progress IS 'Tracks the progress of users for specific offers they have started.';
COMMENT ON COLUMN public.user_offer_progress.offer_details IS 'A JSON blob containing immutable offer data like name, image, and all possible events.';
COMMENT ON COLUMN public.user_offer_progress.status IS 'Current status of the offer for the user (e.g., in-progress, completed).';
COMMENT ON COLUMN public.user_offer_progress.completed_event_ids IS 'An array of event IDs that the user has completed for this offer.';
