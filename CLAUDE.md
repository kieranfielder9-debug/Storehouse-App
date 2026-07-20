# Storehouse

Faith-aligned personal finance app. React 18 + Vite + Tailwind + lucide-react frontend; Supabase (Postgres, Auth, RLS, Realtime) backend; Netlify hosting + Functions; Plaid for bank linking (currently simulated in sandbox mode). Live at storehouse-uk.com.

Brand: Deep Midnight background (#0B0F19), Trust Navy cards (#111C30), Teal gradient accent (#0D9488 → #14B8A6), gold for investment/reward highlights (#F4C56A). Tone: warm, faith-literate, plain-spoken — never preachy, never salesy.

## The goal

Take Storehouse from a polished, fully-mocked prototype to a product genuinely trustworthy with real money — sequenced so early, free, personal-use steps never block on later steps that need capital or regulatory authorisation the founder doesn't have yet. Full phased roadmap (with sourced FCA/provider figures): see the "Path to Real Money" artifact from July 2026.

Roadmap shape, in order:
0. Stabilise the current build (auth, deploys) — £0, no licence.
1. Real Mode — the account owner's own real transactions, entered by hand — £0, no licence.
2. Real automated bank sync, for the account owner only — small cost once funded, no licence (personal use).
3. Extend real functionality to the household (Ethan's Wisdom Wallet) — £0, stay strictly household-scoped.
4. Build the public case — waitlist, closed beta, brand/UX polish, start the RAISP conversation if read-only data for others is wanted (£250 FCA fee, no capital requirement).
5. Real money for real strangers — full authorisation (£15k–£80k+ all-in) or a Banking-as-a-Service partner (Griffin, ClearBank, Railsr, Weavr). Mandatory once serving anyone outside the household; no shortcut exists.
6. Investing & Kingdom Capital (equity crowdfunding) — deliberately last; heaviest regulatory lift of the three domains bundled in the original prototype.

Constraint that shapes everything: time to invest, not capital. Every recommendation should respect that until Phase 4+ produces real traction to fund the rest.

## The team

Ten specialist subagents live in `.claude/agents/` — each owns one domain and one phase-cluster of the roadmap above. Use the Agent tool with the matching `subagent_type` rather than doing specialist work directly:

| Agent | Owns |
|---|---|
| `platform-engineer` | Core app engineering, auth, Supabase schema/RLS, deploys — Phases 0–1 |
| `open-banking-specialist` | Real bank data connectivity (TrueLayer/Plaid/Yapily) — Phase 2 |
| `payments-engineer` | Real money movement, payment initiation, card issuing — Phases 2, 5 |
| `household-product-specialist` | Wisdom Wallet, family/child features, household-scope judgment — Phase 3 |
| `regulatory-compliance-strategist` | FCA pathways, "are we allowed to do this yet" — Phases 4–6, cross-cutting brake pedal |
| `baas-partnerships-lead` | Banking-as-a-Service partnerships (Griffin et al.) — Phase 5 |
| `investment-markets-specialist` | Invest tab, Kingdom Capital — Phase 6, deliberately last |
| `security-trust-engineer` | Adversarial review of auth/RLS/secrets before anything real ships — cross-cutting, review-only |
| `brand-growth-lead` | Visual polish, waitlist/landing page, positioning — Phase 4, after functionality not before |
| `finance-fundraising-strategist` | Costing the roadmap, accelerators/grants, eventually fundraising — Phases 4–5 |

## Working agreement

- Sequence over speed. The right order matters more than moving fast — this app will eventually hold real people's real money.
- Truth over comfort. Real costs, real timelines, real regulatory limits — stated plainly, even when the honest answer is "not yet" or "that needs money we don't have."
- Small proof before big bets. A working, honest, narrow thing today beats a perfect six-month plan.
- Delegate, don't hoard. The orchestrator coordinates; the named specialists do the specialist work.
- Your money, your risk, your call. Specialists surface tradeoffs and flag regulatory lines; the account owner makes the final call on anything with real financial or legal weight.
