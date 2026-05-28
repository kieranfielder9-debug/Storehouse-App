import { TrendingUp, TrendingDown, Plus } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const STOCKS = [
  { sym: 'TRNT', name: 'Trinity BioSciences', price: 142.30, chg: 2.4,  dir: 'up' },
  { sym: 'GRNH', name: 'Green Homes UK',      price: 28.10,  chg: -0.8, dir: 'down' },
  { sym: 'KGDM', name: 'Kingdom Cloud Co.',   price: 67.92,  chg: 4.7,  dir: 'up' },
  { sym: 'EDEN', name: 'Eden Renewables',     price: 19.45,  chg: 1.6,  dir: 'up' },
  { sym: 'BETH', name: 'Bethel Housing',      price: 84.20,  chg: -1.2, dir: 'down' }
]

export default function Watchlist({ onOpenStock, flashToast }) {
  return (
    <div>
      <SectionHeading
        title="Watchlist"
        right={
          <button onClick={() => flashToast('Search stocks')} className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5">
            <Plus className="h-3 w-3" />Add
          </button>
        }
      />
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {STOCKS.map(s => (
          <button
            key={s.sym}
            onClick={() => onOpenStock?.(s)}
            className="w-full flex items-center px-4 py-3 hover:bg-white/[0.03] active:bg-white/[0.05] transition"
          >
            <div className="h-9 w-9 rounded-xl bg-navydeep border border-white/10 flex items-center justify-center font-extrabold text-[11px] text-teal2">
              {s.sym}
            </div>
            <div className="ml-3 flex-1 text-left">
              <p className="text-sm font-semibold text-white leading-tight">{s.name}</p>
              <p className="text-[10px] text-white/40">£{s.price.toFixed(2)}</p>
            </div>
            <div className={`text-right text-xs font-bold flex items-center gap-1 ${
              s.dir === 'up' ? 'text-emerald-400' : 'text-rose-400'
            }`}>
              {s.dir === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {s.dir === 'up' ? '+' : ''}{s.chg}%
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
