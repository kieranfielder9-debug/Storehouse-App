import { useState } from 'react'
import { Home, LineChart, CreditCard, Briefcase } from 'lucide-react'

import PhoneFrame from './components/PhoneFrame.jsx'
import StatusBar from './components/StatusBar.jsx'
import BrandHeader from './components/BrandHeader.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/ui/Toast.jsx'

import DashboardTab from './components/dashboard/DashboardTab.jsx'
import InvestTab from './components/invest/InvestTab.jsx'
import CardsTab from './components/cards/CardsTab.jsx'
import CapitalTab from './components/capital/CapitalTab.jsx'

import WeeklyWrapModal from './modals/WeeklyWrapModal.jsx'
import TransactionModal from './modals/TransactionModal.jsx'
import PieDetailModal from './modals/PieDetailModal.jsx'
import InvestAmountModal from './modals/InvestAmountModal.jsx'

const TABS = [
  { key: 'dashboard', label: 'Home',    icon: Home },
  { key: 'invest',    label: 'Invest',  icon: LineChart },
  { key: 'cards',     label: 'Cards',   icon: CreditCard },
  { key: 'capital',   label: 'Kingdom', icon: Briefcase }
]

export default function Storehouse() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)

  const [wrapOpen, setWrapOpen] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [pieDetail, setPieDetail] = useState(null)
  const [investAmountOpen, setInvestAmountOpen] = useState(null)

  const flashToast = (msg) => {
    setToast({ msg, id: Date.now() })
    setTimeout(() => setToast(null), 2400)
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[320px] w-[320px] rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <PhoneFrame>
        <StatusBar />
        <BrandHeader />

        <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onOpenWrap={() => setWrapOpen(true)}
              onOpenTx={() => setTxOpen(true)}
            />
          )}
          {activeTab === 'invest' && (
            <InvestTab
              onOpenPie={(p) => setPieDetail(p)}
              flashToast={flashToast}
            />
          )}
          {activeTab === 'cards' && <CardsTab flashToast={flashToast} />}
          {activeTab === 'capital' && (
            <CapitalTab onInvest={(item) => setInvestAmountOpen(item)} />
          )}
        </main>

        <BottomNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {toast && <Toast key={toast.id} message={toast.msg} />}

        {wrapOpen && <WeeklyWrapModal onClose={() => setWrapOpen(false)} />}
        {txOpen && <TransactionModal onClose={() => setTxOpen(false)} flashToast={flashToast} />}
        {pieDetail && <PieDetailModal pie={pieDetail} onClose={() => setPieDetail(null)} />}
        {investAmountOpen && (
          <InvestAmountModal
            item={investAmountOpen}
            onClose={() => setInvestAmountOpen(null)}
            onConfirm={() => {
              setInvestAmountOpen(null)
              flashToast('Investment placed — Welcome, steward.')
            }}
          />
        )}
      </PhoneFrame>
    </div>
  )
}
