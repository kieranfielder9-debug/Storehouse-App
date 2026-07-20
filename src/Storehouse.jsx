import { useEffect, useState } from 'react'
import { Home, LineChart, CreditCard, Briefcase } from 'lucide-react'
import { provider } from './backend/provider.js'
import SandboxPanel from './components/dev/SandboxPanel.jsx'
import ReflectionModal from './modals/ReflectionModal.jsx'

import PhoneFrame from './components/PhoneFrame.jsx'
import StatusBar from './components/StatusBar.jsx'
import BrandHeader from './components/BrandHeader.jsx'
import BottomNav from './components/BottomNav.jsx'
import Toast from './components/ui/Toast.jsx'

import SignInScreen from './components/auth/SignInScreen.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

import DashboardTab from './components/dashboard/DashboardTab.jsx'
import InvestTab from './components/invest/InvestTab.jsx'
import CardsTab from './components/cards/CardsTab.jsx'
import CapitalTab from './components/capital/CapitalTab.jsx'

import ProfileMenu from './components/profile/ProfileMenu.jsx'
import AccountView from './components/profile/AccountView.jsx'
import PreferencesView from './components/profile/PreferencesView.jsx'
import { ReferView, StatementsView, HelpView } from './components/profile/SimpleView.jsx'

import NotificationsDrawer from './components/notifications/NotificationsDrawer.jsx'

import WeeklyWrapModal from './modals/WeeklyWrapModal.jsx'
import TransactionModal from './modals/TransactionModal.jsx'
import AddTransactionModal from './modals/AddTransactionModal.jsx'
import PieDetailModal from './modals/PieDetailModal.jsx'
import InvestAmountModal from './modals/InvestAmountModal.jsx'
import BalanceDetailModal from './modals/BalanceDetailModal.jsx'
import BudgetDetailModal from './modals/BudgetDetailModal.jsx'
import PayTransferModal from './modals/PayTransferModal.jsx'
import GiveModal from './modals/GiveModal.jsx'
import StockDetailModal from './modals/StockDetailModal.jsx'
import CardOptionsModal from './modals/CardOptionsModal.jsx'
import ValuesQuizModal from './modals/ValuesQuizModal.jsx'

const TABS = [
  { key: 'dashboard', label: 'Home',    icon: Home },
  { key: 'invest',    label: 'Invest',  icon: LineChart },
  { key: 'cards',     label: 'Cards',   icon: CreditCard },
  { key: 'capital',   label: 'Kingdom', icon: Briefcase }
]

