import { ChevronRight, ShoppingBag, HandCoins, Bus } from 'lucide-react'
import CategoryBar from './CategoryBar.jsx'

export default function BudgetCard({ onOpen }) {
  const spent = 62
  const circumference = 2 * Math.PI * 38
  const dashOffset = circumference - (spent / 100) * circumference

  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card hover:border-teal2/40 transition"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white">Monthly Budget</h3>
        <span className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5">
          Adjust <ChevronRight className="h-3 w-3" />
        </span>
      </div>
      <p className="text-[11px] text-white/40 mb-3">May 2026 cycle · Tap to manage</p>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
            <circle cx="44" cy="44" r="38" stroke="#1F2A40" strokeWidth="9" fill="none" />
            <defs>
              <linearGradient id="budgetGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#0D9488" />
                <stop offset="1" stopColor="#14B8A6" />
              </linearGradient>
            </defs>
            <circle
              cx="44" cy="44" r="38"
              stroke="url(#budgetGrad)" strokeWidth="9" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white leading-none">{spent}%</span>
            <span className="text-[9px] text-white/40 uppercase tracking-wide mt-0.5">Spent</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <CategoryBar icon={ShoppingBag} label="Groceries"      pct={80}  color="from-orange-400 to-orange-500" />
          <CategoryBar icon={HandCoins}   label="Kingdom Giving" pct={100} color="from-teal1 to-teal2"          hilite />
          <CategoryBar icon={Bus}         label="Transport"      pct={40}  color="from-blue-400 to-blue-500" />
        </div>
      </div>
    </button>
  )
}
