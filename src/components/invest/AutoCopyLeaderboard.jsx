import { useState } from 'react'
import { TrendingUp, Check, Repeat } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const LEADERS = [
  { id: 'r-amb', name: 'Rev. Ambrose K.',  tag: 'Yorkshire Faith Capital', perf: '+18.4%', avatar: 'A' },
  { id: 'p-han', name: 'Priscilla Hannon', tag: 'Kingdom Tech Steward',    perf: '+22.1%', avatar: 'P' }
]

export default function AutoCopyLeaderboard({ flashToast }) {
  const [autoCopy, setAutoCopy] = useState({})

  const setSyncing = (id) => {
    setAutoCopy(s => ({ ...s, [id]: 'syncing' }))
    setTimeout(() => {
      setAutoCopy(s => ({ ...s, [id]: 'synced' }))
      flashToast('Portfolio synced successfully')
    }, 1800)
  }

  return (
    <div>
      <SectionHeading
        title="Auto-Copy Leaderboard"
        right={<span className="text-[10px] text-white/40 uppercase tracking-wider">Faith-driven</span>}
      />
      <div className="space-y-2.5">
        {LEADERS.map(l => (
          <div key={l.id} className="rounded-2xl bg-trustnavy border border-white/10 p-3.5 shadow-card flex items-center gap-3">
            <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center text-white font-extrabold shadow-glow border border-white/20">
              {l.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-bold leading-tight">{l.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{l.tag}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3 text-emerald-400" />
                <span className="text-[11px] font-bold text-emerald-400">{l.perf}</span>
                <span className="text-[10px] text-white/30">/ 90d</span>
              </div>
            </div>
            <button
              onClick={() => autoCopy[l.id] !== 'synced' && setSyncing(l.id)}
              disabled={autoCopy[l.id] === 'syncing'}
              className={`px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                autoCopy[l.id] === 'synced'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                  : autoCopy[l.id] === 'syncing'
                  ? 'bg-white/10 text-white/60 border border-white/10'
                  : 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow border border-white/20'
              }`}
            >
              {autoCopy[l.id] === 'synced'  && (<><Check className="h-3 w-3" />Synced</>)}
              {autoCopy[l.id] === 'syncing' && (<><Repeat className="h-3 w-3 animate-spin" />Syncing</>)}
              {!autoCopy[l.id]              && (<>Auto-Copy</>)}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