export default function Storehouse() {
  const [signedIn, setSignedIn] = useState(() => provider.hasSession())
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)
  const [reflectionOpen, setReflectionOpen] = useState(false)

  // Weekly Stewardship Reflection: Sunday evenings (once/week) + sandbox trigger
  useEffect(() => {
    if (signedIn && provider.reflectionDueNow()) setReflectionOpen(true)
    const openIt = () => setReflectionOpen(true)
    window.addEventListener('sh-reflect', openIt)
    return () => window.removeEventListener('sh-reflect', openIt)
  }, [signedIn])

  // overlays
  const [profileOpen, setProfileOpen] = useState(false)
  const [profileView, setProfileView] = useState(null) // 'account' | 'preferences' | 'refer' | 'statements' | 'help'
  const [notifOpen, setNotifOpen] = useState(false)

  const [wrapOpen, setWrapOpen] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [addTxOpen, setAddTxOpen] = useState(false)
  const [pieDetail, setPieDetail] = useState(null)
  const [investAmountOpen, setInvestAmountOpen] = useState(null)
  const [balanceDetail, setBalanceDetail] = useState(null)
  const [budgetOpen, setBudgetOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [giveOpen, setGiveOpen] = useState(false)
  const [stockDetail, setStockDetail] = useState(null)
  const [cardOptions, setCardOptions] = useState(null)
  const [valuesOpen, setValuesOpen] = useState(false)

  const [authBusy, setAuthBusy] = useState(false)

  const flashToast = (msg) => {
    setToast({ msg, id: Date.now() })
    setTimeout(() => setToast(null), 3600)
  }

  // sign in / up / reset — provider handles sandbox (instant) vs Supabase (real auth).
  // Each action is explicit: Sign In never silently creates an account, and
  // every failure surfaces a real, visible message (see Toast render below —
  // it must be present on THIS branch too, not just the signed-in view).
  const handleSignIn = async (email, password) => {
    setAuthBusy(true)
    try {
      await provider.signIn(email, password)
      setSignedIn(true)
    } catch (e) {
      flashToast(e?.message || 'Sign-in failed')
    } finally {
      setAuthBusy(false)
    }
  }

  const handleCreateAccount = async (email, password) => {
    if (!password) { flashToast('Enter a password to create your account.'); return }
    setAuthBusy(true)
    try {
      const { needsEmailConfirmation } = await provider.signUp(email, password)
      if (needsEmailConfirmation) flashToast('Check your email to confirm your account, then sign in.')
      else setSignedIn(true)
    } catch (e) {
      flashToast(e?.message || 'Could not create account')
    } finally {
      setAuthBusy(false)
    }
  }

  const handleForgotPassword = async (email) => {
    try {
      await provider.resetPassword(email)
      flashToast(provider.mode() === 'live' ? 'Password reset email sent.' : 'Sandbox mode: no email is sent here.')
    } catch (e) {
      flashToast(e?.message || 'Could not send reset email')
    }
  }

  const handleFaceId = () => flashToast('Face ID demo — use email sign-in for a live account.')

  if (!signedIn) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6">
        <PhoneFrame>
          <StatusBar />
          <SignInScreen
            onSignIn={handleSignIn}
            onCreateAccount={handleCreateAccount}
            onForgotPassword={handleForgotPassword}
            onFaceId={handleFaceId}
            busy={authBusy}
          />
          {toast && <Toast key={toast.id} message={toast.msg} />}
        </PhoneFrame>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[320px] w-[320px] rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <PhoneFrame>
        <StatusBar />
        <BrandHeader
          unreadCount={2}
          onHome={() => { setActiveTab('dashboard'); flashToast('Home') }}
          onBell={() => setNotifOpen(true)}
          onProfile={() => setProfileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto no-scrollbar pb-32 px-5">
          {activeTab === 'dashboard' && (
            <DashboardTab
              onOpenWrap={() => setWrapOpen(true)}
              onOpenTx={() => setTxOpen(true)}
              onOpenAddTx={() => setAddTxOpen(true)}
              onOpenBalance={(kind) => setBalanceDetail(kind)}
              onOpenBudget={() => setBudgetOpen(true)}
              onPay={() => setPayOpen(true)}
              onGive={() => setGiveOpen(true)}
              onQR={() => setPayOpen(true)}
              onTopUp={() => flashToast('Top-up flow opened')}
              onOpenChild={() => { setActiveTab('cards'); flashToast("Opening Ethan's Wisdom Wallet") }}
              flashToast={flashToast}
            />
          )}
          {activeTab === 'invest' && (
            <InvestTab
              onOpenPie={setPieDetail}
              onOpenStock={setStockDetail}
              onOpenValues={() => setValuesOpen(true)}
              flashToast={flashToast}
            />
          )}
          {activeTab === 'cards' && (
            <CardsTab
              flashToast={flashToast}
              onOpenCardOptions={setCardOptions}
            />
          )}
          {activeTab === 'capital' && (
            <CapitalTab onInvest={setInvestAmountOpen} flashToast={flashToast} />
          )}
        </main>

        <BottomNav tabs={TABS} active={activeTab} onChange={setActiveTab} />

        {toast && <Toast key={toast.id} message={toast.msg} />}

        <InstallPrompt />
        <SandboxPanel flashToast={flashToast} />
        {reflectionOpen && <ReflectionModal onClose={() => setReflectionOpen(false)} flashToast={flashToast} />}

        {/* Profile menu + sub-views */}
        {profileOpen && (
          <ProfileMenu
            onClose={() => setProfileOpen(false)}
            onSelect={(view) => { setProfileView(view); setProfileOpen(false) }}
            onSignOut={async () => { setProfileOpen(false); await provider.signOut(); setSignedIn(false) }}
          />
        )}
        {profileView === 'account'     && <AccountView     onBack={() => setProfileView(null)} flashToast={flashToast} />}
        {profileView === 'preferences' && <PreferencesView onBack={() => setProfileView(null)} flashToast={flashToast} />}
        {profileView === 'refer'       && <ReferView       onBack={() => setProfileView(null)} flashToast={flashToast} />}
        {profileView === 'statements'  && <StatementsView  onBack={() => setProfileView(null)} flashToast={flashToast} />}
        {profileView === 'help'        && <HelpView        onBack={() => setProfileView(null)} flashToast={flashToast} />}

        {/* Notifications */}
        {notifOpen && <NotificationsDrawer onClose={() => setNotifOpen(false)} flashToast={flashToast} />}

        {/* Dashboard modals */}
        {wrapOpen      && <WeeklyWrapModal     onClose={() => setWrapOpen(false)} />}
        {txOpen        && <TransactionModal    onClose={() => setTxOpen(false)} flashToast={flashToast} />}
        {addTxOpen     && <AddTransactionModal onClose={() => setAddTxOpen(false)} flashToast={flashToast} />}
        {balanceDetail && <BalanceDetailModal  kind={balanceDetail} onClose={() => setBalanceDetail(null)} flashToast={flashToast} />}
        {budgetOpen    && <BudgetDetailModal   onClose={() => setBudgetOpen(false)} flashToast={flashToast} />}
        {payOpen       && <PayTransferModal    onClose={() => setPayOpen(false)} flashToast={flashToast} />}
        {giveOpen      && <GiveModal           onClose={() => setGiveOpen(false)} flashToast={flashToast} />}

        {/* Invest modals */}
        {pieDetail     && <PieDetailModal      pie={pieDetail} onClose={() => setPieDetail(null)} />}
        {stockDetail   && <StockDetailModal    stock={stockDetail} onClose={() => setStockDetail(null)} flashToast={flashToast} />}
        {valuesOpen    && <ValuesQuizModal     onClose={() => setValuesOpen(false)} flashToast={flashToast} />}

        {/* Cards modal */}
        {cardOptions   && <CardOptionsModal    card={cardOptions} onClose={() => setCardOptions(null)} flashToast={flashToast} />}

        {/* Capital modal */}
        {investAmountOpen && (
          <InvestAmountModal
            item={investAmountOpen}
            onClose={() => setInvestAmountOpen(null)}
            onConfirm={() => { setInvestAmountOpen(null); flashToast('Investment placed — Welcome, steward.') }}
          />
        )}
      </PhoneFrame>
    </div>
  )
}
