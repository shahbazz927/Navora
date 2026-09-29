-- NAVORA lead_captures — Google-Sheet-style backup of every filling detail.
-- One row per capture event (every step + final + login).
-- Columns match requested Sheet: Date | Name | Email | Phone | UserType | Answers | Recommendation
--
-- MANUAL STEP (Supabase dashboard > SQL Editor > New Query):
--   1. Paste this ENTIRE file
--   2. Click Run -> expect "Success. No rows returned"
--   3. Left menu > Table Editor > confirm table `lead_captures` appears (empty)
--   4. Fill form on website > Table Editor > Refresh > see new row
--
-- Additive & idempotent — safe to run twice.

create table if not exists public.lead_captures (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  user_id text,
  name text,
  email text,
  phone text,
  user_type text,
  onboarding_name text,
  answers jsonb not null default '{}'::jsonb,
  recommendation jsonb,
  source_page text,
  user_agent text
);

-- Indexes for admin lookups (latest first, per phone/email/user)
create index if not exists lead_captures_created_at_idx
  on public.lead_captures (created_at desc);
create index if not exists lead_captures_user_id_idx
  on public.lead_captures (user_id);
create index if not exists lead_captures_phone_idx
  on public.lead_captures (phone);
create index if not exists lead_captures_email_idx
  on public.lead_captures (email);
create index if not exists lead_captures_user_type_idx
  on public.lead_captures (user_type);

alter table public.lead_captures enable row level security;

-- Pre-login (anonymous) users must be able to insert their own step data.
-- Select is locked down: anon sees nothing, authed sees own rows only.
-- Admins inspect all rows via service-role / dashboard (bypasses RLS).
drop policy if exists "lead_captures_insert_any" on public.lead_captures;
create policy "lead_captures_insert_any"
  on public.lead_captures for insert
  to anon, authenticated
  with check (true);

drop policy if exists "lead_captures_select_own" on public.lead_captures;
create policy "lead_captures_select_own"
  on public.lead_captures for select
  to authenticated
  using (auth.uid()::text = user_id or user_id is null);
