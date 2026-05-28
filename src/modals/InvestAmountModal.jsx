import { useState } from 'react'
import { X, Lock } from 'lucide-react'

const PRESETS = [25, 50, 100, 250]

export default function InvestAmountModal({ item, onClose, onConfirm }) {
  const [amount, setAmount] = useState(50)
  const [custom, setCustom] = useState('')
  const Icon = item.icon

  const value = custom ? Number(custom) : amount
  const valid = value > 0 && value <= 50000

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-white/10 animate-slideUp p-5">
        <div className="pt-1 pb-3 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-teal2/15 border border-teal2/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-teal2" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Invest in</p>
            <h2 className="text-base font-extrabold text-white leading-tight truncate">{item.name}</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Amount</p>
          <p className="text-5xl font-black text-white tracking-tight mt-1">£{value || 0}</p>
        </div>

        <div className="grid grid-cols-4 gap-2 mt-5">
          {PRESETS.map(p => (
            <button
              key={p}
              onClick={() => { setAmount(p); setCustom('') }}
              className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                amount === p && !custom
                  ? 'bg-gradient-to-r from-teal1 to-teal2 text-white border-white/20 shadow-glow'
                  : 'bg-navydeep text-white/70 border-white/10'
              }`}
            >£{p}</button>
          ))}
        </div>

        <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-navydeep border border-white/10">
          <span className="text-white/40 font-bold">£</span>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="Custom amount"
            inputMode="numeric"
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
          />
        </div>

        {!valid && (
          <p className="mt-2 text-[11px] text-rose-400">
            Please enter a valid amount between £1 and £50,000.
          </p>
        )}

        <div className="mt-4 flex items-start gap-2 text-[10px] text-white/40 leading-snug">
          <Lock className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <p>
            Investments in equity crowdfunding carry risk. Capital is at risk and returns are not guaranteed.
            Storehouse only lists projects screened to biblical stewardship principles.
          </p>
        </div>

        <button
          disabled={!valid}
          onClick={onConfirm}
          className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-sm transition ${
            valid
              ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          Confirm £{value || 0} Investment
        </button>
      </div>
    </div>
  )
}
