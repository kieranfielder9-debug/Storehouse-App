import { ArrowUpRight, PlayCircle, Sparkles, ChevronRight, Award, Clock, Star, Users, Quote } from 'lucide-react'
import { MODULES, TRACKS, STATS } from './data.js'

export default function Home({ onOpenModule }) {
  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-teal-500/15 blur-3xl pointer-events-none"/>
        <div className="absolute bottom-0 right-1/3 h-[300px] w-[300px] rounded-full bg-amber-400/10 blur-3xl pointer-events-none"/>

        <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 relative">
          <div className="grid grid-cols-12 gap-10 items-center">
            <div className="col-span-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal2/15 border border-teal2/40 text-teal2 text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="h-3 w-3"/> Powered by Storehouse
              </span>
              <h1 className="mt-5 text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight">
                Money wisdom,<br/>
                <span className="bg-gradient-to-r from-teal2 via-gold to-teal2 bg-clip-text text-transparent">the Kingdom way.</span>
              </h1>
              <p className="mt-5 text-lg text-white/65 leading-relaxed max-w-xl">
                Biblical stewardship modules for kids, teens and adults — taught one bite-sized lesson at a time and applied live inside the Storehouse banking app.
              </p>
              <div className="mt-7 flex items-center gap-3">
                <button className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow border border-white/20 flex items-center gap-2">
                  Start your first module <ArrowUpRight className="h-4 w-4"/>
                </button>
                <button className="px-5 py-3.5 rounded-2xl bg-trustnavy/80 border border-white/10 text-white font-bold text-sm flex items-center gap-2 hover:border-teal2/40">
                  <PlayCircle className="h-4 w-4 text-teal2"/> Watch 90-sec preview
                </button>
              </div>

              <div className="mt-10 grid grid-cols-4 gap-6">
                <Stat label="Active learners" value={STATS.learners}/>
                <Stat label="Families"        value={STATS.families}/>
                <Stat label="Modules"         value={STATS.modules}/>
                <Stat label="Completions"     value={STATS.completions}/>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-5">
              <HeroIllustration/>
            </div>
          </div>
        </div>
      </section>

      {/* TRACK SELECTOR */}
      <section className="max-w-7xl mx-auto px-8 mt-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {TRACKS.map(t => (
            <button key={t.key} className="group rounded-2xl p-5 bg-trustnavy border border-white/10 hover:border-teal2/40 transition text-left">
              <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow border border-white/20`}>
                <t.icon className="h-5 w-5 text-white"/>
              </div>
              <p className="mt-3 text-base font-extrabold text-white">{t.label}</p>
              <p className="text-[11px] text-white/45">{t.age}</p>
              <p className="mt-3 text-[11px] font-bold text-teal2 flex items-center gap-1 group-hover:gap-2 transition-all">Browse track <ChevronRight className="h-3 w-3"/></p>
            </button>
          ))}
        </div>
      </section>

      {/* FEATURED MODULE */}
      <section className="max-w-7xl mx-auto px-8 mt-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Featured this week</p>
            <h2 className="text-2xl font-extrabold text-white">For your teenager</h2>
          </div>
          <button className="text-[11px] text-teal2 font-bold flex items-center gap-0.5">View all teen modules <ChevronRight className="h-3 w-3"/></button>
        </div>
        <FeaturedCard module={MODULES.find(m => m.id === 't1')} onOpen={onOpenModule}/>
      </section>

      {/* MODULE GRID */}
      <section className="max-w-7xl mx-auto px-8 mt-16">
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">All modules</p>
            <h2 className="text-2xl font-extrabold text-white">Browse the full library</h2>
          </div>
          <div className="flex gap-1.5 bg-trustnavy rounded-xl p-1 border border-white/10">
            {['All','Kids','Teens','Adults'].map((f, i) => (
              <button key={f} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${i === 0 ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow' : 'text-white/55'}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map(m => <ModuleCard key={m.id} module={m} onOpen={onOpenModule}/>)}
        </div>
      </section>

      {/* INTEGRATION STRIP */}
      <section className="max-w-7xl mx-auto px-8 mt-20">
        <div className="rounded-3xl p-10 bg-gradient-to-br from-trustnavy via-trustnavy to-navydeep border border-white/10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-teal2/10 blur-3xl"/>
          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl"/>
          <div className="relative grid grid-cols-12 gap-10 items-center">
            <div className="col-span-12 lg:col-span-7">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/15 border border-gold/40 text-gold text-[10px] uppercase tracking-widest font-bold">
                <Sparkles className="h-3 w-3"/> Lesson + Application
              </span>
              <h3 className="mt-4 text-3xl font-black text-white leading-tight">Every lesson unlocks something inside the Storehouse app.</h3>
              <p className="mt-3 text-base text-white/65 leading-relaxed max-w-2xl">
                Finish "The Widow's Mite" and your child gets a £5 reward to give to a cause they choose.
                Complete "Avoiding Debt Traps" and your teen unlocks the credit-coaching tools.
                Wisdom isn't theory — it's practiced.
              </p>
              <div className="mt-5 flex gap-3">
                <Pill icon={Award} label="Earn badges"/>
                <Pill icon={Star}  label="Unlock features"/>
                <Pill icon={Clock} label="Build streaks"/>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 flex justify-center">
              <PhoneIllustration/>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="max-w-7xl mx-auto px-8 mt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Testimonial
            quote="My 9-year-old asked to tithe his birthday money. We've never even said the word 'tithe' at home. Whatever Wisdom Wallet is doing — it's working."
            who="Rachel Davies"
            role="Parent · Leeds"
            color="from-teal1 to-teal2"
            initial="R"
          />
          <Testimonial
            quote="Best discipleship tool we've added to youth ministry in five years. Practical, biblical, and the kids actually want to do it."
            who="Pastor James Whitaker"
            role="Huddersfield Christian Fellowship"
            color="from-amber-500 to-orange-500"
            initial="J"
          />
          <Testimonial
            quote="I'm 38 and learned more about generous giving in three modules than in twenty years of church. Beautifully done."
            who="Naomi Okafor"
            role="Member · Bradford"
            color="from-fuchsia-500 to-purple-500"
            initial="N"
          />
        </div>
      </section>
    </main>
  )
}

function Stat({ label, value }) {
  return (
    <div>
      <p className="text-2xl font-extrabold text-white">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-0.5">{label}</p>
    </div>
  )
}

function HeroIllustration() {
  return (
    <div className="relative">
      <div className="aspect-[5/4] rounded-3xl bg-gradient-to-br from-teal1/30 via-trustnavy to-trustnavy border border-white/10 shadow-2xl overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.3),transparent_60%)]"/>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(244,197,106,0.2),transparent_60%)]"/>

        {/* Decorative module cards stacked */}
        <div className="absolute inset-0 p-8 flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <FloatingCard rotate="-rotate-6" top="0" left="0" emoji="⚖️" title="Talents" track="Teens" color="from-teal1 to-teal2"/>
            <FloatingCard rotate="rotate-3" top="20" left="40" emoji="🌾" title="Joseph & Storehouses" track="Kids" color="from-amber-400 to-orange-500"/>
            <FloatingCard rotate="-rotate-2" top="48" left="10" emoji="⏳" title="Eternal Investing" track="Adults" color="from-blue-500 to-indigo-500"/>
          </div>
        </div>
      </div>
      {/* Floating badge */}
      <div className="absolute -bottom-5 -left-5 rounded-2xl px-4 py-3 bg-trustnavy border border-gold/40 shadow-glow flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gold/15 flex items-center justify-center border border-gold/40">
          <Award className="h-4 w-4 text-gold"/>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Earned</p>
          <p className="text-xs font-bold text-white">Faithful Steward · Ethan</p>
        </div>
      </div>
    </div>
  )
}

function FloatingCard({ rotate, top, left, emoji, title, track, color }) {
  return (
    <div className={`absolute ${rotate} bg-trustnavy/95 backdrop-blur border border-white/10 rounded-2xl p-3 shadow-2xl w-64`}
         style={{ top: `${top}%`, left: `${left}%` }}>
      <div className="flex items-center gap-2.5">
        <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center text-xl shadow border border-white/20`}>
          {emoji}
        </div>
        <div>
          <p className="text-[9px] uppercase tracking-widest text-white/40">Module · {track}</p>
          <p className="text-sm font-bold text-white">{title}</p>
        </div>
      </div>
      <div className="mt-2 h-1 rounded-full bg-navydeep overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-teal1 to-teal2" style={{ width: '60%' }}/>
      </div>
    </div>
  )
}

