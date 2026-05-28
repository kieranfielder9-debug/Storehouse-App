import { useMemo, useState } from 'react'

const PERIODS = ['Week', 'Month', '3M', '6M', '1Y']

// Pseudo-random but deterministic mini history per period
const DATA = {
  Week:  [1180, 1240, 1305, 1290, 1360, 1395, 1420],
  Month: Array.from({ length: 30 }, (_, i) => 1100 + Math.sin(i / 3) * 80 + i * 11),
  '3M':  Array.from({ length: 12 }, (_, i) => 950 + Math.cos(i / 2) * 60 + i * 40),
  '6M':  Array.from({ length: 24 }, (_, i) => 800 + Math.sin(i / 4) * 90 + i * 26),
  '1Y':  Array.from({ length: 12 }, (_, i) => 720 + i * 62 + (i % 3 === 0 ? -40 : 30))
}

export default function MoneyTimelineChart({ accent = '#14B8A6' }) {
  const [period, setPeriod] = useState('Month')

  const { path, area, min, max, last } = useMemo(() => {
    const d = DATA[period]
    const min = Math.min(...d)
    const max = Math.max(...d)
    const W = 320, H = 130, P = 4
    const stepX = (W - P * 2) / (d.length - 1)
    const norm = (v) => H - P - ((v - min) / (max - min || 1)) * (H - P * 2)
    const pts = d.map((v, i) => [P + i * stepX, norm(v)])
    const path = pts.map((p, i) => (i === 0 ? `M${p[0]},${p[1]}` : `L${p[0]},${p[1]}`)).join(' ')
    const area = `${path} L${pts.at(-1)[0]},${H} L${pts[0][0]},${H} Z`
    return { path, area, min, max, last: d.at(-1) }
  }, [period])

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-white/40">Balance now</p>
          <p className="text-2xl font-extrabold text-white">£{last.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="flex items-center gap-1 bg-navydeep rounded-lg p-0.5 border border-white/10">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-2.5 py-1 rounded-md text-[10px] font-bold transition ${
                period === p ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow' : 'text-white/50'
              }`}
            >{p}</button>
          ))}
        </div>
      </div>

      <svg viewBox="0 0 320 130" className="w-full h-32">
        <defs>
          <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor={accent} stopOpacity="0.35" />
            <stop offset="1" stopColor={accent} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line key={i} x1="0" x2="320" y1={130 * t} y2={130 * t} stroke="#1F2A40" strokeDasharray="2 4" strokeWidth="0.5" />
        ))}
        <path d={area} fill="url(#chartFill)" />
        <path d={path} fill="none" stroke={accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <div className="flex justify-between text-[10px] text-white/40 mt-1 font-mono">
        <span>min £{Math.round(min).toLocaleString()}</span>
        <span>max £{Math.round(max).toLocaleString()}</span>
      </div>
    </div>
  )
}
