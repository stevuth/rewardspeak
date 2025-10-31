
create or replace function get_offers_by_names(names text[])
returns setof top_converting_offers as $$
begin
  return query
  select *
  from top_converting_offers
  where name ilike any (select unnest(names));
end;
$$ language plpgsql;
