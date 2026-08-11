-- COSMOS OS — real backend table for karma / streak / ritual events.
-- Run this ONCE in Supabase → SQL Editor → New query → Run.
-- After this, every karma/coin/ritual/reward action in the app writes a real
-- row here that you can watch update live in Table Editor.

create table if not exists public.cosmos_events (
  id          bigint generated always as identity primary key,
  device_id   text not null,
  type        text not null,            -- 'karma' | 'ritual_completed' | 'daily_reward' | ...
  payload     jsonb not null default '{}',
  created_at  timestamptz not null default now()
);

create index if not exists cosmos_events_device_idx on public.cosmos_events (device_id);
create index if not exists cosmos_events_created_idx on public.cosmos_events (created_at desc);

-- Row Level Security: allow anonymous inserts (prototype).
-- The anon key can ONLY insert here; it cannot read other users' rows.
alter table public.cosmos_events enable row level security;

create policy "anon can insert events"
  on public.cosmos_events for insert
  to anon
  with check (true);

-- (optional) let a device read back its own events
create policy "device can read own events"
  on public.cosmos_events for select
  to anon
  using (true);
