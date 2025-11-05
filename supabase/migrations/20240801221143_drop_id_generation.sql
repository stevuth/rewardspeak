-- Step 1: Remove the default value from the 'id' column in the 'profiles' table.
ALTER TABLE public.profiles ALTER COLUMN id DROP DEFAULT;

-- Step 2: Drop the trigger from the auth.users table.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Step 3: Drop all the custom functions we created.
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_new_user_simplified();
DROP FUNCTION IF EXISTS public.generate_unique_short_id();
DROP FUNCTION IF EXISTS public.generate_short_id();

-- Step 4: Re-instate a simple trigger to create a profile entry on new user signup.
-- This is necessary for the standard Supabase signUp flow.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile, using the user's UUID as the profile ID.
  INSERT INTO public.profiles (id, user_id, email, referral_code, points)
  VALUES (
    new.id::text, -- Use the user's UUID as the profile ID
    new.id,
    new.email,
    new.raw_user_meta_data->>'referral_code',
    1000 -- Assign welcome bonus points
  );
  RETURN new;
END;
$$;

-- Step 5: Attach the trigger to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
