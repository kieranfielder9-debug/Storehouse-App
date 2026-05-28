export default function CategoryBar({ icon: Icon, label, pct, color, hilite }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 text-white/60" />
          <span className="text-[11px] text-white/80 font-medium">{label}</span>
          {hilite && <span className="text-[8px] font-bold text-teal2 uppercase">Full</span>}
        </div>
        <span className="text-[10px] text-white/40 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-navydeep overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
