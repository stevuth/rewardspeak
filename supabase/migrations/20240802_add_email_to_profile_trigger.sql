-- This function corrects the previous version by adding the user's email
-- to the new profile row upon creation.

CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- This INSERT statement now includes the 'email' column.
  INSERT INTO public.profiles (id, user_id, email, points, referred_by)
  VALUES (
    public.generate_unique_profile_id(), -- The unique 5-character ID.
    new.id, -- The new user's UUID from auth.users.
    new.email, -- The new user's email address.
    1000, -- The initial 1000 points ($1) bonus.
    new.raw_user_meta_data->>'referral_code' -- The referral code they signed up with.
  );
  RETURN new;
END;
$$;

-- Ensure the trigger is attached to the auth.users table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.create_user_profile();
