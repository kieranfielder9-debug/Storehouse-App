-- =============================================================
-- Storehouse — Giving Targets migration (PENDING FOUNDER APPROVAL)
-- Date: 2026-09-28
-- Impact: Adds offerings_target and kingdom_fund_target to
--         stewardship_goals, backing the new Giving Targets rings
--         (Tithe / Offerings / Kingdom Fund) on the Dashboard — ported
--         from the Expo rebuild's Planning screen. Additive only —
--         both columns default to 0, no existing data is touched.
--         SAFE TO RUN on a live database with existing rows.
--
-- ⚠️  This migration is FLAGGED for manual approval per the guardrails.
--    Do NOT run this without the founder's explicit sign-off.
-- =============================================================

alter table public.stewardship_goals
  add column if not exists offerings_target numeric not null default 0;

alter table public.stewardship_goals
  add column if not exists kingdom_fund_target numeric not null default 0;

-- =============================================================
-- END OF MIGRATION — run in Supabase SQL Editor after founder approval.
-- =============================================================
