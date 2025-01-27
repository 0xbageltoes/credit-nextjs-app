-- Check if table exists first to avoid errors

-- Create the trigger function first
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Then create the main function
create or replace function create_user_details_if_not_exists() returns void as $$
begin
  if not exists (select from pg_tables where schemaname = 'public' and tablename = 'user_details') then
    create table public.user_details (
      id uuid references auth.users on delete cascade primary key,
      username text,
      first_name text,
      last_name text,
      firm_name text,
      contact_name text,
      contact_email text,
      contact_phone text,
      created_at timestamp with time zone default timezone('utc'::text, now()) not null,
      updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Set up row level security only if table was just created
    alter table public.user_details enable row level security;

    -- Create policies
    if not exists (select from pg_policies where tablename = 'user_details' and policyname = 'Users can view own details') then
      create policy "Users can view own details" on public.user_details
        for select using (auth.uid() = id);
    end if;

    if not exists (select from pg_policies where tablename = 'user_details' and policyname = 'Users can update own details') then
      create policy "Users can update own details" on public.user_details
        for update using (auth.uid() = id);
    end if;

    if not exists (select from pg_policies where tablename = 'user_details' and policyname = 'Users can insert own details') then
      create policy "Users can insert own details" on public.user_details
        for insert with check (auth.uid() = id);
    end if;

    -- Create trigger
    if not exists (select from pg_trigger where tgname = 'handle_updated_at') then
      create trigger handle_updated_at
        before update on public.user_details
        for each row
        execute function public.handle_updated_at();
    end if;

    -- Backfill data for existing users
    insert into public.user_details (id, username, created_at, updated_at)
    select 
      au.id,
      coalesce(au.raw_user_meta_data->>'username', au.email), -- fallback to email if no username
      now(),
      now()
    from auth.users au
    where not exists (
      select 1 from public.user_details ud where ud.id = au.id
    );

  end if;
end;
$$ language plpgsql;

-- Execute the function
select create_user_details_if_not_exists();

-- Clean up
drop function if exists create_user_details_if_not_exists();
