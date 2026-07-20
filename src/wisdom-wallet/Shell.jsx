import { ArrowUpRight, ExternalLink, Search, Menu } from 'lucide-react'

function WWMark() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border border-white/15">
          <svg viewBox="0 0 32 32" className="h-6 w-6">
            <path d="M16 3 L29 14 L26 14 L16 6.5 L6 14 L3 14 Z" fill="#fff" opacity="0.9"/>
            <path d="M7 14 L25 14 L25 27 L20 27 L20 19 L12 19 L12 27 L7 27 Z" fill="#fff"/>
            <rect x="14" y="21" width="4" height="6" fill="#0D9488" rx="0.5"/>
          </svg>
        </div>
        <div className="absolute -top-1.5 -right-1.5 h-4 w-4 rounded-full bg-gold flex items-center justify-center border-2 border-midnight">
          <svg viewBox="0 0 12 12" className="h-2 w-2"><path d="M2 6 L5 9 L10 3" stroke="#111C30" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
        </div>
      </div>
      <div className="leading-tight">
        <p className="text-[10px] uppercase tracking-[0.25em] text-teal2 font-bold">Storehouse</p>
        <p className="text-[18px] font-black text-white tracking-tight">Wisdom Wallet</p>
      </div>
    </div>
  )
}

export function TopNav({ active = 'library' }) {
  const items = [
    { key: 'library',  label: 'Library' },
    { key: 'tracks',   label: 'Age Tracks' },
    { key: 'family',   label: 'For Families' },
    { key: 'church',   label: 'For Churches' },
    { key: 'about',    label: 'About' }
  ]
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-midnight/85 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <div className="flex items-center gap-10">
          <WWMark />
          <nav className="hidden lg:flex items-center gap-7">
            {items.map(i => (
              <button key={i.key} className={`text-sm transition ${active === i.key ? 'text-white font-bold' : 'text-white/55 hover:text-white/80 font-medium'}`}>
                {i.label}
                {active === i.key && <span className="block h-0.5 w-full bg-gradient-to-r from-teal1 to-teal2 mt-1 rounded-full" />}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-trustnavy/80 border border-white/10 hover:border-teal2/40 transition text-[12px] text-white/70">
            <Search className="h-3.5 w-3.5"/> Search modules…
          </button>
          <button className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-trustnavy/80 border border-white/10 text-[12px] font-bold text-teal2 hover:border-teal2/50 transition">
            Open Storehouse App <ExternalLink className="h-3 w-3"/>
          </button>
          <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal1 to-teal2 text-white text-[12px] font-bold shadow-glow border border-white/20 flex items-center gap-1">
            Sign in <ArrowUpRight className="h-3 w-3"/>
          </button>
          <button className="lg:hidden h-9 w-9 rounded-xl bg-trustnavy border border-white/10 flex items-center justify-center"><Menu className="h-4 w-4 text-white"/></button>
        </div>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-trustnavy/50">
      <div className="max-w-7xl mx-auto px-8 py-14 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <WWMark/>
          <p className="text-[13px] text-white/55 mt-3 max-w-xs leading-relaxed">
            The biblical money curriculum built into the Storehouse stewardship app. Trusted by 500+ Christian families across the UK.
          </p>
        </div>
        {[
          { h: 'Learn',    items: ['All modules','Kids','Teens','Adults','Family plans'] },
          { h: 'Storehouse',items: ['The app','Investing','Cards','Kingdom Capital'] },
          { h: 'Company',  items: ['About','Pricing','Churches','Contact','Privacy'] }
        ].map((c, i) => (
          <div key={i}>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-3">{c.h}</p>
            <ul className="space-y-2">
              {c.items.map(it => <li key={it} className="text-[12px] text-white/70 hover:text-white cursor-pointer">{it}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <p className="text-[11px] text-white/40">© 2026 Storehouse Group Ltd · Registered in England 14820194</p>
          <p className="text-[11px] text-white/40 italic">"Where your treasure is, there your heart will be also." — Matt. 6:21</p>
        </div>
      </div>
    </footer>
  )
}
