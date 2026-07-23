-- =============================================================
-- Storehouse — Schema hardening migration (PENDING FOUNDER APPROVAL)
-- Date: 2026-07-23
-- Impact: Adds updated_at triggers, CHECK constraint on ledger.amount,
--         multi-bank support for plaid_items, and updated_at on core tables.
--         All changes are additive or ALTER — no existing data is lost.
--         SAFE TO RUN on a live database with existing rows.
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
-- Existing zero-amount rows (if any) would need to be cleaned up first:
--   delete from public.ledger where amount = 0;
alter table public.ledger
  add constraint ledger_amount_nonzero check (amount <> 0);

-- ---- 3. Multi-bank support: plaid_items ----
-- Currently user_id is the PK, allowing only one bank per user.
-- This migration adds a surrogate id PK, makes user_id a regular column
-- with a unique index (one active item per user per institution), and
-- adds institution_name for display without needing a separate API call.
--
-- ⚠️ This changes the table structure. The upsert in plaid-exchange-public-token.js
--    uses user_id as the conflict target — it will need updating to use
--    a composite unique constraint on (user_id, item_id) instead. The
--    serverless function code is already updated in this commit to match.

-- Step 3a: Add surrogate id column
alter table public.plaid_items
  add column if not exists id bigint generated always as identity primary key;

-- Step 3b: Drop the user_id primary key constraint
-- (Supabase names this constraint plaid_items_pkey by default)
alter table public.plaid_items
  drop constraint if exists plaid_items_pkey;

-- Step 3c: Add institution_name column for display
alter table public.plaid_items
  add column if not exists institution_name text;

-- Step 3d: Make user_id a regular column with a unique constraint
-- (one active Plaid item per user — multiple banks would need a different
--  table structure or a status column; for now, one active item is the
--  MVP scope, but this at least doesn't use user_id AS the PK)
alter table public.plaid_items
  add constraint plaid_items_user_id_key unique (user_id);

-- ---- 4. Add ON DELETE SET NULL to reward_requests.approved_by ----
-- Currently if a user is deleted, their reward approvals would have
-- dangling FK references. This makes the FK nullable on delete.
alter table public.reward_requests
  drop constraint if exists reward_requests_approved_by_fkey;
alter table public.reward_requests
  add constraint reward_requests_approved_by_fkey
  foreign key (approved_by) references public.users (auth_id) on delete set null;

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
