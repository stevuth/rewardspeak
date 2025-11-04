-- This function will be triggered after a new user signs up.
-- It inserts a new row into the public.profiles table.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert a new profile record for the new user.
  -- It sets the user_id from the new auth.users record.
  -- It gives them a starting balance of 1000 points as a welcome bonus.
  INSERT INTO public.profiles (user_id, points)
  VALUES (new.id, 1000);
  
  -- The trigger function must return the `new` record.
  RETURN new;
END;
$$;

-- This command creates the trigger.
-- It specifies that the `handle_new_user` function should run
-- AFTER a new row is inserted into the `auth.users` table.
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
