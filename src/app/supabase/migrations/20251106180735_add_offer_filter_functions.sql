
-- Drop the old function first to allow for redefinition
drop function if exists get_filtered_offers (text, text[]);

-- Recreate the function with explicit column selection and correct type conversion
create
or replace function get_filtered_offers (
  country_code_param text,
  offer_ids_param text[]
) returns table (
  offer_id text,
  name text,
  description text,
  click_url text,
  image_url text,
  network text,
  payout numeric,
  countries jsonb,
  platforms jsonb,
  devices jsonb,
  categories jsonb,
  is_disabled boolean,
  created_at timestamptz,
  updated_at timestamptz,
  events jsonb
) as $$
begin
  return query
  select
    ao.offer_id,
    ao.name,
    ao.description,
    ao.click_url,
    ao.image_url,
    ao.network,
    ao.payout,
    to_jsonb(ao.countries),
    to_jsonb(ao.platforms),
    to_jsonb(ao.devices),
    to_jsonb(ao.categories),
    ao.is_disabled,
    ao.created_at,
    ao.updated_at,
    ao.events
  from
    public.all_offers as ao
  where
    ao.offer_id = any (offer_ids_param)
    and (
      'ALL' = any(ao.countries)
      or country_code_param = any(ao.countries)
    ) and ao.is_disabled = false;
end;
$$ language plpgsql;


-- Drop the old function first to allow for redefinition
drop function if exists get_filtered_offers_paginated (text, text, int, int);

-- Recreate the function with explicit column selection and correct type conversion
create
or replace function get_filtered_offers_paginated (
  country_code_param text,
  search_query_param text,
  page_num_param int,
  page_size_param int
) returns table (
  offer_id text,
  name text,
  description text,
  click_url text,
  image_url text,
  network text,
  payout numeric,
  countries jsonb,
  platforms jsonb,
  devices jsonb,
  categories jsonb,
  is_disabled boolean,
  created_at timestamptz,
  updated_at timestamptz,
  events jsonb
) as $$
begin
  return query
  select
    ao.offer_id,
    ao.name,
    ao.description,
    ao.click_url,
    ao.image_url,
    ao.network,
    ao.payout,
    to_jsonb(ao.countries),
    to_jsonb(ao.platforms),
    to_jsonb(ao.devices),
    to_jsonb(ao.categories),
    ao.is_disabled,
    ao.created_at,
    ao.updated_at,
    ao.events
  from
    public.all_offers as ao
  where
    ao.is_disabled = false
    and (
      'ALL' = any(ao.countries)
      or country_code_param = any(ao.countries)
    )
    and (
      search_query_param is null
      or search_query_param = ''
      or ao.name ilike '%' || search_query_param || '%'
    )
  order by
    ao.payout desc
  limit page_size_param offset (page_num_param - 1) * page_size_param;
end;
$$ language plpgsql;
