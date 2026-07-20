export default function Suggestion({ icon: Icon, title, meta, badge }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight truncate">{title}</p>
        <p className="text-[10px] text-white/40 mt-0.5 truncate">{meta}</p>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40">
        {badge}
      </span>
    </div>
  )
}
