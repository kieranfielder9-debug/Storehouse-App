# Storehouse — Running Cost Model

Owner: `finance-fundraising-strategist` (P8). Updated continuously, not gated to Phase 4 — this is the
one piece of finance work that runs from day one, because the whole roadmap is sequenced around a single
constraint: **time to invest, not capital**. Everything below exists to keep that claim honest with real
numbers instead of vibes.

**Last verified:** 2026-07-20 (web search, this session). Prices and fees change — re-verify anything with a
£/$ sign before acting on it if this document is more than a few months old. Where a figure could not be
confirmed with confidence, it's marked **unconfirmed** rather than guessed.

**Scope note:** accelerator/grant programmes, angel/pre-seed norms, and BaaS *commercial-terms comparison*
are explicitly gated to Phase 4+ (once there's a working product and real traction to pitch with). Storehouse
doesn't have that yet, so none of that appears here — see the "Deferred research" section at the bottom for
what's intentionally not yet done, and why.

---

## Summary: what's safe on £0 right now

| Phase | What it is | Cost today | Needs capital? |
|---|---|---|---|
| 0 | Stabilise the build (auth, deploys) | £0 | No |
| 1 | Real Mode — manual entry, owner only | £0 | No |
| 2 | Real automated bank sync, owner only | £0 now, small recurring cost once turned on | Not yet — modest, deferrable |
| 3 | Household (Wisdom Wallet), strictly scoped | £0 | No |
| 4 | Public case — waitlist, beta, RAISP conversation | £0–£250 (RAISP fee only if filed) | Small, one-off, affordable |
| 5 | Real money for strangers — full authorisation or BaaS | £15,000–£80,000+ (authorisation) or BaaS onboarding/rev-share (cheaper but not free) | **Yes — hard capital requirement** |
| 6 | Investing / Kingdom Capital | Not yet costed — deliberately last, heaviest regulatory lift | Assume capital-heavy until researched |

**Bottom line:** Phases 0–3 are genuinely free. Phase 4 introduces the first real (small, one-off) cash
outlay if the RAISP route is chosen, but no capital raise is needed to get there. Phase 5 is where the
model changes character entirely — that's the point at which "time, not capital" stops being sufficient on
its own, and it's exactly why Phase 4 traction matters: it's what you'd use to either (a) raise the capital,
or (b) negotiate BaaS terms that don't require it up front.

---

## Phase-by-phase detail

### Phase 0 — Stabilise the current build
**Cost: £0. No licence required.**
This is engineering time against infrastructure already in use (Netlify + Supabase), both currently on free
tiers. No new spend.

### Phase 1 — Real Mode (manual entry, owner only)
**Cost: £0. No licence required.**
Pure app-layer work — no new data provider, no new infrastructure tier. Free.

### Phase 2 — Real automated bank sync, owner only
**Cost: £0 to start; small recurring cost once turned on. No licence (personal use, data belongs to the
account owner).**

This is the first phase where a real recurring bill *could* appear, and it's worth being specific about why
it's still "small," not "capital":

- **Plaid** — sandbox/development use (what Storehouse currently simulates against) is free. Moving to
  production is where it costs money, but Plaid does not publish a public price list — pricing is disclosed
  only once you apply for production access, and typically mixes one-off per-connection fees (Auth,
  Identity, Income products) with either subscription fees or per-API-call charges (roughly $0.10–$0.60 per
  call depending on product/volume) for ongoing products like Transactions. For a single account (the owner
  only), realistic exposure is low double-digit £/$ per month, not a capital sum — but "low" here is an
  estimate, not a confirmed figure, because Plaid won't quote it without an application. **Unconfirmed
  exact figure — must be checked directly with Plaid (or TrueLayer/Yapily, which the `open-banking-specialist`
  already has in scope for UK-specific comparison) before turning this on.**
- **TrueLayer / Yapily** (UK Open Banking aggregators, `open-banking-specialist`'s domain) typically publish
  UK-specific tiered pricing with a free/low-volume developer tier — worth a direct comparison against Plaid
  once this phase is actually being built, since UK Open Banking-native providers may undercut Plaid for a
  UK-only, single-user use case. Not re-verified in this pass; flagging for that agent.

Recommendation embedded in the roadmap already: stay on manual Real Mode (Phase 1) until this small
recurring cost is comfortably affordable, then turn on the paid tier. This is a "modest, deferrable" cost,
not a blocker.

### Phase 3 — Household (Wisdom Wallet)
**Cost: £0. No licence required, provided it stays strictly household-scoped** (per
`household-product-specialist`'s remit — the moment it serves anyone outside the household, Phase 5's
licensing requirement kicks in). No new infrastructure tier needed for household-scale data.

### Phase 4 — Build the public case
**Cost: £0–£250, one-off. No capital requirement.**

- **Waitlist / landing page / beta polish** — £0 in cash; this is brand and engineering time
  (`brand-growth-lead`), on infrastructure already free-tier.
- **FCA RAISP registration** (Registered Account Information Service Provider — read-only account data for
  people outside the household) — **£250**, confirmed current figure: the FCA's standard AISP registration
  fee is £1,500, but a reduced £250 fee applies to small firms/RAISP applicants (FCA fee Category 3). This
  is a one-off application fee, non-refundable, paid directly to the FCA — not a recurring cost, and not
  something that requires a capital raise; it's affordable out of ordinary means once there's a genuine
  reason to file (real users waiting, not hypothetical ones).
- **FCA Innovation Hub** — genuinely free. Before paying anyone for regulatory guidance at this stage,
  the FCA's own Innovation Hub (and from 2026, its Pre-Application Support Service) offers direct,
  no-cost early guidance to firms navigating authorisation/registration questions. This should be the
  first port of call, ahead of any paid legal advice, and it's free at any phase, not just Phase 4 — worth
  using even earlier if a regulatory question comes up sooner.

### Phase 5 — Real money for real strangers (full authorisation or BaaS partner)
**Cost: real capital required. No shortcut. This is where "time, not capital" stops being enough on its own.**

Two paths, both costed here honestly, neither cheap:

**Path A — Full FCA authorisation.** The £15,000–£80,000+ figure already in `CLAUDE.md`
(`regulatory-compliance-strategist`'s estimate) holds up against what's publicly findable, and here's the
component breakdown so it's numbers, not just a range:

| Component | Small EMI | Authorised EMI | Authorised PI (payment initiation) |
|---|---|---|---|
| FCA application fee | ~£500 | £5,000 | ~£1,500–£5,440 (sources vary; £5,000 is the commonly cited figure) |
| Minimum initial capital | None required, but must show "adequate financial resources"; capped at €5m e-money outstanding | £350,000 | £50,000 (payment initiation only) / £125,000 (payment execution) |
| Legal/compliance consultancy | Typically the bulk of the £15k–£80k+ range — safeguarding policy, wind-down plan, AML/financial crime framework, application drafting | Same, larger scope | Same |
| Timeline | Months | 6–18 months | 6–12 months |

The **£15,000–£80,000+ range is dominated by legal/consultancy fees and the capital requirement, not the
application fee itself** — the FCA application fee alone (£500–£5,000) is the smallest line item. A "Small
EMI" route (no minimum capital, capped e-money volume) is meaningfully cheaper than full Authorised EMI, but
still requires real consultancy spend to build a compliant application, and caps how much e-money can be
outstanding at any time — worth `regulatory-compliance-strategist` confirming which tier actually fits
Storehouse's Phase 5 ambitions before assuming the full £80k end applies.

**Path B — Banking-as-a-Service partner** (Griffin, ClearBank, Railsr, Weavr — `payments-engineer` owns the
technical integration; this agent owns the commercial comparison). These partners let Storehouse move real
money under *their* licence, in exchange for onboarding/platform fees and/or revenue share instead of the
full authorisation cost. This is very likely the cheaper near-term path to Phase 5 — but **commercial terms
(onboarding fees, minimum commitments, rev-share %) are not publicly quoted by any of the four providers**;
they're negotiated case-by-case once there's a real product and volume to discuss. That comparison is
explicitly gated to Phase 4+ traction (per this agent's scope) and has deliberately not been done yet —
see "Deferred research" below.

**Either path needs real capital Storehouse does not currently have.** The honest sequencing implication:
Phase 4 traction (waitlist size, beta engagement, a working closed beta) is not just a product milestone —
it's the asset that gets used to either (a) make a fundraising case for Path A, or (b) get a BaaS partner to
the table for Path B on workable terms. Nothing here should be paid for out of pocket before that traction
exists.

### Phase 6 — Investing & Kingdom Capital
**Not costed yet — deliberately last.** Flagged in `CLAUDE.md` as the heaviest regulatory lift of the three
domains in the original prototype (alongside AISP/PISP and card issuing). No cost research done here yet;
this phase shouldn't be costed in detail until Phase 5 is either underway or resolved, since its regulatory
scope (investment permissions, equity crowdfunding platform rules) is materially different from payments/EMI
and would need its own dedicated pass with `regulatory-compliance-strategist`.

---

## Infrastructure cost tracker (Phases 0–3, ongoing)

Current stack: Netlify (hosting + Functions) + Supabase (Postgres/Auth/RLS/Realtime). Both used on free
tiers today. Figures below verified via web search this session (2026-07-20); Supabase and Netlify both
changed their free-tier structures in the last year or two, so these are worth re-checking every few months
rather than assumed static.

**Supabase free tier (current, as of this check):**
- 500 MB database, 1 GB file storage, 5 GB egress/bandwidth per month
- Up to 50,000 monthly active users, 500,000 edge function invocations/month, 200 concurrent Realtime connections
- Up to 2 active projects
- Shared CPU, 500 MB RAM compute
- **No daily backups, no SLA, no SSO on free tier**
- **Free projects auto-pause after 7 days of no API activity** (data retained, but the project goes offline
  until manually resumed; 0-day backup retention on free tier means no snapshot exists while paused; ~90-day
  window to restore before actual deletion)
- **Pro plan: $25/month** — this is the natural next step once real, continuously-online usage (i.e.,
  anything beyond the owner poking at it occasionally) makes the auto-pause behaviour a problem. This is a
  small recurring cost, not a capital item, and is realistically a Phase 2–3 trigger (once Ethan/household
  are using it regularly enough that pausing is disruptive) rather than a Phase 0–1 one.

**Netlify free tier (current, as of this check):**
- 300 platform credits/month (credits fund a mix of deploys, bandwidth, compute, and requests — roughly
  ~15 GB bandwidth-equivalent before the cap)
- 1 concurrent build, 1 seat
- Hitting the 300-credit cap **pauses all sites** until the next billing month — no overage, no auto-charge
- **Personal plan: $9/month** (1,000 credits) or **Pro: $20/month** (3,000 credits, unlimited team seats) —
  next step if/when the credit cap becomes a real constraint. Also a small recurring cost, not capital.
- Note: accounts created before September 2025 may still be on a legacy 100GB-bandwidth/300-build-minute
  model rather than credits — worth checking which model the actual Storehouse Netlify account is on rather
  than assuming.

**Trigger for action, not a standing recommendation:** neither Supabase Pro ($25/mo) nor Netlify's paid
tiers ($9–20/mo) should be turned on pre-emptively. They're each individually small enough to not need a
"raise" — they're pocket-money-scale recurring costs — but per the working agreement, no spend should happen
until the free tier is actually being outgrown (auto-pause disrupting real usage, or the credit cap actually
being hit), not in anticipation of it.

---

## Deferred research (intentionally not done in this pass)

Per this agent's scope, the following is gated to Phase 4+ traction (a working product + a waitlist/beta to
show) and has **not** been researched yet:
- UK fintech accelerator/incubator programmes and their free-with-equity legal/regulatory support terms
- Grant schemes
- Angel/pre-seed norms and valuation expectations for UK fintech
- BaaS commercial-terms comparison (Griffin vs ClearBank vs Railsr vs Weavr onboarding fees, minimum
  commitments, revenue-share percentages) — confirmed via search this session that none of the four publish
  this publicly; it's negotiated once there's real product/volume to discuss, which is exactly the Phase 4+
  gate

This section exists so it's clear these gaps are a deliberate sequencing choice, not an oversight.

---

## Sources checked this session (2026-07-20)

- Supabase pricing/free tier: [designrevision.com](https://designrevision.com/blog/supabase-pricing), [Supabase project pausing docs](https://supabase.com/docs/guides/platform/free-project-pausing), [simplebackups.com](https://simplebackups.com/blog/supabase-free-tier-paused)
- Netlify pricing/free tier: [Netlify official pricing](https://www.netlify.com/pricing/), [flexprice.io](https://flexprice.io/blog/complete-guide-to-netlify-pricing-and-plans), [agentdeals.dev](https://agentdeals.dev/vendor/netlify)
- Plaid pricing: [Plaid official pricing](https://plaid.com/pricing/), [Plaid billing docs](https://plaid.com/docs/account/billing/), [Plaid support: how much does Plaid cost](https://support.plaid.com/hc/en-us/articles/16194632655895-How-much-does-Plaid-cost-and-what-are-the-pricing-models)
- FCA RAISP/AISP fees: [FCA authorisation fees](https://www.fca.org.uk/firms/authorisation/apply/fees), [FCA RAISP applicants](https://www.fca.org.uk/firms/apply-emoney-payment-institution/raisp)
- FCA EMI/PI capital & fees: [FCA EMI applicants](https://www.fca.org.uk/firms/apply-emoney-payment-institution/emi), [FCA PI applicants](https://www.fca.org.uk/firms/apply-emoney-payment-institution/pi), [Bratby Law](https://bratby.law/practice-areas/payments-regulation/authorisation-and-licensing/), [advapay.eu — small vs authorised EMI/PI](https://advapay.eu/the-main-differences-between-small-and-authorised-emis-pi-licenses/), [FD Capital — FCA fees and capital](https://www.fdcapital.co.uk/fca-authorisation-fees-and-capital-a-practical-guide/)
- FCA Innovation Hub: [FCA Innovation Hub](https://www.fca.org.uk/firms/innovation), [FCA innovation services](https://www.fca.org.uk/firms/project-innovate-innovation-hub)
- BaaS providers (landscape only, no commercial terms — those are Phase 4+ gated): [Gemba — Best BaaS Providers UK](https://ge.mba/research/best-baas-providers-in-the-uk), [Griffin](https://griffin.com/)
