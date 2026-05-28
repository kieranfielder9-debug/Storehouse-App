import { useState } from 'react'
import { X, ShoppingBag, HandCoins, Bus, Coffee, Home, Sparkles, Plus, Minus } from 'lucide-react'
import Label from '../components/ui/Label.jsx'

const CATEGORIES = [
  { key: 'groceries', label: 'Groceries',      icon: ShoppingBag, spent: 480, cap: 600, color: 'from-orange-400 to-orange-500' },
  { key: 'giving',    label: 'Kingdom Giving', icon: HandCoins,   spent: 410, cap: 410, color: 'from-teal1 to-teal2' },
  { key: 'transport', label: 'Transport',      icon: Bus,         spent: 60,  cap: 150, color: 'from-blue-400 to-blue-500' },
  { key: 'eating',    label: 'Eating Out',     icon: Coffee,      spent: 92,  cap: 160, color: 'from-amber-400 to-amber-500' },
  { key: 'home',      label: 'Home & Bills',   icon: Home,        spent: 850, cap: 950, color: 'from-fuchsia-400 to-purple-500' },
  { key: 'misc',      label: 'Miscellaneous',  icon: Sparkles,    spent: 78,  cap: 200, color: 'from-cyan-400 to-blue-500' }
]

export default function BudgetDetailModal({ onClose, flashToast }) {
  const [cats, setCats] = useState(CATEGORIES)
  const total = cats.reduce((s, c) => s + c.spent, 0)
  const cap   = cats.reduce((s, c) => s + c.cap, 0)
  const pct   = Math.min(100, Math.round((total / cap) * 100))

  const adjust = (i, delta) => {
    setCats(cs => cs.map((c, idx) => idx === i ? { ...c, cap: Math.max(c.spent, c.cap + delta) } : c))
  }

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Monthly Budget</p>
            <h2 className="text-2xl font-extrabold text-white">£{total} <span className="text-white/40 text-base font-bold">/ £{cap}</span></h2>
            <p className="text-[11px] text-teal2 mt-0.5 font-bold">{pct}% spent · May 2026</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          <div className="mt-3 h-2 rounded-full bg-navydeep overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2" style={{ width: `${pct}%` }} />
          </div>

          <Label><span className="mt-5 block">Categories</span></Label>
          <div className="mt-2 space-y-2">
            {cats.map((c, i) => {
              const p = Math.min(100, Math.round((c.spent / c.cap) * 100))
              const over = c.spent >= c.cap
              return (
                <div key={c.key} className="rounded-2xl bg-navydeep border border-white/10 p-3">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-9 w-9 rounded-xl bg-white/5 flex items-center justify-center">
                      <c.icon className="h-4 w-4 text-white/70" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white leading-tight">{c.label}</p>
                      <p className="text-[10px] text-white/40">£{c.spent} of £{c.cap}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => adjust(i, -25)} className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center active:scale-95">
                        <Minus className="h-3 w-3 text-white/70" />
                      </button>
                      <button onClick={() => adjust(i, 25)} className="h-7 w-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center active:scale-95">
                        <Plus className="h-3 w-3 text-white/70" />
                      </button>
                    </div>
                  </div>
                  <div className="h-1.5 rounded-full bg-trustnavy overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${c.color}`} style={{ width: `${p}%` }} />
                  </div>
                  {over && <p className="mt-1 text-[10px] text-amber-400 font-bold">🎯 Target met</p>}
                </div>
              )
            })}
          </div>

          <button
            onClick={() => { flashToast('Budget saved'); onClose() }}
            className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
          >
            Save Budget
          </button>
        </div>
      </div>
    </div>
  )
}
