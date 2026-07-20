import { Snowflake } from 'lucide-react'

export default function DebitCard({ variant, name, subtitle, number, frozen, onClick }) {
  const primary = variant === 'primary'
  return (
    <button
      onClick={onClick}
      className="block w-full text-left relative active:scale-[0.99] transition"
    >
      <div className={`relative rounded-3xl p-5 border shadow-card overflow-hidden h-[210px] ${
        primary
          ? 'bg-gradient-to-br from-[#0E1A30] via-trustnavy to-[#0a1326] border-white/10'
          : 'bg-gradient-to-br from-[#7CC8FF] via-[#A06EE1] to-[#F4C56A] border-white/30'
      }`}>
        {primary ? (
          <>
            <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-teal2/15 blur-2xl" />
            <div className="absolute inset-x-0 top-12 h-12 bg-gradient-to-r from-teal1 via-teal2 to-teal1 opacity-90" />
          </>
        ) : (
          <>
            <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/25 blur-2xl" />
            <div className="absolute -bottom-16 -left-10 h-44 w-44 rounded-full bg-teal2/30 blur-2xl" />
            <svg viewBox="0 0 100 100" className="absolute top-3 right-3 h-12 w-12 opacity-50">
              <path d="M50 10 L88 88 L12 88 Z" fill="white" />
            </svg>
          </>
        )}

        <div className="relative h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/15 backdrop-blur flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4 text-white">
                  <path d="M12 2 L22 10 L20 10 L12 4 L4 10 L2 10 Z M5 10 H19 V21 H15 V14 H9 V21 H5 Z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-[10px] font-black tracking-[0.25em] text-white">STOREHOUSE</span>
            </div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest ${primary ? 'text-teal2' : 'text-white'}`}>
              {primary ? 'Primary' : 'Wisdom'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className={`h-8 w-10 rounded-md ${
              primary
                ? 'bg-gradient-to-br from-amber-200 to-amber-500'
                : 'bg-gradient-to-br from-yellow-100 to-yellow-300'
            } border border-black/20 flex items-center justify-center`}>
              <div className="h-5 w-7 rounded-sm border border-amber-700/40" />
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-white/90">
              <path d="M8 6 a8 8 0 0 1 0 12 M12 4 a10 10 0 0 1 0 16 M16 2 a12 12 0 0 1 0 20" stroke="currentColor" strokeWidth="1.5" fill="none" />
            </svg>
          </div>

          <div>
            <p className={`text-[11px] tracking-[0.3em] font-mono ${primary ? 'text-white/80' : 'text-white'}`}>{number}</p>
            <div className="flex items-end justify-between mt-1.5">
              <div>
                <p className={`text-[8px] uppercase tracking-widest ${primary ? 'text-white/40' : 'text-white/80'}`}>Cardholder</p>
                <p className="text-sm font-bold text-white leading-tight">{name}</p>
                <p className={`text-[10px] italic ${primary ? 'text-teal2' : 'text-white/95'}`}>{subtitle}</p>
              </div>
              <span className="text-[10px] font-black tracking-wider text-white/90 italic">VISA</span>
            </div>
          </div>
        </div>

        {frozen && (
          <div className="absolute inset-0 bg-cyan-900/60 backdrop-blur-[3px] flex items-center justify-center animate-flashIn rounded-3xl">
            <div className="flex flex-col items-center gap-1">
              <Snowflake className="h-8 w-8 text-cyan-200" />
              <span className="text-[10px] uppercase tracking-widest text-cyan-100 font-bold">Frozen</span>
            </div>
          </div>
        )}
      </div>
      <p className="absolute bottom-2 right-3 text-[9px] text-white/60 font-bold pointer-events-none">Tap card for options</p>
    </button>
  )
}
