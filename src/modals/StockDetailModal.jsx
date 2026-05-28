import { useState } from 'react'
import { X, TrendingUp, TrendingDown, Plus, Star, Building2, Globe } from 'lucide-react'

export default function StockDetailModal({ stock, onClose, flashToast }) {
  const [tab, setTab] = useState('1M')
  const positive = stock.dir === 'up'

  // generate a plausible sparkline path
  const W = 320, H = 120
  const seed = stock.sym.charCodeAt(0)
  const pts = Array.from({ length: 24 }, (_, i) => {
    const y = H * 0.5 + Math.sin(i / 2 + seed) * 30 + (positive ? -i : i) * 1.2
    return [4 + (i * (W - 8)) / 23, Math.max(8, Math.min(H - 8, y))]
  })
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area = `${path} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`
  const stroke = positive ? '#34D399' : '#FB7185'

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-navydeep border border-white/10 flex items-center justify-center font-extrabold text-[12px] text-teal2">
              {stock.sym}
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">{stock.sym} · LON</p>
              <h2 className="text-base font-extrabold text-white leading-tight">{stock.name}</h2>
            </div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          <div className="mt-3 flex items-end gap-3">
            <p className="text-3xl font-extrabold text-white">£{stock.price.toFixed(2)}</p>
            <p className={`text-sm font-bold flex items-center gap-1 mb-1 ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
              {positive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {positive ? '+' : ''}{stock.chg}% today
            </p>
          </div>

          <div className="mt-3 flex gap-1 bg-navydeep p-0.5 rounded-lg border border-white/10 w-fit">
            {['1D', '1W', '1M', '3M', '1Y', '5Y'].map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                  tab === t ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow' : 'text-white/50'
                }`}
              >{t}</button>
            ))}
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-32 mt-3">
            <defs>
              <linearGradient id="stockFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor={stroke} stopOpacity="0.35" />
                <stop offset="1" stopColor={stroke} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#stockFill)" />
            <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <Stat label="P/E"     value="14.2" />
            <Stat label="Mkt Cap" value="£3.2B" />
            <Stat label="Yield"   value="2.1%" />
          </div>

          <div className="mt-4 rounded-2xl bg-navydeep border border-white/10 p-3.5">
            <div className="flex items-center gap-2 mb-1.5">
              <Star className="h-3.5 w-3.5 text-teal2 fill-teal2" />
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Stewardship Screen</p>
            </div>
            <div className="space-y-1.5 text-[11px] text-white/70">
              <Row label="No alcohol / tobacco" pass />
              <Row label="No gambling exposure" pass />
              <Row label="No weapons revenue"   pass />
              <Row label="ESG rating ≥ 7"       pass />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button onClick={() => { flashToast(`Added ${stock.sym} to watchlist`); onClose() }} className="py-3 rounded-xl bg-trustnavy border border-white/10 text-sm font-bold text-white flex items-center justify-center gap-2">
              <Plus className="h-4 w-4 text-teal2" /> Watch
            </button>
            <button onClick={() => { flashToast(`Buying ${stock.sym}…`); onClose() }} className="py-3 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-sm font-bold text-white shadow-glow">
              Buy {stock.sym}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-navydeep border border-white/10 p-2.5 text-center">
      <p className="text-[9px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="text-base font-bold text-white mt-0.5">{value}</p>
    </div>
  )
}

function Row({ label, pass }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${pass ? 'bg-emerald-400' : 'bg-rose-400'}`} />
      <span>{label}</span>
    </div>
  )
}
