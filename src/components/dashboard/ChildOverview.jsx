import { BookOpen, ChevronRight, TrendingUp, Sparkles } from 'lucide-react'

export default function ChildOverview({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-fuchsia-500/15 via-trustnavy to-trustnavy border border-fuchsia-400/30 shadow-card relative overflow-hidden"
    >
      <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-fuchsia-400/10 blur-3xl"/>
      <div className="relative flex items-center gap-3">
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7CC8FF] via-[#A06EE1] to-[#F4C56A] flex items-center justify-center text-white font-extrabold text-lg shadow-glow border border-white/20">
          E
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[10px] uppercase tracking-widest text-fuchsia-300 font-bold">Wisdom Wallet</p>
            <Sparkles className="h-3 w-3 text-fuchsia-300"/>
          </div>
          <p className="text-sm font-bold text-white leading-tight">Ethan's Budget · This week</p>
        </div>
        <ChevronRight className="h-4 w-4 text-white/40"/>
      </div>

      <div className="relative mt-3 grid grid-cols-3 gap-2">
        <Mini label="Balance" value="£14.20" />
        <Mini label="Saved"   value="£8.50"  icon={TrendingUp} pos />
        <Mini label="Modules" value="2 / 4"  icon={BookOpen} />
      </div>

      <div className="relative mt-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] text-white/60 font-bold">Weekly limit</span>
          <span className="text-[10px] text-white/40 font-mono">£12 of £20</span>
        </div>
        <div className="h-1.5 rounded-full bg-navydeep overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-500" style={{ width: '60%' }}/>
        </div>
      </div>
    </button>
  )
}

function Mini({ label, value, icon: Icon, pos }) {
  return (
    <div className="rounded-xl bg-navydeep/70 border border-white/10 p-2 text-center">
      <p className="text-[9px] uppercase tracking-widest text-white/40">{label}</p>
      <p className={`text-sm font-extrabold ${pos ? 'text-emerald-400' : 'text-white'} flex items-center justify-center gap-0.5 mt-0.5`}>
        {Icon && <Icon className="h-3 w-3"/>}{value}
      </p>
    </div>
  )
}
