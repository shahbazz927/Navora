-- NAVORA payments (Razorpay, one-time annual ₹999) — Phase 2
-- Extends 20261002000001_entitlement_hardening.sql. Additive & idempotent.
-- MANUAL STEP: apply in Supabase dashboard > SQL after the hardening migration.
--
-- Model: one-time annual access. successful ₹999 purchase =>
--   subscriptions: plan='pro', status='active', provider='razorpay',
--   amount=99900 (paise), currency='INR', started_at=now, expires_at=now+365d
-- payments table is the idempotency/audit record (unique provider_payment_id).

-- ---------------------------------------------------------------- 1. subscriptions: payment columns
alter table if exists public.subscriptions
  add column if not exists provider_order_id text,
  add column if not exists provider_payment_id text,
  add column if not exists amount integer,
  add column if not exists currency text default 'INR',
  add column if not exists started_at timestamptz,
  add column if not exists expires_at timestamptz;

-- Backfill legacy rows so expiry logic (expires_at > now) works uniformly
update public.subscriptions
  set expires_at = coalesce(expires_at, current_period_end)
  where expires_at is null;

create index if not exists idx_subscriptions_provider_order on public.subscriptions(provider_order_id);
create index if not exists idx_subscriptions_provider_payment on public.subscriptions(provider_payment_id);
create index if not exists idx_subscriptions_expires on public.subscriptions(expires_at);

-- ---------------------------------------------------------------- 2. payments audit table
create table if not exists public.payments (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null default 'razorpay',
  provider_order_id text,
  provider_payment_id text,
  amount integer,
  currency text default 'INR',
  status text not null default 'created'
    check (status in ('created','paid','failed','refunded')),
  raw jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Idempotency: one payment id activates Pro at most once
create unique index if not exists uq_payments_provider_payment
  on public.payments(provider, provider_payment_id)
  where provider_payment_id is not null;
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_payments_order on public.payments(provider_order_id);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_created on public.payments(created_at);

alter table public.payments enable row level security;

-- Users read their own payment history. No self-writes (server/service-role only).
drop policy if exists "Users can read own payments" on public.payments;
create policy "Users can read own payments"
  on public.payments for select using (auth.uid() = user_id);

-- updated_at touch
create or replace function public.touch_payments_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;
drop trigger if exists trg_payments_touch on public.payments;
create trigger trg_payments_touch
  before update on public.payments
  for each row execute function public.touch_payments_updated_at();

-- ---------------------------------------------------------------- 3. Expiry helper (backend may also compute in JS)
-- Active Pro  <=>  plan='pro' AND status='active' AND expires_at > now()
create or replace function public.is_pro_active(p_user_id uuid)
returns boolean
language sql security definer set search_path = public stable
as $$
  select exists (
    select 1 from public.subscriptions
    where user_id = p_user_id and plan = 'pro' and status = 'active'
      and expires_at is not null and expires_at > now()
  );
$$;
revoke all on function public.is_pro_active(uuid) from public, anon, authenticated;
grant execute on function public.is_pro_active(uuid) to service_role;
