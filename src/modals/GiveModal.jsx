import { useState } from 'react'
import { X, Heart, Sparkles, ArrowRight, ChevronRight, Search } from 'lucide-react'

const SUGGESTIONS = [
  {
    id: 'hcf',
    name: 'Huddersfield Christian Fellowship',
    blurb: 'Your home church · Standing order active',
    tag: 'Church',
    color: 'from-teal-500 to-emerald-500',
    suggested: 210
  },
  {
    id: 'bradford-faith',
    name: 'Bradford Faith Hub',
    blurb: 'Community center · 78% funded',
    tag: 'Kingdom Capital',
    color: 'from-amber-500 to-orange-500',
    suggested: 25
  },
  {
    id: 'compass',
    name: 'Compassion UK — Sponsor a child',
    blurb: '£30/mo · Recommended for you',
    tag: 'Mission',
    color: 'from-rose-500 to-pink-500',
    suggested: 30
  },
  {
    id: 'foodbank',
    name: 'Leeds South Foodbank',
    blurb: 'Trussell Trust partner · Local',
    tag: 'Local',
    color: 'from-blue-500 to-indigo-500',
    suggested: 20
  },
  {
    id: 'biblesoc',
    name: 'Bible Society',
    blurb: 'Translation work · Worldwide',
    tag: 'Mission',
    color: 'from-fuchsia-500 to-purple-500',
    suggested: 15
  }
]

export default function GiveModal({ onClose, flashToast }) {
  const [selected, setSelected] = useState(null)
  const [amount, setAmount] = useState('')
  const item = SUGGESTIONS.find(s => s.id === selected)

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[92%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400 fill-rose-400" /> Give
            </h2>
            <p className="text-[11px] text-white/50">Tithes, missions & causes</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          {!selected && (
            <>
              <div className="mt-2 rounded-2xl p-4 bg-gradient-to-br from-teal1/20 to-trustnavy border border-teal2/30">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-teal2" />
                  <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Tithe progress</p>
                </div>
                <p className="text-base text-white font-bold">You've given £410 this month · 10.2% of income</p>
                <div className="mt-2 h-1.5 rounded-full bg-navydeep overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2" style={{ width: '100%' }} />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navydeep border border-white/10">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  placeholder="Search a cause or charity"
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
                />
              </div>

              <p className="mt-4 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Suggested for you</p>
              <div className="space-y-2">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s.id}
                    onClick={() => { setSelected(s.id); setAmount(String(s.suggested)) }}
                    className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl bg-navydeep border border-white/10 hover:border-teal2/30 transition text-left"
                  >
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white font-extrabold shadow border border-white/20`}>
                      {s.name.slice(0, 1)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm text-white font-bold leading-tight truncate">{s.name}</p>
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5 truncate">{s.blurb}</p>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-teal2 mt-0.5 inline-block">{s.tag}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40" />
                  </button>
                ))}
              </div>
            </>
          )}

          {selected && item && (
            <div className="pt-2">
              <button onClick={() => setSelected(null)} className="text-[11px] text-teal2 font-bold mb-3">← Back to causes</button>

              <div className="rounded-2xl p-4 bg-navydeep border border-white/10 flex items-center gap-3">
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-extrabold shadow border border-white/20`}>
                  {item.name.slice(0, 1)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-tight">{item.name}</p>
                  <p className="text-[11px] text-white/50">{item.blurb}</p>
                </div>
              </div>

              <p className="mt-4 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Amount</p>
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navydeep border border-white/10">
                <span className="text-white/40 font-bold text-lg">£</span>
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                  inputMode="decimal"
                  className="flex-1 bg-transparent text-2xl font-extrabold text-white placeholder-white/20 focus:outline-none"
                />
              </div>

              <div className="mt-3 grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map(v => (
                  <button
                    key={v}
                    onClick={() => setAmount(String(v))}
                    className={`py-2 rounded-lg text-xs font-bold border transition ${
                      Number(amount) === v
                        ? 'bg-teal2/15 text-teal2 border-teal2/40'
                        : 'bg-trustnavy text-white/70 border-white/10'
                    }`}
                  >£{v}</button>
                ))}
              </div>

              <button
                disabled={!amount}
                onClick={() => { flashToast(`£${amount} given to ${item.name}`); onClose() }}
                className={`mt-5 w-full py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  amount
                    ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                <Heart className="h-4 w-4" /> Give £{amount || 0}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
