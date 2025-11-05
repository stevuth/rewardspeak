-- Step 1: Clean up the old, problematic functions and triggers.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.generate_unique_short_id();

-- Step 2: Create a simple, built-in function to generate a 5-character random string.
-- We are not checking for uniqueness here; we will rely on the database's primary key constraint to retry.
CREATE OR REPLACE FUNCTION public.generate_short_id()
RETURNS TEXT AS $$
DECLARE
  safe_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  short_id TEXT;
BEGIN
  short_id := (
    SELECT string_agg(
      SUBSTRING(safe_chars, (RANDOM() * LENGTH(safe_chars))::integer + 1, 1), ''
    )
    FROM generate_series(1, 5)
  );
  RETURN short_id;
END;
$$ LANGUAGE plpgsql VOLATILE;


-- Step 3: Alter the 'id' column of the 'profiles' table to use this function as its default value.
-- The database will automatically generate a new ID for every new profile.
-- If a rare collision happens, the insert will fail, and Supabase's auth process can be retried by the user.
-- This is a much more standard and reliable approach.
ALTER TABLE public.profiles
ALTER COLUMN id SET DEFAULT public.generate_short_id();

-- Step 4: Re-create the trigger on auth.users.
-- This new, simplified function ONLY inserts the user_id, email, and referral code.
-- It does NOT touch the 'id' column, allowing the database to generate it automatically.
CREATE OR REPLACE FUNCTION public.handle_new_user_simplified()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- We no longer insert 'id' here. The database will do it for us.
  INSERT INTO public.profiles (user_id, email, referral_code)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'referral_code');
  RETURN new;
END;
$$;

-- Step 5: Attach the new simplified trigger to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_simplified();
