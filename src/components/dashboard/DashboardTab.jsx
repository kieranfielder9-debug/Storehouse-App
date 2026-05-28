import BalanceSplit from './BalanceSplit.jsx'
import WeeklyWrapCard from './WeeklyWrapCard.jsx'
import BudgetCard from './BudgetCard.jsx'
import TransactionFeed from './TransactionFeed.jsx'

export default function DashboardTab({ onOpenWrap, onOpenTx }) {
  return (
    <div className="space-y-5 pt-2">
      <div>
        <p className="text-white/50 text-sm">Good afternoon, Michael</p>
        <p className="text-white/30 text-xs">Thursday • 28 May</p>
      </div>

      <BalanceSplit />
      <WeeklyWrapCard onClick={onOpenWrap} />
      <BudgetCard />
      <TransactionFeed onOpenTx={onOpenTx} />
    </div>
  )
}
