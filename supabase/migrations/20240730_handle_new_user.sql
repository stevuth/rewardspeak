-- Function to create a profile for a new user.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  -- Insert a new profile record for the new user, providing a 1000 point welcome bonus.
  insert into public.profiles (user_id, email, points)
  values (new.id, new.email, 1000);
  return new;
end;
$$;

-- Trigger to run the function after a new user is created in the auth.users table.
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
