export default function Tagchip({ color, label }) {
  return (
    <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${color}`}>
      {label}
    </span>
  )
}
