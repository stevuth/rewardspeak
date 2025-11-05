
-- Drop any previous, faulty triggers and functions to ensure a clean slate.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Creates a trigger function that inserts a new row into public.profiles
-- when a new user signs up and is created in the auth.users table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile record for the new user.
  -- This function now correctly provides a value for all required columns.
  INSERT INTO public.profiles (id, user_id, email, points, referral_code)
  VALUES (
    gen_random_uuid(), -- Explicitly generate a UUID for the 'id' primary key.
    new.id, -- The user's ID from auth.users.
    new.email, -- The user's email from auth.users.
    1000, -- Award the 1000 point welcome bonus.
    new.raw_user_meta_data->>'referral_code' -- Get the referral code from the metadata passed during signup.
  );
  RETURN new;
END;
$$;

-- Create the trigger that executes the handle_new_user function
-- every time a new user is added to the auth.users table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
