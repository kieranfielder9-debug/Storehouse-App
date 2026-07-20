import { Award, Sparkles, ArrowRight, Heart, Share2, Download, Star } from 'lucide-react'

export default function Completion() {
  return (
    <main className="relative overflow-hidden">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[700px] w-[700px] rounded-full bg-teal-500/20 blur-3xl pointer-events-none"/>
      <div className="absolute top-20 right-20 h-[300px] w-[300px] rounded-full bg-amber-400/15 blur-3xl pointer-events-none"/>
      <div className="absolute bottom-0 left-10 h-[300px] w-[300px] rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none"/>

      {/* Confetti shapes */}
      {[
        { l: '15%', t: '12%', c: 'bg-teal2',     r: 12 },
        { l: '85%', t: '18%', c: 'bg-gold',      r: -8 },
        { l: '8%',  t: '50%', c: 'bg-fuchsia-400', r: 24 },
        { l: '92%', t: '60%', c: 'bg-teal2',     r: -16 },
        { l: '20%', t: '78%', c: 'bg-amber-400', r: 8  },
        { l: '78%', t: '85%', c: 'bg-rose-400',  r: -20 }
      ].map((s, i) => (
        <div key={i} className={`absolute h-3 w-3 ${s.c} rounded-sm opacity-60`}
             style={{ left: s.l, top: s.t, transform: `rotate(${s.r}deg)` }}/>
      ))}

      <section className="max-w-5xl mx-auto px-8 pt-16 pb-12 relative">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal2/15 border border-teal2/40 text-teal2 text-[10px] uppercase tracking-widest font-bold">
            <Sparkles className="h-3 w-3"/> Module complete
          </span>
          <h1 className="mt-6 text-5xl lg:text-6xl font-black text-white tracking-tight">
            You finished<br/>
            <span className="bg-gradient-to-r from-teal2 via-gold to-teal2 bg-clip-text text-transparent">The Parable of the Talents.</span>
          </h1>
          <p className="mt-4 text-lg text-white/65 max-w-2xl mx-auto">
            6 lessons, 4 quizzes and 1 real-life project. You didn't just read a parable — you lived it.
          </p>
        </div>

        {/* Badge */}
        <div className="mt-12 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-teal2 to-gold blur-3xl opacity-40 scale-90"/>
            <div className="relative h-52 w-52 rounded-full bg-gradient-to-br from-teal1 via-teal2 to-gold flex items-center justify-center shadow-glow border-8 border-trustnavy">
              <div className="absolute inset-2 rounded-full border-2 border-white/30"/>
              <div className="absolute inset-6 rounded-full border border-dashed border-white/20"/>
              <div className="text-center relative z-10">
                <Award className="h-14 w-14 text-white mx-auto"/>
                <p className="text-[9px] uppercase tracking-widest font-bold text-white/90 mt-1">Wisdom Wallet</p>
                <p className="text-base font-black text-white">FAITHFUL</p>
                <p className="text-base font-black text-white -mt-1">STEWARD</p>
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 h-14 w-14 rounded-full bg-trustnavy border-4 border-midnight flex items-center justify-center">
              <Star className="h-6 w-6 text-gold fill-gold"/>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
          <CompStat label="Time invested"   value="27 min" />
          <CompStat label="Quiz score"      value="92%" pos />
          <CompStat label="Lessons aced"    value="6 / 6" />
          <CompStat label="Stewardship pts" value="+180" />
        </div>

        {/* Unlock card */}
        <div className="mt-10 rounded-3xl p-7 bg-gradient-to-br from-gold/15 via-trustnavy to-trustnavy border border-gold/40 shadow-glow relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-gold/15 blur-3xl"/>
          <div className="relative grid grid-cols-12 gap-7 items-center">
            <div className="col-span-12 lg:col-span-8">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-3.5 w-3.5 text-gold"/>
                <p className="text-[10px] uppercase tracking-widest text-gold font-bold">Unlocked in Storehouse</p>
              </div>
              <h2 className="text-2xl font-extrabold text-white">£5 stewardship reward sent to your Wisdom Wallet.</h2>
              <p className="mt-2 text-base text-white/75 leading-relaxed">
                Now choose how to multiply it. Open Storehouse to give it to a cause, invest in your first Kingdom Capital project, or save it toward your big goal.
              </p>

              <div className="mt-5 flex gap-2">
                <Pill icon={Heart}   label="Give to a cause" />
                <Pill icon={Star}    label="Invest £5"      />
                <Pill icon={Award}   label="Save it"        />
              </div>

              <button className="mt-6 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-gold to-amber-400 text-trustnavy font-extrabold text-sm shadow flex items-center gap-2 border border-white/20 w-fit">
                Open Storehouse → Choose your move <ArrowRight className="h-4 w-4"/>
              </button>
            </div>
            <div className="col-span-12 lg:col-span-4 flex justify-center">
              <div className="rounded-2xl p-5 bg-trustnavy/80 border border-white/10 shadow-2xl w-44 text-center">
                <p className="text-[9px] uppercase tracking-widest text-gold font-bold">Reward</p>
                <p className="text-5xl font-black text-white mt-1">£5</p>
                <p className="text-[10px] text-white/55 mt-1">delivered to Wisdom Wallet</p>
                <div className="mt-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  Approved by parent
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-2">
          <ActionTile icon={ArrowRight} label="Next module"     sub="Avoiding Debt Traps" highlight/>
          <ActionTile icon={Share2}      label="Share badge"    sub="Tell your church"/>
          <ActionTile icon={Download}    label="Certificate"    sub="PDF · printable"/>
          <ActionTile icon={Heart}       label="Discussion"     sub="3 talking points"/>
        </div>
      </section>
    </main>
  )
}

function CompStat({ label, value, pos }) {
  return (
    <div className="rounded-2xl p-4 bg-trustnavy border border-white/10 shadow-card text-center">
      <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold">{label}</p>
      <p className={`text-2xl font-black mt-1 ${pos ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function Pill({ icon: Icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-trustnavy/70 border border-white/10 text-[11px] font-bold text-white">
      <Icon className="h-3 w-3 text-gold"/>{label}
    </span>
  )
}

function ActionTile({ icon: Icon, label, sub, highlight }) {
  return (
    <button className={`flex flex-col items-start gap-1 p-4 rounded-2xl border transition text-left ${
      highlight
        ? 'bg-gradient-to-br from-teal1 to-teal2 border-white/20 text-white shadow-glow'
        : 'bg-trustnavy border-white/10 hover:border-teal2/40'
    }`}>
      <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${highlight ? 'bg-white/15' : 'bg-teal2/15'}`}>
        <Icon className={`h-4 w-4 ${highlight ? 'text-white' : 'text-teal2'}`}/>
      </div>
      <p className={`text-sm font-extrabold ${highlight ? 'text-white' : 'text-white'}`}>{label}</p>
      <p className={`text-[10px] ${highlight ? 'text-white/85' : 'text-white/50'}`}>{sub}</p>
    </button>
  )
}
