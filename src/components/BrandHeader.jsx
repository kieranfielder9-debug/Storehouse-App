import { Bell } from 'lucide-react'
import StorehouseMark from './StorehouseMark.jsx'

export default function BrandHeader() {
  return (
    <header className="px-5 pt-2 pb-3 flex items-start justify-between">
      <div className="flex items-center gap-3">
        <StorehouseMark />
        <div>
          <h1 className="text-[20px] font-black tracking-[0.18em] leading-none text-white">
            STOREHOUSE
          </h1>
          <p className="text-[11px] mt-1 text-teal2/90 italic tracking-wide">
            Where your treasure is
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="relative h-9 w-9 rounded-full bg-trustnavy border border-white/10 flex items-center justify-center">
          <Bell className="h-4 w-4 text-white/80" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-teal2 animate-pulseGlow" />
        </button>
        <button className="h-9 w-9 rounded-full bg-gradient-to-br from-teal1 to-teal2 text-white font-bold text-sm flex items-center justify-center shadow-glow border border-white/20">
          MG
        </button>
      </div>
    </header>
  )
}
