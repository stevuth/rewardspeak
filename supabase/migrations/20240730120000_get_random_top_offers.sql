
create or replace function get_random_top_offers(limit_count integer)
returns setof top_converting_offers
language sql
as $$
  select *
  from top_converting_offers
  order by random()
  limit limit_count;
$$;
