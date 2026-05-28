import { Bell } from 'lucide-react'
import StorehouseMark from './StorehouseMark.jsx'

export default function BrandHeader({ unreadCount = 2, onHome, onBell, onProfile }) {
  return (
    <header className="px-5 pt-2 pb-3 flex items-start justify-between">
      <button onClick={onHome} className="flex items-center gap-3 text-left active:opacity-80">
        <StorehouseMark />
        <div>
          <h1 className="text-[20px] font-black tracking-[0.18em] leading-none text-white">
            STOREHOUSE
          </h1>
          <p className="text-[11px] mt-1 text-teal2/90 italic tracking-wide">
            Where your treasure is
          </p>
        </div>
      </button>
      <div className="flex items-center gap-2">
        <button
          onClick={onBell}
          className="relative h-9 w-9 rounded-full bg-trustnavy border border-white/10 flex items-center justify-center active:scale-95 transition"
        >
          <Bell className="h-4 w-4 text-white/80" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 rounded-full bg-gradient-to-br from-teal1 to-teal2 text-[9px] font-extrabold text-white flex items-center justify-center border border-midnight">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={onProfile}
          className="h-9 w-9 rounded-full bg-gradient-to-br from-teal1 to-teal2 text-white font-bold text-sm flex items-center justify-center shadow-glow border border-white/20 active:scale-95 transition"
        >
          MG
        </button>
      </div>
    </header>
  )
}
