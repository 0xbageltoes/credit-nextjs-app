-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  bio text,
  avatar_url text,
  banner_url text,
  location text,
  website text,
  skills text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Create policies
do $$
begin
  -- Select policy
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'profiles' 
    and policyname = 'Public profiles are viewable by everyone'
  ) then
    create policy "Public profiles are viewable by everyone"
      on profiles for select
      using (true);
  end if;

  -- Insert policy
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'profiles' 
    and policyname = 'Users can insert their own profile'
  ) then
    create policy "Users can insert their own profile"
      on profiles for insert
      with check (auth.uid() = id);
  end if;

  -- Update policy
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'public' 
    and tablename = 'profiles' 
    and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
      on profiles for update
      using (auth.uid() = id);
  end if;
end $$;

-- Create trigger for updated_at
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger if it doesn't exist
do $$
begin
  if not exists (
    select 1 from pg_trigger 
    where tgname = 'handle_updated_at_profiles'
  ) then
    create trigger handle_updated_at_profiles
      before update on profiles
      for each row
      execute function handle_updated_at();
  end if;
end $$;

-- Insert a profile for each user that doesn't have one
insert into public.profiles (id, created_at, updated_at)
select 
  id,
  now(),
  now()
from auth.users
where id not in (select id from public.profiles);
