import { Star, Building2, Leaf } from 'lucide-react'
import CauseCard from './CauseCard.jsx'

const ITEMS = [
  {
    id: 'bradford',
    name: 'Bradford Faith Hub & Enterprise Center',
    tag: 'Community Equity',
    icon: Building2,
    pct: 78,
    goal: 250000,
    raised: 195000,
    backers: 412,
    blurb: 'A multi-use community center supporting 2,000+ families with co-working, childcare and prayer spaces.'
  },
  {
    id: 'greentech',
    name: 'Leeds Green Tech Inc',
    tag: 'Clean Energy',
    icon: Leaf,
    pct: 42,
    goal: 500000,
    raised: 210000,
    backers: 287,
    blurb: 'Solar-powered urban farming systems for inner-city schools across West Yorkshire.'
  }
]

export default function CapitalTab({ onInvest }) {
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

      <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/20 via-trustnavy to-trustnavy border border-gold/30 shadow-card">
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Featured Cause</span>
        </div>
        <p className="text-sm text-white mt-1.5 font-semibold leading-snug">
          Backed by 700+ Storehouse stewards this week.
        </p>
      </div>

      {ITEMS.map(item => (
        <CauseCard key={item.id} item={item} onInvest={() => onInvest(item)} />
      ))}
    </div>
  )
}
