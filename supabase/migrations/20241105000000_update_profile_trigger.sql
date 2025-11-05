
-- Drop the existing function and trigger if they exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile;

-- Recreate the function to include 'country_code'
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, referred_by, country_code)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code',
    new.raw_user_meta_data->>'country_code'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate the trigger to call the updated function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- Add a comment to the function for clarity
COMMENT ON FUNCTION public.create_user_profile() IS 'Creates a user profile upon new user signup, capturing email, referral code, and country code.';
