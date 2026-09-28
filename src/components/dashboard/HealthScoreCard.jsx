import { useStewardship } from '../../backend/useStewardship.js'

/** Health Score — ported from the Expo rebuild's HomeScreen.tsx (there,
 *  a mock 0–100 number). Here it's a real blend of three signals already
 *  available from provider.js:
 *   - Giving progress toward the tithe target this month (weight 0.5)
 *   - Whether a stewardship source (bank) is connected (weight 0.25)
 *   - Needs-vs-wants split this month, as a light discipline signal (0.25)
 *  The 50/25/25 weighting is a first-pass heuristic, not a validated
 *  formula — a good candidate to revisit once real usage data exists. */
export default function HealthScoreCard() {
  const { stats, plaid } = useStewardship()

  const givingScore = Math.min(100, stats.givingPct)
  const sourceScore = plaid.connected ? 100 : 0
  const totalMarked = stats.needCount + stats.wantCount
  const disciplineScore = totalMarked ? Math.round((stats.needCount / totalMarked) * 100) : 50
  const score = Math.round(givingScore * 0.5 + sourceScore * 0.25 + disciplineScore * 0.25)

  return (
    <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] uppercase tracking-widest text-white/40">Health Score</span>
        <span className="text-lg font-extrabold text-white">
          {score}<span className="text-xs text-white/30 font-semibold">/100</span>
        </span>
      </div>
      <div className="h-3 rounded-full bg-navydeep overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2 transition-all duration-500"
          style={{ width: `${score}%` }}
        />
      </div>
      <p className="text-[10px] text-white/40 mt-2 text-center">Your stewardship health this month</p>
    </div>
  )
}
