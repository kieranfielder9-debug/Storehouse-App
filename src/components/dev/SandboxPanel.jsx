import { useState } from 'react'
import { FlaskConical, X, PlusCircle, HandCoins, ShoppingBag, RotateCcw, BookHeart, Coffee } from 'lucide-react'
import { useStewardship } from '../../backend/useStewardship.js'

/** Dev-only Sandbox: trigger mock events and watch the dashboard react live.
 *  Visible only in `npm run dev` (Vite DEV mode). Removed ?sandbox=1 URL
 *  param access — that was a production security hole allowing anyone to
 *  inject mock data into their real account on the live site. */
const enabled = () => import.meta.env.DEV

export default function SandboxPanel({ flashToast }) {
  const [open, setOpen] = useState(false)
  const { stats, mode, provider } = useStewardship()
  if (!enabled()) return null

  const act = async (fn, msg) => { await fn(); flashToast(msg) }
  const EVENTS = [
    { icon: PlusCircle,  label: 'Add £100 income',        run: () => act(() => provider.addLedger({ amount: 100,  category: 'Income',  description: 'Sandbox income' }), 'Sandbox: +£100 income') },
    { icon: HandCoins,   label: 'Record tithe £28',       run: () => act(() => provider.addLedger({ amount: -28,  category: 'Giving',  description: 'Sandbox tithe' }), 'Sandbox: tithe recorded') },
    { icon: ShoppingBag, label: 'Expense £30 (Need)',     run: () => act(() => provider.addLedger({ amount: -30,  category: 'Groceries', description: 'Sandbox groceries', is_contentment_satisfied: true }), 'Sandbox: need expense') },
    { icon: Coffee,      label: 'Expense £12 (Want)',     run: () => act(() => provider.addLedger({ amount: -12,  category: 'Food', description: 'Sandbox treat', is_contentment_satisfied: false }), 'Sandbox: want expense') },
    { icon: BookHeart,   label: 'Trigger Sunday reflection', run: () => window.dispatchEvent(new Event('sh-reflect')) },
    { icon: RotateCcw,   label: 'Reset all sandbox data', run: () => act(() => provider.resetSandbox(), 'Sandbox reset') }
  ]

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="absolute bottom-24 left-3 z-[45] h-10 w-10 rounded-full bg-cyan-500/20 border border-cyan-400/50 backdrop-blur flex items-center justify-center shadow-lg"
        title="Sandbox"
      >
        <FlaskConical className="h-4 w-4 text-cyan-300" />
      </button>

      {open && (
        <div className="absolute inset-0 z-[59]">
          <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-cyan-400/30 animate-slideUp p-5">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 text-cyan-300" />
                <h2 className="text-base font-extrabold text-white">Sandbox</h2>
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-400/40">
                  {mode} mode
                </span>
              </div>
              <button onClick={() => setOpen(false)} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
                <X className="h-4 w-4 text-white/70" />
              </button>
            </div>
            <p className="text-[11px] text-white/45 mb-3">Fire mock events, watch the dashboard update — no refresh.</p>

            {/* Live stats readout */}
            <div className="grid grid-cols-4 gap-1.5 mb-4">
              <Stat label="Income 30d" value={`£${stats.income.toFixed(0)}`} />
              <Stat label="Giving 30d" value={`£${stats.giving.toFixed(0)}`} />
              <Stat label="Ratio" value={`${stats.ratio.toFixed(1)}%`} />
              <Stat label="Target" value={`${Math.round(stats.givingPct)}%`} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              {EVENTS.map((e) => (
                <button
                  key={e.label}
                  onClick={e.run}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-navydeep border border-white/10 hover:border-cyan-400/40 text-left transition"
                >
                  <e.icon className="h-4 w-4 text-cyan-300 flex-shrink-0" />
                  <span className="text-[11px] font-bold text-white leading-tight">{e.label}</span>
                </button>
              ))}
            </div>
            <p className="mt-3 text-[9px] text-white/30 text-center">
              Need/Want counts — Need: {stats.needCount} · Want: {stats.wantCount}
            </p>
          </div>
        </div>
      )}
    </>
  )
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-navydeep border border-white/10 p-2 text-center">
      <p className="text-[8px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="text-sm font-extrabold text-cyan-300">{value}</p>
    </div>
  )
}
