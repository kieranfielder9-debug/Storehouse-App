import { useStewardship } from '../../backend/useStewardship.js'

/** Stream Splitter — ported from the Expo rebuild's AllocationScreen.tsx
 *  (there, a branching river SVG over mock vault balances). Reimplemented
 *  as a simpler segmented bar + list, reusing the SAME Everyday/Savings
 *  balances BalanceSplit.jsx already shows above it — there is no real
 *  "account balance" model yet (the ledger tracks transactions, not
 *  running balances), so those two figures stay illustrative and
 *  in sync with BalanceSplit rather than inventing a second, different
 *  set of numbers. The Giving stream is real, computed from this
 *  month's actual ledger rows. */
export default function StreamSplitter() {
  const { stats } = useStewardship()

  const vaults = [
    { id: 'everyday', name: 'Everyday', balance: 1420.5, color: '#516183' },
    { id: 'savings', name: 'Savings + Invest', balance: 12650, color: '#14B8A6' },
    { id: 'giving', name: 'Giving (this month)', balance: stats.giving, color: '#F4C56A' }
  ]
  const total = vaults.reduce((s, v) => s + v.balance, 0) || 1

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-white">Stream Splitter</p>
        <span className="text-[10px] text-white/40">£{total.toLocaleString(undefined, { maximumFractionDigits: 0 })} total</span>
      </div>

      <div className="flex h-3 rounded-full overflow-hidden mb-3">
        {vaults.map((v) => (
          <div key={v.id} style={{ width: `${(v.balance / total) * 100}%`, background: v.color }} />
        ))}
      </div>

      <div className="space-y-2">
        {vaults.map((v) => (
          <div key={v.id} className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: v.color }} />
              <span className="text-[11px] text-white/70 truncate">{v.name}</span>
            </div>
            <span className="text-[11px] font-bold text-white font-mono flex-shrink-0">
              £{v.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} · {Math.round((v.balance / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
