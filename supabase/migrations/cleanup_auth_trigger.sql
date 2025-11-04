-- This script permanently removes the faulty trigger and its associated function from your database.
-- Running this is crucial to ensure the new manual signup process in the code works without conflicts.

-- Drop the trigger from the auth.users table to stop it from firing on new signups.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function that the trigger called, as it is no longer needed.
DROP FUNCTION IF EXISTS public.handle_new_user();
