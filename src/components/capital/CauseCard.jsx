import { ArrowUpRight } from 'lucide-react'

export default function CauseCard({ item, onInvest }) {
  const Icon = item.icon
  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card overflow-hidden">
      <div className="h-24 relative bg-gradient-to-br from-navysoft to-navydeep flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal2/20 via-transparent to-amber-400/10" />
        <Icon className="h-12 w-12 text-white/30" />
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-white border border-white/15">
          {item.tag}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-extrabold text-white leading-tight">{item.name}</h3>
        <p className="text-[11px] text-white/50 mt-1.5 leading-snug">{item.blurb}</p>

        <div className="mt-3">
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <p className="text-lg font-bold text-white">£{item.raised.toLocaleString()}</p>
              <p className="text-[10px] text-white/40">raised of £{item.goal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-teal2">{item.pct}%</p>
              <p className="text-[10px] text-white/40">{item.backers} backers</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-navydeep overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2 transition-all"
              style={{ width: `${item.pct}%` }}
            />
          </div>
        </div>

        <button
          onClick={onInvest}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2"
        >
          Invest Now <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
