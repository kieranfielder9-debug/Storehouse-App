import { Check, ChevronRight } from 'lucide-react'
import { useStewardship } from '../../backend/useStewardship.js'

/** Stewardship Profile Assessment — ported from the Expo rebuild's
 *  WatchtowerScreen.tsx (there, a fully mocked checklist). The first three
 *  items here reflect real account state from provider.js; the last two
 *  are clearly marked "Soon" placeholders for features not built yet
 *  (spending review / a generosity plan), rather than faked as complete —
 *  see the port summary for why Watchtower's expense-audit + "prune
 *  payments" flow itself was left out of this pass. */
export default function StewardshipAssessment({ flashToast }) {
  const { plaid, goals, reflections } = useStewardship()

  const items = [
    { id: 'source', title: 'Connect a stewardship source', subtitle: 'Link a bank so Storehouse can see real activity', done: plaid.connected },
    { id: 'tithe', title: 'Set a tithe target', subtitle: `Currently ${goals.tithe_percentage}% of income`, done: !!goals.tithe_percentage },
    { id: 'reflect', title: 'Log a weekly reflection', subtitle: 'Sunday evening check-in on your stewardship', done: reflections.length > 0 },
    { id: 'audit', title: 'Review your spending', subtitle: 'Coming soon', done: false, comingSoon: true },
    { id: 'plan', title: 'Build a generosity plan', subtitle: 'Coming soon', done: false, comingSoon: true }
  ]

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 shadow-card p-4">
      <p className="text-sm font-bold text-white mb-3">Stewardship Profile Assessment</p>
      <div className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            disabled={item.comingSoon}
            onClick={() => flashToast?.(item.done ? `${item.title} — already done` : item.title)}
            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl border text-left transition ${
              item.done ? 'border-teal2/40 bg-teal2/5' : 'border-white/10 bg-navydeep'
            } ${item.comingSoon ? 'opacity-50 cursor-default' : 'hover:border-teal2/30'}`}
          >
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white truncate">{item.title}</p>
              <p className="text-[10px] text-white/40 truncate">{item.subtitle}</p>
            </div>
            {item.done ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-teal2 flex-shrink-0">
                <Check className="h-3 w-3" /> Done
              </span>
            ) : item.comingSoon ? (
              <span className="text-[10px] font-bold text-white/30 flex-shrink-0">Soon</span>
            ) : (
              <ChevronRight className="h-4 w-4 text-white/30 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
