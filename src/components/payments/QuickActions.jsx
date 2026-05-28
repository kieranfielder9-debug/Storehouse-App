import { Send, Heart, QrCode, Plus } from 'lucide-react'

export default function QuickActions({ onPay, onGive, onQR, onTopUp }) {
  const items = [
    { label: 'Pay',     icon: Send,    onClick: onPay,   color: 'from-teal1 to-teal2' },
    { label: 'Give',    icon: Heart,   onClick: onGive,  color: 'from-rose-500 to-pink-500' },
    { label: 'QR Pay',  icon: QrCode,  onClick: onQR,    color: 'from-blue-500 to-indigo-500' },
    { label: 'Top up',  icon: Plus,    onClick: onTopUp, color: 'from-amber-500 to-amber-600' }
  ]
  return (
    <div className="grid grid-cols-4 gap-2">
      {items.map(it => (
        <button
          key={it.label}
          onClick={it.onClick}
          className="flex flex-col items-center gap-1.5 py-2.5 rounded-2xl bg-trustnavy border border-white/10 hover:border-teal2/40 active:scale-95 transition"
        >
          <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${it.color} flex items-center justify-center shadow border border-white/20`}>
            <it.icon className="h-4 w-4 text-white" />
          </div>
          <span className="text-[10px] text-white font-bold">{it.label}</span>
        </button>
      ))}
    </div>
  )
}
