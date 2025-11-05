
-- This function is triggered when a new user signs up.
-- It creates a corresponding row in the public.profiles table,
-- adds a 1000 point signup bonus, and saves the country code.
-- It now safely handles cases where no referral code is provided.
create or replace function public.create_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Variable to hold the ID of the user who referred this new user
  referrer_id_val bigint;
  -- Variable to hold the country code from auth metadata
  country_code_val text;
  -- Temporary variable to hold the raw referral code from metadata
  raw_referral_code text;
begin
  -- Extract raw metadata from the new user object
  raw_referral_code := new.raw_user_meta_data->>'referral_code';
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Safely handle the referral code.
  -- Only attempt to find the referrer's ID if a referral code was actually provided and is not an empty string.
  if raw_referral_code is not null and raw_referral_code != '' then
    -- Use a block with an exception handler to prevent errors
    -- if the referral code is invalid (e.g., not a number, doesn't exist).
    begin
      select id into referrer_id_val from public.profiles where id = raw_referral_code::bigint;
    exception
      when others then
        -- If any error occurs (e.g., invalid format, code not found),
        -- simply leave referrer_id_val as NULL and continue without error.
        referrer_id_val := null;
    end;
  end if;

  -- Insert a new row into the public.profiles table.
  -- The "id" column is omitted, allowing the database to auto-generate it.
  insert into public.profiles (user_id, email, points, referred_by, country_code)
  values (
    new.id, -- The new user's UUID from auth.users
    new.email,
    1000, -- Add 1000 bonus points on signup
    referrer_id_val, -- This will be the found ID or NULL if no valid referral code was used
    country_code_val
  );
  
  return new;
end;
$$;

-- Drop the existing trigger to ensure the new function is used.
drop trigger if exists on_auth_user_created on auth.users;

-- Re-create the trigger to execute the updated function after a new user is inserted.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user_profile();
