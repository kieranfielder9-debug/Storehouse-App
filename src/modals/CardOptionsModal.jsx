import { X, Apple, Key, RefreshCw, Receipt, Send, ShoppingBag, Globe, Snowflake, AlertOctagon, MapPin } from 'lucide-react'

export default function CardOptionsModal({ card, onClose, flashToast }) {
  const ACTIONS = [
    { key: 'wallet',  icon: Apple,        label: 'Add to Apple Wallet',    sub: 'Tap to pay on your iPhone & Watch', action: () => flashToast('Added to Apple Wallet') },
    { key: 'pin',     icon: Key,          label: 'PIN Reminder',           sub: 'Reveal PIN via Face ID',             action: () => flashToast('PIN: •••• (revealed)') },
    { key: 'replace', icon: RefreshCw,    label: 'Cancel & Replace Card',  sub: 'New card arrives in 2-3 days',       action: () => flashToast('Replacement ordered'), danger: true },
    { key: 'stmt',    icon: Receipt,      label: 'Card Statement',         sub: 'Download last 90 days',              action: () => flashToast('Statement downloaded') },
    { key: 'send',    icon: Send,         label: 'Share Card Details',     sub: 'Securely with a contact',            action: () => flashToast('Share sheet opened') },
    { key: 'online',  icon: Globe,        label: 'Online Payments',        sub: 'Allow / block online use',           action: () => flashToast('Online payments toggled') },
    { key: 'shops',   icon: ShoppingBag,  label: 'In-store Payments',      sub: 'Toggle chip & contactless',          action: () => flashToast('In-store payments toggled') },
    { key: 'abroad',  icon: MapPin,       label: 'Use Abroad',             sub: 'Travel notice + FX rate',            action: () => flashToast('Travel notice on') },
    { key: 'freeze',  icon: Snowflake,    label: 'Freeze Card',            sub: 'Pause spending instantly',           action: () => { flashToast('Card frozen'); onClose() } },
    { key: 'lost',    icon: AlertOctagon, label: 'Report Lost or Stolen',  sub: 'Block immediately',                  action: () => flashToast('Card reported'), danger: true }
  ]

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[90%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Card options</p>
            <h2 className="text-base font-extrabold text-white leading-tight">{card.name}</h2>
            <p className="text-[11px] text-white/40 font-mono">{card.number}</p>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-8">
          <div className="rounded-2xl bg-navydeep border border-white/10 divide-y divide-white/5 overflow-hidden">
            {ACTIONS.map(a => (
              <button
                key={a.key}
                onClick={a.action}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.03] active:bg-white/[0.05] transition"
              >
                <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  a.danger ? 'bg-rose-500/15 text-rose-400' : 'bg-teal2/15 text-teal2'
                }`}>
                  <a.icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold leading-tight ${a.danger ? 'text-rose-400' : 'text-white'}`}>{a.label}</p>
                  <p className="text-[10px] text-white/40 mt-0.5 truncate">{a.sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
