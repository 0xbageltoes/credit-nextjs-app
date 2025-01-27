-- Backfill profiles for existing users
insert into public.profiles (id, display_name, created_at, updated_at)
select 
  id,
  raw_user_meta_data->>'name',
  created_at,
  created_at
from auth.users
where id not in (select id from public.profiles);

-- Backfill settings for existing users
insert into public.user_settings (
  id,
  decimal_places,
  default_currency,
  default_return_metric,
  show_grid_lines,
  dark_mode,
  compact_mode,
  day_count_convention,
  settlement_days,
  price_decimal_places,
  yield_decimal_places,
  spread_decimal_places,
  cashflow_table_settings,
  matrix_table_settings,
  created_at,
  updated_at
)
select 
  id,
  2, -- default decimal places
  'USD', -- default currency
  'yield_percent'::public.return_metric_type, -- default return metric
  true, -- show grid lines
  false, -- dark mode
  false, -- compact mode
  'ACT/360', -- day count convention
  2, -- settlement days
  3, -- price decimal places
  3, -- yield decimal places
  0, -- spread decimal places
  '{
    "showPresentValue": true,
    "defaultSortColumn": "paymentDate",
    "defaultSortDirection": "asc"
  }'::jsonb, -- cashflow table settings
  '{
    "defaultView": "yield",
    "showSpreadToWorst": true,
    "showYieldToWorst": true
  }'::jsonb, -- matrix table settings
  created_at,
  created_at
from auth.users
where id not in (select id from public.user_settings);

-- Create a function to ensure all users have profiles and settings
create or replace function public.ensure_user_data()
returns trigger as $$
begin
  -- Insert profile if it doesn't exist
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'name')
  on conflict (id) do nothing;

  -- Insert settings if they don't exist
  insert into public.user_settings (id)
  values (new.id)
  on conflict (id) do nothing;

  return new;
end;
$$ language plpgsql security definer;

-- Drop the old trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create new trigger that ensures both profile and settings exist
create trigger ensure_user_data
  after insert on auth.users
  for each row
  execute procedure public.ensure_user_data();
