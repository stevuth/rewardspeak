-- This SQL command will permanently delete the trigger and its associated function.
-- Running this is the first step to cleaning the database and fixing the signup error.

-- Drop the trigger from the auth.users table if it exists.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop the function that the trigger calls if it exists.
DROP FUNCTION IF EXISTS public.handle_new_user();
