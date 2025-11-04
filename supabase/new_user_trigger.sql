
-- Creates a trigger function that inserts a new row into public.profiles
-- when a new user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert a new profile record for the new user.
  -- The user_id is a UUID that comes from auth.users.id.
  -- The referral_code from the user's metadata is also stored.
  insert into public.profiles (user_id, referral_code)
  values (new.id, new.raw_user_meta_data->>'referral_code');
  
  -- The on_auth_user_created trigger requires the function to return the `new` user record.
  return new;
end;
$$;

-- Clean up the old trigger if it exists, to prevent conflicts.
drop trigger if exists on_auth_user_created on auth.users;

-- Create the trigger that executes the handle_new_user function
-- every time a new user is added to the auth.users table.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
