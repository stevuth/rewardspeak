-- Step 1: Create a function to generate a unique 5-character alphanumeric ID.
-- It is defined with SECURITY DEFINER to allow it to be called by the `handle_new_user` trigger,
-- which also runs with elevated privileges. This allows it to check for uniqueness in the profiles table.
CREATE OR REPLACE FUNCTION public.generate_unique_short_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  short_id TEXT;
  is_unique BOOLEAN := FALSE;
  safe_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  -- Loop until a unique ID is found to prevent collisions.
  WHILE NOT is_unique LOOP
    -- Generate a 5-character random string from the safe character set.
    short_id := (
      SELECT string_agg(
        SUBSTRING(safe_chars, (RANDOM() * LENGTH(safe_chars))::integer + 1, 1), ''
      )
      FROM generate_series(1, 5)
    );
    -- Check if the generated ID already exists in the profiles table.
    PERFORM 1 FROM public.profiles WHERE id = short_id;
    IF NOT FOUND THEN
      is_unique := TRUE;
    END IF;
  END LOOP;
  RETURN short_id;
END;
$$;

-- Step 2: Update the user creation trigger to use the new ID generation function.
-- This function now correctly populates the 'id', 'user_id', 'email', and 'referral_code'.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, referral_code, points)
  VALUES (
    public.generate_unique_short_id(),
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code',
    1000 -- Welcome bonus of 1000 points
  );
  RETURN new;
END;
$$;

-- Step 3: Ensure the trigger is active on the auth.users table.
-- This will run the `handle_new_user` function after every new user is created.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();