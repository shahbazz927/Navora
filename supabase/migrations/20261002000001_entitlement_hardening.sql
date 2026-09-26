-- NAVORA entitlement hardening (Phase 2)
-- Goals:
--  1. Normalize subscription_status -> status (preserve data)
--  2. Lock RLS: users SELECT own only; NO INSERT/UPDATE/DELETE for anon/authenticated
--     (writes happen only via service-role/webhook backend)
--  3. Server-side AI quota: ai_usage + atomic increment_ai_usage() RPC
--  4. Admin role: profiles.role with anti-escalation guard
--
-- MANUAL STEP (Supabase dashboard > SQL): apply this file. Additive & idempotent.
-- ROLLBACK: none destructive; old column kept during transition, dropped at end.
--
-- RLS TESTS (run as authenticated non-admin user):
--  Test 1: UPDATE subscriptions SET plan='pro'            -> expect DENIED
--  Test 2: INSERT INTO subscriptions(user_id,plan,status) -> expect DENIED
--  Test 3: SELECT * FROM subscriptions WHERE user_id=auth.uid() -> ALLOWED (own row)
--  Test 4: SELECT another user's row                      -> DENIED (0 rows)
--  Test 5 (service_role): UPDATE subscriptions            -> ALLOWED

-- ---------------------------------------------------------------- 0. Pre-reqs
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------- 1. subscriptions: normalize naming
-- Existing schema (20261001000002): user_id PK, plan, subscription_status, ...
alter table if exists public.subscriptions
  add column if not exists status text;

-- Backfill new canonical column from legacy column (data preservation)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='subscriptions' and column_name='subscription_status'
  ) then
    execute $$
      update public.subscriptions
      set status = case subscription_status
        when 'pending' then 'past_due'
        else subscription_status
      end
      where status is null
    $$;
  end if;
end $$;

alter table if exists public.subscriptions
  alter column status set default 'active';

-- New provider / period columns (additive)
alter table if exists public.subscriptions
  add column if not exists provider text,
  add column if not exists provider_customer_id text,
  add column if not exists current_period_start timestamptz,
  add column if not exists current_period_end timestamptz;

-- Widen status values to canonical set: active|trialing|past_due|cancelled|expired
do $$
begin
  if exists (select 1 from pg_constraint where conname='subscriptions_subscription_status_check') then
    alter table public.subscriptions drop constraint subscriptions_subscription_status_check;
  end if;
  -- drop legacy check if named differently
  if exists (select 1 from pg_constraint where conname='subscriptions_status_check') then
    alter table public.subscriptions drop constraint subscriptions_status_check;
  end if;
end $$;

do $$
begin
  if not exists (select 1 from pg_constraint where conname='chk_subscriptions_plan') then
    alter table public.subscriptions
      add constraint chk_subscriptions_plan check (plan in ('free','pro'));
  end if;
  if not exists (select 1 from pg_constraint where conname='chk_subscriptions_status') then
    alter table public.subscriptions
      add constraint chk_subscriptions_status
      check (status in ('active','trialing','past_due','cancelled','expired'));
  end if;
end $$;

-- Backfill provider default + timestamps for legacy rows
update public.subscriptions set provider = coalesce(provider,'manual') where provider is null;
alter table if exists public.subscriptions
  alter column plan set default 'free';

-- Drop legacy column only after backfill (data preserved into status)
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema='public' and table_name='subscriptions' and column_name='subscription_status'
  ) then
    -- ensure no nulls remain before dropping legacy col
    update public.subscriptions set status='active' where status is null;
    alter table public.subscriptions alter column status set not null;
    alter table public.subscriptions drop column subscription_status;
  end if;
end $$;

create unique index if not exists uq_subscriptions_user on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan on public.subscriptions(plan);
create index if not exists idx_subscriptions_status_new on public.subscriptions(status);

-- ---------------------------------------------------------------- 2. RLS: SELECT-own only
alter table public.subscriptions enable row level security;

-- Remove the insecure self-upsert policy from the previous migration
drop policy if exists "Users can upsert own subscription" on public.subscriptions;
-- Recreate read-own idempotently
drop policy if exists "Users can read own subscription" on public.subscriptions;
create policy "Users can read own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);
-- NOTE: no INSERT/UPDATE/DELETE policies -> authenticated users get DENIED by default.
-- Service-role / webhook backend bypasses RLS and is the ONLY writer.

-- ---------------------------------------------------------------- 3. ai_usage (server-side daily quota)
create table if not exists public.ai_usage (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  usage_date date not null default current_date,
  request_count integer not null default 0 check (request_count >= 0),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, usage_date)
);
create index if not exists idx_ai_usage_user_date on public.ai_usage(user_id, usage_date);

alter table public.ai_usage enable row level security;
-- Users may read their own usage (for "X of N remaining" display). No writes.
drop policy if exists "Users can read own ai usage" on public.ai_usage;
create policy "Users can read own ai usage"
  on public.ai_usage for select
  using (auth.uid() = user_id);

-- Atomic increment: avoids race where 10 parallel requests bypass the limit.
-- Call via service-role only. Returns the new count for (user, today).
create or replace function public.increment_ai_usage(p_user_id uuid, p_date date default current_date)
returns integer
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  insert into public.ai_usage(user_id, usage_date, request_count, updated_at)
  values (p_user_id, p_date, 1, now())
  on conflict (user_id, usage_date)
  do update set request_count = public.ai_usage.request_count + 1, updated_at = now()
  returning request_count into v_count;
  return v_count;
end;
$$;
revoke all on function public.increment_ai_usage(uuid, date) from public, anon, authenticated;
-- service_role bypasses RLS and keeps EXECUTE via ownership; grant explicitly for clarity
grant execute on function public.increment_ai_usage(uuid, date) to service_role;

-- ---------------------------------------------------------------- 4. Admin role (profiles.role)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'user' check (role in ('user','admin')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select using (auth.uid() = user_id);

-- Users may insert their own profile row but never as admin
drop policy if exists "Users can insert own profile as user" on public.profiles;
create policy "Users can insert own profile as user"
  on public.profiles for insert with check (auth.uid() = user_id and role = 'user');

-- Users may update own profile EXCEPT role (enforced by trigger below, belt & suspenders)
drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Anti-escalation: block role changes from non-service-role sessions
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if coalesce(old.role,'user') is distinct from coalesce(new.role,'user') then
    raise exception 'role change denied: use trusted admin backend';
  end if;
  new.updated_at = now();
  return new;
end;
$$;
drop trigger if exists trg_profiles_no_escalation on public.profiles;
create trigger trg_profiles_no_escalation
  before update of role on public.profiles
  for each row execute function public.prevent_role_escalation();

-- Helper for backend/admin checks (service-role): is this user an admin?
create or replace function public.is_admin(p_user_id uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$ select exists (select 1 from public.profiles where user_id = p_user_id and role='admin') $$;
revoke all on function public.is_admin(uuid) from public, anon, authenticated;
grant execute on function public.is_admin(uuid) to service_role;
