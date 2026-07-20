import { X, Layers } from 'lucide-react'
import Stat from '../components/ui/Stat.jsx'

export default function PieDetailModal({ pie, onClose }) {
  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-white/10 animate-slideUp p-5">
        <div className="pt-1 pb-3 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>
        <div className="flex items-center gap-3 mb-4">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center"
            style={{ background: `${pie.color}25`, border: `1px solid ${pie.color}55` }}
          >
            <Layers className="h-6 w-6" style={{ color: pie.color }} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40">Allocation Pie</p>
            <h2 className="text-lg font-extrabold text-white leading-tight">{pie.name}</h2>
          </div>
          <button onClick={onClose} className="ml-auto h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>
        <p className="text-sm text-white/70 leading-snug">{pie.desc}</p>

        <div className="mt-4 grid grid-cols-3 gap-2">
          <Stat label="Allocation" value={`${pie.pct}%`} />
          <Stat label="1Y Return" value={pie.oneYearReturn || '+14.2%'} pos />
          <Stat label="Holdings" value={pie.holdings ?? 22} />
        </div>

        <button
          onClick={onClose}
          className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
        >
          Adjust Allocation
        </button>
      </div>
    </div>
  )
}
