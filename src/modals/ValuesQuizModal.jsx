import { useState } from 'react'
import { X, Sparkles, ChevronLeft, ChevronRight, Check } from 'lucide-react'

const QUESTIONS = [
  {
    key: 'risk',
    title: 'How comfortable are you with risk?',
    sub: 'Higher risk = bigger swings up and down',
    options: [
      { v: 'low',    l: 'Cautious',     d: 'Steady growth, low volatility' },
      { v: 'med',    l: 'Balanced',     d: 'Mix of growth and stability' },
      { v: 'high',   l: 'Adventurous',  d: 'Maximise long-term return' }
    ]
  },
  {
    key: 'horizon',
    title: 'How long is your investment horizon?',
    sub: 'When do you expect to use this money?',
    options: [
      { v: 'short',  l: '< 3 years',  d: 'Short-term goals' },
      { v: 'mid',    l: '3-10 years', d: 'Mid-term, e.g. a deposit' },
      { v: 'long',   l: '10+ years',  d: 'Pension, legacy, long burn' }
    ]
  },
  {
    key: 'values',
    title: 'Which screens matter most?',
    sub: 'Select all that apply',
    multi: true,
    options: [
      { v: 'noalc',  l: 'No alcohol',       d: '' },
      { v: 'notob',  l: 'No tobacco',       d: '' },
      { v: 'nogamb', l: 'No gambling',      d: '' },
      { v: 'noarms', l: 'No weapons',       d: '' },
      { v: 'noporn', l: 'No adult industry',d: '' },
      { v: 'green',  l: 'Climate positive', d: '' }
    ]
  },
  {
    key: 'mission',
    title: 'Where should we tilt your portfolio?',
    sub: 'Pick a kingdom-aligned focus',
    options: [
      { v: 'tech',     l: 'Kingdom Tech',          d: 'Faith-led innovation' },
      { v: 'housing',  l: 'Affordable Housing',    d: 'Roof over heads' },
      { v: 'energy',   l: 'Clean Energy',          d: 'Creation stewardship' },
      { v: 'mission',  l: 'Mission & Education',   d: 'Schools & Bible work' }
    ]
  }
]

export default function ValuesQuizModal({ onClose, flashToast }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const q = QUESTIONS[step]

  const select = (v) => {
    if (q.multi) {
      const cur = answers[q.key] || []
      const next = cur.includes(v) ? cur.filter(x => x !== v) : [...cur, v]
      setAnswers(a => ({ ...a, [q.key]: next }))
    } else {
      setAnswers(a => ({ ...a, [q.key]: v }))
    }
  }

  const isSelected = (v) => {
    if (q.multi) return (answers[q.key] || []).includes(v)
    return answers[q.key] === v
  }

  const canAdvance = q.multi ? (answers[q.key] || []).length > 0 : !!answers[q.key]

  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  return (
    <div className="absolute inset-0 z-[56]">
      <button className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[92%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            <h2 className="text-base font-extrabold text-white">Values & AI Setup</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        {!done && (
          <>
            <div className="px-5">
              <div className="flex gap-1 mb-3">
                {QUESTIONS.map((_, i) => (
                  <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-gradient-to-r from-teal1 to-teal2' : 'bg-white/10'}`} />
                ))}
              </div>
              <p className="text-[10px] uppercase tracking-widest text-white/40">Step {step + 1} of {QUESTIONS.length}</p>
              <h3 className="text-xl font-extrabold text-white leading-tight mt-1">{q.title}</h3>
              <p className="text-sm text-white/50 mt-1">{q.sub}</p>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-5 mt-4 pb-3">
              <div className="space-y-2">
                {q.options.map(opt => (
                  <button
                    key={opt.v}
                    onClick={() => select(opt.v)}
                    className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${
                      isSelected(opt.v)
                        ? 'bg-teal2/10 border-teal2'
                        : 'bg-navydeep border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white font-bold leading-tight">{opt.l}</p>
                      {opt.d && <p className="text-[11px] text-white/50 mt-0.5">{opt.d}</p>}
                    </div>
                    {isSelected(opt.v) && (
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center">
                        <Check className="h-3 w-3 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-5 pb-7 pt-2 flex gap-2 border-t border-white/5">
              <button
                onClick={() => setStep(s => Math.max(0, s - 1))}
                disabled={step === 0}
                className={`px-4 py-3 rounded-xl text-sm font-bold flex items-center gap-1 ${
                  step === 0 ? 'bg-white/5 text-white/30 cursor-not-allowed' : 'bg-trustnavy border border-white/10 text-white'
                }`}
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <button
                onClick={next}
                disabled={!canAdvance}
                className={`flex-1 py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-1 ${
                  canAdvance ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow' : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                {step === QUESTIONS.length - 1 ? 'See my picks' : 'Next'} <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        {done && (
          <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8">
            <div className="text-center pt-4">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border border-white/20 mb-3">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Your AI profile is ready</h3>
              <p className="text-sm text-white/50 mt-1">We'll tailor suggestions to your values.</p>
            </div>

            <div className="mt-5 space-y-2">
              <ResultRow label="Risk appetite"   value={answers.risk} />
              <ResultRow label="Horizon"         value={answers.horizon} />
              <ResultRow label="Mission tilt"    value={answers.mission} />
              <ResultRow label="Screens active"  value={`${(answers.values || []).length} filters`} />
            </div>

            <button
              onClick={() => { flashToast('Profile saved. New AI picks ready.'); onClose() }}
              className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
            >
              See my AI suggestions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultRow({ label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-navydeep border border-white/10">
      <span className="text-[11px] uppercase tracking-widest text-white/40 font-bold">{label}</span>
      <span className="text-sm text-white font-bold capitalize">{String(value)}</span>
    </div>
  )
}
