-- =============================================================
-- Storehouse MVP schema — run once in Supabase SQL Editor.
-- Tables: users, stewardship_goals, ledger, reflections, plaid_items
-- Every table has Row-Level Security: a user can only ever touch
-- rows where user_id = auth.uid(). plaid_items is deny-all to
-- clients — only the serverless functions (service role) read it.
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

-- ---------------- Row-Level Security ----------------
alter table public.users             enable row level security;
alter table public.stewardship_goals enable row level security;
alter table public.ledger            enable row level security;
alter table public.reflections       enable row level security;
alter table public.plaid_items       enable row level security;  -- no policies = deny all client access

create policy "own profile"     on public.users             for all using (auth.uid() = auth_id) with check (auth.uid() = auth_id);
create policy "own goals"       on public.stewardship_goals for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own ledger"      on public.ledger            for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own reflections" on public.reflections       for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

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
