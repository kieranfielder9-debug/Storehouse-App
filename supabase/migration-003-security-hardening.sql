-- =============================================================
-- Storehouse — Security hardening migration 003
-- Date: 2026-09-29 (from the 2026-09 security review)
--
-- What it does:
--   1. public.users becomes READ-ONLY to clients (was: full read/write). Any
--      signed-in user could set their users.email to someone else's address,
--      which (because email was UNIQUE) made the real owner's later signup fail
--      inside handle_new_user() and let the attacker probe which emails exist
--      via error 23505. They could also delete their own row, cascading away
--      plaid_items without revoking the token at Plaid. The app never writes
--      public.users (the signup trigger does), so nothing legitimate is lost.
--   2. Drops the UNIQUE constraint on public.users.email — auth.users already
--      guarantees unique emails; this copy can only ever break signups.
--   3. reward_requests: the policy's WITH CHECK now also requires
--      approved_by = auth.uid(), so a client can't name someone else as approver.
--   4. Backstops: revoke all API-role privileges on plaid_items (access tokens),
--      and EXECUTE on the trigger function handle_new_user() from
--      public/anon/authenticated. service_role and supabase_auth_admin are unaffected.
--
-- SAFE TO RE-RUN: every statement is idempotent; a second run changes nothing.
-- Modifies no data. Independent of migration-001/-002 (any order). Steps whose
-- table/function doesn't exist in this database are skipped with a NOTICE
-- rather than failing, so they can't block the users fix.
--
-- ⚠️  Like the other migrations: run in the Supabase SQL Editor after founder sign-off.
-- =============================================================

-- ---- 1. users: clients may only READ their own row ----
alter table public.users enable row level security;   -- already on; no-op

drop policy if exists "own profile" on public.users;
create policy "own profile" on public.users for select using (auth.uid() = auth_id);

-- ---- 2. users.email: drop the UNIQUE constraint (whatever it is named) ----
do $$
declare c text;
begin
  for c in
    select con.conname
    from pg_constraint con
    where con.conrelid = 'public.users'::regclass
      and con.contype = 'u'
      and con.conkey = array[(select a.attnum from pg_attribute a
                              where a.attrelid = con.conrelid and a.attname = 'email')]
  loop
    execute format('alter table public.users drop constraint %I', c);
  end loop;
end $$;

-- ---- 3. reward_requests: approved_by must be the caller ----
do $$
begin
  if to_regclass('public.reward_requests') is null or to_regclass('public.household_members') is null then
    raise notice 'reward_requests / household_members not found - skipping step 3 (schema.sql creates them with the corrected policy).';
    return;
  end if;

  drop policy if exists "own household rewards" on public.reward_requests;
  create policy "own household rewards" on public.reward_requests for all
    using (auth.uid() = (select auth_id from public.household_members where id = household_member_id))
    with check (
      auth.uid() = (select auth_id from public.household_members where id = household_member_id)
      and approved_by = auth.uid()
    );
end $$;

-- ---- 4. Backstop revokes ----
do $$
begin
  if to_regclass('public.plaid_items') is not null then
    revoke all on public.plaid_items from anon, authenticated;
  else
    raise notice 'plaid_items not found - skipping its revoke.';
  end if;

  if to_regprocedure('public.handle_new_user()') is not null then
    revoke execute on function public.handle_new_user() from public, anon, authenticated;
    -- Re-assert the one grant signup needs (same as schema.sql), so this revoke
    -- can never be what breaks the auth trigger.
    grant execute on function public.handle_new_user() to supabase_auth_admin;
  else
    raise notice 'handle_new_user() not found - skipping its revoke.';
  end if;
end $$;

-- =============================================================
-- END OF MIGRATION — safe to run again at any time.
-- =============================================================
