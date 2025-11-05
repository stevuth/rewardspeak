-- This function generates a unique 5-character ID for new user profiles.
-- The critical fix is adding `SECURITY DEFINER`, which gives this function
-- the necessary permissions to check the `profiles` table for uniqueness
-- when it's called by the database trigger.

CREATE OR REPLACE FUNCTION public.generate_unique_short_id()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public -- This is the crucial fix
AS $$
DECLARE
  short_id TEXT;
  is_unique BOOLEAN := FALSE;
  safe_chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
BEGIN
  -- Loop until a unique ID is found.
  WHILE NOT is_unique LOOP
    -- Generate a 5-character random string.
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


-- We also re-apply the handle_new_user and the trigger to ensure the entire
-- system is using the corrected function.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, referral_code)
  VALUES (
    public.generate_unique_short_id(),
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code'
  );
  RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
