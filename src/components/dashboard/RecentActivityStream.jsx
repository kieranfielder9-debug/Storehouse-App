import { useStewardship } from '../../backend/useStewardship.js'
import { deriveKingdomImpact } from '../../backend/kingdomImpact.js'

const GROUPS = [
  { key: 'purchases', label: 'Purchases' },
  { key: 'streamAllocations', label: 'Stream Allocations' },
  { key: 'kingdomImpacts', label: 'Kingdom Impacts' },
  { key: 'cancelledPurchases', label: 'Cancelled Purchases' }
]

/** Recent Activity Stream — ported from the Expo rebuild's HomeScreen.tsx,
 *  which grouped mock activity into these same four buckets. Here,
 *  Purchases and Stream Allocations are real ledger rows, and Kingdom
 *  Impacts reuses the same real-data helper as Capital's Kingdom Impact
 *  Log (see backend/kingdomImpact.js). "Cancelled Purchases" has no
 *  backing concept yet — the ledger model has no refund/void/cancel
 *  field — so it always renders its honest empty state instead of being
 *  invented here. */
export default function RecentActivityStream() {
  const { ledger } = useStewardship()

  const grouped = {
    purchases: ledger.filter((r) => r.amount < 0 && r.category !== 'Giving').slice(0, 5),
    streamAllocations: ledger.filter((r) => r.category === 'Giving').slice(0, 5),
    kingdomImpacts: deriveKingdomImpact(ledger).slice(0, 3),
    cancelledPurchases: []
  }

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <p className="text-sm font-bold text-white mb-3">Recent Activity Stream</p>
      {GROUPS.map(({ key, label }) => (
        <div key={key} className="mb-3 last:mb-0">
          <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">{label}</p>
          {grouped[key].length === 0 ? (
            <p className="text-[11px] text-white/30 italic">
              {key === 'cancelledPurchases' ? 'No cancelled purchases' : 'Nothing here yet'}
            </p>
          ) : (
            <div className="space-y-1">
              {grouped[key].map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                  <span className="text-[11px] text-white/70 truncate pr-2">{item.description || item.title}</span>
                  <span className={`text-[11px] font-bold font-mono flex-shrink-0 ${item.amount >= 0 ? 'text-emerald-400' : 'text-white/70'}`}>
                    {item.amountLabel || `${item.amount >= 0 ? '+' : '-'}£${Math.abs(item.amount).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
