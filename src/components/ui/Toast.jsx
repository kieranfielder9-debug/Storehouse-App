import { Check, AlertCircle } from 'lucide-react'

export default function Toast({ message, type = 'success' }) {
  const isError = type === 'error'
  return (
    <div className="absolute left-1/2 -translate-x-1/2 bottom-28 z-50 animate-flashIn">
      <div className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-white shadow-glow border border-white/10 ${
        isError
          ? 'bg-gradient-to-r from-rose-600 to-rose-500'
          : 'bg-gradient-to-r from-teal1 to-teal2'
      }`}>
        {isError
          ? <AlertCircle className="h-4 w-4" />
          : <Check className="h-4 w-4" />}
        <span className="text-sm font-medium">{message}</span>
      </div>
    </div>
  )
}
