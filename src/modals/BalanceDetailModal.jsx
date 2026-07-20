import { X, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react'
import MoneyTimelineChart from '../components/dashboard/MoneyTimelineChart.jsx'
import Label from '../components/ui/Label.jsx'

export default function BalanceDetailModal({ kind, onClose, flashToast }) {
  const isEveryday = kind === 'everyday'
  const meta = isEveryday
    ? { title: 'Everyday Balance', total: '£1,420.50', accent: '#14B8A6',
        breakdown: [
          { name: 'Monzo Current', amt: '£820.10', color: 'from-pink-500 to-rose-500' },
          { name: 'Halifax Joint', amt: '£600.40', color: 'from-blue-500 to-indigo-500' }
        ] }
    : { title: 'Savings & Investments', total: '£12,650.00', accent: '#F4C56A',
        breakdown: [
          { name: 'Stocks & Shares ISA',  amt: '£6,420.00', color: 'from-teal-500 to-emerald-500' },
          { name: 'Kingdom Capital',      amt: '£1,250.00', color: 'from-amber-500 to-amber-600' },
          { name: 'Emergency Fund',       amt: '£4,980.00', color: 'from-blue-500 to-cyan-500' }
        ] }

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">{meta.title}</p>
            <h2 className="text-2xl font-extrabold text-white">{meta.total}</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          <div className="mt-2 rounded-2xl bg-navydeep border border-white/10 p-4">
            <MoneyTimelineChart accent={meta.accent} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button onClick={() => flashToast('Top-up flow opened')} className="py-3 rounded-xl bg-trustnavy border border-white/10 flex items-center justify-center gap-2">
              <Plus className="h-4 w-4 text-teal2" />
              <span className="text-sm text-white font-semibold">Top up</span>
            </button>
            <button onClick={() => flashToast('Withdrawal scheduled')} className="py-3 rounded-xl bg-trustnavy border border-white/10 flex items-center justify-center gap-2">
              <ArrowDownRight className="h-4 w-4 text-teal2" />
              <span className="text-sm text-white font-semibold">Withdraw</span>
            </button>
          </div>

          <div className="mt-5">
            <Label>Breakdown</Label>
            <div className="mt-2 rounded-2xl bg-navydeep border border-white/10 divide-y divide-white/5 overflow-hidden">
              {meta.breakdown.map(b => (
                <button
                  key={b.name}
                  onClick={() => flashToast(`${b.name} opened`)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03]"
                >
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-extrabold text-xs shadow`}>
                    {b.name.slice(0, 1)}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm text-white font-bold leading-tight">{b.name}</p>
                  </div>
                  <span className="text-sm font-extrabold text-white">{b.amt}</span>
                </button>
              ))}
            </div>
          </div>

          {!isEveryday && (
            <div className="mt-5 rounded-2xl p-4 bg-gradient-to-br from-amber-500/15 to-trustnavy border border-amber-400/30">
              <p className="text-[10px] uppercase tracking-widest text-amber-300">This month</p>
              <p className="text-base font-extrabold text-white mt-1">+£212.30 growth</p>
              <p className="text-[11px] text-white/50">Compound interest + market gains</p>
              <button
                onClick={() => flashToast('Growth report')}
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-amber-300"
              >
                See report <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
