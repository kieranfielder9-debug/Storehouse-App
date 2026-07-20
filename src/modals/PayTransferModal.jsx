import { useState } from 'react'
import { X, QrCode, Search, ArrowRight, Users, CreditCard } from 'lucide-react'

const CONTACTS = [
  { id: 'sarah',   name: 'Sarah Bennett',    sub: 'Last sent: £20 · Fri', initial: 'S', color: 'from-pink-500 to-rose-500' },
  { id: 'tom',     name: 'Tom Whitaker',     sub: 'Tap to pay',           initial: 'T', color: 'from-amber-500 to-amber-600' },
  { id: 'church',  name: 'Hud. Christian F.',sub: 'Standing order active',initial: 'H', color: 'from-teal-500 to-emerald-500' },
  { id: 'natalie', name: 'Natalie Howard',   sub: 'Owes £14 (split)',     initial: 'N', color: 'from-blue-500 to-indigo-500' },
  { id: 'leo',     name: 'Leo Ramirez',      sub: 'Tap to pay',           initial: 'L', color: 'from-fuchsia-500 to-purple-500' }
]

export default function PayTransferModal({ onClose, flashToast }) {
  const [mode, setMode] = useState('pay') // pay | qr
  const [amount, setAmount] = useState('')
  const [selected, setSelected] = useState(null)

  return (
    <div className="absolute inset-0 z-[55]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 max-h-[92%] bg-trustnavy rounded-t-3xl border-t border-white/10 shadow-2xl animate-slideUp flex flex-col">
        <div className="pt-2 pb-1 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="px-5 pb-3 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-white">Pay or Transfer</h2>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="px-5">
          <div className="flex items-center gap-1 bg-navydeep p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setMode('pay')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'pay' ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow' : 'text-white/50'
              }`}
            ><Users className="h-3 w-3" /> Contact</button>
            <button
              onClick={() => setMode('qr')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                mode === 'qr' ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow' : 'text-white/50'
              }`}
            ><QrCode className="h-3 w-3" /> QR Code</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-8 mt-4">
          {mode === 'pay' && (
            <>
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-navydeep border border-white/10">
                <Search className="h-4 w-4 text-white/40" />
                <input
                  placeholder="Search name, sort code or IBAN"
                  className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/30"
                />
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Recent</p>
                <div className="rounded-2xl bg-navydeep border border-white/10 divide-y divide-white/5 overflow-hidden">
                  {CONTACTS.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition ${
                        selected === c.id ? 'bg-teal2/10' : 'hover:bg-white/[0.03]'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${c.color} flex items-center justify-center text-white font-extrabold shadow border border-white/20`}>
                        {c.initial}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-bold leading-tight truncate">{c.name}</p>
                        <p className="text-[10px] text-white/40 truncate">{c.sub}</p>
                      </div>
                      {selected === c.id && <span className="text-[10px] font-bold text-teal2">Selected</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-2">Amount</p>
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-navydeep border border-white/10">
                  <span className="text-white/40 font-bold text-lg">£</span>
                  <input
                    value={amount}
                    onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                    placeholder="0.00"
                    inputMode="decimal"
                    className="flex-1 bg-transparent text-2xl font-extrabold text-white placeholder-white/20 focus:outline-none"
                  />
                </div>
              </div>

              <button
                disabled={!selected || !amount}
                onClick={() => { flashToast(`£${amount} sent`); onClose() }}
                className={`mt-5 w-full py-3.5 rounded-2xl font-bold text-sm transition flex items-center justify-center gap-2 ${
                  selected && amount
                    ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow'
                    : 'bg-white/5 text-white/30 cursor-not-allowed'
                }`}
              >
                Send {amount && `£${amount}`} <ArrowRight className="h-4 w-4" />
              </button>
            </>
          )}

          {mode === 'qr' && (
            <div className="text-center pt-3">
              <div className="mx-auto h-48 w-48 rounded-3xl bg-white p-4 shadow-2xl">
                <FauxQR />
              </div>
              <p className="text-base font-bold text-white mt-4">Your pay-me code</p>
              <p className="text-[11px] text-white/50 mt-1">Scan to send Michael £ instantly</p>

              <button
                onClick={() => flashToast('Scanner opened')}
                className="mt-5 w-full py-3.5 rounded-2xl bg-trustnavy border border-white/10 text-white font-bold text-sm flex items-center justify-center gap-2"
              >
                <QrCode className="h-4 w-4 text-teal2" /> Scan someone's QR
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FauxQR() {
  // tile a grid; deterministic pattern
  const grid = Array.from({ length: 19 * 19 }, (_, i) => ((i * 31) % 7 < 3) || (i % 19 < 2) || (Math.floor(i / 19) < 2))
  return (
    <div className="grid grid-cols-19 gap-px h-full w-full" style={{ gridTemplateColumns: 'repeat(19, 1fr)' }}>
      {grid.map((on, i) => (
        <div key={i} className={on ? 'bg-trustnavy' : 'bg-white'} />
      ))}
    </div>
  )
}
