export default function Stat({ label, value, pos }) {
  return (
    <div className="rounded-xl bg-navydeep border border-white/10 p-3 text-center">
      <p className="text-[9px] uppercase tracking-widest text-white/40">{label}</p>
      <p className={`text-base font-bold mt-1 ${pos ? 'text-emerald-400' : 'text-white'}`}>{value}</p>
    </div>
  )
}
