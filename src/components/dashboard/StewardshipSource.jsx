import { useState } from 'react'
import { Landmark, Check, Repeat, ShieldCheck } from 'lucide-react'
import { useStewardship } from '../../backend/useStewardship.js'

/** Plaid bank-linking entry point + live stewardship stats readout.
 *  Additive card — existing dashboard elements are untouched. */
export default function StewardshipSource({ flashToast }) {
  const { plaid, stats, provider } = useStewardship()
  const [busy, setBusy] = useState(false)

  const connect = async () => {
    setBusy(true)
    try {
      await provider.connectPlaid()
      flashToast('Stewardship source connected')
    } catch { flashToast('Connection cancelled') }
    setBusy(false)
  }

  return (
    <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-teal2/15 border border-teal2/30 flex items-center justify-center">
          <Landmark className="h-5 w-5 text-teal2" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white leading-tight">Stewardship Source</p>
          <p className="text-[10px] text-white/40 mt-0.5 truncate">
            {plaid.connected ? `Linked · ${plaid.institution}` : 'Link a bank via Plaid — credentials never touch Storehouse'}
          </p>
        </div>
        {plaid.connected ? (
          <span className="px-3 py-2 rounded-xl text-[11px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5">
            <Check className="h-3 w-3" /> Linked
          </span>
        ) : (
          <button
            onClick={connect}
            disabled={busy}
            className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 ${
              busy ? 'bg-white/10 text-white/60 border border-white/10'
                   : 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow border border-white/20'
            }`}
          >
            {busy ? (<><Repeat className="h-3 w-3 animate-spin" />Linking…</>) : 'Connect'}
          </button>
        )}
      </div>

      {/* Live derived stats — update instantly on any Ledger change */}
      <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
        <p className="text-[11px] text-white/60">
          Stewardship ratio <span className="font-bold text-teal2">{stats.ratio.toFixed(1)}%</span> of income given
        </p>
        <p className="text-[11px] text-white/60">
          Giving target <span className="font-bold text-teal2">{Math.round(stats.givingPct)}%</span>
        </p>
      </div>
      <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/35">
        <ShieldCheck className="h-3 w-3 text-teal2/70 flex-shrink-0" />
        We do not sell your data. Your financial stewardship is private.
      </div>
    </div>
  )
}
