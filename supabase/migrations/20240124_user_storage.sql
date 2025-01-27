-- Create buckets for user uploads
insert into storage.buckets (id, name, public)
values ('user_avatars', 'user_avatars', false);

insert into storage.buckets (id, name, public)
values ('user_banners', 'user_banners', false);

-- Create storage policies for avatars
create policy "Avatar images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'user_avatars');

create policy "Users can upload their own avatar"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
    and (length < 5242880) -- Limit file size to 5MB
    and (lower(storage.extension(name)) = any (array['png', 'jpg', 'jpeg', 'gif', 'webp']))
  );

create policy "Users can update their own avatar"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
    and (length < 5242880)
    and (lower(storage.extension(name)) = any (array['png', 'jpg', 'jpeg', 'gif', 'webp']))
  );

create policy "Users can delete their own avatar"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user_avatars' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create storage policies for banners
create policy "Banner images are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'user_banners');

create policy "Users can upload their own banner"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'user_banners' 
    and (storage.foldername(name))[1] = auth.uid()::text
    and (length < 10485760) -- Limit file size to 10MB
    and (lower(storage.extension(name)) = any (array['png', 'jpg', 'jpeg', 'gif', 'webp']))
  );

create policy "Users can update their own banner"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'user_banners' 
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'user_banners' 
    and (storage.foldername(name))[1] = auth.uid()::text
    and (length < 10485760)
    and (lower(storage.extension(name)) = any (array['png', 'jpg', 'jpeg', 'gif', 'webp']))
  );

create policy "Users can delete their own banner"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'user_banners' 
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create a function to handle avatar/banner URL updates
create or replace function public.handle_storage_update()
returns trigger as $$
declare
  avatar_url text;
  banner_url text;
begin
  -- Get the avatar URL if it exists
  select storage.download_url(objects.bucket_id, objects.name) into avatar_url
  from storage.objects
  where bucket_id = 'user_avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
  order by created_at desc
  limit 1;

  -- Get the banner URL if it exists
  select storage.download_url(objects.bucket_id, objects.name) into banner_url
  from storage.objects
  where bucket_id = 'user_banners'
  and (storage.foldername(name))[1] = auth.uid()::text
  order by created_at desc
  limit 1;

  -- Update the profile with the new URLs
  update public.profiles
  set 
    avatar_url = coalesce(avatar_url, profiles.avatar_url),
    banner_url = coalesce(banner_url, profiles.banner_url),
    updated_at = now()
  where id = auth.uid();

  return new;
end;
$$ language plpgsql security definer;

-- Create separate triggers for insert/update/delete
create trigger on_avatar_insert
  after insert on storage.objects
  for each row
  when (new.bucket_id = 'user_avatars')
  execute procedure public.handle_storage_update();

create trigger on_avatar_update
  after update on storage.objects
  for each row
  when (old.bucket_id = 'user_avatars' or new.bucket_id = 'user_avatars')
  execute procedure public.handle_storage_update();

create trigger on_avatar_delete
  after delete on storage.objects
  for each row
  when (old.bucket_id = 'user_avatars')
  execute procedure public.handle_storage_update();

create trigger on_banner_insert
  after insert on storage.objects
  for each row
  when (new.bucket_id = 'user_banners')
  execute procedure public.handle_storage_update();

create trigger on_banner_update
  after update on storage.objects
  for each row
  when (old.bucket_id = 'user_banners' or new.bucket_id = 'user_banners')
  execute procedure public.handle_storage_update();

create trigger on_banner_delete
  after delete on storage.objects
  for each row
  when (old.bucket_id = 'user_banners')
  execute procedure public.handle_storage_update();
