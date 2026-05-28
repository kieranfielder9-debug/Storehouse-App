import { User, Settings, Share2, FileText, HelpCircle, LogOut, ChevronRight, X } from 'lucide-react'

const ITEMS = [
  { key: 'account',     label: 'Account',                 icon: User,       sub: 'Personal details & banks' },
  { key: 'preferences', label: 'Preferences',             icon: Settings,   sub: 'Appearance & notifications' },
  { key: 'refer',       label: 'Refer a Friend',          icon: Share2,     sub: 'Earn £20 per steward' },
  { key: 'statements',  label: 'Statements & Documents',  icon: FileText,   sub: 'Tax, ISA, statements' },
  { key: 'help',        label: 'Help & Support',          icon: HelpCircle, sub: '24/7 chat with the team' }
]

export default function ProfileMenu({ onSelect, onSignOut, onClose }) {
  return (
    <div className="absolute inset-0 z-[58]">
      <button className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute top-16 right-3 w-[280px] bg-trustnavy border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-flashIn">
        <div className="px-4 py-3.5 bg-gradient-to-br from-teal1/20 to-trustnavy border-b border-white/10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-teal1 to-teal2 text-white font-extrabold text-base flex items-center justify-center shadow-glow border border-white/20">
            MG
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-bold leading-tight">Michael Gladstone</p>
            <p className="text-[10px] text-white/40 truncate">michael.gladstone@example.com</p>
          </div>
          <button onClick={onClose} className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-3 w-3 text-white/60" />
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {ITEMS.map(item => (
            <button
              key={item.key}
              onClick={() => onSelect(item.key)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] transition"
            >
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <item.icon className="h-4 w-4 text-white/70" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white font-semibold leading-tight">{item.label}</p>
                <p className="text-[10px] text-white/40 mt-0.5 truncate">{item.sub}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-white/30" />
            </button>
          ))}
        </div>

        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-4 py-3 text-left border-t border-white/5 hover:bg-rose-500/5 transition"
        >
          <div className="h-8 w-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <LogOut className="h-4 w-4 text-rose-400" />
          </div>
          <span className="text-sm text-rose-400 font-semibold flex-1">Sign Out</span>
        </button>
      </div>
    </div>
  )
}
