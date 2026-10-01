-- Run in Supabase SQL Editor. Any authenticated user = admin (disable public sign-ups in Auth settings).
create table settings (id int primary key default 1 check (id = 1), data jsonb not null);
create table rsvps (id uuid primary key default gen_random_uuid(), name text not null, contact text not null,
  attending boolean not null, headcount int not null default 1, companions text[] default '{}', dietary text default 'Standard',
  notes text, created_at timestamptz default now());
create table wishlist_items (id uuid primary key default gen_random_uuid(), name text not null, category text not null,
  description text, price_range text, needed int not null default 1, covered int not null default 0, image_url text, created_at timestamptz default now());
create table gift_claims (id uuid primary key default gen_random_uuid(), item_id uuid references wishlist_items on delete cascade,
  guest_name text not null, contact text not null, qty int not null, note text, created_at timestamptz default now());
create table messages (id uuid primary key default gen_random_uuid(), sender text not null, body text not null,
  status text not null default 'pending' check (status in ('pending','approved')), created_at timestamptz default now());

alter table settings enable row level security; alter table rsvps enable row level security;
alter table wishlist_items enable row level security; alter table gift_claims enable row level security; alter table messages enable row level security;

create policy "public read settings" on settings for select using (true);
create policy "admin write settings" on settings for all to authenticated using (true) with check (true);
create policy "public insert rsvp" on rsvps for insert with check (true);
create policy "admin all rsvps" on rsvps for all to authenticated using (true) with check (true);
create policy "public read wishlist" on wishlist_items for select using (true);
create policy "admin all wishlist" on wishlist_items for all to authenticated using (true) with check (true);
create policy "admin all claims" on gift_claims for all to authenticated using (true) with check (true);
create policy "public read approved msgs" on messages for select using (status = 'approved');
create policy "public insert pending msg" on messages for insert with check (status = 'pending');
create policy "admin all msgs" on messages for all to authenticated using (true) with check (true);

-- Guests reserve gifts atomically; claim details stay private to admins.
create or replace function reserve_gift(p_item uuid, p_qty int, p_name text, p_contact text, p_note text)
returns void language plpgsql security definer as $$
declare r int;
begin
  select needed - covered into r from wishlist_items where id = p_item for update;
  if r is null or p_qty < 1 or p_qty > r then raise exception 'Not enough items remaining'; end if;
  update wishlist_items set covered = covered + p_qty where id = p_item;
  insert into gift_claims(item_id, guest_name, contact, qty, note) values (p_item, p_name, p_contact, p_qty, p_note);
end $$;
grant execute on function reserve_gift to anon, authenticated;

insert into settings values (1, '{"babyName":"Liam Alexander","parents":"David & Eleanor Vance","eventDateText":"Saturday, November 14, 2026","eventDate":"2026-11-14T10:00:00","eventTime":"10:00 AM PST","ceremonyVenue":"St. Jude Grace Sanctuary","ceremonyAddress":"742 Evergreen Terrace, Sanctuary Hall, CA","receptionVenue":"The Rosewood Garden Pavilion","receptionAddress":"1200 Magnolia Way, Grand Ballroom, CA","dressCode":"Soft Pastel / Smart Casual Attire","rsvpDeadline":"October 28, 2026","bankName":"GCash / Maya / Bank Transfer","accountName":"Liam Alexander Vance Savings","accountNumber":"0917-888-9900"}');
insert into wishlist_items (name,category,description,price_range,needed,image_url) values
('Ergonomic Baby Carrier','Baby Essentials','Breathable, all-position soft carrier.','~$120 - $150',1,'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&q=80&w=400'),
('Organic Cotton Hooded Towels','Bath & Nursery','Plush hooded towels, organic cotton.','~$25 - $35',3,'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=400'),
('Wooden Sensory Walker','Toys & Books','Push toy with gears and beads for first steps.','~$45 - $60',1,'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&q=80&w=400');
