import { Coffee, HandCoins, ShoppingBag, ArrowUpRight, Home, Bus, Sparkles, FlaskConical } from 'lucide-react'
import { useStewardship } from '../../backend/useStewardship.js'

const CATEGORY_STYLE = {
  Food:      { icon: Coffee,       color: 'bg-amber-500/15 text-amber-400' },
  Giving:    { icon: HandCoins,    color: 'bg-teal-500/15 text-teal-400' },
  Groceries: { icon: ShoppingBag,  color: 'bg-orange-500/15 text-orange-400' },
  Income:    { icon: ArrowUpRight, color: 'bg-emerald-500/15 text-emerald-400' },
  Bills:     { icon: Home,         color: 'bg-fuchsia-500/15 text-fuchsia-400' },
  Transport: { icon: Bus,          color: 'bg-blue-500/15 text-blue-400' },
  Sandbox:   { icon: FlaskConical, color: 'bg-cyan-500/15 text-cyan-300' }
}
const fallback = { icon: Sparkles, color: 'bg-white/10 text-white/70' }

const friendly = (d) => {
  const today = new Date().toISOString().slice(0, 10)
  const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  return d === today ? 'Today' : d === yest ? 'Yesterday' : d
}

export default function TransactionFeed({ onOpenTx }) {
  const { ledger } = useStewardship()

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>
        <button className="text-[10px] text-teal2 font-semibold">See all</button>
      </div>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {ledger.slice(0, 4).map((t) => {
          const s = CATEGORY_STYLE[t.category] || fallback
          const Icon = s.icon
          return (
            <button
              key={t.id}
              onClick={() => onOpenTx?.(t)}
              className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition"
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${s.color}`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-[13px] text-white font-semibold leading-tight">{t.description}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{t.meta || `${t.category} · ${friendly(t.date)}`}</p>
              </div>
              <div className="text-right">
                <p className={`text-[13px] font-bold ${t.amount > 0 ? 'text-emerald-400' : 'text-white'}`}>
                  {t.amount > 0 ? '+' : ''}£{Math.abs(t.amount).toFixed(2)}
                </p>
                <p className="text-[9px] text-teal2 mt-0.5">Tap to manage</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
