import { Sparkles, Leaf, Building2, BookOpen, Settings2 } from 'lucide-react'
import Suggestion from './Suggestion.jsx'

export default function AISuggestions({ onOpenValues }) {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-trustnavy via-trustnavy to-navydeep border border-white/10 shadow-card relative overflow-hidden">
      <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            <span className="text-[10px] uppercase tracking-widest font-bold text-gold">AI Investment Suggestions</span>
          </div>
          <button
            onClick={onOpenValues}
            className="text-[10px] text-gold font-bold flex items-center gap-0.5"
          >
            <Settings2 className="h-3 w-3" /> Tune
          </button>
        </div>
        <h3 className="text-base font-bold text-white">Tuned to your values</h3>
        <p className="text-[11px] text-white/50 mt-1">
          AI picks based on your stewardship profile, risk appetite and biblical screens.
        </p>

        <div className="mt-3 space-y-2">
          <Suggestion icon={Leaf}      title="Eden Renewables Trust"  meta="ESG 9.4 · No fossil fuels"   badge="High Match"   />
          <Suggestion icon={Building2} title="Bethel Housing Fund"    meta="Affordable homes · 7Y track" badge="Steward Pick" />
          <Suggestion icon={BookOpen}  title="Mission Education ETF"  meta="Christian schools · Global"  badge="New"          />
        </div>

        <button
          onClick={onOpenValues}
          className="mt-3 w-full py-2.5 rounded-xl bg-gold/15 border border-gold/40 text-gold text-[11px] font-bold flex items-center justify-center gap-1.5"
        >
          <Settings2 className="h-3 w-3" /> Update my values profile
        </button>
      </div>
    </div>
  )
}
