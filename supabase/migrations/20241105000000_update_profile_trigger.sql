-- This function is triggered when a new user signs up.
-- It creates a corresponding row in the public.profiles table,
-- adds a 1000 point signup bonus, and saves the country code.
-- This version correctly handles cases where no referral code is provided.
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
  -- Variable to hold the raw referral code from metadata
  raw_referral_code text;
begin
  -- Extract raw metadata
  raw_referral_code := new.raw_user_meta_data->>'referral_code';
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Only try to find the referrer if a referral code was actually provided
  if raw_referral_code is not null and raw_referral_code != '' then
    select id into referrer_id_val from public.profiles where id = (raw_referral_code)::bigint;
  end if;

  -- Insert a new row into the public.profiles table
  insert into public.profiles (user_id, email, points, referred_by, country_code)
  values (
    new.id,
    new.email,
    1000, -- Add 1000 bonus points on signup
    referrer_id_val, -- This will be NULL if no valid referral code was found
    country_code_val
  );
  return new;
end;
$$;

-- Configure the trigger to execute the function after a new user is inserted into the auth.users table
-- This command ensures the most up-to-date function is always used.
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user_profile();
