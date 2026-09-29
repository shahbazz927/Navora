-- Official outbound-link click tracking (login-gated Official Website /
-- Admissions Portal / Official source links in Colleges + Scholarships).
--
-- One row per click: who clicked (name + phone number), which college /
-- scholarship section, which link label + URL.

create table if not exists public.official_link_clicks (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  name text,
  phone text,
  email text,
  section text not null default 'colleges',
  college_slug text,
  college_name text,
  scholarship_id text,
  scholarship_name text,
  link_label text not null,
  link_url text not null,
  created_at timestamptz not null default now()
);

-- Indexes for admin lookups (who clicked what, per college/scholarship)
create index if not exists official_link_clicks_created_at_idx
  on public.official_link_clicks (created_at desc);
create index if not exists official_link_clicks_section_idx
  on public.official_link_clicks (section);
create index if not exists official_link_clicks_college_slug_idx
  on public.official_link_clicks (college_slug);
create index if not exists official_link_clicks_scholarship_id_idx
  on public.official_link_clicks (scholarship_id);
create index if not exists official_link_clicks_user_id_idx
  on public.official_link_clicks (user_id);

alter table public.official_link_clicks enable row level security;

-- App uses the anon key with an authenticated session: allow any signed-in
-- user to log their own clicks. Select is limited to one's own rows so
-- users can't enumerate other users' activity; admins inspect via
-- service-role / dashboard.
drop policy if exists "official_link_clicks_insert_authed" on public.official_link_clicks;
create policy "official_link_clicks_insert_authed"
  on public.official_link_clicks for insert
  to authenticated
  with check (true);

drop policy if exists "official_link_clicks_select_own" on public.official_link_clicks;
create policy "official_link_clicks_select_own"
  on public.official_link_clicks for select
  to authenticated
  using (auth.uid()::text = user_id or user_id is null);
