
-- Step 1: Clean up any old functions and triggers to ensure a fresh start.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user_profile();
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_simplified();
DROP FUNCTION IF EXISTS public.generate_unique_short_id();
DROP FUNCTION IF EXISTS public.generate_short_id();

-- Step 2: Create a function to generate a unique 5-character alphanumeric ID.
-- This function is robust and will re-try if it generates a code that already exists.
CREATE OR REPLACE FUNCTION public.generate_unique_profile_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  short_id TEXT;
  is_unique BOOLEAN := FALSE;
  safe_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  WHILE NOT is_unique LOOP
    short_id := (
      SELECT string_agg(
        SUBSTRING(safe_chars, (RANDOM() * LENGTH(safe_chars))::integer + 1, 1), ''
      )
      FROM generate_series(1, 5)
    );
    PERFORM 1 FROM public.profiles WHERE id = short_id;
    IF NOT FOUND THEN
      is_unique := TRUE;
    END IF;
  END LOOP;
  RETURN short_id;
END;
$$;

-- Step 3: Create the main trigger function that correctly inserts into your 'profiles' table.
-- This function now uses the correct column names: 'id', 'user_id', 'points', and 'referred_by'.
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, points, referred_by)
  VALUES (
    public.generate_unique_profile_id(), -- Generate the unique 5-character ID.
    new.id, -- The new user's UUID from auth.users.
    1000, -- The initial 1000 points ($1) bonus.
    new.raw_user_meta_data->>'referral_code' -- The referral code they signed up with.
  );
  RETURN new;
END;
$$;

-- Step 4: Attach the trigger to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();