function FeaturedCard({ module, onOpen }) {
  return (
    <div className="rounded-3xl p-8 bg-gradient-to-br from-teal1/20 via-trustnavy to-trustnavy border border-teal2/30 shadow-glow relative overflow-hidden">
      <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-teal2/10 blur-3xl"/>
      <div className="relative grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 lg:col-span-8">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal2/20 border border-teal2/40 text-teal2 text-[10px] uppercase tracking-widest font-bold">Teens · 25 min</span>
          <h3 className="mt-3 text-3xl font-black text-white leading-tight">{module.title}</h3>
          <p className="mt-2 text-base text-white/70 leading-relaxed max-w-xl">{module.desc}</p>
          <div className="mt-4 flex items-center gap-4 text-[11px] text-white/55">
            <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-teal2"/> 6 lessons</span>
            <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-teal2"/> Badge: {module.badge}</span>
            <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-teal2"/> 1,240 finished</span>
          </div>
          <button onClick={onOpen} className="mt-5 px-5 py-3 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow border border-white/20 flex items-center gap-2 w-fit">
            Begin module <ArrowUpRight className="h-4 w-4"/>
          </button>
        </div>
        <div className="col-span-12 lg:col-span-4 flex justify-center">
          <div className={`aspect-square rounded-3xl bg-gradient-to-br ${module.color} flex items-center justify-center text-8xl shadow-2xl border border-white/20 w-48`}>
            {module.emoji}
          </div>
        </div>
      </div>
    </div>
  )
}

