export default function StorehouseMark() {
  return (
    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal1 to-teal2 flex items-center justify-center shadow-glow border border-white/15">
      <svg viewBox="0 0 32 32" className="h-6 w-6">
        <defs>
          <linearGradient id="rooflite" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0.7" />
          </linearGradient>
        </defs>
        <path d="M16 3 L29 14 L26 14 L16 6.5 L6 14 L3 14 Z" fill="url(#rooflite)" />
        <path d="M7 14 L25 14 L25 27 L20 27 L20 19 L12 19 L12 27 L7 27 Z" fill="#fff" opacity="0.95" />
        <rect x="14" y="21" width="4" height="6" fill="#0D9488" rx="0.5" />
      </svg>
    </div>
  )
}
