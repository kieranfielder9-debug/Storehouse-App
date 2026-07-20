import { useState } from 'react'
import { Star, Building2, Leaf, BookOpen, Heart, Sprout, Search, Filter } from 'lucide-react'
import CauseCard from './CauseCard.jsx'

const ITEMS = [
  {
    id: 'bradford', name: 'Bradford Faith Hub & Enterprise Center', tag: 'Community Equity', category: 'Community',
    icon: Building2, pct: 78, goal: 250000, raised: 195000, backers: 412,
    blurb: 'A multi-use community center supporting 2,000+ families with co-working, childcare and prayer spaces.'
  },
  {
    id: 'greentech', name: 'Leeds Green Tech Inc', tag: 'Clean Energy', category: 'Climate',
    icon: Leaf, pct: 42, goal: 500000, raised: 210000, backers: 287,
    blurb: 'Solar-powered urban farming systems for inner-city schools across West Yorkshire.'
  },
  {
    id: 'school', name: 'Trinity Christian Academy', tag: 'Education', category: 'Education',
    icon: BookOpen, pct: 91, goal: 180000, raised: 163800, backers: 521,
    blurb: 'New STEM block and bursaries for low-income families in Wakefield. £16.2k from goal.'
  },
  {
    id: 'shelter', name: 'Hope House Sheffield', tag: 'Housing', category: 'Community',
    icon: Heart, pct: 24, goal: 800000, raised: 192000, backers: 142,
    blurb: 'Transitional housing for women leaving domestic abuse, with pastoral and counselling support.'
  },
  {
    id: 'farm', name: 'Eden Yorkshire Farms', tag: 'Regen Ag', category: 'Climate',
    icon: Sprout, pct: 58, goal: 320000, raised: 185600, backers: 198,
    blurb: 'Regenerative agriculture co-op restoring 200 acres of degraded pasture in the Dales.'
  }
]

const FILTERS = ['All', 'Community', 'Climate', 'Education']

export default function CapitalTab({ onInvest, flashToast }) {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? ITEMS : ITEMS.filter(i => i.category === filter)
  const featured = ITEMS.find(i => i.id === 'bradford')

  return (
    <div className="space-y-5 pt-2">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white">Kingdom Capital</h2>
          <p className="text-xs text-white/40 mt-1">Equity-crowdfund the kingdom</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-widest text-gold">Your stake</p>
          <p className="text-base font-bold text-white">£1,250</p>
        </div>
      </div>

      <button
        onClick={() => onInvest(featured)}
        className="w-full text-left rounded-2xl p-4 bg-gradient-to-br from-amber-500/20 via-trustnavy to-trustnavy border border-gold/30 shadow-card"
      >
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Featured Cause</span>
        </div>
        <p className="text-sm text-white mt-1.5 font-semibold leading-snug">
          {featured.name} is {featured.pct}% funded, backed by {featured.backers} Storehouse stewards.
        </p>
      </button>

      {/* Search + filter */}
      <div>
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-trustnavy border border-white/10">
          <Search className="h-4 w-4 text-white/40" />
          <input
            placeholder="Search causes, locations…"
            className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
          />
          <button onClick={() => flashToast('Filters opened')}>
            <Filter className="h-4 w-4 text-teal2" />
          </button>
        </div>

        <div className="flex gap-1.5 mt-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap border transition ${
                filter === f
                  ? 'bg-gradient-to-r from-teal1 to-teal2 text-white border-white/20 shadow-glow'
                  : 'bg-trustnavy text-white/60 border-white/10'
              }`}
            >{f}</button>
          ))}
        </div>
      </div>

      {filtered.map(item => (
        <CauseCard key={item.id} item={item} onInvest={() => onInvest(item)} />
      ))}

      <button
        onClick={() => flashToast('Submit your project')}
        className="w-full py-4 rounded-2xl bg-trustnavy border border-dashed border-white/20 text-white/70 text-sm font-bold flex items-center justify-center gap-2"
      >
        + Pitch your own project
      </button>
    </div>
  )
}