function ModuleCard({ module, onOpen }) {
  return (
    <button onClick={onOpen} className="group text-left rounded-2xl bg-trustnavy border border-white/10 hover:border-teal2/40 transition shadow-card overflow-hidden">
      <div className={`h-32 bg-gradient-to-br ${module.color} relative flex items-center justify-center`}>
        <span className="text-6xl">{module.emoji}</span>
        <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-white border border-white/15">
          {module.track === 'kids' ? 'Kids' : module.track === 'teens' ? 'Teens' : 'Adults'}
        </span>
        <span className="absolute top-2 right-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-black/40 backdrop-blur text-white border border-white/15">{module.duration}</span>
      </div>
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">{module.verse}</p>
        <h4 className="mt-1 text-base font-extrabold text-white leading-tight">{module.title}</h4>
        <p className="mt-1.5 text-[11px] text-white/55 line-clamp-2 leading-relaxed">{module.desc}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] text-white/40 flex items-center gap-1"><Clock className="h-3 w-3"/> {module.lessons} lessons</span>
          <span className="text-[11px] font-bold text-teal2 flex items-center gap-1 group-hover:gap-1.5 transition-all">Open <ChevronRight className="h-3 w-3"/></span>
        </div>
      </div>
    </button>
  )
}

function Pill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-trustnavy/70 border border-white/10 text-[11px] font-bold text-white">
      <Icon className="h-3 w-3 text-teal2"/>{label}
    </span>
  )
}

function PhoneIllustration() {
  return (
    <div className="relative">
      <div className="rounded-[36px] p-[6px] bg-gradient-to-b from-[#1a2236] to-[#0a0e18] shadow-2xl">
        <div className="rounded-[30px] overflow-hidden bg-midnight w-[200px] h-[400px] relative">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 h-4 w-20 rounded-full bg-black/90 z-10"/>
          <div className="p-3 pt-7">
            <p className="text-[7px] uppercase tracking-widest text-white/40 font-bold">Ethan · Wisdom Wallet</p>
            <p className="text-xs font-extrabold text-white mt-0.5">Modules this week</p>
            <div className="mt-3 space-y-1.5">
              {[
                { name: 'Widow\'s Mite',     done: true,  color: 'from-amber-400 to-orange-500',   emoji: '💝' },
                { name: 'Joseph Saves',      done: true,  color: 'from-teal1 to-teal2',            emoji: '🌾' },
                { name: 'Big Goals',         done: false, color: 'from-fuchsia-400 to-purple-500', emoji: '🎯' }
              ].map(m => (
                <div key={m.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-trustnavy border border-white/10">
                  <div className={`h-6 w-6 rounded-md bg-gradient-to-br ${m.color} flex items-center justify-center text-[10px]`}>{m.emoji}</div>
                  <p className="flex-1 text-[8px] text-white font-bold">{m.name}</p>
                  {m.done
                    ? <span className="text-[7px] font-bold text-teal2">✓ Done</span>
                    : <span className="text-[7px] text-white/40">2/3</span>
                  }
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-lg bg-gradient-to-br from-gold/20 to-trustnavy border border-gold/40 p-2">
              <p className="text-[7px] uppercase tracking-widest text-gold font-bold">Reward ready</p>
              <p className="text-[9px] font-bold text-white mt-0.5">Approve £5 for Ethan</p>
              <button className="mt-1.5 w-full py-1 rounded-md bg-gradient-to-r from-gold to-amber-400 text-[8px] font-extrabold text-trustnavy">Approve</button>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 h-14 w-14 rounded-full bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border-4 border-midnight rotate-12">
        <Award className="h-6 w-6 text-white"/>
      </div>
    </div>
  )
}

function Testimonial({ quote, who, role, color, initial }) {
  return (
    <div className="rounded-2xl p-6 bg-trustnavy border border-white/10 shadow-card">
      <Quote className="h-5 w-5 text-teal2 mb-3"/>
      <p className="text-sm text-white/85 leading-relaxed">"{quote}"</p>
      <div className="mt-4 flex items-center gap-2.5 pt-4 border-t border-white/5">
        <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-extrabold text-sm shadow border border-white/20`}>{initial}</div>
        <div>
          <p className="text-sm text-white font-bold leading-tight">{who}</p>
          <p className="text-[10px] text-white/40">{role}</p>
        </div>
      </div>
    </div>
  )
}
