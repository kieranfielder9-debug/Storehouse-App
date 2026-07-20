import { X, Sparkles, HandCoins, TrendingUp, Building2, Snowflake, CheckCheck } from 'lucide-react'

const NOTIFS = [
  { id: 1, icon: Sparkles,   color: 'bg-teal2/15 text-teal2',   title: 'Weekly Wrap is ready',         body: 'You auto-saved £42 this week.',                  time: 'Just now', unread: true },
  { id: 2, icon: HandCoins,  color: 'bg-emerald-500/15 text-emerald-400', title: 'Tithe sent successfully',  body: '£210 to Huddersfield Christian Fellowship.', time: '08:00',    unread: true },
  { id: 3, icon: Building2,  color: 'bg-amber-500/15 text-amber-400',    title: 'Bradford Faith Hub at 78%', body: 'Your stake is now £350. £55,000 to goal.',   time: 'Yesterday', unread: false },
  { id: 4, icon: TrendingUp, color: 'bg-blue-500/15 text-blue-400',      title: 'Kingdom Tech +4.7% today',  body: 'Auto-Copy mirroring James Whitcombe.',       time: 'Yesterday', unread: false },
  { id: 5, icon: Snowflake,  color: 'bg-cyan-500/15 text-cyan-300',      title: 'Ethan\'s card unfrozen',     body: 'Limit kept at £20/day.',                     time: '27 May',   unread: false }
]

export default function NotificationsDrawer({ onClose, flashToast }) {
  return (
    <div className="absolute inset-0 z-[58]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[88%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-extrabold text-white">Notifications</h2>
            <p className="text-[11px] text-white/40">2 unread</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => flashToast('Marked all read')} className="text-[10px] text-teal2 font-semibold flex items-center gap-1">
              <CheckCheck className="h-3 w-3" /> Mark all read
            </button>
            <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-8">
          <div className="space-y-1.5">
            {NOTIFS.map(n => (
              <button
                key={n.id}
                onClick={() => flashToast(`Opened: ${n.title}`)}
                className={`w-full flex items-start gap-3 px-3 py-3 rounded-xl text-left transition ${
                  n.unread ? 'bg-white/[0.04] border border-teal2/20' : 'hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <n.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm text-white font-bold leading-tight truncate">{n.title}</p>
                    {n.unread && <span className="h-2 w-2 rounded-full bg-teal2 flex-shrink-0" />}
                  </div>
                  <p className="text-[11px] text-white/60 mt-0.5 leading-snug">{n.body}</p>
                  <p className="text-[10px] text-white/30 mt-1">{n.time}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
