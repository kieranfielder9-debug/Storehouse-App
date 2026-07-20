import { useState } from 'react'
import { TrendingUp, BarChart3, PieChart, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const SPEND_OVER_TIME = [
  { m: 'Dec', v: 2140 }, { m: 'Jan', v: 1980 }, { m: 'Feb', v: 2310 },
  { m: 'Mar', v: 2050 }, { m: 'Apr', v: 2200 }, { m: 'May', v: 1970 }
]
const CATS = [
  { label: 'Home & Bills',   pct: 38, color: '#A06EE1' },
  { label: 'Groceries',      pct: 18, color: '#FF9F4A' },
  { label: 'Giving',         pct: 17, color: '#14B8A6' },
  { label: 'Transport',      pct: 9,  color: '#7CC8FF' },
  { label: 'Eating Out',     pct: 8,  color: '#F4C56A' },
  { label: 'Other',          pct: 10, color: '#516183' }
]

export default function AnalyticsSection({ flashToast }) {
  const [view, setView] = useState('compare')

  return (
    <div>
      <SectionHeading
        title="Analytics"
        right={<button onClick={() => flashToast('Full analytics opened')} className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5">Open <ChevronRight className="h-3 w-3" /></button>}
      />

      <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card overflow-hidden">
        {/* Tab strip */}
        <div className="flex border-b border-white/5">
          {[
            { k: 'compare', l: 'Income vs Spend', icon: BarChart3 },
            { k: 'time',    l: 'Over Time',      icon: TrendingUp },
            { k: 'pie',     l: 'By Category',    icon: PieChart }
          ].map(t => (
            <button
              key={t.k}
              onClick={() => setView(t.k)}
              className={`flex-1 py-2.5 text-[11px] font-bold flex items-center justify-center gap-1.5 transition ${
                view === t.k ? 'text-teal2 border-b-2 border-teal2' : 'text-white/40 border-b-2 border-transparent'
              }`}
            >
              <t.icon className="h-3 w-3" /> {t.l}
            </button>
          ))}
        </div>

        <div className="p-4">
          {view === 'compare' && <IncomeVsSpend flashToast={flashToast} />}
          {view === 'time'    && <SpendOverTime data={SPEND_OVER_TIME} flashToast={flashToast} />}
          {view === 'pie'     && <CategoryPie cats={CATS} flashToast={flashToast} />}
        </div>
      </div>
    </div>
  )
}

function IncomeVsSpend({ flashToast }) {
  const months = [
    { m: 'Mar', inc: 2840, sp: 2050 },
    { m: 'Apr', inc: 2840, sp: 2200 },
    { m: 'May', inc: 2840, sp: 1970 }
  ]
  const max = Math.max(...months.flatMap(m => [m.inc, m.sp]))
  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <Tile label="Income"   value="£8,520" delta="+0%"  pos />
        <Tile label="Spending" value="£6,220" delta="-4.2%" pos />
      </div>
      <div className="space-y-2.5">
        {months.map(m => (
          <button key={m.m} onClick={() => flashToast(`${m.m} breakdown`)} className="w-full text-left">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white/70 w-8">{m.m}</span>
              <span className="text-[10px] text-white/40 font-mono">£{m.sp} of £{m.inc}</span>
            </div>
            <div className="flex gap-1 h-3">
              <div className="rounded-full bg-emerald-500/70" style={{ width: `${(m.inc / max) * 100}%` }} />
              <div className="rounded-full bg-rose-500/70 -ml-px" style={{ width: `${(m.sp / max) * 50}%` }} />
            </div>
          </button>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-white/50">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-emerald-500"/>Income</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500"/>Spending</span>
      </div>
    </>
  )
}

function SpendOverTime({ data, flashToast }) {
  const W = 320, H = 110, P = 4
  const max = Math.max(...data.map(d => d.v))
  const min = Math.min(...data.map(d => d.v))
  const stepX = (W - P * 2) / (data.length - 1)
  const norm = (v) => H - P - ((v - min) / (max - min || 1)) * (H - P * 2)
  const pts = data.map((d, i) => [P + i * stepX, norm(d.v)])
  const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
  const area = `${path} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`

  return (
    <>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Tile label="Avg / mo" value="£2,108" />
        <Tile label="vs prev"  value="£1,985" delta="+6.2%" />
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-28">
        <defs>
          <linearGradient id="spendFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#F4C56A" stopOpacity="0.35"/>
            <stop offset="1" stopColor="#F4C56A" stopOpacity="0"/>
          </linearGradient>
        </defs>
        {[0.33, 0.66].map((t, i) => (
          <line key={i} x1="0" x2={W} y1={H * t} y2={H * t} stroke="#1F2A40" strokeDasharray="2 4" strokeWidth="0.5"/>
        ))}
        <path d={area} fill="url(#spendFill)"/>
        <path d={path} fill="none" stroke="#F4C56A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#F4C56A" className="cursor-pointer" onClick={() => flashToast(`${data[i].m}: £${data[i].v}`)}/>
        ))}
      </svg>
      <div className="flex justify-between mt-1 text-[10px] text-white/40 font-mono">
        {data.map(d => <span key={d.m}>{d.m}</span>)}
      </div>
    </>
  )
}

function CategoryPie({ cats, flashToast }) {
  const total = cats.reduce((s, c) => s + c.pct, 0)
  const r = 42
  const c = 2 * Math.PI * r
  let off = 0

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 flex-shrink-0">
        <svg viewBox="0 0 100 100" className="-rotate-90 h-full w-full">
          <circle cx="50" cy="50" r={r} stroke="#1F2A40" strokeWidth="14" fill="none"/>
          {cats.map(cat => {
            const len = (cat.pct / total) * c
            const seg = (
              <circle
                key={cat.label}
                cx="50" cy="50" r={r}
                stroke={cat.color}
                strokeWidth="14"
                fill="none"
                strokeDasharray={`${len} ${c - len}`}
                strokeDashoffset={-off}
                strokeLinecap="butt"
                className="cursor-pointer transition-opacity hover:opacity-80"
                onClick={() => flashToast(`${cat.label}: ${cat.pct}%`)}
              />
            )
            off += len
            return seg
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[9px] uppercase tracking-widest text-white/40">Total</span>
          <span className="text-base font-extrabold text-white">£1,970</span>
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {cats.map(cat => (
          <button key={cat.label} onClick={() => flashToast(`${cat.label}: ${cat.pct}%`)} className="w-full flex items-center gap-2 text-left hover:bg-white/5 rounded px-1 py-0.5">
            <div className="h-2 w-2 rounded-sm flex-shrink-0" style={{ background: cat.color }}/>
            <span className="text-[10px] text-white/80 flex-1 truncate">{cat.label}</span>
            <span className="text-[10px] text-white/60 font-bold">{cat.pct}%</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function Tile({ label, value, delta, pos }) {
  return (
    <div className="rounded-xl bg-navydeep border border-white/10 p-2.5">
      <p className="text-[9px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="text-base font-extrabold text-white">{value}</p>
      {delta && (
        <p className={`text-[10px] font-bold flex items-center gap-0.5 ${pos ? 'text-emerald-400' : 'text-white/40'}`}>
          {pos ? <ArrowUpRight className="h-3 w-3"/> : <ArrowDownRight className="h-3 w-3"/>}
          {delta}
        </p>
      )}
    </div>
  )
}
