import { Check } from 'lucide-react'

export default function Toast({ message }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-28 z-50 animate-flashIn">
      <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow border border-white/10">
        <Check className="h-4 w-4" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
