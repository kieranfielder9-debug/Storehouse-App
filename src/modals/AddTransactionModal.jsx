import { useState } from 'react'
import {
  ChevronLeft, X, Coffee, HandCoins, ShoppingBag, ArrowUpRight, Home, Bus, Sparkles,
  ChevronDown, Check, Scale
} from 'lucide-react'
import Label from '../components/ui/Label.jsx'
import { provider } from '../backend/provider.js'

// Same category set TransactionFeed's CATEGORY_STYLE renders, plus a
// catch-all "Other" for anything that doesn't fit the named buckets.
const CATS = [
  { label: 'Food',      icon: Coffee },
  { label: 'Giving',    icon: HandCoins },
  { label: 'Groceries', icon: ShoppingBag },
  { label: 'Income',    icon: ArrowUpRight },
  { label: 'Bills',     icon: Home },
  { label: 'Transport', icon: Bus },
  { label: 'Other',     icon: Sparkles }
]

const today = () => new Date().toISOString().slice(0, 10)

export default function AddTransactionModal({ onClose, flashToast }) {
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(today())
  const [contentment, setContentment] = useState(null) // true=Need, false=Want, null=unset
  const [saving, setSaving] = useState(false)

  const isIncome = category === 'Income'
  const numeric = Number(amount)
  const valid = amount.trim() !== '' && Number.isFinite(numeric) && numeric > 0 && description.trim() !== '' && !!date

  const handleSave = async () => {
    if (!valid || saving) return
    setSaving(true)
    try {
      await provider.addLedger({
        amount: isIncome ? Math.abs(numeric) : -Math.abs(numeric),
        category,
        description: description.trim(),
        date,
        is_contentment_satisfied: contentment
      })
      flashToast('Transaction added')
      onClose()
    } catch (e) {
      flashToast(e?.message || 'Could not add transaction')
      setSaving(false)
    }
  }

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[92%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <button onClick={onClose} className="h-8 w-8 -ml-1 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-white/80" />
          </button>
          <h2 className="text-sm font-bold text-white">Add Transaction</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          <Label>Amount</Label>
          <div className="mt-1.5 flex items-center gap-2 px-4 py-3 rounded-xl bg-navydeep border border-white/10">
            <span className={`font-bold text-lg ${isIncome ? 'text-emerald-400' : 'text-white/40'}`}>
              {isIncome ? '+£' : '–£'}
            </span>
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
              inputMode="decimal"
              placeholder="0.00"
              autoFocus
              className="flex-1 bg-transparent text-2xl font-extrabold text-white placeholder-white/20 focus:outline-none"
            />
          </div>
          <p className="mt-1.5 text-[10px] text-white/35 px-1">
            {isIncome ? 'Recorded as money in.' : 'Recorded as money out — pick "Income" as the category for money in.'}
          </p>

          <div className="mt-4">
            <Label>Category</Label>
            <button
              onClick={() => setShowCatMenu((v) => !v)}
              className="w-full mt-1.5 flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10"
            >
              <span className="text-sm text-white font-medium">{category}</span>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${showCatMenu ? 'rotate-180' : ''}`} />
            </button>
            {showCatMenu && (
              <div className="mt-1.5 rounded-xl bg-navydeep border border-white/10 overflow-hidden animate-flashIn">
                {CATS.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => { setCategory(c.label); setShowCatMenu(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/5 ${
                      category === c.label ? 'text-teal2' : 'text-white/80'
                    }`}
                  >
                    <c.icon className="h-4 w-4" />
                    <span className="text-sm font-medium flex-1">{c.label}</span>
                    {category === c.label && <Check className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4">
            <Label>Description</Label>
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Coffee with a friend"
              className="mt-1.5 w-full rounded-xl bg-navydeep border border-white/10 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal2/50"
            />
          </div>

          <div className="mt-4">
            <Label>Date</Label>
            <input
              type="date"
              value={date}
              max={today()}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1.5 w-full rounded-xl bg-navydeep border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:border-teal2/50 [color-scheme:dark]"
            />
          </div>

          {/* Contentment check — same Need/Want pattern as TransactionModal */}
          <div className="mt-4 rounded-xl bg-navydeep border border-white/10 px-4 py-3 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Scale className="h-4 w-4 text-white/70" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90 font-medium leading-tight">Contentment check</p>
              <p className="text-[10px] text-white/40">Was this a need or a want?</p>
            </div>
            <div className="flex gap-1 bg-trustnavy p-0.5 rounded-lg border border-white/10">
              <button
                onClick={() => setContentment(true)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                  contentment === true ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow' : 'text-white/50'
                }`}
              >Need</button>
              <button
                onClick={() => setContentment(false)}
                className={`px-3 py-1.5 rounded-md text-[11px] font-bold transition ${
                  contentment === false ? 'bg-gradient-to-r from-gold to-amber-400 text-trustnavy shadow' : 'text-white/50'
                }`}
              >Want</button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={!valid || saving}
            className={`mt-5 w-full py-3.5 rounded-2xl font-bold text-sm transition ${
              valid && !saving
                ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow'
                : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {saving ? 'Adding…' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  )
}
