-- =============================================================
-- Storehouse MVP schema — run once in Supabase SQL Editor.
-- Tables: users, stewardship_goals, ledger, reflections, plaid_items,
--         household_members, reward_requests
-- Every table has Row-Level Security: a user can only ever touch
-- rows where user_id = auth.uid(). plaid_items is deny-all to
-- clients — only the serverless functions (service role) read it.
--
-- household_members / reward_requests: a household member (e.g. "Ethan")
-- is a SUB-RECORD owned by the account holder — not a separate login/auth
-- identity. There is no child-facing auth at this stage. Every reward
-- request is created (and, today, approved in the same step) by the
-- signed-in parent/guardian; the parent is always the visible
-- decision-maker for anything involving a minor's money.
-- =============================================================

create table public.users (
  auth_id uuid primary key references auth.users (id) on delete cascade,
  name    text,
  email   text unique
);

create table public.stewardship_goals (
  user_id           uuid primary key references public.users (auth_id) on delete cascade,
  tithe_percentage  numeric not null default 10,
  generosity_target numeric not null default 0
);

create table public.ledger (
  id                        bigint generated always as identity primary key,
  user_id                   uuid not null references public.users (auth_id) on delete cascade,
  date                      date not null default current_date,
  amount                    numeric not null,
  category                  text not null,
  description               text,
  is_contentment_satisfied  boolean            -- true = Need, false = Want, null = unmarked
);
create index ledger_user_date_idx on public.ledger (user_id, date desc);

create table public.reflections (
  id      bigint generated always as identity primary key,
  user_id uuid not null references public.users (auth_id) on delete cascade,
  date    date not null default current_date,
  content text not null
);

-- Plaid access tokens: server-side only. Supabase encrypts at rest;
-- for column-level encryption enable pgsodium + a TCE label on access_token.
create table public.plaid_items (
  user_id      uuid primary key references public.users (auth_id) on delete cascade,
  access_token text not null,
  item_id      text
);

-- A literal household member of the account owner (e.g. a child), tied
-- to the owner's own auth identity. Not a login — see note above.
create table public.household_members (
  id           bigint generated always as identity primary key,
  auth_id      uuid not null references public.users (auth_id) on delete cascade,
  name         text not null,
  relationship text not null default 'child',
  created_at   timestamptz not null default now()
);
create index household_members_auth_idx on public.household_members (auth_id);

-- A reward the parent/guardian has granted (today: request + approval
-- happen in one step, since there's no child-initiated flow yet).
create table public.reward_requests (
  id                  bigint generated always as identity primary key,
  household_member_id bigint not null references public.household_members (id) on delete cascade,
  amount              numeric not null,
  reason              text,
  status              text not null default 'pending' check (status in ('pending', 'approved', 'declined')),
  approved_by         uuid references public.users (auth_id),
  approved_at         timestamptz,
  created_at          timestamptz not null default now()
);
create index reward_requests_member_idx on public.reward_requests (household_member_id);

-- ---------------- Row-Level Security ----------------
alter table public.users             enable row level security;
alter table public.stewardship_goals enable row level security;
alter table public.ledger            enable row level security;
alter table public.reflections       enable row level security;
alter table public.plaid_items       enable row level security;  -- no policies = deny all client access
alter table public.household_members enable row level security;
alter table public.reward_requests   enable row level security;

create policy "own profile"     on public.users             for all using (auth.uid() = auth_id) with check (auth.uid() = auth_id);
create policy "own goals"       on public.stewardship_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own ledger"      on public.ledger            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reflections" on public.reflections       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own household"   on public.household_members for all using (auth.uid() = auth_id) with check (auth.uid() = auth_id);

-- reward_requests has no auth_id column of its own — ownership is via the
-- household_members join, same single-owner check, just one hop over.
create policy "own household rewards" on public.reward_requests for all
  using (auth.uid() = (select auth_id from public.household_members where id = household_member_id))
  with check (auth.uid() = (select auth_id from public.household_members where id = household_member_id));

-- ---------------- Auto-provision on signup ----------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users (auth_id, name, email)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', 'Steward'), new.email);
  insert into public.stewardship_goals (user_id) values (new.id);
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------- Realtime (dashboard reactivity) ----------------
alter publication supabase_realtime add table public.ledger;
alter publication supabase_realtime add table public.stewardship_goals;
alter publication supabase_realtime add table public.household_members;
alter publication supabase_realtime add table public.reward_requests;
