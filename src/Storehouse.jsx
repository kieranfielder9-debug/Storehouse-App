import { useEffect, useState } from 'react'
import {
  Home, LineChart, CreditCard, Briefcase,
  Bell, ChevronRight, Coffee, ShoppingBag, Bus, HandCoins, Sparkles,
  X, ChevronLeft, Receipt, FileText, Repeat, EyeOff, Users, Award,
  TrendingUp, TrendingDown, Plus, Snowflake, Wallet, Star, ArrowUpRight,
  Building2, Leaf, ShieldCheck, Check, Lock, BadgePercent, BookOpen, Heart,
  Sprout, Layers, ChevronDown
} from 'lucide-react'

/* -----------------------------------------------------------------------------------
 * STOREHOUSE — Mobile Banking Prototype
 * Branding: Midnight Slate (#0B0F19), Trust Navy (#111C30), Teal Gradient (#0D9488 → #14B8A6)
 * --------------------------------------------------------------------------------- */

export default function Storehouse() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [toast, setToast] = useState(null)

  // Modal states
  const [wrapOpen, setWrapOpen] = useState(false)
  const [txOpen, setTxOpen] = useState(false)
  const [pieDetail, setPieDetail] = useState(null)
  const [investAmountOpen, setInvestAmountOpen] = useState(null)

  // Flash a global toast notification
  const flashToast = (msg, tone = 'success') => {
    setToast({ msg, tone, id: Date.now() })
    setTimeout(() => setToast(null), 2400)
  }

  const tabs = [
    { key: 'dashboard', label: 'Home',     icon: Home },
    { key: 'invest',    label: 'Invest',   icon: LineChart },
    { key: 'cards',     label: 'Cards',    icon: CreditCard },
    { key: 'capital',   label: 'Kingdom',  icon: Briefcase }
  ]

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-2 sm:p-6">
      {/* Soft ambient glow behind the phone */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-teal-500/10 blur-3xl" />
        <div className="absolute bottom-0 right-10 h-[320px] w-[320px] rounded-full bg-amber-400/5 blur-3xl" />
      </div>

      <PhoneFrame>
        {/* Sticky Top Header / Status */}
        <StatusBar />
        <BrandHeader />

        {/* Scrollable tab content */}
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

        {/* Sticky Bottom Navigation */}
        <BottomNav tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {/* Global Toast */}
        {toast && (
          <div
            key={toast.id}
            className="absolute left-1/2 -translate-x-1/2 bottom-28 z-50 animate-flashIn"
          >
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow border border-white/10">
              <Check className="h-4 w-4" />
              <span className="text-sm font-medium">{toast.msg}</span>
            </div>
          </div>
        )}

        {/* Overlay modals */}
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

/* ----------------------------------------------------------------------------------- */
/*  Phone Frame                                                                        */
/* ----------------------------------------------------------------------------------- */
function PhoneFrame({ children }) {
  return (
    <div className="relative z-10">
      {/* Outer hardware frame */}
      <div className="rounded-[58px] p-[10px] bg-gradient-to-b from-[#1a2236] via-[#0d1322] to-[#0a0e18] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/5">
        {/* Inner screen */}
        <div className="relative rounded-[48px] overflow-hidden bg-midnight w-[390px] h-[820px] flex flex-col">
          {/* Notch / Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-7 w-32 rounded-full bg-black/90" />
          {children}
        </div>
      </div>
    </div>
  )
}

/* ----------------------------------------------------------------------------------- */
/*  Status Bar + Brand Header                                                          */
/* ----------------------------------------------------------------------------------- */
function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[12px] font-semibold text-white/80 tracking-wide">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1,2,3,4].map(i => <div key={i} className="h-1.5 w-1 rounded-sm bg-white/80" />)}
        </div>
        <span className="text-[10px]">5G</span>
        <div className="ml-1 h-2.5 w-5 rounded-[3px] border border-white/70 relative">
          <div className="absolute inset-0.5 right-1.5 bg-white/80 rounded-[1px]" />
        </div>
      </div>
    </div>
  )
}

function BrandHeader() {
  return (
    <header className="px-5 pt-2 pb-3 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <StorehouseMark />
        <div>
          <h1 className="text-[20px] font-black tracking-[0.18em] leading-none text-white">
            STOREHOUSE
          </h1>
          <p className="text-[11px] mt-1 text-teal2/90 italic tracking-wide">
            Where your treasure is
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative h-9 w-9 rounded-full bg-trustnavy border border-white/10 flex items-center justify-center">
          <Bell className="h-4 w-4 text-white/80" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-teal2 animate-pulseGlow" />
        </button>
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-teal1 to-teal2 text-white font-bold text-sm flex items-center justify-center shadow-glow border border-white/20">
          MG
        </button>
      </div>
    </header>
  )
}

/* The vector storehouse mark — upward-roof modern silhouette */
function StorehouseMark() {
  return (
    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border border-white/15">
      <svg viewBox="0 0 32 32" className="h-6 w-6">
        <defs>
          <linearGradient id="rooflite" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="1"/>
            <stop offset="1" stopColor="#fff" stopOpacity="0.7"/>
          </linearGradient>
        </defs>
        {/* Roof - sharp upward trajectory */}
        <path d="M16 3 L29 14 L26 14 L16 6.5 L6 14 L3 14 Z" fill="url(#rooflite)"/>
        {/* House body */}
        <path d="M7 14 L25 14 L25 27 L20 27 L20 19 L12 19 L12 27 L7 27 Z" fill="#fff" opacity="0.95"/>
        {/* Door highlight */}
        <rect x="14" y="21" width="4" height="6" fill="#0D9488" rx="0.5" />
      </svg>
    </div>
  )
}

/* ----------------------------------------------------------------------------------- */
/*  Bottom Navigation                                                                  */
/* ----------------------------------------------------------------------------------- */
function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-2 bg-gradient-to-t from-midnight via-midnight/95 to-transparent">
      <div className="bg-trustnavy/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-2 py-2 shadow-card">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              <div className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all ${
                isActive ? 'bg-gradient-to-br from-teal1 to-teal2 shadow-glow' : ''
              }`}>
                <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/50'}`} strokeWidth={isActive ? 2.5 : 2}/>
              </div>
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/* ===================================================================================
   TAB 1 — DASHBOARD ("Emma" Engine)
   =================================================================================== */
function DashboardTab({ onOpenWrap, onOpenTx }) {
  return (
    <div className="space-y-5 pt-2">
      {/* Greeting */}
      <div>
        <p className="text-white/50 text-sm">Good afternoon, Michael</p>
        <p className="text-white/30 text-xs">Thursday • 28 May</p>
      </div>

      {/* Balances split */}
      <BalanceSplit />

      {/* Weekly Wrap Card */}
      <WeeklyWrapCard onClick={onOpenWrap} />

      {/* Monthly Budget Radial + categories */}
      <BudgetCard />

      {/* Transaction Feed */}
      <TransactionFeed onOpenTx={onOpenTx} />
    </div>
  )
}

function BalanceSplit() {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Everyday */}
      <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase tracking-widest text-white/40">Everyday</span>
          <Wallet className="h-3.5 w-3.5 text-white/40"/>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight">£1,420<span className="text-white/40 text-base">.50</span></p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Tagchip color="bg-pink-500/15 text-pink-300 border-pink-500/30" label="Monzo"/>
          <Tagchip color="bg-blue-500/15 text-blue-300 border-blue-500/30" label="Halifax"/>
        </div>
      </div>

      {/* Savings & Investments */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-teal1/30 via-trustnavy to-trustnavy border border-teal2/30 shadow-glow relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-teal2/10 blur-2xl"/>
        <div className="flex items-center justify-between mb-2 relative">
          <span className="text-[10px] uppercase tracking-widest text-teal2">Savings + Invest</span>
          <TrendingUp className="h-3.5 w-3.5 text-teal2"/>
        </div>
        <p className="text-2xl font-bold text-white tracking-tight relative">£12,650<span className="text-white/40 text-base">.00</span></p>
        <div className="mt-3 flex items-center gap-1 text-[11px] relative">
          <ArrowUpRight className="h-3 w-3 text-teal2"/>
          <span className="text-teal2 font-semibold">+£212.30</span>
          <span className="text-white/40">this month</span>
        </div>
      </div>
    </div>
  )
}

