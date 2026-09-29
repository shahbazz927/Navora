-- Phone persistence + official-link click logging hardening.
--
-- Problem:
--  1. Phone entered in PhonePromptModal was only saved to localStorage
--     (UserContext) + auth.user_metadata, never to a visible table, so
--     Supabase Table Editor showed nothing.
--  2. RequireAuth / Login overwrote context user without phone, so 2nd click
--     asked again.
--  3. official_link_clicks inserts failed silently (e.g. migration never
--     applied remotely) and link_url/link_label were hard to audit.
--
-- This migration is additive & idempotent. Apply in Supabase dashboard > SQL.

-- ---------------------------------------------------------------- 1. profiles: visible phone/name/email columns
alter table if exists public.profiles
  add column if not exists full_name text,
  add column if not exists phone text,
  add column if not exists email text;

-- Keep updated_at fresh on any update
create or replace function public.touch_profiles_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_touch on public.profiles;
create trigger trg_profiles_touch
  before update on public.profiles
  for each row execute function public.touch_profiles_updated_at();

-- ---------------------------------------------------------------- 2. official_link_clicks: ensure table exists remotely
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
create index if not exists official_link_clicks_phone_idx
  on public.official_link_clicks (phone);

alter table public.official_link_clicks enable row level security;

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
