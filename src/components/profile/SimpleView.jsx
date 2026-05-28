import { Share2, FileText, HelpCircle, MessageSquare, Mail, Phone, Download, Copy, Gift } from 'lucide-react'
import ProfileScreen from './ProfileScreen.jsx'
import Label from '../ui/Label.jsx'

export function ReferView({ onBack, flashToast }) {
  return (
    <ProfileScreen title="Refer a Friend" onBack={onBack}>
      <div className="rounded-2xl p-5 bg-gradient-to-br from-teal1/30 via-trustnavy to-trustnavy border border-teal2/30 shadow-glow text-center">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border border-white/20 mb-3">
          <Gift className="h-7 w-7 text-white" />
        </div>
        <p className="text-[10px] uppercase tracking-widest text-teal2">Earn together</p>
        <h3 className="text-2xl font-extrabold text-white mt-1">£20 per steward</h3>
        <p className="text-xs text-white/60 mt-2">You and your friend each get £20 when they fund their account.</p>
      </div>

      <Label><span className="mt-5 block">Your referral code</span></Label>
      <button
        onClick={() => flashToast('Referral code copied')}
        className="mt-2 w-full flex items-center justify-between px-4 py-3.5 rounded-xl bg-trustnavy border border-white/10 hover:border-teal2/40 transition"
      >
        <span className="text-lg font-extrabold text-white tracking-[0.3em]">GLDS-MG24</span>
        <Copy className="h-4 w-4 text-teal2" />
      </button>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <ShareBtn icon={MessageSquare} label="iMessage" onClick={() => flashToast('Shared via iMessage')} />
        <ShareBtn icon={Mail}          label="Email"    onClick={() => flashToast('Shared via Email')} />
        <ShareBtn icon={Share2}        label="More"     onClick={() => flashToast('Share sheet opened')} />
      </div>

      <div className="mt-6 rounded-2xl bg-trustnavy border border-white/10 p-4">
        <p className="text-sm text-white font-bold">You've referred 3 stewards</p>
        <p className="text-[11px] text-white/50 mt-1">£60 earned so far. Keep going!</p>
      </div>
    </ProfileScreen>
  )
}

function ShareBtn({ icon: Icon, label, onClick }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-trustnavy border border-white/10 hover:border-teal2/40">
      <Icon className="h-4 w-4 text-teal2" />
      <span className="text-[11px] text-white font-semibold">{label}</span>
    </button>
  )
}

export function StatementsView({ onBack, flashToast }) {
  const items = [
    { kind: 'Statement', name: 'April 2026 — Current Account', date: '01 May 2026' },
    { kind: 'Statement', name: 'March 2026 — Current Account', date: '01 Apr 2026' },
    { kind: 'Tax Doc',   name: '2025/26 ISA Annual Summary',   date: '06 Apr 2026' },
    { kind: 'Receipt',   name: 'Tithe summary — Q1 2026',      date: '01 Apr 2026' },
    { kind: 'Statement', name: 'February 2026 — Current Account', date: '01 Mar 2026' }
  ]
  return (
    <ProfileScreen title="Statements & Documents" onBack={onBack}>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {items.map((it, i) => (
          <button
            key={i}
            onClick={() => flashToast(`${it.name} downloaded`)}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] text-left"
          >
            <div className="h-9 w-9 rounded-xl bg-teal2/15 text-teal2 flex items-center justify-center border border-teal2/30">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[9px] uppercase tracking-widest text-white/40">{it.kind}</p>
              <p className="text-sm text-white font-semibold truncate">{it.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{it.date}</p>
            </div>
            <Download className="h-4 w-4 text-white/40" />
          </button>
        ))}
      </div>
    </ProfileScreen>
  )
}

export function HelpView({ onBack, flashToast }) {
  const topics = [
    'How do tithes & giving categories work?',
    'Can I link my child\'s school card?',
    'How is Auto-Copy investing managed?',
    'Is Storehouse FCA-regulated?',
    'What happens when I freeze a card?',
    'How do I withdraw from Kingdom Capital?'
  ]
  return (
    <ProfileScreen title="Help & Support" onBack={onBack}>
      <div className="rounded-2xl p-5 bg-gradient-to-br from-teal1/30 to-trustnavy border border-teal2/30 shadow-glow">
        <p className="text-[10px] uppercase tracking-widest text-teal2">Need a human?</p>
        <h3 className="text-lg font-extrabold text-white mt-1">24/7 live chat with the team</h3>
        <p className="text-xs text-white/60 mt-1">Average response time: 90 seconds.</p>
        <button
          onClick={() => flashToast('Chat opened')}
          className="mt-3 w-full py-3 rounded-xl bg-white text-trustnavy font-bold text-sm flex items-center justify-center gap-2"
        >
          <MessageSquare className="h-4 w-4" /> Start a chat
        </button>
      </div>

      <Label><span className="mt-5 block">Popular topics</span></Label>
      <div className="mt-2 rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {topics.map((t, i) => (
          <button
            key={i}
            onClick={() => flashToast('Article opened')}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] text-left"
          >
            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
              <HelpCircle className="h-4 w-4 text-white/70" />
            </div>
            <span className="text-sm text-white/90 flex-1">{t}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2">
        <button onClick={() => flashToast('Calling team...')} className="py-3 rounded-xl bg-trustnavy border border-white/10 flex items-center justify-center gap-2">
          <Phone className="h-4 w-4 text-teal2" />
          <span className="text-sm text-white font-semibold">Call us</span>
        </button>
        <button onClick={() => flashToast('Compose email')} className="py-3 rounded-xl bg-trustnavy border border-white/10 flex items-center justify-center gap-2">
          <Mail className="h-4 w-4 text-teal2" />
          <span className="text-sm text-white font-semibold">Email</span>
        </button>
      </div>
    </ProfileScreen>
  )
}