function Tagchip({ color, label }) {
  return (
    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {label}
    </span>
  )
}

function WeeklyWrapCard({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left relative rounded-2xl p-4 bg-gradient-to-br from-teal1 to-teal2 border border-white/20 shadow-glow overflow-hidden group"
    >
      <div className="absolute -top-8 -right-8 h-32 w-32 rounded-full bg-white/15 blur-2xl group-hover:scale-110 transition-transform"/>
      <div className="absolute top-2 right-2 flex gap-0.5">
        {[0,1,2].map(i => (
          <div key={i} className="h-1.5 w-6 rounded-full bg-white/30 overflow-hidden">
            <div className="h-full w-full bg-white" style={{ width: i === 0 ? '100%' : i === 1 ? '60%' : '0%' }}/>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 mb-1 relative">
        <Sparkles className="h-4 w-4 text-white"/>
        <span className="text-[10px] uppercase tracking-widest text-white/90 font-bold">Weekly Wrap</span>
      </div>
      <h3 className="text-lg font-extrabold text-white leading-tight relative">
        Your Weekly Stewardship<br/>Wrap is Ready!
      </h3>
      <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-white/90 relative">
        Tap to view <ChevronRight className="h-3.5 w-3.5"/>
      </div>
    </button>
  )
}

function BudgetCard() {
  const spent = 62
  const circumference = 2 * Math.PI * 38
  const dashOffset = circumference - (spent / 100) * circumference

  return (
    <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-sm font-bold text-white">Monthly Budget</h3>
        <button className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5">Adjust <ChevronRight className="h-3 w-3"/></button>
      </div>
      <p className="text-[11px] text-white/40 mb-3">May 2026 cycle</p>

      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 flex-shrink-0">
          <svg viewBox="0 0 88 88" className="h-full w-full -rotate-90">
            <circle cx="44" cy="44" r="38" stroke="#1F2A40" strokeWidth="9" fill="none"/>
            <defs>
              <linearGradient id="budgetGrad" x1="0" x2="1" y1="0" y2="1">
                <stop offset="0" stopColor="#0D9488"/>
                <stop offset="1" stopColor="#14B8A6"/>
              </linearGradient>
            </defs>
            <circle
              cx="44" cy="44" r="38"
              stroke="url(#budgetGrad)" strokeWidth="9" fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-extrabold text-white leading-none">{spent}%</span>
            <span className="text-[9px] text-white/40 uppercase tracking-wide mt-0.5">Spent</span>
          </div>
        </div>

        <div className="flex-1 space-y-2.5">
          <CategoryBar icon={ShoppingBag} label="Groceries" pct={80} color="from-orange-400 to-orange-500"/>
          <CategoryBar icon={HandCoins} label="Kingdom Giving" pct={100} color="from-teal1 to-teal2" hilite/>
          <CategoryBar icon={Bus} label="Transport" pct={40} color="from-blue-400 to-blue-500"/>
        </div>
      </div>
    </div>
  )
}

function CategoryBar({ icon: Icon, label, pct, color, hilite }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <Icon className="h-3 w-3 text-white/60"/>
          <span className="text-[11px] text-white/80 font-medium">{label}</span>
          {hilite && <span className="text-[8px] font-bold text-teal2 uppercase">Full</span>}
        </div>
        <span className="text-[10px] text-white/40 font-mono">{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-navydeep overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color}`} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  )
}

function TransactionFeed({ onOpenTx }) {
  const txs = [
    { id: 1, icon: Coffee, name: 'Coffee at Leeds Centre', sub: 'Costa Coffee • Today, 09:14', amt: -3.20, color: 'bg-amber-500/15 text-amber-400', clickable: true },
    { id: 2, icon: HandCoins, name: 'Tithe — Trinity Church',     sub: 'Standing Order • Today',     amt: -210.00, color: 'bg-teal-500/15 text-teal-400'  },
    { id: 3, icon: ShoppingBag, name: 'Sainsbury\'s',              sub: 'Groceries • Yesterday',     amt: -48.62,  color: 'bg-orange-500/15 text-orange-400' },
    { id: 4, icon: ArrowUpRight, name: 'Salary — Riverbank Ltd',   sub: 'Income • 27 May',           amt: 2840.00, color: 'bg-emerald-500/15 text-emerald-400' }
  ]
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <h3 className="text-sm font-bold text-white">Recent Activity</h3>
        <button className="text-[10px] text-teal2 font-semibold">See all</button>
      </div>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {txs.map(t => (
          <button
            key={t.id}
            onClick={t.clickable ? onOpenTx : undefined}
            className={`w-full flex items-center gap-3 px-3.5 py-3 ${t.clickable ? 'hover:bg-white/[0.03] active:bg-white/[0.05]' : ''} transition`}
          >
            <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${t.color}`}>
              <t.icon className="h-4 w-4"/>
            </div>
            <div className="flex-1 text-left">
              <p className="text-[13px] text-white font-semibold leading-tight">{t.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{t.sub}</p>
            </div>
            <div className="text-right">
              <p className={`text-[13px] font-bold ${t.amt > 0 ? 'text-emerald-400' : 'text-white'}`}>
                {t.amt > 0 ? '+' : ''}£{Math.abs(t.amt).toFixed(2)}
              </p>
              {t.clickable && <p className="text-[9px] text-teal2 mt-0.5">Tap to manage</p>}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

/* ===================================================================================
   WEEKLY WRAP — Stories style takeover
   =================================================================================== */
function WeeklyWrapModal({ onClose }) {
  const slides = [
    {
      key: 'save',
      title: 'This week you auto-saved',
      hero: '£42',
      subtitle: 'across 14 micro-round-ups',
      accent: 'from-teal1 to-teal2',
      icon: Sprout
    },
    {
      key: 'tithe',
      title: 'You hit your 10% tithing target',
      hero: '100%',
      subtitle: 'perfectly across West Yorkshire causes 🎉',
      accent: 'from-amber-400 to-amber-500',
      icon: Heart
    },
    {
      key: 'kingdom',
      title: 'Kingdom impact this week',
      hero: '3 lives',
      subtitle: 'touched through Bradford Faith Hub funding',
      accent: 'from-teal1 to-teal2',
      icon: ShieldCheck
    }
  ]
  const [i, setI] = useState(0)
  const slide = slides[i]
  const Icon = slide.icon

  // Auto advance
  useEffect(() => {
    const t = setTimeout(() => {
      if (i < slides.length - 1) setI(i + 1)
    }, 5000)
    return () => clearTimeout(t)
  }, [i, slides.length])

  return (
    <div className="absolute inset-0 z-[60] bg-black/95 animate-flashIn">
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-90`}/>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40"/>

      {/* Progress bars */}
      <div className="absolute top-10 left-4 right-4 flex gap-1.5 z-10">
        {slides.map((s, idx) => (
          <div key={s.key} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
            <div
              key={`${s.key}-${i}`}
              className={`h-full bg-white ${idx < i ? 'w-full' : idx === i ? 'animate-progress origin-left' : 'w-0'}`}
            />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute top-14 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white"/>
          <span className="text-[11px] uppercase tracking-widest font-bold text-white">Weekly Wrap</span>
        </div>
        <button onClick={onClose} className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center">
          <X className="h-4 w-4 text-white"/>
        </button>
      </div>

      {/* Tap zones */}
      <button className="absolute inset-y-0 left-0 w-1/3 z-[5]" onClick={() => setI(Math.max(0, i - 1))} aria-label="prev"/>
      <button className="absolute inset-y-0 right-0 w-1/3 z-[5]" onClick={() => setI(Math.min(slides.length - 1, i + 1))} aria-label="next"/>

      {/* Content */}
      <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6 border border-white/20">
          <Icon className="h-8 w-8 text-white"/>
        </div>
        <p className="text-white/80 text-sm font-semibold tracking-wide mb-3">{slide.title}</p>
        <h1 className="text-7xl font-black text-white tracking-tight drop-shadow-lg">
          {slide.hero}
        </h1>
        <p className="mt-4 text-white/90 text-base font-medium max-w-[260px] leading-snug">
          {slide.subtitle}
        </p>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-10 left-6 right-6 z-10">
        <button
          onClick={onClose}
          className="w-full py-3.5 rounded-2xl bg-white text-trustnavy font-bold text-sm shadow-xl"
        >
          Back to Storehouse →
        </button>
        <p className="text-center text-white/70 text-[11px] mt-3">Slide {i + 1} of {slides.length}</p>
      </div>
    </div>
  )
}

/* ===================================================================================
   TRANSACTION MODAL — deep settings sheet
   =================================================================================== */
function TransactionModal({ onClose, flashToast }) {
  const [category, setCategory] = useState('Food')
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [note, setNote] = useState('Morning catch-up with Sarah re: church plant')
  const [recurring, setRecurring] = useState(false)
  const [exclude, setExclude] = useState(false)
  const [split, setSplit] = useState(false)

  const cats = [
    { label: 'Food', icon: Coffee },
    { label: 'Giving', icon: HandCoins },
    { label: 'Bills', icon: FileText }
  ]

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose}/>
      <div className="absolute bottom-0 left-0 right-0 max-h-[88%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        {/* Drag handle */}
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20"/></div>

        {/* Header */}
        <div className="px-5 pb-3 flex items-center justify-between">
          <button onClick={onClose} className="h-8 w-8 -ml-1 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-white/80"/>
          </button>
          <h2 className="text-sm font-bold text-white">Transaction</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center"><X className="h-4 w-4 text-white/70"/></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          {/* Hero */}
          <div className="text-center pt-2">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
              <Coffee className="h-7 w-7"/>
            </div>
            <p className="text-white/50 text-xs">Today, 09:14 • Costa Coffee</p>
            <h3 className="text-white font-bold mt-0.5">Coffee at Leeds Centre</h3>
            <p className="text-3xl font-black text-white mt-2">–£3.20</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal2 bg-teal2/10 border border-teal2/30 px-2.5 py-1 rounded-full">
              <Award className="h-3 w-3"/>
              You've given to this vendor 14 times this year
            </div>
          </div>

          {/* Category Selector */}
          <div className="mt-6">
            <Label>Category</Label>
            <button
              onClick={() => setShowCatMenu(v => !v)}
              className="w-full mt-1.5 flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10"
            >
              <span className="text-sm text-white font-medium">{category}</span>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${showCatMenu ? 'rotate-180' : ''}`}/>
            </button>
            {showCatMenu && (
              <div className="mt-1.5 rounded-xl bg-navydeep border border-white/10 overflow-hidden animate-flashIn">
                {cats.map(c => (
                  <button
                    key={c.label}
                    onClick={() => { setCategory(c.label); setShowCatMenu(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 ${category === c.label ? 'text-teal2' : 'text-white/80'}`}
                  >
                    <c.icon className="h-4 w-4"/>
                    <span className="text-sm font-medium flex-1">{c.label}</span>
                    {category === c.label && <Check className="h-4 w-4"/>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Tags & Notes */}
          <div className="mt-4">
            <Label>Tags & Notes</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <Tagchip color="bg-amber-500/15 text-amber-300 border-amber-500/30" label="#coffee"/>
              <Tagchip color="bg-teal-500/15 text-teal-300 border-teal-500/30" label="#fellowship"/>
              <button className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-dashed border-white/20 text-white/50 flex items-center gap-0.5">
                <Plus className="h-2.5 w-2.5"/> add
              </button>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              className="mt-2 w-full rounded-xl bg-navydeep border border-white/10 p-3 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-teal2/50"
              placeholder="Add a note..."
            />
          </div>

          {/* Receipt */}
          <button
            onClick={() => flashToast('Receipt opened')}
            className="mt-3 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10 hover:border-teal2/40 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal2/15 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-teal2"/>
              </div>
              <div className="text-left">
                <p className="text-sm text-white font-semibold">View Receipt Image</p>
                <p className="text-[10px] text-white/40">Scanned 09:14 today</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-white/40"/>
          </button>

          {/* Toggles */}
          <div className="mt-4 rounded-xl bg-navydeep border border-white/10 divide-y divide-white/5">
            <ToggleRow icon={Repeat}   label="Make Recurring Payment"     value={recurring} onToggle={() => setRecurring(v => !v)}/>
            <ToggleRow icon={EyeOff}   label="Exclude from Analytics"     value={exclude}   onToggle={() => setExclude(v => !v)}/>
            <ToggleRow icon={Users}    label="Split Bill with Contacts"   value={split}     onToggle={() => setSplit(v => !v)}/>
          </div>

          {/* Save */}
          <button
            onClick={() => { onClose(); flashToast('Transaction settings saved') }}
            className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function Label({ children }) {
  return <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{children}</p>
}

function ToggleRow({ icon: Icon, label, value, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className="h-4 w-4 text-white/70"/>
      </div>
      <span className="text-sm text-white/90 font-medium flex-1">{label}</span>
      <div className={`h-6 w-10 rounded-full transition-all relative ${value ? 'bg-gradient-to-r from-teal1 to-teal2' : 'bg-white/15'}`}>
        <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? 'left-[18px]' : 'left-0.5'}`}/>
      </div>
    </button>
  )
}

/* ===================================================================================
   TAB 2 — INVEST ("Trading 212" Engine)
   =================================================================================== */
function InvestTab({ onOpenPie, flashToast }) {
  const pies = [
    { key: 'tech',     name: 'Kingdom Tech Expansion',     pct: 40, color: '#14B8A6', desc: 'Faith-led innovation, gospel-aligned SaaS, ethical AI' },
    { key: 'housing',  name: 'Clean Green Housing',         pct: 30, color: '#F4C56A', desc: 'Affordable, eco-built residential developments' },
    { key: 'global',   name: 'Ethical Global Blue-Chips',   pct: 30, color: '#7CC8FF', desc: 'Screened global leaders. No alcohol/arms/gambling' }
  ]
  const [autoCopy, setAutoCopy] = useState({})

  const setSyncing = (id) => {
    setAutoCopy(s => ({ ...s, [id]: 'syncing' }))
    setTimeout(() => {
      setAutoCopy(s => ({ ...s, [id]: 'synced' }))
      flashToast('Portfolio synced successfully')
    }, 1800)
  }

  const leaders = [
    { id: 'r-amb', name: 'Rev. Ambrose K.',  tag: 'Yorkshire Faith Capital', perf: '+18.4%', avatar: 'A' },
    { id: 'p-han', name: 'Priscilla Hannon', tag: 'Kingdom Tech Steward',    perf: '+22.1%', avatar: 'P' }
  ]

  return (
    <div className="space-y-5 pt-2">
      <SectionHeading title="Your Portfolio" right={<span className="text-emerald-400 font-bold text-xs">+£212.30 today</span>}/>

      {/* Pie Chart Card */}
      <PortfolioPie pies={pies} onSlice={onOpenPie}/>

      {/* Auto-Copy Leaderboard */}
      <div>
        <SectionHeading title="Auto-Copy Leaderboard" right={<span className="text-[10px] text-white/40 uppercase tracking-wider">Faith-driven</span>}/>
        <div className="space-y-2.5">
          {leaders.map(l => (
            <div key={l.id} className="rounded-2xl bg-trustnavy border border-white/10 p-3.5 shadow-card flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center text-white font-extrabold shadow-glow border border-white/20">
                {l.avatar}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white font-bold leading-tight">{l.name}</p>
                <p className="text-[10px] text-white/40 mt-0.5">{l.tag}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <TrendingUp className="h-3 w-3 text-emerald-400"/>
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
                {autoCopy[l.id] === 'synced' && (<><Check className="h-3 w-3"/>Synced</>)}
                {autoCopy[l.id] === 'syncing' && (<><Repeat className="h-3 w-3 animate-spin"/>Syncing</>)}
                {!autoCopy[l.id] && (<>Auto-Copy</>)}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Watchlist */}
      <Watchlist/>

      {/* AI Suggestions */}
      <AISuggestions/>
    </div>
  )
}

function SectionHeading({ title, right }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {right}
    </div>
  )
}

function PortfolioPie({ pies, onSlice }) {
  const total = pies.reduce((s, p) => s + p.pct, 0)
  const r = 56
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <div className="rounded-2xl p-5 bg-trustnavy border border-white/10 shadow-card relative overflow-hidden">
      <div className="absolute -top-10 -right-10 h-48 w-48 rounded-full bg-teal2/5 blur-3xl"/>

      <div className="flex items-center gap-4">
        {/* Ring */}
        <div className="relative h-36 w-36 flex-shrink-0">
          <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
            <circle cx="80" cy="80" r={r} stroke="#1F2A40" strokeWidth="18" fill="none"/>
            {pies.map((p) => {
              const len = (p.pct / total) * c
              const seg = (
                <circle
                  key={p.key}
                  cx="80" cy="80" r={r}
                  stroke={p.color}
                  strokeWidth="18"
                  fill="none"
                  strokeDasharray={`${len} ${c - len}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-opacity hover:opacity-80"
                  onClick={() => onSlice(p)}
                />
              )
              offset += len
              return seg
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest text-white/40">Invested</span>
            <span className="text-2xl font-extrabold text-white">£8.4k</span>
            <span className="text-[10px] text-emerald-400 font-bold">+2.6%</span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2">
          {pies.map(p => (
            <button
              key={p.key}
              onClick={() => onSlice(p)}
              className="w-full flex items-center gap-2 text-left hover:bg-white/5 rounded-lg p-1 transition"
            >
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: p.color }}/>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-white font-semibold leading-tight truncate">{p.name}</p>
              </div>
              <span className="text-[11px] font-bold text-white/70">{p.pct}%</span>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-white/40 mt-3 text-center">Tap a slice to dig deeper</p>
    </div>
  )
}

function PieDetailModal({ pie, onClose }) {
  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose}/>
      <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-white/10 animate-slideUp p-5">
        <div className="pt-1 pb-3 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20"/></div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ background: `${pie.color}25`, border: `1px solid ${pie.color}55` }}>
            <Layers className="h-6 w-6" style={{ color: pie.color }}/>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Allocation Pie</p>
            <h2 className="text-lg font-extrabold text-white leading-tight">{pie.name}</h2>
          </div>
          <button onClick={onClose} className="ml-auto h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70"/>
          </button>
        </div>
        <p className="text-sm text-white/70 leading-snug">{pie.desc}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Allocation" value={`${pie.pct}%`}/>
          <Stat label="1Y Return" value="+14.2%" pos/>
          <Stat label="Holdings" value="22"/>
        </div>

        <button onClick={onClose} className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow">
          Adjust Allocation
        </button>
      </div>
    </div>
  )
}

function Stat({ label, value, pos }) {
  return (
    <div className="rounded-xl bg-navydeep border border-white/10 p-3 text-center">
      <p className="text-[9px] uppercase tracking-widest text-white/40">{label}</p>
      <p className={`text-base font-bold mt-1 ${pos ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function Watchlist() {
  const stocks = [
    { sym: 'TRNT', name: 'Trinity BioSciences', price: 142.30, chg: 2.4, dir: 'up' },
    { sym: 'GRNH', name: 'Green Homes UK',      price: 28.10,  chg: -0.8, dir: 'down' },
    { sym: 'KGDM', name: 'Kingdom Cloud Co.',   price: 67.92,  chg: 4.7,  dir: 'up' }
  ]
  return (
    <div>
      <SectionHeading title="Watchlist" right={<button className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5"><Plus className="h-3 w-3"/>Add</button>}/>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {stocks.map(s => (
          <div key={s.sym} className="flex items-center px-4 py-3">
            <div className="h-9 w-9 rounded-xl bg-navydeep border border-white/10 flex items-center justify-center font-extrabold text-[11px] text-teal2">
              {s.sym}
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-semibold text-white leading-tight">{s.name}</p>
              <p className="text-[10px] text-white/40">£{s.price.toFixed(2)}</p>
            </div>
            <div className={`text-right text-xs font-bold flex items-center gap-1 ${s.dir === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
              {s.dir === 'up' ? <TrendingUp className="h-3 w-3"/> : <TrendingDown className="h-3 w-3"/>}
              {s.dir === 'up' ? '+' : ''}{s.chg}%
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AISuggestions() {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-trustnavy via-trustnavy to-navydeep border border-white/10 shadow-card relative overflow-hidden">
      <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl"/>
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-gold"/>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">AI Investment Suggestions</span>
        </div>
        <h3 className="text-base font-bold text-white">Funds aligned with biblical values</h3>
        <p className="text-[11px] text-white/50 mt-1">Strictly non-compromised. Independently screened by our stewardship board.</p>

        <div className="mt-3 space-y-2">
          <Suggestion icon={Leaf}        title="Eden Renewables Trust"   meta="ESG 9.4 • No fossil fuels" badge="High Match"/>
          <Suggestion icon={Building2}   title="Bethel Housing Fund"     meta="Affordable homes • 7Y track"  badge="Steward Pick"/>
          <Suggestion icon={BookOpen}    title="Mission Education ETF"   meta="Christian schools • Global"   badge="New"/>
        </div>
      </div>
    </div>
  )
}

function Suggestion({ icon: Icon, title, meta, badge }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
      <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
        <Icon className="h-4 w-4"/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight truncate">{title}</p>
        <p className="text-[10px] text-white/40 mt-0.5 truncate">{meta}</p>
      </div>
      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40">{badge}</span>
    </div>
  )
}

/* ===================================================================================
   TAB 3 — FAMILY CARD HUB
   =================================================================================== */
function CardsTab({ flashToast }) {
  const [freeze, setFreeze]   = useState({ p: false, t: false })
  const [limit, setLimit]     = useState(20)
  const [approved, setApproved] = useState(false)

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h2 className="text-xl font-extrabold text-white">Household Card Manager</h2>
        <p className="text-xs text-white/40 mt-1">2 active cards • Gladders family</p>
      </div>

      {/* Card 1 - Primary */}
      <DebitCard
        variant="primary"
        name="Michael Gladders"
        subtitle="Storehouse Primary"
        number="•••• •••• •••• 4421"
        frozen={freeze.p}
      />

      {/* Card 2 - Teen */}
      <DebitCard
        variant="teen"
        name="Ethan (Wisdom Wallet)"
        subtitle="Chore Rewards & Curriculum Track Active"
        number="•••• •••• •••• 9120"
        frozen={freeze.t}
      />

      {/* Control Center */}
      <div className="rounded-2xl bg-trustnavy border border-white/10 overflow-hidden shadow-card">
        <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-teal2"/>
          <h3 className="text-sm font-bold text-white">Control Center</h3>
        </div>

        <ToggleRow
          icon={Snowflake}
          label={freeze.p ? 'Primary Card Frozen' : 'Freeze Primary Card'}
          value={freeze.p}
          onToggle={() => {
            setFreeze(f => ({ ...f, p: !f.p }))
            flashToast(freeze.p ? 'Primary card unfrozen' : 'Primary card frozen')
          }}
        />

        <ToggleRow
          icon={Snowflake}
          label={freeze.t ? "Ethan's Card Frozen" : "Freeze Ethan's Card"}
          value={freeze.t}
          onToggle={() => {
            setFreeze(f => ({ ...f, t: !f.t }))
            flashToast(freeze.t ? "Ethan's card unfrozen" : "Ethan's card frozen")
          }}
        />

        {/* Spending Limit */}
        <div className="px-4 py-3 border-t border-white/5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <BadgePercent className="h-4 w-4 text-white/70"/>
              </div>
              <span className="text-sm text-white/90 font-medium">Daily Spending Limit</span>
            </div>
            <span className="text-sm font-bold text-teal2">£{limit}</span>
          </div>
          <input
            type="range" min="5" max="100" step="5" value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="w-full accent-teal-500"
          />
          <div className="flex justify-between text-[10px] text-white/30 mt-1">
            <span>£5</span><span>£50</span><span>£100</span>
          </div>
        </div>

        {/* Approve allowance */}
        <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
            <BookOpen className="h-4 w-4"/>
          </div>
          <div className="flex-1">
            <p className="text-sm text-white font-semibold leading-tight">Review Curriculum Modules</p>
            <p className="text-[10px] text-white/40">2 modules completed this week</p>
          </div>
          <button
            onClick={() => {
              setApproved(true)
              flashToast('£5 reward sent to Ethan')
              setTimeout(() => setApproved(false), 2000)
            }}
            className={`px-3 py-2 rounded-xl text-[11px] font-bold transition ${
              approved
                ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
                : 'bg-gradient-to-r from-gold to-amber-400 text-trustnavy shadow border border-white/20'
            }`}
          >
            {approved ? <span className="flex items-center gap-1"><Check className="h-3 w-3"/>Sent</span> : 'Approve £5'}
          </button>
        </div>
      </div>
    </div>
  )
}

function DebitCard({ variant, name, subtitle, number, frozen }) {
  const primary = variant === 'primary'
  return (
    <div className="relative">
      <div className={`relative rounded-3xl p-5 border shadow-card overflow-hidden h-[210px] ${
        primary
          ? 'bg-gradient-to-br from-[#0E1A30] via-trustnavy to-[#0a1326] border-white/10'
          : 'bg-gradient-to-br from-[#7CC8FF] via-[#A06EE1] to-[#F4C56A] border-white/30'
      }`}>
        {/* decorative shapes */}
        {primary ? (
          <>
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-teal2/15 blur-2xl"/>
            <div className="absolute inset-x-0 top-12 h-12 bg-gradient-to-r from-teal1 via-teal2 to-teal1 opacity-90"/>
          </>
        ) : (
          <>
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/25 blur-2xl"/>
            <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-teal2/30 blur-2xl"/>
            <svg viewBox="0 0 100 100" className="absolute top-3 right-3 h-12 w-12 opacity-50">
              <path d="M50 10 L88 88 L12 88 Z" fill="white"/>
            </svg>
          </>
        )}

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white"><path d="M12 2 L22 10 L20 10 L12 4 L4 10 L2 10 Z M5 10 H19 V21 H15 V14 H9 V21 H5 Z" fill="currentColor"/></svg>
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-white">STOREHOUSE</span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${primary ? 'text-teal2' : 'text-white'}`}>
              {primary ? 'Primary' : 'Wisdom'}
            </span>
          </div>

          {/* Chip */}
          <div className="flex items-center gap-2">
            <div className={`h-8 w-10 rounded-md ${primary ? 'bg-gradient-to-br from-amber-200 to-amber-500' : 'bg-gradient-to-br from-yellow-100 to-yellow-300'} border border-black/20 flex items-center justify-center`}>
              <div className="h-5 w-7 rounded-sm border border-amber-700/40"/>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/90"><path d="M8 6 a8 8 0 0 1 0 12 M12 4 a10 10 0 0 1 0 16 M16 2 a12 12 0 0 1 0 20" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
          </div>

          <div>
            <p className={`text-[11px] tracking-[0.3em] font-mono ${primary ? 'text-white/80' : 'text-white'}`}>{number}</p>
            <div className="flex items-end justify-between mt-1.5">
              <div>
                <p className={`text-[8px] uppercase tracking-widest ${primary ? 'text-white/40' : 'text-white/80'}`}>Cardholder</p>
                <p className="text-sm font-bold text-white leading-tight">{name}</p>
                <p className={`text-[10px] italic ${primary ? 'text-teal2' : 'text-white/95'}`}>{subtitle}</p>
              </div>
              <span className="text-[10px] font-black tracking-wider text-white/90 italic">VISA</span>
            </div>
          </div>
        </div>

        {/* Frozen overlay */}
        {frozen && (
          <div className="absolute inset-0 bg-cyan-900/60 backdrop-blur-[3px] flex items-center justify-center animate-flashIn rounded-3xl">
            <div className="flex flex-col items-center gap-1">
              <Snowflake className="h-8 w-8 text-cyan-200"/>
              <span className="text-[10px] uppercase tracking-widest text-cyan-100 font-bold">Frozen</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ===================================================================================
   TAB 4 — KINGDOM CAPITAL
   =================================================================================== */
function CapitalTab({ onInvest }) {
  const items = [
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

      {/* Pinned hero */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-amber-500/20 via-trustnavy to-trustnavy border border-gold/30 shadow-card">
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 text-gold"/>
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">Featured Cause</span>
        </div>
        <p className="text-sm text-white mt-1.5 font-semibold leading-snug">
          Backed by 700+ Storehouse stewards this week.
        </p>
      </div>

      {/* Listings */}
      {items.map(item => (
        <CauseCard key={item.id} item={item} onInvest={() => onInvest(item)} />
      ))}
    </div>
  )
}

function CauseCard({ item, onInvest }) {
  const Icon = item.icon
  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card overflow-hidden">
      {/* Hero strip */}
      <div className="h-24 relative bg-gradient-to-br from-navysoft to-navydeep flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal2/20 via-transparent to-amber-400/10"/>
        <Icon className="h-12 w-12 text-white/30"/>
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-white border border-white/15">
          {item.tag}
        </span>
      </div>

      <div className="p-4">
        <h3 className="text-base font-extrabold text-white leading-tight">{item.name}</h3>
        <p className="text-[11px] text-white/50 mt-1.5 leading-snug">{item.blurb}</p>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-end justify-between mb-1.5">
            <div>
              <p className="text-lg font-bold text-white">£{item.raised.toLocaleString()}</p>
              <p className="text-[10px] text-white/40">raised of £{item.goal.toLocaleString()}</p>
            </div>
            <div className="text-right">
              <p className="text-base font-extrabold text-teal2">{item.pct}%</p>
              <p className="text-[10px] text-white/40">{item.backers} backers</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-navydeep overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2 transition-all"
              style={{ width: `${item.pct}%` }}
            />
          </div>
        </div>

        <button
          onClick={onInvest}
          className="mt-4 w-full py-3 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2"
        >
          Invest Now <ArrowUpRight className="h-4 w-4"/>
        </button>
      </div>
    </div>
  )
}

function InvestAmountModal({ item, onClose, onConfirm }) {
  const presets = [25, 50, 100, 250]
  const [amount, setAmount] = useState(50)
  const [custom, setCustom] = useState('')
  const Icon = item.icon

  const value = custom ? Number(custom) : amount
  const valid = value > 0 && value <= 50000

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose}/>
      <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-white/10 animate-slideUp p-5">
        <div className="pt-1 pb-3 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20"/></div>

        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-teal2/15 border border-teal2/30 flex items-center justify-center">
            <Icon className="h-5 w-5 text-teal2"/>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Invest in</p>
            <h2 className="text-base font-extrabold text-white leading-tight truncate">{item.name}</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70"/>
          </button>
        </div>

        {/* Amount display */}
        <div className="mt-5 text-center">
          <p className="text-[10px] uppercase tracking-widest text-white/40">Amount</p>
          <p className="text-5xl font-black text-white tracking-tight mt-1">£{value || 0}</p>
        </div>

        {/* Presets */}
        <div className="grid grid-cols-4 gap-2 mt-5">
          {presets.map(p => (
            <button
              key={p}
              onClick={() => { setAmount(p); setCustom('') }}
              className={`py-2.5 rounded-xl text-sm font-bold border transition ${
                amount === p && !custom
                  ? 'bg-gradient-to-r from-teal1 to-teal2 text-white border-white/20 shadow-glow'
                  : 'bg-navydeep text-white/70 border-white/10'
              }`}
            >£{p}</button>
          ))}
        </div>

        {/* Custom amount */}
        <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-xl bg-navydeep border border-white/10">
          <span className="text-white/40 font-bold">£</span>
          <input
            value={custom}
            onChange={(e) => { setCustom(e.target.value.replace(/[^0-9]/g, '')) }}
            placeholder="Custom amount"
            inputMode="numeric"
            className="flex-1 bg-transparent text-white placeholder-white/30 text-sm focus:outline-none"
          />
        </div>

        {/* Validation */}
        {!valid && (
          <p className="mt-2 text-[11px] text-rose-400">
            Please enter a valid amount between £1 and £50,000.
          </p>
        )}

        {/* Disclosure */}
        <div className="mt-4 flex items-start gap-2 text-[10px] text-white/40 leading-snug">
          <Lock className="h-3 w-3 mt-0.5 flex-shrink-0"/>
          <p>Investments in equity crowdfunding carry risk. Capital is at risk and returns are not guaranteed. Storehouse only lists projects screened to biblical stewardship principles.</p>
        </div>

        <button
          disabled={!valid}
          onClick={onConfirm}
          className={`mt-4 w-full py-3.5 rounded-2xl font-bold text-sm transition ${
            valid
              ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow'
              : 'bg-white/5 text-white/30 cursor-not-allowed'
          }`}
        >
          Confirm £{value || 0} Investment
        </button>
      </div>
    </div>
  )
}
