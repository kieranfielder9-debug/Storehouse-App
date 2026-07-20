import { useState } from 'react'
import { ShieldCheck, Snowflake, BadgePercent, BookOpen, Check } from 'lucide-react'
import ToggleRow from '../ui/ToggleRow.jsx'
import { useStewardship } from '../../backend/useStewardship.js'

const REWARD_MEMBER = 'Ethan'
const REWARD_REASON = 'Curriculum modules completed'

const formatApprovedAt = (iso) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const sameDay = d.toDateString() === new Date().toDateString()
  const time = d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  return sameDay ? `Today, ${time}` : `${d.toLocaleDateString([], { day: 'numeric', month: 'short' })}, ${time}`
}

export default function ControlCenter({ freeze, setFreeze, flashToast }) {
  const [limit, setLimit] = useState(20)
  const [approving, setApproving] = useState(false)
  const [justApproved, setJustApproved] = useState(false)
  const { provider, householdMembers, rewardRequests } = useStewardship()

  const member = householdMembers.find((m) => m.name === REWARD_MEMBER)
  const memberRewards = member ? rewardRequests.filter((r) => r.household_member_id === member.id) : []

  const handleApprove = async () => {
    if (approving) return
    setApproving(true)
    try {
      await provider.approveReward({ memberName: REWARD_MEMBER, amount: 5, reason: REWARD_REASON })
      flashToast(`£5 reward sent to ${REWARD_MEMBER}`)
      setJustApproved(true)
      setTimeout(() => setJustApproved(false), 2000)
    } catch (e) {
      flashToast(e?.message || 'Could not approve reward')
    } finally {
      setApproving(false)
    }
  }

  return (
    <div className="rounded-2xl bg-trustnavy border border-white/10 overflow-hidden shadow-card">
      <div className="px-4 py-3 border-b border-white/5 flex items-center gap-2">
        <ShieldCheck className="h-4 w-4 text-teal2" />
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

      <div className="px-4 py-3 border-t border-white/5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
              <BadgePercent className="h-4 w-4 text-white/70" />
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

      <div className="px-4 py-3 border-t border-white/5 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-gold/15 text-gold flex items-center justify-center border border-gold/30">
          <BookOpen className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-white font-semibold leading-tight">Review Curriculum Modules</p>
          <p className="text-[10px] text-white/40">2 modules completed this week</p>
        </div>
        <button
          onClick={handleApprove}
          disabled={approving}
          className={`px-3 py-2 rounded-xl text-[11px] font-bold transition ${
            justApproved
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/40'
              : 'bg-gradient-to-r from-gold to-amber-400 text-trustnavy shadow border border-white/20'
          } ${approving ? 'opacity-60 cursor-wait' : ''}`}
        >
          {justApproved
            ? <span className="flex items-center gap-1"><Check className="h-3 w-3" />Sent</span>
            : approving ? 'Sending…' : 'Approve £5'}
        </button>
      </div>

      {memberRewards.length > 0 && (
        <div className="px-4 py-3 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Reward History</p>
          <div className="space-y-1.5">
            {memberRewards.slice(0, 5).map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between text-[11px] bg-white/[0.03] rounded-lg px-2.5 py-2"
              >
                <div className="min-w-0">
                  <span className="text-white/60">{r.reason || 'Reward'}</span>
                  {r.approved_at && (
                    <span className="block text-[9px] text-white/30 mt-0.5">
                      Approved by you · {formatApprovedAt(r.approved_at)}
                    </span>
                  )}
                </div>
                <span className="text-emerald-400 font-semibold shrink-0 ml-2">£{Number(r.amount).toFixed(2)} approved</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
