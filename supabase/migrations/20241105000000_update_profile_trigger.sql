-- This function is triggered when a new user signs up.
-- It creates a corresponding row in the public.profiles table.
create or replace function public.create_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Variable to hold the referral code from auth metadata, if it exists
  referrer_id_val bigint;
  -- Variable to hold the country code from auth metadata
  country_code_val text;
begin
  -- Extract the referral code and country code from the new user's metadata
  select id into referrer_id_val from public.profiles where id = (new.raw_user_meta_data->>'referral_code')::bigint;
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Insert a new row into the public.profiles table
  insert into public.profiles (user_id, email, referred_by, country_code, points)
  values (
    new.id,
    new.email,
    referrer_id_val,
    country_code_val,
    1000 -- Award 1000 points as a sign-up bonus
  );
  return new;
end;
$$;

-- Configure the trigger to execute the function after a new user is inserted into the auth.users table
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user_profile();
