export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[12px] font-semibold text-white/80 tracking-wide">
      <span>9:41</span>
      <div className="flex items-center gap-1.5">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-1.5 w-1 rounded-sm bg-white/80" />)}
        </div>
        <span className="text-[10px]">5G</span>
        <div className="ml-1 h-2.5 w-5 rounded-[3px] border border-white/70 relative">
          <div className="absolute inset-0.5 right-1.5 bg-white/80 rounded-[1px]" />
        </div>
      </div>
    </div>
  )
}
