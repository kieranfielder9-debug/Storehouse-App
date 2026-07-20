import { useEffect, useState } from 'react'
import { Sparkles, X, Sprout, Heart, ShieldCheck } from 'lucide-react'

const SLIDES = [
  {
    key: 'save',
    title: 'This week you auto-saved',
    hero: '£42',
    subtitle: 'across 14 micro-round-ups',
    accent: 'from-teal1 to-teal2',
    icon: Sprout
  },
  {
    key: 'tithe',
    title: 'You hit your 10% tithing target',
    hero: '100%',
    subtitle: 'perfectly across West Yorkshire causes 🎉',
    accent: 'from-amber-400 to-amber-500',
    icon: Heart
  },
  {
    key: 'kingdom',
    title: 'Kingdom impact this week',
    hero: '3 lives',
    subtitle: 'touched through Bradford Faith Hub funding',
    accent: 'from-teal1 to-teal2',
    icon: ShieldCheck
  }
]

export default function WeeklyWrapModal({ onClose }) {
  const [i, setI] = useState(0)
  const slide = SLIDES[i]
  const Icon = slide.icon

  useEffect(() => {
    const t = setTimeout(() => {
      if (i < SLIDES.length - 1) setI(i + 1)
    }, 5000)
    return () => clearTimeout(t)
  }, [i])

  return (
    <div className="absolute inset-0 z-[60] bg-black/95 animate-flashIn">
      <div className={`absolute inset-0 bg-gradient-to-br ${slide.accent} opacity-90`} />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />

      <div className="absolute top-10 left-4 right-4 flex gap-1.5 z-10">
        {SLIDES.map((s, idx) => (
          <div key={s.key} className="flex-1 h-1 rounded-full bg-white/25 overflow-hidden">
            <div
              key={`${s.key}-${i}`}
              className={`h-full bg-white ${
                idx < i ? 'w-full' : idx === i ? 'animate-progress origin-left' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      <div className="absolute top-14 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-white" />
          <span className="text-[11px] uppercase tracking-widest font-bold text-white">Weekly Wrap</span>
        </div>
        <button onClick={onClose} className="h-8 w-8 rounded-full bg-black/30 flex items-center justify-center">
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      <button className="absolute inset-y-0 left-0 w-1/3 z-[5]" onClick={() => setI(Math.max(0, i - 1))} aria-label="prev" />
      <button className="absolute inset-y-0 right-0 w-1/3 z-[5]" onClick={() => setI(Math.min(SLIDES.length - 1, i + 1))} aria-label="next" />

      <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
        <div className="h-16 w-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-6 border border-white/20">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <p className="text-white/80 text-sm font-semibold tracking-wide mb-3">{slide.title}</p>
        <h1 className="text-7xl font-black text-white tracking-tight drop-shadow-lg">{slide.hero}</h1>
        <p className="mt-4 text-white/90 text-base font-medium max-w-[260px] leading-snug">{slide.subtitle}</p>
      </div>

      <div className="absolute bottom-10 left-6 right-6 z-10">
        <button onClick={onClose} className="w-full py-3.5 rounded-2xl bg-white text-trustnavy font-bold text-sm shadow-xl">
          Back to Storehouse →
        </button>
        <p className="text-center text-white/70 text-[11px] mt-3">Slide {i + 1} of {SLIDES.length}</p>
      </div>
    </div>
  )
}
