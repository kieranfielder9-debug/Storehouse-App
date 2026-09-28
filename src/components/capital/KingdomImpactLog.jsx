import { useStewardship } from '../../backend/useStewardship.js'
import { deriveKingdomImpact } from '../../backend/kingdomImpact.js'

/** Kingdom Impact Log — ported from the Expo rebuild's
 *  MeasurementScreen.tsx (mock data there). Backed by real ledger rows via
 *  backend/kingdomImpact.js — see that file for why it doesn't fabricate a
 *  cause story on top of real transactions. "+ Add Your Own Impact" is
 *  intentionally a stub for now rather than a modal wired to a
 *  half-modelled feature; see the port summary. */
export default function KingdomImpactLog({ flashToast }) {
  const { ledger } = useStewardship()
  const impact = deriveKingdomImpact(ledger)

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <p className="text-sm font-bold text-white mb-3">Kingdom Impact Log</p>
      {impact.length === 0 ? (
        <p className="text-[11px] text-white/30 italic mb-3">Your giving will show up here as you go.</p>
      ) : (
        <div className="space-y-2 mb-3">
          {impact.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0 gap-2">
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-white truncate">{item.title}</p>
                <p className="text-[10px] text-white/40">{item.subtitle}</p>
              </div>
              <span className="text-[12px] font-bold text-gold flex-shrink-0">{item.amountLabel}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => flashToast?.('Manual impact logging is coming soon')}
        className="w-full py-2.5 rounded-xl bg-navydeep border border-dashed border-white/20 text-white/50 text-xs font-bold"
      >
        + Add Your Own Impact
      </button>
    </div>
  )
}
