import { useState } from 'react'
import { TrendingUp, Check, Repeat, ChevronRight } from 'lucide-react'
import SectionHeading from '../ui/SectionHeading.jsx'

const LEADERS = [
  { id: 'j-whit', name: 'James Whitcombe',  tag: 'Bethel Capital',           perf: '+22.1%', avatar: 'JW', accent: 'from-teal1 to-teal2',     specialty: 'Kingdom Tech' },
  { id: 's-odon', name: "Sarah O'Donnell",  tag: 'Compass Asset Partners',   perf: '+18.4%', avatar: 'SO', accent: 'from-amber-500 to-amber-600', specialty: 'Ethical Bonds' },
  { id: 'd-cole', name: 'David Coleridge',  tag: 'Riverbank Stewardship',    perf: '+16.8%', avatar: 'DC', accent: 'from-blue-500 to-indigo-500', specialty: 'Global Blue-Chip' },
  { id: 'n-pate', name: 'Naomi Patel',      tag: 'Eden Faith Investments',   perf: '+14.6%', avatar: 'NP', accent: 'from-fuchsia-500 to-purple-500', specialty: 'Clean Energy' },
  { id: 't-ashw', name: 'Thomas Ashworth',  tag: 'Albany Capital Group',     perf: '+12.9%', avatar: 'TA', accent: 'from-rose-500 to-pink-500', specialty: 'Mid-Cap Growth' },
  { id: 'h-mars', name: 'Hannah Marsden',   tag: 'Foundation Wealth Group',  perf: '+11.4%', avatar: 'HM', accent: 'from-emerald-500 to-teal-500', specialty: 'Affordable Housing' }
]

export default function AutoCopyLeaderboard({ flashToast }) {
  const [autoCopy, setAutoCopy] = useState({})
  const [showAll, setShowAll] = useState(false)

  const visible = showAll ? LEADERS : LEADERS.slice(0, 3)

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
        right={<span className="text-[10px] text-white/40 uppercase tracking-wider">Faith-driven · 90d</span>}
      />
      <div className="space-y-2.5">
        {visible.map(l => (
          <div key={l.id} className="rounded-2xl bg-trustnavy border border-white/10 p-3.5 shadow-card flex items-center gap-3">
            <div className={`h-11 w-11 rounded-full bg-gradient-to-br ${l.accent} flex items-center justify-center text-white font-extrabold shadow-glow border border-white/20`}>
              {l.avatar}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white font-bold leading-tight truncate">{l.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5 truncate">{l.tag} · {l.specialty}</p>
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
              {!autoCopy[l.id]              && (<>Copy</>)}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={() => setShowAll(v => !v)}
        className="mt-3 w-full py-2.5 rounded-xl bg-trustnavy border border-white/10 text-[12px] font-bold text-white/80 flex items-center justify-center gap-1"
      >
        {showAll ? 'Show fewer' : `Show ${LEADERS.length - 3} more stewards`} <ChevronRight className={`h-3 w-3 transition-transform ${showAll ? 'rotate-90' : ''}`}/>
      </button>

      <p className="text-[9px] text-white/30 mt-2 px-1 italic">All names illustrative. Past performance is not a guarantee of future returns.</p>
    </div>
  )
}
