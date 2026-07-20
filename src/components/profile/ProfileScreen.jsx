import { ChevronLeft } from 'lucide-react'

export default function ProfileScreen({ title, onBack, children }) {
  return (
    <div className="absolute inset-0 z-[57] bg-midnight flex flex-col animate-flashIn">
      <div className="px-5 pt-12 pb-4 flex items-center gap-3 border-b border-white/5">
        <button onClick={onBack} className="h-9 w-9 rounded-full bg-trustnavy border border-white/10 flex items-center justify-center">
          <ChevronLeft className="h-4 w-4 text-white/80" />
        </button>
        <h2 className="text-lg font-extrabold text-white">{title}</h2>
      </div>
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 py-5 pb-10">
        {children}
      </div>
    </div>
  )
}
