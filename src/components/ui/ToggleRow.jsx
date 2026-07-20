export default function ToggleRow({ icon: Icon, label, value, onToggle }) {
  return (
    <button onClick={onToggle} className="w-full flex items-center gap-3 px-4 py-3 text-left">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className="h-4 w-4 text-white/70" />
      </div>
      <span className="text-sm text-white/90 font-medium flex-1">{label}</span>
      <div
        className={`h-6 w-10 rounded-full transition-all relative ${
          value ? 'bg-gradient-to-r from-teal1 to-teal2' : 'bg-white/15'
        }`}
      >
        <div
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${
            value ? 'left-[18px]' : 'left-0.5'
          }`}
        />
      </div>
    </button>
  )
}
