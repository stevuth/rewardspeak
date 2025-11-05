-- This function runs after a new user is created in `auth.users`.
-- It inserts a new row into `public.profiles` for that user.
-- It now calls `generate_unique_short_id()` to create a 5-character ID for the profile.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, user_id, email, points, referral_code)
  VALUES (
    public.generate_unique_short_id(),
    new.id,
    new.email,
    1000, -- Award 1000 points ($1) on signup
    new.raw_user_meta_data->>'referral_code'
  );
  RETURN new;
END;
$$;

-- This command ensures the trigger is active on the auth.users table.
-- It will run the `handle_new_user` function after every new user is created.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();