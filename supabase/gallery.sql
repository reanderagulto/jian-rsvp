-- Run after schema.sql: gallery table + public Storage bucket "gallery".
create table gallery_images (id uuid primary key default gen_random_uuid(), path text not null, position int not null default 0, created_at timestamptz default now());
alter table gallery_images enable row level security;
create policy "public read gallery" on gallery_images for select using (true);
create policy "admin all gallery" on gallery_images for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public) values ('gallery', 'gallery', true) on conflict do nothing;
create policy "public read gallery files" on storage.objects for select using (bucket_id = 'gallery');
create policy "admin upload gallery files" on storage.objects for insert to authenticated with check (bucket_id = 'gallery');
create policy "admin delete gallery files" on storage.objects for delete to authenticated using (bucket_id = 'gallery');

update settings set data = data || '{"galleryTitle":"Our Little Moments","gallerySubtitle":"A peek at Liam''s first year of giggles and milestones."}' where id = 1;
