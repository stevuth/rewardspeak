
-- This migration adds a unique constraint to the user_id column in the profiles table.
-- This is necessary to allow other tables to create a foreign key relationship to it.

ALTER TABLE public.profiles
ADD CONSTRAINT profiles_user_id_key UNIQUE (user_id);

-- Add a comment for clarity
COMMENT ON CONSTRAINT profiles_user_id_key ON public.profiles IS 'Ensures that each Supabase auth user can only have one profile.';
