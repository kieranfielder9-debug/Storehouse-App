export default function PortfolioPie({ pies, onSlice }) {
  const total = pies.reduce((s, p) => s + p.pct, 0)
  const r = 56
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="rounded-2xl p-5 bg-trustnavy border border-white/10 shadow-card relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-teal2/5 blur-3xl" />

      <div className="flex items-center gap-4">
        <div className="relative h-36 w-36 flex-shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={r} stroke="#1F2A40" strokeWidth="18" fill="none" />
            {pies.map((p) => {
              const len = (p.pct / total) * c
              const seg = (
                <circle
                  key={p.key}
                  cx="80" cy="80" r={r}
                  stroke={p.color}
                  strokeWidth="18"
                  fill="none"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => onSlice(p)}
                />
              )
              offset += len
              return seg
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest text-white/40">Invested</span>
            <span className="text-2xl font-extrabold text-white">£8.4k</span>
            <span className="text-[10px] text-emerald-400 font-bold">+2.6%</span>
          </div>
        </div>

        <div className="flex-1 space-y-2">
          {pies.map(p => (
            <button
              key={p.key}
              onClick={() => onSlice(p)}
              className="w-full flex items-center gap-2 text-left hover:bg-white/5 rounded-lg p-1 transition"
            >
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-semibold leading-tight truncate">{p.name}</p>
              </div>
              <span className="text-[11px] font-bold text-white/70">{p.pct}%</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-white/40 mt-3 text-center">Tap a slice to dig deeper</p>
    </div>
  )
}
