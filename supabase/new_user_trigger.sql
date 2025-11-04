-- Drop the trigger from the auth.users table to stop it from firing on new signups.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function that the trigger called, as it is no longer needed and is the source of the errors.
DROP FUNCTION IF EXISTS public.handle_new_user();
