import { ChevronRight, Clock, Award, PlayCircle, Check, Lock, BookOpen, Users, Sparkles, Heart, ArrowUpRight, MessageSquare, ChevronLeft } from 'lucide-react'
import { MODULES } from './data.js'

export default function Module({ moduleId = 't1', onBack, onStartLesson }) {
  const m = MODULES.find(x => x.id === moduleId) || MODULES[3]

  const lessons = [
    { n: 1, title: 'A master, three servants, three bags', done: true,  duration: '4 min', verse: 'Matthew 25:14-15' },
    { n: 2, title: 'Faithful with little, faithful with much',  done: true,  duration: '5 min', verse: 'Luke 16:10' },
    { n: 3, title: 'Burying what God has given you',           done: false, duration: '4 min', verse: 'Matthew 25:24-27', current: true },
    { n: 4, title: 'Multiplying with risk vs greed',            done: false, duration: '5 min', verse: 'Ecc. 11:1-2' },
    { n: 5, title: 'Your talents in 2026',                     done: false, duration: '4 min', verse: 'Romans 12:6-8' },
    { n: 6, title: 'Project: Invest £5 with Storehouse',       done: false, duration: '3 min', verse: 'James 2:14-17', lock: false, project: true }
  ]

  return (
    <main>
      <div className="max-w-7xl mx-auto px-8 pt-8">
        <button onClick={onBack} className="text-[11px] text-white/55 font-bold flex items-center gap-1 hover:text-white">
          <ChevronLeft className="h-3 w-3"/> Library / Teens / {m.title}
        </button>
      </div>

      <section className="max-w-7xl mx-auto px-8 mt-6">
        <div className="grid grid-cols-12 gap-8">
          {/* Left: hero */}
          <div className="col-span-12 lg:col-span-8">
            <div className={`relative rounded-3xl p-10 bg-gradient-to-br ${m.color} border border-white/20 shadow-glow overflow-hidden`}>
              <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-white/10 blur-2xl"/>
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/20 backdrop-blur text-white text-[10px] uppercase tracking-widest font-bold">
                  Teens · 25 min · 6 lessons
                </span>
                <h1 className="mt-4 text-5xl font-black text-white leading-[1.05] tracking-tight">{m.title}</h1>
                <p className="mt-3 text-white/90 text-base font-semibold italic">{m.verse}</p>
                <p className="mt-4 text-white/85 text-base leading-relaxed max-w-2xl">{m.desc}</p>
                <div className="mt-6 flex items-center gap-3">
                  <button onClick={onStartLesson} className="px-5 py-3 rounded-xl bg-white text-trustnavy font-extrabold text-sm shadow flex items-center gap-2">
                    <PlayCircle className="h-4 w-4"/> Continue lesson 3
                  </button>
                  <button className="px-5 py-3 rounded-xl bg-black/20 backdrop-blur border border-white/30 text-white font-bold text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4"/> Save
                  </button>
                </div>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {['J','S','A','M'].map((l, i) => (
                      <div key={i} className={`h-7 w-7 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center ${['bg-rose-500','bg-blue-500','bg-amber-500','bg-fuchsia-500'][i]}`}>{l}</div>
                    ))}
                  </div>
                  <p className="text-[11px] text-white/85">1,240 teens finished this module · 4.9★ (312)</p>
                </div>
              </div>
            </div>

            {/* What you'll learn */}
            <div className="mt-6 rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">What you'll learn</p>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {[
                  'What "talents" really means (it\'s more than money)',
                  'Why burying gifts disappoints the Master',
                  'How to identify YOUR talents at age 16',
                  'How to take Kingdom risks vs sinful gambles',
                  'A real plan to multiply one talent in 90 days',
                  'How to invest your first £5 the right way'
                ].map(t => (
                  <div key={t} className="flex items-start gap-2">
                    <div className="h-5 w-5 rounded-full bg-teal2/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="h-3 w-3 text-teal2"/>
                    </div>
                    <span className="text-[12px] text-white/80 leading-snug">{t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lessons */}
            <div className="mt-6 rounded-2xl bg-trustnavy border border-white/10 shadow-card overflow-hidden">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-white/5">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Lessons</p>
                  <h3 className="text-lg font-extrabold text-white">2 of 6 complete</h3>
                </div>
                <div className="w-32 h-1.5 rounded-full bg-navydeep overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2" style={{ width: '33%' }}/>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {lessons.map(l => (
                  <div key={l.n} className={`flex items-center gap-4 px-6 py-3.5 ${l.current ? 'bg-teal2/5' : ''}`}>
                    <div className={`h-9 w-9 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                      l.done ? 'bg-teal2/15 text-teal2 border border-teal2/40' :
                      l.current ? 'bg-gradient-to-br from-teal1 to-teal2 text-white shadow-glow border border-white/20' :
                      'bg-white/5 text-white/40 border border-white/10'
                    }`}>
                      {l.done ? <Check className="h-4 w-4"/> : l.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white font-bold leading-tight">{l.title}</p>
                        {l.project && <span className="text-[9px] uppercase tracking-widest font-bold text-gold bg-gold/15 border border-gold/40 px-1.5 py-0.5 rounded">Project</span>}
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5">{l.verse} · {l.duration}</p>
                    </div>
                    {l.current && <span className="text-[10px] font-bold text-teal2 uppercase tracking-wider">Up next</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: aside */}
          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="rounded-2xl p-5 bg-gradient-to-br from-gold/15 to-trustnavy border border-gold/40 shadow-card">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-gold"/>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Storehouse integration</p>
              </div>
              <h3 className="text-base font-extrabold text-white">When you finish this module</h3>
              <div className="mt-3 space-y-2.5">
                <Reward icon={Award}    label="Earn the 'Faithful Steward' badge"/>
                <Reward icon={BookOpen} label="Unlock 'Multiply £5' project in app"/>
                <Reward icon={Heart}    label="Receive £5 stewardship reward"/>
                <Reward icon={Users}    label="Parent gets a progress notification"/>
              </div>
            </div>

            <div className="rounded-2xl p-5 bg-trustnavy border border-white/10 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Discussion guide</p>
              <h3 className="text-base font-extrabold text-white mt-1">Talk it over with a parent</h3>
              <p className="text-[12px] text-white/55 mt-2">3 conversation prompts to use this week.</p>
              <button className="mt-3 w-full py-2.5 rounded-xl bg-trustnavy border border-white/10 hover:border-teal2/40 transition text-[12px] font-bold text-white flex items-center justify-center gap-2">
                <MessageSquare className="h-3.5 w-3.5 text-teal2"/> Download PDF guide
              </button>
            </div>

            <div className="rounded-2xl p-5 bg-trustnavy border border-white/10 shadow-card">
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Next up</p>
              <NextModule emoji="🔓" title="Avoiding Debt Traps" duration="18 min"/>
              <NextModule emoji="💼" title="Your First Job & Tithing" duration="22 min"/>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}

function Reward({ icon: Icon, label }) {
  return (
    <div className="flex items-start gap-2">
      <div className="h-7 w-7 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="h-3.5 w-3.5 text-gold"/>
      </div>
      <span className="text-[12px] text-white/85 leading-snug">{label}</span>
    </div>
  )
}

function NextModule({ emoji, title, duration }) {
  return (
    <button className="mt-2 w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/5 text-left">
      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-rose-500 to-pink-500 flex items-center justify-center text-base shadow border border-white/20">{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] font-bold text-white leading-tight truncate">{title}</p>
        <p className="text-[10px] text-white/40">{duration}</p>
      </div>
      <ChevronRight className="h-3.5 w-3.5 text-white/40"/>
    </button>
  )
}
