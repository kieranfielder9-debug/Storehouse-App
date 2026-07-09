import { useState } from 'react'
import {
  ChevronLeft, X, Coffee, Award, ChevronDown, Check,
  HandCoins, FileText, Plus, Receipt, Repeat, EyeOff, Users
} from 'lucide-react'
import { Scale } from 'lucide-react'
import Label from '../components/ui/Label.jsx'
import Tagchip from '../components/ui/Tagchip.jsx'
import ToggleRow from '../components/ui/ToggleRow.jsx'
import { provider } from '../backend/provider.js'

const CATS = [
  { label: 'Food',   icon: Coffee    },
  { label: 'Giving', icon: HandCoins },
  { label: 'Bills',  icon: FileText  }
]

export default function TransactionModal({ onClose, flashToast }) {
  const txId = 1 // Coffee at Leeds Centre (seed row)
  const row = provider.getLedger().find((r) => r.id === txId)
  const [category, setCategory] = useState(row?.category || 'Food')
  const [showCatMenu, setShowCatMenu] = useState(false)
  const [note, setNote] = useState(row?.note ?? 'Morning catch-up with Sarah re: church plant')
  const [recurring, setRecurring] = useState(false)
  const [exclude, setExclude] = useState(false)
  const [split, setSplit] = useState(false)
  const [contentment, setContentment] = useState(row?.is_contentment_satisfied ?? null) // true=Need, false=Want

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[88%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <button onClick={onClose} className="h-8 w-8 -ml-1 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-white/80" />
          </button>
          <h2 className="text-sm font-bold text-white">Transaction</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
          <div className="text-center pt-2">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-amber-500/15 text-amber-400 flex items-center justify-center mb-3">
              <Coffee className="h-7 w-7" />
            </div>
            <p className="text-white/50 text-xs">Today, 09:14 • Costa Coffee</p>
            <h3 className="text-white font-bold mt-0.5">Coffee at Leeds Centre</h3>
            <p className="text-3xl font-black text-white mt-2">–£3.20</p>
            <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-teal2 bg-teal2/10 border border-teal2/30 px-2.5 py-1 rounded-full">
              <Award className="h-3 w-3" />
              You've given to this vendor 14 times this year
            </div>
          </div>

          <div className="mt-6">
            <Label>Category</Label>
            <button
              onClick={() => setShowCatMenu(v => !v)}
              className="w-full mt-1.5 flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10"
            >
              <span className="text-sm text-white font-medium">{category}</span>
              <ChevronDown className={`h-4 w-4 text-white/50 transition-transform ${showCatMenu ? 'rotate-180' : ''}`} />
            </button>
            {showCatMenu && (
              <div className="mt-1.5 rounded-xl bg-navydeep border border-white/10 overflow-hidden animate-flashIn">
                {CATS.map(c => (
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
            <Label>Tags & Notes</Label>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <Tagchip color="bg-amber-500/15 text-amber-300 border-amber-500/30" label="#coffee" />
              <Tagchip color="bg-teal-500/15 text-teal-300 border-teal-500/30" label="#fellowship" />
              <button className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border border-dashed border-white/20 text-white/50 flex items-center gap-0.5">
                <Plus className="h-2.5 w-2.5" /> add
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

          <button
            onClick={() => flashToast('Receipt opened')}
            className="mt-3 w-full flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10 hover:border-teal2/40 transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-teal2/15 flex items-center justify-center">
                <Receipt className="h-4 w-4 text-teal2" />
              </div>
              <div className="text-left">
                <p className="text-sm text-white font-semibold">View Receipt Image</p>
                <p className="text-[10px] text-white/40">Scanned 09:14 today</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 text-white/40 -rotate-90" />
          </button>

          {/* Contentment check — single tap: Need (true) or Want (false) */}
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

          <div className="mt-4 rounded-xl bg-navydeep border border-white/10 divide-y divide-white/5">
            <ToggleRow icon={Repeat} label="Make Recurring Payment"   value={recurring} onToggle={() => setRecurring(v => !v)} />
            <ToggleRow icon={EyeOff} label="Exclude from Analytics"   value={exclude}   onToggle={() => setExclude(v => !v)} />
            <ToggleRow icon={Users}  label="Split Bill with Contacts" value={split}     onToggle={() => setSplit(v => !v)} />
          </div>

          <button
            onClick={() => {
              provider.updateLedger(txId, { category, note, is_contentment_satisfied: contentment })
              onClose(); flashToast('Transaction settings saved')
            }}
            className="mt-5 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
