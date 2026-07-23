import BalanceSplit from './BalanceSplit.jsx'
import StewardshipSource from './StewardshipSource.jsx'
import { useStewardship } from '../../backend/useStewardship.js'
import WeeklyWrapCard from './WeeklyWrapCard.jsx'
import BudgetCard from './BudgetCard.jsx'
import TransactionFeed from './TransactionFeed.jsx'
import QuickActions from '../payments/QuickActions.jsx'
import ChildOverview from './ChildOverview.jsx'
import AnalyticsSection from './AnalyticsSection.jsx'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  const d = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return `${days[d.getDay()]} · ${d.getDate()} ${months[d.getMonth()]}`
}

export default function DashboardTab({
  onOpenWrap, onOpenTx, onOpenAddTx, onOpenBalance, onOpenBudget,
  onPay, onGive, onQR, onTopUp, onOpenChild, flashToast
}) {
  const { stats, user } = useStewardship()
  const name = user?.name || 'Steward'
  return (
    <div className="space-y-5 pt-2">
      <div>
        <p className="text-white/50 text-sm">{getGreeting()}, {name}</p>
        <p className="text-white/30 text-xs">{formatDate()}</p>
      </div>

      <BalanceSplit onSelect={onOpenBalance} />
      <QuickActions onPay={onPay} onGive={onGive} onQR={onQR} onTopUp={onTopUp} />
      <StewardshipSource flashToast={flashToast} />
      <WeeklyWrapCard onClick={onOpenWrap} />
      <BudgetCard onOpen={onOpenBudget} givingPct={stats.givingPct} />
      <ChildOverview onOpen={onOpenChild} />
      <AnalyticsSection flashToast={flashToast} />
      <TransactionFeed onOpenTx={onOpenTx} onAdd={onOpenAddTx} />
    </div>
  )
}
