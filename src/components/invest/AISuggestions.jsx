import { Sparkles, Leaf, Building2, BookOpen } from 'lucide-react'
import Suggestion from './Suggestion.jsx'

export default function AISuggestions() {
  return (
    <div className="rounded-2xl p-4 bg-gradient-to-br from-trustnavy via-trustnavy to-navydeep border border-white/10 shadow-card relative overflow-hidden">
      <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="text-[10px] uppercase tracking-widest font-bold text-gold">AI Investment Suggestions</span>
        </div>
        <h3 className="text-base font-bold text-white">Funds aligned with biblical values</h3>
        <p className="text-[11px] text-white/50 mt-1">
          Strictly non-compromised. Independently screened by our stewardship board.
        </p>

        <div className="mt-3 space-y-2">
          <Suggestion icon={Leaf}      title="Eden Renewables Trust"  meta="ESG 9.4 • No fossil fuels"   badge="High Match"   />
          <Suggestion icon={Building2} title="Bethel Housing Fund"    meta="Affordable homes • 7Y track" badge="Steward Pick" />
          <Suggestion icon={BookOpen}  title="Mission Education ETF"  meta="Christian schools • Global"  badge="New"          />
        </div>
      </div>
    </div>
  )
}
