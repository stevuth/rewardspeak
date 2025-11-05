-- This migration fixes the new user profile creation process.
-- The previous trigger failed because it did not provide a value for the 'id' column in the 'profiles' table,
-- which is a required field (primary key). This script corrects the trigger function to insert the new user's
-- authentication ID into both the 'id' and 'user_id' columns, satisfying the database constraints.

-- Step 1: Clean up any previous trigger and function to ensure a fresh start.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_simplified();
DROP FUNCTION IF EXISTS public.generate_unique_short_id();
DROP FUNCTION IF EXISTS public.generate_short_id();


-- Step 2: Create the new, correct function.
-- The critical fix is that this function now provides a value for the 'id' column.
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert into profiles, using the new user's ID for both 'id' and 'user_id' columns.
  -- This ensures the required 'id' column is not null.
  INSERT INTO public.profiles (id, user_id, email, referral_code, points)
  VALUES (
    new.id::text, -- Use the user's UUID for the primary 'id' column.
    new.id,       -- Also use the user's UUID for the 'user_id' foreign key column.
    new.email,
    new.raw_user_meta_data->>'referral_code',
    1000          -- Award 1000 points ($1) on signup.
  );
  RETURN new;
END;
$$;

-- Step 3: Attach the new, correct trigger to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_profile();
