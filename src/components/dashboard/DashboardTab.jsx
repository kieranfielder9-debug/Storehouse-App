import BalanceSplit from './BalanceSplit.jsx'
import StewardshipSource from './StewardshipSource.jsx'
import { useStewardship } from '../../backend/useStewardship.js'
import WeeklyWrapCard from './WeeklyWrapCard.jsx'
import BudgetCard from './BudgetCard.jsx'
import TransactionFeed from './TransactionFeed.jsx'
import QuickActions from '../payments/QuickActions.jsx'
import ChildOverview from './ChildOverview.jsx'
import AnalyticsSection from './AnalyticsSection.jsx'

export default function DashboardTab({
  onOpenWrap, onOpenTx, onOpenBalance, onOpenBudget,
  onPay, onGive, onQR, onTopUp, onOpenChild, flashToast
}) {
  const { stats } = useStewardship()
  return (
    <div className="space-y-5 pt-2">
      <div>
        <p className="text-white/50 text-sm">Good afternoon, Michael</p>
        <p className="text-white/30 text-xs">Thursday · 28 May</p>
      </div>

      <BalanceSplit onSelect={onOpenBalance} />
      <QuickActions onPay={onPay} onGive={onGive} onQR={onQR} onTopUp={onTopUp} />
      <StewardshipSource flashToast={flashToast} />
      <WeeklyWrapCard onClick={onOpenWrap} />
      <BudgetCard onOpen={onOpenBudget} givingPct={stats.givingPct} />
      <ChildOverview onOpen={onOpenChild} />
      <AnalyticsSection flashToast={flashToast} />
      <TransactionFeed onOpenTx={onOpenTx} />
    </div>
  )
}
