
-- Step 1: Add the 'email' column to the 'profiles' table.
-- It's nullable for now to handle any existing rows that don't have an email.
ALTER TABLE public.profiles
ADD COLUMN email VARCHAR(255);

-- Step 2: Create a unique index on the new email column to ensure data integrity.
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_key ON public.profiles(email);


-- Step 3: Update the trigger function to populate the new email column.
-- This function now inserts user_id, email, and referral_code into the profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile record for the new user.
  INSERT INTO public.profiles (user_id, email, referral_code)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'referral_code');
  
  -- The on_auth_user_created trigger requires the function to return the `new` user record.
  RETURN NEW;
END;
$$;

-- Step 4: Drop the old trigger if it exists to avoid conflicts.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 5: Re-create the trigger to execute the updated function
-- after a new user is inserted into auth.users.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Optional Step 6: Backfill the email column for existing users.
-- This script will update existing profiles with the email from the auth.users table.
-- It's safe to run even if there are no existing users.
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.user_id = u.id AND p.email IS NULL;
