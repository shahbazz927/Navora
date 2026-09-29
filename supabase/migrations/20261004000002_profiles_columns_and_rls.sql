-- ============================================================================
-- NAVORA — profiles: missing columns + RLS policies
-- ============================================================================
-- Verified state of the live `profiles` table BEFORE this migration:
--   user_id uuid | full_name | email | phone | created_at
--   missing: updated_at, role   +  no RLS policies for authenticated users
--
-- Why this is needed:
--   1. supabase/migrations/20261003000002_phone_persistence.sql creates the
--      trigger public.touch_profiles_updated_at(), which assigns
--      `new.updated_at = now()`. Without the column, EVERY update on profiles
--      fails with:  record "new" has no field "updated_at"
--   2. The app upserts profiles with { onConflict: 'user_id' } — that needs a
--      UNIQUE constraint on user_id (src/lib/officialLinks.js).
--   3. Without an UPDATE policy, signed-in users cannot save name/phone/email.
--
-- Applied in the Supabase dashboard > SQL Editor. Additive & idempotent.

-- ---------------------------------------------------------- 1. missing columns
alter table if exists public.profiles
  add column if not exists updated_at timestamptz default now(),
  add column if not exists role text default 'user';

-- Backfill + defaults (existing rows keep working)
update public.profiles set role = 'user' where role is null;
alter table public.profiles alter column role set default 'user';
alter table public.profiles alter column updated_at set default now();

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'chk_profiles_role') then
    alter table public.profiles
      add constraint chk_profiles_role check (role in ('user','admin'));
  end if;
end $$;

-- ------------------------------------------- 2. user_id must be UNIQUE
-- Requires an upsert(..., { onConflict: 'user_id' }) to succeed.
do $$
begin
  if not exists (
    select 1
    from pg_index i
    join pg_class c on c.oid = i.indrelid
    where c.relname = 'profiles'
      and i.indisunique
      and i.indnatts = 1
      and i.indkey[0] = (
        select a.attnum from pg_attribute a
        where a.attrelid = 'public.profiles'::regclass and a.attname = 'user_id'
      )
  ) then
    create unique index profiles_user_id_key on public.profiles (user_id);
  end if;
end $$;

-- ---------------------------------------------------------- 3. RLS: own row only
alter table public.profiles enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own profile as user" on public.profiles;
create policy "Users can insert own profile as user"
  on public.profiles for insert to authenticated
  with check (auth.uid() = user_id and coalesce(role, 'user') = 'user');

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ------------------------------------------- 4. updated_at touch (safe now)
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

-- ------------------------------------------- 5. anti role-escalation guard
create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
as $$
begin
  if coalesce(old.role, 'user') is distinct from coalesce(new.role, 'user') then
    raise exception 'role change denied: use trusted admin backend';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_profiles_no_escalation on public.profiles;
create trigger trg_profiles_no_escalation
  before update of role on public.profiles
  for each row execute function public.prevent_role_escalation();
