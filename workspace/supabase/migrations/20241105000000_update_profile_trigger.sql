-- Step 1: Create a function to generate a short, unique alphanumeric ID.
-- This function will be called by our main trigger.
CREATE OR REPLACE FUNCTION public.create_random_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN;
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  done := false;
  WHILE NOT done LOOP
    -- Generate a 6-character random string
    new_id := '';
    FOR i IN 1..6 LOOP
      new_id := new_id || substr(characters, (1 + floor(random() * 36))::integer, 1);
    END LOOP;
    -- Check if this ID already exists in the profiles table
    done := NOT EXISTS(SELECT 1 FROM public.profiles WHERE id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$ LANGUAGE plpgsql VOLATILE;


-- Step 2: Update the main trigger function to use the new ID generator.
-- This function is triggered when a new user signs up.
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
DECLARE
  -- Variable to hold the ID of the user who referred this new user
  referrer_id_val TEXT;
  -- Variable to hold the country code from auth metadata
  country_code_val TEXT;
  -- Temporary variable to hold the raw referral code from metadata
  raw_referral_code TEXT;
  -- Variable to hold the newly generated unique profile ID
  profile_id TEXT;
BEGIN
  -- Generate a unique ID for the new profile
  profile_id := public.create_random_id();

  -- Extract raw metadata from the new user object
  raw_referral_code := new.raw_user_meta_data->>'referral_code';
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Safely handle the referral code.
  IF raw_referral_code IS NOT NULL AND raw_referral_code != '' THEN
    BEGIN
      SELECT id INTO referrer_id_val FROM public.profiles WHERE id = raw_referral_code;
    EXCEPTION
      WHEN OTHERS THEN
        referrer_id_val := NULL;
    END;
  END IF;

  -- Insert a new row into the public.profiles table, now with a guaranteed unique ID.
  INSERT INTO public.profiles (id, user_id, email, points, referred_by, country_code)
  VALUES (
    profile_id, -- The new unique ID for this profile
    new.id,     -- The new user's UUID from auth.users
    new.email,
    1000,       -- Add 1000 bonus points on signup
    referrer_id_val, -- This will be the found ID or NULL
    country_code_val
  );

  RETURN new;
END;
$$;

-- Step 3: Ensure the trigger is correctly configured to use the updated function.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();
