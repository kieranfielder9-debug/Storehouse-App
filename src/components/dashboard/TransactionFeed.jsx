import { Coffee, HandCoins, ShoppingBag, ArrowUpRight } from 'lucide-react'

const TXS = [
  { id: 1, icon: Coffee,       name: 'Coffee at Leeds Centre',  sub: 'Costa Coffee · Today, 09:14', amt: -3.20,   color: 'bg-amber-500/15 text-amber-400' },
  { id: 2, icon: HandCoins,    name: 'Tithe — Huddersfield Christian Fellowship', sub: 'Standing Order · Today', amt: -210.00, color: 'bg-teal-500/15 text-teal-400' },
  { id: 3, icon: ShoppingBag,  name: "Sainsbury's",             sub: 'Groceries · Yesterday',       amt: -48.62,  color: 'bg-orange-500/15 text-orange-400' },
  { id: 4, icon: ArrowUpRight, name: 'Salary — Riverbank Ltd',  sub: 'Income · 27 May',             amt: 2840.00, color: 'bg-emerald-500/15 text-emerald-400' }
]

export default function TransactionFeed({ onOpenTx }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>
        <button className="text-[10px] text-teal2 font-semibold">See all</button>
      </div>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {TXS.map(t => (
          <button
            key={t.id}
            onClick={() => onOpenTx?.(t)}
            className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition"
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${t.color}`}>
              <t.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] text-white font-semibold leading-tight">{t.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{t.sub}</p>
            </div>
            <div className="text-right">
              <p className={`text-[13px] font-bold ${t.amt > 0 ? 'text-emerald-400' : 'text-white'}`}>
                {t.amt > 0 ? '+' : ''}£{Math.abs(t.amt).toFixed(2)}
              </p>
              <p className="text-[9px] text-teal2 mt-0.5">Tap to manage</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
