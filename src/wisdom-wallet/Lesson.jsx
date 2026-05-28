import { useState } from 'react'
import { ChevronLeft, ChevronRight, BookOpen, Sparkles, MessageSquare, Check, X, ArrowRight, Heart } from 'lucide-react'

export default function Lesson({ onBack, onComplete }) {
  const [picked, setPicked] = useState(null)
  const correct = 'multiplied'

  return (
    <main>
      {/* Top bar */}
      <div className="border-b border-white/5 bg-trustnavy/60">
        <div className="max-w-5xl mx-auto px-8 py-4 flex items-center gap-5">
          <button onClick={onBack} className="text-[11px] text-white/55 font-bold flex items-center gap-1 hover:text-white">
            <ChevronLeft className="h-3 w-3"/> Exit lesson
          </button>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Lesson 3 of 6 · The Parable of the Talents</p>
              <p className="text-[10px] text-teal2 font-bold">Section 4 of 5</p>
            </div>
            <div className="flex gap-1">
              {[true, true, true, false, false].map((on, i) => (
                <div key={i} className={`flex-1 h-1 rounded-full ${on ? 'bg-gradient-to-r from-teal1 to-teal2' : 'bg-white/10'}`}/>
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="max-w-3xl mx-auto px-8 py-12">
        {/* Bible passage */}
        <div className="rounded-3xl p-7 bg-gradient-to-br from-teal1/20 via-trustnavy to-trustnavy border border-teal2/40 shadow-glow relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-teal2/15 blur-3xl"/>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-teal2"/>
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Matthew 25:24-27 · ESV</p>
            </div>
            <p className="text-xl text-white font-medium leading-relaxed italic">
              "He also who had received the one talent came forward, saying, 'Master, I knew you to be a hard man… so I was afraid, and I went and hid your talent in the ground. Here, you have what is yours.'"
            </p>
            <p className="mt-4 text-base text-white/75 leading-relaxed">
              "But his master answered him, 'You wicked and slothful servant!… you ought to have invested my money with the bankers, and at my coming I should have received what was my own with interest.'"
            </p>
          </div>
        </div>

        {/* Teaching */}
        <div className="mt-8">
          <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Lesson</p>
          <h2 className="text-3xl font-extrabold text-white leading-tight mt-1">Burying what God has given you</h2>
          <div className="mt-4 prose text-base text-white/75 leading-relaxed space-y-4 max-w-none">
            <p>
              Notice what gets the servant in trouble. It isn't that he <em>lost</em> the money — he didn't. He gave back exactly what he was given. Same coin. Same weight.
            </p>
            <p>
              The Master's anger is about something deeper: <strong className="text-white">fear-driven inaction with what God entrusted to him.</strong> He was so worried about losing that he forgot the point — gifts are given to be <em>used</em>, not preserved.
            </p>
            <p>
              That's why the Master tells him: at the very least, you could have put it in the bank to earn interest. Multiplying through wisdom and investment isn't unspiritual. <strong className="text-white">It is the assignment.</strong>
            </p>
          </div>
        </div>

        {/* Real life */}
        <div className="mt-8 rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-gold"/>
            <p className="text-[10px] uppercase tracking-widest text-gold font-bold">In real life</p>
          </div>
          <p className="text-base text-white/85 leading-relaxed">
            You're 16. You have £40 from chores sat in a jar. The "buried talent" move is leaving it there for three years. The "faithful steward" move is putting it where it can grow — even £40 in a Stocks & Shares ISA at 7% average return becomes <strong className="text-teal2">£105 by age 25</strong>.
          </p>
        </div>

        {/* Quiz */}
        <div className="mt-8 rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-teal2"/>
            <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Check your understanding</p>
          </div>
          <h3 className="text-lg font-extrabold text-white">What does the Master praise the first two servants for?</h3>
          <div className="mt-4 space-y-2">
            {[
              { v: 'kept',       l: 'They kept the money perfectly safe and gave back exactly what was given' },
              { v: 'multiplied', l: 'They multiplied what they were given by putting it to work' },
              { v: 'tithed',     l: 'They gave a tenth of the talents back to the temple' },
              { v: 'shared',     l: 'They shared their talents with friends so no one risked losing money' }
            ].map(o => {
              const isPicked = picked === o.v
              const isCorrect = o.v === correct
              const reveal = picked !== null
              return (
                <button
                  key={o.v}
                  onClick={() => setPicked(o.v)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 text-left transition ${
                    !reveal ? 'bg-navydeep border-white/10 hover:border-white/25' :
                    isCorrect ? 'bg-teal2/10 border-teal2' :
                    isPicked  ? 'bg-rose-500/10 border-rose-500' :
                    'bg-navydeep border-white/10 opacity-60'
                  }`}
                >
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    !reveal ? 'border border-white/20' :
                    isCorrect ? 'bg-teal2 text-white' :
                    isPicked  ? 'bg-rose-500 text-white' :
                    'border border-white/10'
                  }`}>
                    {reveal && isCorrect ? <Check className="h-3 w-3"/> :
                     reveal && isPicked  ? <X className="h-3 w-3"/> : null}
                  </div>
                  <span className="text-sm text-white/90 font-medium">{o.l}</span>
                </button>
              )
            })}
          </div>
          {picked === correct && (
            <div className="mt-4 rounded-xl p-3 bg-teal2/10 border border-teal2/40">
              <p className="text-sm text-teal2 font-bold">Exactly. Faithful means active, not just careful.</p>
            </div>
          )}
        </div>

        {/* Action */}
        <div className="mt-10 flex items-center justify-between">
          <button className="px-5 py-3 rounded-xl bg-trustnavy border border-white/10 text-sm font-bold text-white flex items-center gap-1.5">
            <Heart className="h-4 w-4 text-rose-400 fill-rose-400"/> Save quote
          </button>
          <button onClick={onComplete} className="px-6 py-3 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center gap-2 border border-white/20">
            Continue <ArrowRight className="h-4 w-4"/>
          </button>
        </div>
      </section>
    </main>
  )
}
