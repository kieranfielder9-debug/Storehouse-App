-- =============================================================
-- Storehouse — Schema hardening migration (PENDING FOUNDER APPROVAL)
-- Date: 2026-07-23 (rewritten 2026-09-29: key swap reordered, re-runnable,
--       zero-amount-safe — the first version errored as one transaction and,
--       run statement by statement, left plaid_items with no primary key)
-- Impact: Adds updated_at + triggers, a non-zero CHECK on ledger.amount, an
--         id primary key for plaid_items (user_id stays UNIQUE — one bank per
--         user), institution_name, and ON DELETE SET NULL on
--         reward_requests.approved_by. No existing data is deleted or rewritten.
--         SAFE TO RUN on a live database with existing rows.
--         SAFE TO RE-RUN: every step is guarded, a second run changes nothing.
--
-- ⚠️  This migration is FLAGGED for manual approval per the guardrails.
--    Do NOT run this without the founder's explicit sign-off.
-- =============================================================

-- ---- 1. Add updated_at to core tables ----
-- Tracks when a record was last modified. Uses a trigger to auto-update.

-- Helper function: sets updated_at = now() on row update
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Add updated_at columns
alter table public.ledger            add column if not exists updated_at timestamptz not null default now();
alter table public.stewardship_goals  add column if not exists updated_at timestamptz not null default now();
alter table public.reflections       add column if not exists updated_at timestamptz not null default now();
alter table public.plaid_items       add column if not exists updated_at timestamptz not null default now();

-- Create triggers (idempotent — drop if exists first)
drop trigger if exists set_updated_at_ledger on public.ledger;
create trigger set_updated_at_ledger
  before update on public.ledger
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_goals on public.stewardship_goals;
create trigger set_updated_at_goals
  before update on public.stewardship_goals
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_reflections on public.reflections;
create trigger set_updated_at_reflections
  before update on public.reflections
  for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_plaid on public.plaid_items;
create trigger set_updated_at_plaid
  before update on public.plaid_items
  for each row execute function public.set_updated_at();

-- ---- 2. CHECK constraint: ledger.amount must be non-zero ----
-- Prevents bad data from empty form submissions or API errors.
-- Added NOT VALID so a legacy zero-amount row can't make this migration fail:
-- the rule is enforced for every new or edited row straight away, and existing
-- rows are checked only by the VALIDATE step below. (Adding it as a plain
-- CHECK would scan and reject the whole statement on the first zero row.)
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.ledger'::regclass and conname = 'ledger_amount_nonzero'
  ) then
    alter table public.ledger
      add constraint ledger_amount_nonzero check (amount <> 0) not valid;
  end if;

  if not exists (select 1 from public.ledger where amount = 0) then
    alter table public.ledger validate constraint ledger_amount_nonzero;
  else
    raise notice 'ledger has zero-amount rows, so ledger_amount_nonzero is left NOT VALID: it is enforced for new and edited rows, but editing one of those old rows will be rejected until its amount is corrected. Review them (select * from public.ledger where amount = 0), fix or delete, then run: alter table public.ledger validate constraint ledger_amount_nonzero;';
  end if;
end $$;

-- ---- 3. plaid_items: surrogate id primary key, user_id stays unique ----
-- Originally user_id is the PRIMARY KEY. This gives the table its own id
-- primary key and demotes user_id to a NOT NULL UNIQUE column: still one
-- active Plaid item per user (the MVP scope), and the row's identity no longer
-- doubles as the owner. plaid-exchange-public-token.js upserts with
-- onConflict: 'user_id', which resolves against the primary key before this
-- migration and against plaid_items_user_id_key after it — so re-linking a
-- bank replaces the row in both states.
--
-- Order matters (the first version got it backwards and failed with "multiple
-- primary keys"): keep user_id unique -> drop the old primary key -> add the new one.

-- Step 3a: user_id unique first, so uniqueness is never lost part-way through.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.plaid_items'::regclass and conname = 'plaid_items_user_id_key'
  ) then
    alter table public.plaid_items add constraint plaid_items_user_id_key unique (user_id);
  end if;
end $$;

-- Step 3b: swap the primary key. Decided by what the primary key IS, not by
-- whether an id column exists, so it also repairs a table left half-migrated by
-- the old script (no primary key at all, with or without an id column):
--   PK already on id  -> nothing to do
--   PK on user_id     -> drop it, then add id + make it the PK
--   no PK             -> add id if missing, make it the PK
do $$
declare
  pk_name text;
  pk_cols text;
begin
  select c.conname,
         (select string_agg(a.attname, ',' order by k.ord)
            from unnest(c.conkey) with ordinality as k(attnum, ord)
            join pg_attribute a on a.attrelid = c.conrelid and a.attnum = k.attnum)
    into pk_name, pk_cols
    from pg_constraint c
    where c.conrelid = 'public.plaid_items'::regclass and c.contype = 'p';

  if pk_cols = 'id' then
    return;
  end if;

  if pk_name is not null then
    execute format('alter table public.plaid_items drop constraint %I', pk_name);
  end if;
  alter table public.plaid_items alter column user_id set not null;
  if not exists (
    select 1 from pg_attribute
    where attrelid = 'public.plaid_items'::regclass and attname = 'id' and not attisdropped
  ) then
    alter table public.plaid_items add column id bigint generated always as identity;
  end if;
  alter table public.plaid_items add primary key (id);
end $$;

-- Step 3c: institution_name, for display without an extra API call.
alter table public.plaid_items add column if not exists institution_name text;

-- ---- 4. Add ON DELETE SET NULL to reward_requests.approved_by ----
-- Currently if a user is deleted, their reward approvals would have
-- dangling FK references. This makes the FK nullable on delete.
-- (Skipped, with a notice, on a database that predates the household tables.)
do $$
begin
  if to_regclass('public.reward_requests') is null then
    raise notice 'reward_requests not found - skipping step 4.';
    return;
  end if;

  alter table public.reward_requests
    drop constraint if exists reward_requests_approved_by_fkey;
  alter table public.reward_requests
    add constraint reward_requests_approved_by_fkey
    foreign key (approved_by) references public.users (auth_id) on delete set null;
end $$;

-- ---- 5. Future: TCE for plaid_items.access_token ----
-- This requires pgsodium to be enabled in Supabase (Dashboard → Database →
-- Extensions → pgsodium). Once enabled, uncomment the block below to
-- encrypt access tokens at the column level:
--
-- create extension if not exists pgsodium;
-- alter table public.plaid_items
--   alter column access_token type bytea
--   using pgsodium.crypto_secretbox_encrypt(access_token::bytea, pgsodium.crypto_secretbox_new_key());
-- -- And update the serverless functions to decrypt on read.
-- -- This is intentionally commented out — it requires pgsodium to be
-- -- enabled first and code changes in the Netlify functions. Flagged for
-- -- a dedicated security hardening pass.

-- =============================================================
-- END OF MIGRATION — run in Supabase SQL Editor after founder approval.
-- =============================================================
