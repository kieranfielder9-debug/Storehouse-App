import { Wallet, TrendingUp, ArrowUpRight } from 'lucide-react'
import Tagchip from '../ui/Tagchip.jsx'

export default function BalanceSplit() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Everyday</span>
          <Wallet className="h-3.5 w-3.5 text-white/40" />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">
          £1,420<span className="text-white/40 text-base">.50</span>
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tagchip color="bg-pink-500/15 text-pink-300 border-pink-500/30" label="Monzo" />
          <Tagchip color="bg-blue-500/15 text-blue-300 border-blue-500/30" label="Halifax" />
        </div>
      </div>

      <div className="rounded-2xl p-4 bg-gradient-to-br from-teal1/30 via-trustnavy to-trustnavy border border-teal2/30 shadow-glow relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal2/10 blur-2xl" />
        <div className="flex items-center justify-between mb-2 relative">
          <span className="text-[10px] uppercase tracking-widest text-teal2">Savings + Invest</span>
          <TrendingUp className="h-3.5 w-3.5 text-teal2" />
        </div>
        <p className="text-2xl font-bold text-white tracking-tight relative">
          £12,650<span className="text-white/40 text-base">.00</span>
        </p>
        <div className="mt-3 flex items-center gap-1 text-[11px] relative">
          <ArrowUpRight className="h-3 w-3 text-teal2" />
          <span className="text-teal2 font-semibold">+£212.30</span>
          <span className="text-white/40">this month</span>
        </div>
      </div>
    </div>
  )
}
