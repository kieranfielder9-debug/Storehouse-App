import { Award, TrendingUp, Clock, Heart, ChevronRight, Sparkles, Check, ArrowUpRight } from 'lucide-react'

export default function Parent() {
  return (
    <main>
      <section className="max-w-7xl mx-auto px-8 pt-10">
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Parent dashboard</p>
            <h1 className="text-4xl font-black text-white">Hi Michael — here's Ethan's week.</h1>
            <p className="text-white/55 mt-1.5">28 May 2026 · Weekly summary auto-saved to your Storehouse account.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-2.5 rounded-xl bg-trustnavy border border-white/10 text-[12px] font-bold text-white flex items-center gap-1.5">Switch child <ChevronRight className="h-3.5 w-3.5"/></button>
            <button className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-white text-[12px] font-bold shadow-glow border border-white/20 flex items-center gap-1.5">Open in Storehouse app <ArrowUpRight className="h-3.5 w-3.5"/></button>
          </div>
        </div>
      </section>

      {/* TOP STATS */}
      <section className="max-w-7xl mx-auto px-8 mt-7 grid grid-cols-2 md:grid-cols-4 gap-3">
        <BigStat label="Modules completed" value="2" delta="+2 vs last week" icon={Award}      color="from-teal1 to-teal2"/>
        <BigStat label="Time engaged"       value="48m" delta="+22m vs avg"    icon={Clock}     color="from-amber-500 to-orange-500"/>
        <BigStat label="Streak"             value="6 days" delta="🔥 keep going" icon={TrendingUp} color="from-fuchsia-500 to-purple-500"/>
        <BigStat label="Stewardship points" value="320" delta="+180 earned"   icon={Sparkles}  color="from-blue-500 to-indigo-500"/>
      </section>

      {/* MIDDLE GRID */}
      <section className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-12 gap-4">
        {/* Skills demonstrated */}
        <div className="col-span-12 lg:col-span-7 rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Skills demonstrated</p>
              <h3 className="text-xl font-extrabold text-white">Stewardship character map</h3>
            </div>
            <button className="text-[10px] text-teal2 font-bold flex items-center gap-0.5">Methodology <ChevronRight className="h-3 w-3"/></button>
          </div>
          <p className="text-[12px] text-white/55 mt-1">Based on Ethan's quiz answers, lesson choices, and in-app actions over the last 30 days.</p>

          <div className="mt-5 flex items-center gap-7">
            <RadarChart/>
            <div className="flex-1 space-y-2.5">
              {[
                { label: 'Generosity',   pct: 92 },
                { label: 'Patience',     pct: 78 },
                { label: 'Wisdom',       pct: 64 },
                { label: 'Diligence',    pct: 81 },
                { label: 'Contentment',  pct: 56 }
              ].map(s => (
                <div key={s.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-white/80 font-medium">{s.label}</span>
                    <span className="text-[10px] text-teal2 font-bold">{s.pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-navydeep overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2" style={{ width: `${s.pct}%` }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reward approval */}
        <div className="col-span-12 lg:col-span-5 rounded-2xl p-6 bg-gradient-to-br from-gold/15 to-trustnavy border border-gold/40 shadow-card relative overflow-hidden">
          <div className="absolute -top-10 -right-10 h-44 w-44 rounded-full bg-gold/15 blur-3xl"/>
          <div className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-gold"/>
              <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Reward ready</p>
            </div>
            <h3 className="text-xl font-extrabold text-white">Ethan earned £5 this week</h3>
            <p className="text-[12px] text-white/65 mt-1.5">For finishing "Joseph & the Storehouse Years" + "The Widow's Mite" with 90%+ quiz scores.</p>

            <div className="mt-4 rounded-xl bg-trustnavy/70 border border-white/10 p-3">
              <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Suggested next step</p>
              <p className="text-[12px] text-white/90 mt-1 leading-relaxed">Approve the £5, then let Ethan choose a cause to give it to — that's lesson 4 in action.</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <button className="py-3 rounded-xl bg-gradient-to-r from-gold to-amber-400 text-trustnavy font-extrabold text-sm shadow flex items-center justify-center gap-1.5">
                <Check className="h-4 w-4"/> Approve £5
              </button>
              <button className="py-3 rounded-xl bg-trustnavy border border-white/10 text-white font-bold text-sm">
                Customise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* RECENT ACTIVITY */}
      <section className="max-w-7xl mx-auto px-8 mt-8 grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-8 rounded-2xl bg-trustnavy border border-white/10 shadow-card overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Recent activity</p>
              <h3 className="text-lg font-extrabold text-white">Last 7 days</h3>
            </div>
            <button className="text-[10px] text-teal2 font-bold">Full log</button>
          </div>
          <div className="divide-y divide-white/5">
            <Activity emoji="💝" title="Completed: The Widow's Mite"     when="Today, 17:42" tag="Lesson" tagColor="bg-teal2/15 text-teal2 border-teal2/40"/>
            <Activity emoji="🌾" title="Completed: Joseph Saves Egypt"   when="Yesterday, 19:08" tag="Lesson" tagColor="bg-teal2/15 text-teal2 border-teal2/40"/>
            <Activity emoji="💷" title="Set aside £1 from £10 chore money" when="Tue, 16:30" tag="App action" tagColor="bg-gold/15 text-gold border-gold/40"/>
            <Activity emoji="🎯" title="Started: Saving for a Big Goal"  when="Mon, 20:15" tag="Lesson" tagColor="bg-teal2/15 text-teal2 border-teal2/40"/>
            <Activity emoji="📖" title="Watched intro to 'Joseph'"        when="Mon, 19:50" tag="Lesson" tagColor="bg-teal2/15 text-teal2 border-teal2/40"/>
          </div>
        </div>

        {/* Recommendations */}
        <div className="col-span-12 lg:col-span-4 rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
          <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Recommended next</p>
          <h3 className="text-lg font-extrabold text-white">Where to take Ethan next</h3>
          <p className="text-[11px] text-white/55 mt-1">Tailored by Wisdom Wallet AI to his completed modules and skill gaps.</p>

          <div className="mt-4 space-y-2">
            <RecCard emoji="⚖️" title="The Parable of the Talents" reason="Builds on 'Joseph' — next natural step." color="from-teal1 to-teal2"/>
            <RecCard emoji="🤲" title="Family lesson: Choosing a cause" reason="Pair with this week's £5 reward." color="from-amber-500 to-orange-500"/>
            <RecCard emoji="🎯" title="Continue: Saving for a Big Goal" reason="He's already 1 of 3 lessons in." color="from-fuchsia-400 to-purple-500"/>
          </div>
        </div>
      </section>
    </main>
  )
}

function BigStat({ label, value, delta, icon: Icon, color }) {
  return (
    <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</p>
        <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow border border-white/20`}>
          <Icon className="h-3.5 w-3.5 text-white"/>
        </div>
      </div>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-[10px] text-teal2 font-bold mt-1">{delta}</p>
    </div>
  )
}

function Activity({ emoji, title, when, tag, tagColor }) {
  return (
    <div className="flex items-center gap-3 px-6 py-3.5">
      <div className="h-9 w-9 rounded-xl bg-navydeep border border-white/10 flex items-center justify-center text-base">{emoji}</div>
      <div className="flex-1">
        <p className="text-sm text-white font-bold leading-tight">{title}</p>
        <p className="text-[10px] text-white/40 mt-0.5">{when}</p>
      </div>
      <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${tagColor}`}>{tag}</span>
    </div>
  )
}

function RecCard({ emoji, title, reason, color }) {
  return (
    <button className="w-full flex items-start gap-3 p-3 rounded-xl bg-navydeep border border-white/10 hover:border-teal2/40 text-left transition">
      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-base shadow border border-white/20 flex-shrink-0`}>{emoji}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[12px] text-white font-bold leading-tight">{title}</p>
        <p className="text-[10px] text-white/50 mt-0.5 leading-snug">{reason}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-white/40 mt-0.5"/>
    </button>
  )
}

function RadarChart() {
  const points = [
    { l: 'Generosity',  v: 92, a:  -90 },
    { l: 'Patience',    v: 78, a:  -18 },
    { l: 'Wisdom',      v: 64, a:   54 },
    { l: 'Diligence',   v: 81, a:  126 },
    { l: 'Contentment', v: 56, a:  198 }
  ]
  const r = 70
  const cx = 90, cy = 90
  const angle = (a) => (a * Math.PI) / 180
  const pt = (v, a) => [cx + Math.cos(angle(a)) * (r * v / 100), cy + Math.sin(angle(a)) * (r * v / 100)]
  const path = points.map(p => pt(p.v, p.a)).map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(' ') + 'Z'

  return (
    <svg viewBox="0 0 180 180" className="w-44 h-44 flex-shrink-0">
      <defs>
        <linearGradient id="radarFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#14B8A6" stopOpacity="0.5"/>
          <stop offset="1" stopColor="#0D9488" stopOpacity="0.2"/>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75, 1].map(s => (
        <polygon key={s}
          points={points.map(p => pt(100 * s, p.a)).map(p => p.join(',')).join(' ')}
          fill="none" stroke="#1F2A40" strokeWidth="1"/>
      ))}
      {points.map(p => {
        const [x, y] = pt(100, p.a)
        return <line key={p.l} x1={cx} y1={cy} x2={x} y2={y} stroke="#1F2A40" strokeWidth="0.5"/>
      })}
      <path d={path} fill="url(#radarFill)" stroke="#14B8A6" strokeWidth="1.5"/>
      {points.map(p => {
        const [x, y] = pt(p.v, p.a)
        return <circle key={p.l} cx={x} cy={y} r="3" fill="#14B8A6" stroke="#fff" strokeWidth="1"/>
      })}
    </svg>
  )
}
