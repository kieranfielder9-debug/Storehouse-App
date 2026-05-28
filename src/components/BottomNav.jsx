export default function BottomNav({ tabs, active, onChange }) {
  return (
    <nav className="absolute bottom-0 left-0 right-0 px-4 pb-5 pt-2 bg-gradient-to-t from-midnight via-midnight/95 to-transparent">
      <div className="bg-trustnavy/90 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-between px-2 py-2 shadow-card">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = active === key
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-1.5 rounded-xl transition-all ${
                isActive ? 'text-white' : 'text-white/40'
              }`}
            >
              <div
                className={`h-8 w-8 flex items-center justify-center rounded-xl transition-all ${
                  isActive ? 'bg-gradient-to-br from-teal1 to-teal2 shadow-glow' : ''
                }`}
              >
                <Icon
                  className={`h-4 w-4 ${isActive ? 'text-white' : 'text-white/50'}`}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
