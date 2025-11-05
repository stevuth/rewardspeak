
-- This function is triggered when a new user signs up.
-- It creates a corresponding row in the public.profiles table,
-- correctly handles the auto-incrementing 'id' column,
-- adds a 1000 point signup bonus, and saves the country code.
-- It now safely handles cases where no referral code is provided.
create or replace function public.create_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  -- Use bigint to match the 'id' and 'referred_by' column type in the profiles table
  referrer_id_val bigint;
  -- 'text' is the correct data type for the country_code
  country_code_val text;
  -- Temporary variable to hold the raw referral code from metadata
  raw_referral_code text;
begin
  -- Extract raw metadata from the new user object
  raw_referral_code := new.raw_user_meta_data->>'referral_code';
  country_code_val := new.raw_user_meta_data->>'country_code';

  -- Safely handle the referral code.
  -- Only try to find the referrer's ID if a referral code was actually provided.
  if raw_referral_code is not null and raw_referral_code != '' then
    -- Use a block with an exception handler to prevent errors
    -- if the referral code is invalid or doesn't exist.
    begin
      select id into referrer_id_val from public.profiles where id = raw_referral_code::bigint;
    exception
      when others then
        -- If any error occurs (e.g., invalid format, code not found),
        -- simply leave referrer_id_val as NULL and continue.
        referrer_id_val := null;
    end;
  end if;

  -- Insert a new row into the public.profiles table.
  -- CRITICAL FIX: The `id` column is omitted from the column list,
  -- allowing the database to auto-generate it using its sequence.
  insert into public.profiles (user_id, email, points, referred_by, country_code)
  values (
    new.id,
    new.email,
    1000, -- Add 1000 bonus points on signup
    referrer_id_val, -- This will be the found ID or NULL
    country_code_val
  );
  return new;
end;
$$;

-- Ensure the trigger is correctly configured to use this function
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.create_user_profile();
