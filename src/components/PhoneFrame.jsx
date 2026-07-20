export default function PhoneFrame({ children }) {
  return (
    <div className="relative z-10">
      <div className="rounded-[58px] p-[10px] bg-gradient-to-b from-[#1a2236] via-[#0d1322] to-[#0a0e18] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] border border-white/5">
        <div className="relative rounded-[48px] overflow-hidden bg-midnight w-[390px] h-[820px] flex flex-col">
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 h-7 w-32 rounded-full bg-black/90" />
          {children}
        </div>
      </div>
    </div>
  )
}
