-- NAVORA subscriptions — provider-ready
create table if not exists public.subscriptions (
  user_id uuid primary key references auth.users(id) on delete cascade,
  plan text not null check (plan in ('free','pro')),
  subscription_status text not null check (subscription_status in ('active','expired','cancelled','pending')),
  billing_provider text,
  provider_subscription_id text,
  started_at timestamptz default now(),
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index if not exists idx_subscriptions_plan on public.subscriptions(plan);
create index if not exists idx_subscriptions_status on public.subscriptions(subscription_status);
alter table public.subscriptions enable row level security;
do $$ begin
  if not exists (select 1 from pg_policies where policyname='Users can read own subscription' and tablename='subscriptions') then
    create policy "Users can read own subscription" on public.subscriptions for select using (auth.uid() = user_id);
  end if;
  if not exists (select 1 from pg_policies where policyname='Users can upsert own subscription' and tablename='subscriptions') then
    create policy "Users can upsert own subscription" on public.subscriptions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
  end if;
end $$;
