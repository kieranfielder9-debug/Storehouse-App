-- =============================================================
-- Storehouse — signup-failure diagnostics.
-- Run each numbered block in Supabase SQL Editor and read the output.
-- All of these are read-only or self-rolling-back — nothing is left
-- behind in the database.
-- =============================================================

-- 1. Does the trigger exist at all, and is it enabled?
--    tgenabled should be 'O' (origin, i.e. normal/on). 'D' means disabled.
select tgname, tgenabled, tgrelid::regclass as on_table
from pg_trigger
where tgrelid = 'auth.users'::regclass and not tgisinternal;

-- 2. Who owns handle_new_user(), and is it really SECURITY DEFINER?
--    prosecdef should be true. `owner` matters: if it is NOT the same role
--    that owns public.users/public.stewardship_goals (normally `postgres`),
--    Row-Level Security will NOT be bypassed inside the trigger, and the
--    insert will be silently blocked by the "own profile"/"own goals"
--    policies (auth.uid() is NULL inside a trigger, so `auth.uid() = auth_id`
--    can never pass).
select p.proname, p.prosecdef as is_security_definer, r.rolname as function_owner
from pg_proc p
join pg_roles r on r.oid = p.proowner
where p.proname = 'handle_new_user';

select tablename, tableowner
from pg_tables
where schemaname = 'public' and tablename in ('users', 'stewardship_goals');

-- 3. Can the role that actually performs the auth.users insert
--    (supabase_auth_admin — this is GoTrue's own Postgres role, separate
--    from the `postgres` role you're running this script as) execute the
--    trigger function at all? If this is false, the trigger cannot fire,
--    and GoTrue will surface exactly the symptom you saw: a bare 500 with
--    no user ever created anywhere.
select has_function_privilege('supabase_auth_admin', 'public.handle_new_user()', 'EXECUTE') as auth_admin_can_execute_trigger,
       has_schema_privilege('supabase_auth_admin', 'public', 'USAGE') as auth_admin_has_schema_usage;

-- 4. Table-level grants on the two tables the trigger writes to — useful if
--    (3) looks fine but you still suspect a grant was narrowed by hand in
--    the dashboard at some point (schema.sql does not track any GRANT
--    statements beyond RLS policies, so anything applied outside of it
--    won't show up in version control).
select table_name, grantee, privilege_type
from information_schema.role_table_grants
where table_schema = 'public' and table_name in ('users', 'stewardship_goals')
order by table_name, grantee, privilege_type;

-- 5. The most direct test: run the trigger's own two inserts yourself, as
--    the same `postgres` role the SQL Editor uses, wrapped in a transaction
--    that always rolls back (nothing is kept). If this succeeds, the bug is
--    specific to the trigger's execution context (most likely the
--    supabase_auth_admin privilege check in #3) rather than the SQL itself.
--    If this FAILS, the NOTICE below will show you the real Postgres error
--    — copy that text, it is the ground truth the 500 was hiding.
begin;
do $$
declare fake_id uuid := gen_random_uuid();
begin
  insert into public.users (auth_id, name, email)
  values (fake_id, 'Diag Test', 'diag-test-' || fake_id || '@example.com');
  insert into public.stewardship_goals (user_id) values (fake_id);
  raise notice 'OK: both inserts succeeded for %', fake_id;
exception when others then
  raise notice 'FAILED: sqlstate=% message=%', sqlstate, sqlerrm;
end $$;
rollback;

-- 6. Also worth doing manually (cannot be scripted): Supabase Dashboard ->
--    Logs -> Postgres Logs (and separately, Logs -> Auth Logs), filtered to
--    the exact timestamp of a signup attempt. That will show the raw
--    Postgres ERROR line the 500 is hiding, which is the single most
--    reliable source of truth here.
