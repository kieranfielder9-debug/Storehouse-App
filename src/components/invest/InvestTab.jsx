import SectionHeading from '../ui/SectionHeading.jsx'
import PortfolioPie from './PortfolioPie.jsx'
import AutoCopyLeaderboard from './AutoCopyLeaderboard.jsx'
import Watchlist from './Watchlist.jsx'
import AISuggestions from './AISuggestions.jsx'

const PIES = [
  { key: 'tech',    name: 'Kingdom Tech Expansion',   pct: 40, color: '#14B8A6', desc: 'Faith-led innovation, gospel-aligned SaaS, ethical AI' },
  { key: 'housing', name: 'Clean Green Housing',      pct: 30, color: '#F4C56A', desc: 'Affordable, eco-built residential developments' },
  { key: 'global',  name: 'Ethical Global Blue-Chips', pct: 30, color: '#7CC8FF', desc: 'Screened global leaders. No alcohol/arms/gambling' }
]

export default function InvestTab({ onOpenPie, onOpenStock, onOpenValues, flashToast }) {
  return (
    <div className="space-y-5 pt-2">
      <SectionHeading
        title="Your Portfolio"
        right={<span className="text-emerald-400 font-bold text-xs">+£212.30 today</span>}
      />

      <PortfolioPie pies={PIES} onSlice={onOpenPie} />
      <AutoCopyLeaderboard flashToast={flashToast} />
      <Watchlist onOpenStock={onOpenStock} flashToast={flashToast} />
      <AISuggestions onOpenValues={onOpenValues} />
    </div>
  )
}
