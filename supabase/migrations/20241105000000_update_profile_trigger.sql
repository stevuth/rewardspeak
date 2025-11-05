-- Drop the existing trigger and function to replace them
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.create_user_profile();

-- Re-create the function to include country_code
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER AS $$
DECLARE
  random_id TEXT;
BEGIN
  -- Generate a random 6-character ID
  random_id := substr(md5(random()::text), 0, 7);

  -- Insert into public.profiles
  INSERT INTO public.profiles (user_id, email, referred_by, country_code, id)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code',
    new.raw_user_meta_data->>'country_code', -- Extract country_code from metadata
    random_id
  );
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-create the trigger to call the new function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- Grant usage on the public schema to the service_role
GRANT USAGE ON SCHEMA public TO service_role;
