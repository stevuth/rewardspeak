
DROP FUNCTION IF EXISTS get_filtered_offers(text, text[]);
DROP FUNCTION IF EXISTS get_filtered_offers_paginated(text, text, integer, integer);

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
  payout real,
  countries jsonb,
  platforms jsonb,
  devices jsonb,
  categories jsonb,
  events jsonb,
  is_disabled boolean,
  created_at timestamptz,
  updated_at timestamptz
) as $$
begin
  return query
  select
    *
  from
    public.all_offers
  where
    all_offers.offer_id = any (offer_ids_param)
    and (
      all_offers.countries ? 'ALL'
      or all_offers.countries ? country_code_param
    ) and all_offers.is_disabled = false;
end;
$$ language plpgsql;


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
  payout real,
  countries jsonb,
  platforms jsonb,
  devices jsonb,
  categories jsonb,
  events jsonb,
  is_disabled boolean,
  created_at timestamptz,
  updated_at timestamptz
) as $$
begin
  return query
  select
    *
  from
    public.all_offers
  where
    all_offers.is_disabled = false
    and (
      all_offers.countries ? 'ALL'
      or all_offers.countries ? country_code_param
    )
    and (
      search_query_param is null
      or search_query_param = ''
      or all_offers.name ilike '%' || search_query_param || '%'
    )
  order by
    all_offers.payout desc
  limit page_size_param offset (page_num_param - 1) * page_size_param;
end;
$$ language plpgsql;
