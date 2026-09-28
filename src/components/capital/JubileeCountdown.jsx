import { useStewardship } from '../../backend/useStewardship.js'

/** Jubilee Countdown — ported from the Expo rebuild's MeasurementScreen.tsx
 *  (an LCD-style countdown there driven by mock numbers). "Jubilee" here
 *  means an illustrative lifetime-giving milestone, not a literal 50-year
 *  biblical Jubilee and not yet a per-user goal (a good follow-up: let
 *  stewards set their own milestone in Preferences). The countdown itself
 *  IS real: total Giving-category ledger rows ever given, projected
 *  forward at the current 30-day giving rate. */
const JUBILEE_MILESTONE = 10000

export default function JubileeCountdown() {
  const { ledger, stats } = useStewardship()

  const lifetimeGiving = ledger
    .filter((r) => r.category === 'Giving' && r.amount < 0)
    .reduce((s, r) => s + Math.abs(r.amount), 0)
  const remaining = Math.max(0, JUBILEE_MILESTONE - lifetimeGiving)
  const monthlyRate = stats.giving

  if (!monthlyRate || remaining === 0) {
    return (
      <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4 text-center">
        <p className="text-sm font-bold text-white mb-1">Jubilee Countdown</p>
        <p className="text-[11px] text-white/40">
          {remaining === 0
            ? `You've reached the £${JUBILEE_MILESTONE.toLocaleString()} Jubilee milestone — well done, faithful steward.`
            : 'Start giving regularly to begin your Jubilee countdown.'}
        </p>
      </div>
    )
  }

  const daysToGo = Math.ceil((remaining / monthlyRate) * 30)
  const months = Math.floor(daysToGo / 30)
  const weeks = Math.floor((daysToGo % 30) / 7)
  const days = (daysToGo % 30) % 7

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <p className="text-sm font-bold text-white mb-3 text-center">Jubilee Countdown</p>
      <div className="flex items-center justify-center gap-2 bg-navydeep rounded-xl p-3">
        <LcdDigit value={months} unit="MO" />
        <span className="text-white/20 text-lg">:</span>
        <LcdDigit value={weeks} unit="WK" />
        <span className="text-white/20 text-lg">:</span>
        <LcdDigit value={days} unit="DY" />
      </div>
      <p className="text-[10px] text-white/40 text-center mt-2">
        On pace for your £{JUBILEE_MILESTONE.toLocaleString()} Jubilee milestone at your current giving rate — {daysToGo} days to go
      </p>
    </div>
  )
}

function LcdDigit({ value, unit }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-2xl font-bold text-teal2 font-mono">{String(value).padStart(2, '0')}</span>
      <span className="text-[8px] text-white/30 font-bold tracking-widest">{unit}</span>
    </div>
  )
}
