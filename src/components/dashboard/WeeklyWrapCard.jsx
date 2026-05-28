import { Sparkles, ChevronRight } from 'lucide-react'

export default function WeeklyWrapCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left relative rounded-2xl p-4 bg-gradient-to-br from-teal1 to-teal2 border border-white/20 shadow-glow overflow-hidden group"
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl group-hover:scale-110 transition-transform" />
      <div className="absolute top-2 right-2 flex gap-0.5">
        {[0, 1, 2].map(i => (
          <div key={i} className="h-1.5 w-6 rounded-full bg-white/30 overflow-hidden">
            <div
              className="h-full bg-white"
              style={{ width: i === 0 ? '100%' : i === 1 ? '60%' : '0%' }}
            />
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-1 relative">
        <Sparkles className="h-4 w-4 text-white" />
        <span className="text-[10px] uppercase tracking-widest text-white/90 font-bold">Weekly Wrap</span>
      </div>
      <h3 className="text-lg font-extrabold text-white leading-tight relative">
        Your Weekly Stewardship<br />Wrap is Ready!
      </h3>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90 relative">
        Tap to view <ChevronRight className="h-3.5 w-3.5" />
      </div>
    </button>
  )
}
