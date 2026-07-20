export default function SectionHeading({ title, right }) {
  return (
    <div className="flex items-center justify-between mb-2 px-1">
      <h3 className="text-sm font-bold text-white">{title}</h3>
      {right}
    </div>
  )
}
