-- First, create a function to generate a unique 5-character alphanumeric ID.
CREATE OR REPLACE FUNCTION public.create_random_id()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_id TEXT;
  done BOOLEAN;
  characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  done := FALSE;
  WHILE NOT done LOOP
    new_id := '';
    FOR i IN 1..5 LOOP
      new_id := new_id || substr(characters, (1 + floor(random() * 36))::integer, 1);
    END LOOP;
    done := NOT exists(SELECT 1 FROM public.profiles WHERE id = new_id);
  END LOOP;
  RETURN new_id;
END;
$$;

-- Second, update the main trigger function to use the new ID generator.
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET SEARCH_PATH = public
AS $$
DECLARE
  new_profile_id TEXT;
  referrer_id_val TEXT;
  country_code_val TEXT;
  raw_referral_code TEXT;
BEGIN
  -- Generate a unique 5-character ID for the new profile
  new_profile_id := public.create_random_id();

  -- Extract metadata from the new user object
  raw_referral_code := new.raw_user_meta_data->>'referral_code';
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Safely handle the referral code
  IF raw_referral_code IS NOT NULL AND raw_referral_code != '' THEN
    BEGIN
      SELECT id INTO referrer_id_val FROM public.profiles WHERE id = raw_referral_code;
    EXCEPTION
      WHEN OTHERS THEN
        referrer_id_val := NULL;
    END;
  END IF;

  -- Insert the new profile with the generated ID and other details
  INSERT INTO public.profiles (id, user_id, email, points, referred_by, country_code)
  VALUES (
    new_profile_id,
    new.id,
    new.email,
    1000, -- Add 1000 bonus points on signup
    referrer_id_val,
    country_code_val
  );

  RETURN new;
END;
$$;

-- Finally, ensure the trigger is active on the auth.users table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();
