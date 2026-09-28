import { useStewardship } from '../../backend/useStewardship.js'
import { KINGDOM_STAKE } from '../capital/kingdomStake.js'

/** Giving Targets — ported from the Expo rebuild's PlanningScreen.tsx
 *  ("Giving Targets" target rings for Tithe/Offerings/Kingdom Fund, mock
 *  data there). Backed here by real fields: Tithe and Offerings are
 *  computed from actual ledger rows this month (see
 *  provider.computeStats()); Kingdom Fund compares the illustrative
 *  KINGDOM_STAKE investment figure (kingdomStake.js) against its target,
 *  since there is no real investment-transaction ledger yet. Target-ring
 *  visuals are reserved for giving/generosity progress specifically, per
 *  the mobile redesign's own DESIGN-DECISIONS.md §10 — not reused for
 *  anything else here. */
export default function GivingTargets() {
  const { goals, stats } = useStewardship()

  const rings = [
    { id: 'tithe', label: 'Tithe', given: stats.giving, target: stats.titheTarget || 1, color: '#14B8A6' },
    { id: 'offerings', label: 'Offerings', given: stats.offeringsGiven ?? 0, target: goals.offerings_target || 1, color: '#0D9488' },
    { id: 'kingdom', label: 'Kingdom Fund', given: KINGDOM_STAKE, target: goals.kingdom_fund_target || 1, color: '#F4C56A' }
  ]

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <p className="text-sm font-bold text-white mb-3">Giving Targets</p>
      <div className="flex justify-between gap-2">
        {rings.map((r) => (
          <TargetRing key={r.id} {...r} />
        ))}
      </div>
    </div>
  )
}

function TargetRing({ label, given, target, color }) {
  const pct = Math.min(100, (given / target) * 100)
  const r = 26
  const c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center flex-1 min-w-0">
      <div className="relative h-16 w-16">
        <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
          <circle cx="32" cy="32" r={r} stroke="#1F2A40" strokeWidth="6" fill="none" />
          <circle
            cx="32" cy="32" r={r}
            stroke={color} strokeWidth="6" fill="none"
            strokeDasharray={c}
            strokeDashoffset={c - (pct / 100) * c}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-extrabold text-white">{Math.round(pct)}%</span>
        </div>
      </div>
      <p className="text-[10px] text-white/60 font-semibold mt-1.5 text-center truncate w-full">{label}</p>
      <p className="text-[9px] text-white/30 text-center">£{Math.round(given)} / £{Math.round(target)}</p>
    </div>
  )
}
