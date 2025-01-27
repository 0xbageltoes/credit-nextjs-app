-- Create storage buckets if they don't exist
do $$
begin
  insert into storage.buckets (id, name, public)
  values ('avatars', 'avatars', true)
  on conflict (id) do nothing;

  insert into storage.buckets (id, name, public)
  values ('banners', 'banners', true)
  on conflict (id) do nothing;
end $$;

-- Enable RLS
alter table storage.objects enable row level security;

-- Drop existing policies if they exist
do $$
begin
  -- Drop avatar policies
  drop policy if exists "Avatar images are publicly accessible" on storage.objects;
  drop policy if exists "Users can upload avatar images" on storage.objects;
  drop policy if exists "Users can update their own avatar image" on storage.objects;
  drop policy if exists "Users can delete their own avatar image" on storage.objects;
  
  -- Drop banner policies
  drop policy if exists "Banner images are publicly accessible" on storage.objects;
  drop policy if exists "Users can upload banner images" on storage.objects;
  drop policy if exists "Users can update their own banner image" on storage.objects;
  drop policy if exists "Users can delete their own banner image" on storage.objects;
end $$;

-- Create new policies
-- Avatar policies
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "Users can upload avatar images"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own avatar images"
  on storage.objects for update
  using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own avatar images"
  on storage.objects for delete
  using (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Banner policies
create policy "Banner images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'banners');

create policy "Users can upload banner images"
  on storage.objects for insert
  with check (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own banner images"
  on storage.objects for update
  using (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own banner images"
  on storage.objects for delete
  using (
    bucket_id = 'banners'
    and auth.role() = 'authenticated'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Grant necessary permissions to authenticated users
grant all on storage.objects to authenticated;
grant all on storage.buckets to authenticated;
