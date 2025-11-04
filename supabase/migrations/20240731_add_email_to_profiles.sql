-- Step 1: Add the email column to the public.profiles table.
-- It allows NULL values to avoid errors on existing rows, but the trigger will populate it for all new users.
ALTER TABLE public.profiles
ADD COLUMN email TEXT;

-- Step 2: Recreate the trigger function to include the new email field.
-- This function now inserts user_id, referral_code, AND the email into the profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, referral_code, email)
  VALUES (new.id, new.raw_user_meta_data->>'referral_code', new.email);
  RETURN new;
END;
$$;

-- Step 3: Drop the existing trigger to ensure we can apply the new one.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 4: Re-create the trigger to execute our updated function after a new user signs up.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
