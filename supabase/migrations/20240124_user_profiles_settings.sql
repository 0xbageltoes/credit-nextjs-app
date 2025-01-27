-- Create enum types for focus areas and asset classes
create type public.focus_area as enum (
  'credit_research',
  'portfolio_management',
  'trading',
  'risk_management',
  'quantitative_analysis',
  'investment_banking',
  'sales_and_trading'
);

create type public.asset_class as enum (
  'investment_grade',
  'high_yield',
  'leveraged_loans',
  'structured_products',
  'municipal_bonds',
  'sovereign_debt',
  'emerging_markets',
  'convertibles'
);

create type public.return_metric_type as enum (
  'yield_percent',
  'spread_bps',
  'price',
  'dollar_price'
);

-- Create profiles table for public-facing user information
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  display_name text,
  avatar_url text,
  banner_url text,
  company text,
  focus_areas focus_area[] default '{}',
  priority_assets asset_class[] default '{}',
  bio text,
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create user settings table for app preferences
create table public.user_settings (
  id uuid references auth.users on delete cascade primary key,
  -- Display settings
  decimal_places smallint default 2,
  default_currency text default 'USD',
  default_return_metric return_metric_type default 'yield_percent',
  show_grid_lines boolean default true,
  dark_mode boolean default false,
  compact_mode boolean default false,
  
  -- Market convention settings
  day_count_convention text default 'ACT/360',
  settlement_days smallint default 2,
  price_decimal_places smallint default 3,
  yield_decimal_places smallint default 3,
  spread_decimal_places smallint default 0,
  
  -- Table specific settings
  cashflow_table_settings jsonb default '{
    "showPresentValue": true,
    "defaultSortColumn": "paymentDate",
    "defaultSortDirection": "asc"
  }',
  
  matrix_table_settings jsonb default '{
    "defaultView": "yield",
    "showSpreadToWorst": true,
    "showYieldToWorst": true
  }',
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create function to handle profile updates
create or replace function public.handle_profile_update()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create function to handle settings updates
create or replace function public.handle_settings_update()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Create triggers for updating timestamps
create trigger on_profile_update
  before update on public.profiles
  for each row
  execute procedure public.handle_profile_update();

create trigger on_settings_update
  before update on public.user_settings
  for each row
  execute procedure public.handle_settings_update();

-- Create function to automatically create profile and settings on user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'name');

  insert into public.user_settings (id)
  values (new.id);

  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;

-- Profiles policies (public profiles can be viewed by any authenticated user)
create policy "Profiles are viewable by authenticated users"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Settings policies (private, only accessible by the owner)
create policy "Users can view own settings"
  on public.user_settings for select
  to authenticated
  using (auth.uid() = id);

create policy "Users can update own settings"
  on public.user_settings for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
