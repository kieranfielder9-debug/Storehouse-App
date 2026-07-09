import { useState } from 'react'
import { User, Cake, Mail, Phone, Fingerprint, Building2, Check, Plus, Landmark, ShieldCheck } from 'lucide-react'
import ProfileScreen from './ProfileScreen.jsx'
import ToggleRow from '../ui/ToggleRow.jsx'
import Label from '../ui/Label.jsx'
import { useStewardship } from '../../backend/useStewardship.js'

const BANKS = [
  { name: 'Monzo',     last: '•• 4421', color: 'from-pink-500 to-rose-500',    connected: true },
  { name: 'Halifax',   last: '•• 0118', color: 'from-blue-500 to-indigo-500',  connected: true },
  { name: 'Starling',  last: '•• 9920', color: 'from-purple-500 to-fuchsia-500', connected: false }
]

export default function AccountView({ onBack, flashToast }) {
  const [faceId, setFaceId] = useState(true)
  const [banks, setBanks] = useState(BANKS)
  const { plaid, provider } = useStewardship()

  const toggleBank = (i) => {
    setBanks(b => b.map((x, idx) => idx === i ? { ...x, connected: !x.connected } : x))
    flashToast(banks[i].connected ? `${banks[i].name} disconnected` : `${banks[i].name} connected`)
  }

  return (
    <ProfileScreen title="Account" onBack={onBack}>
      <Label>Personal Details</Label>
      <div className="mt-2 rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        <DetailRow icon={User}  label="Full Name"     value="Michael Gladstone" />
        <DetailRow icon={Cake}  label="Date of Birth" value="14 March 1986" />
        <DetailRow icon={Mail}  label="Email"         value="michael.gladstone@example.com" />
        <DetailRow icon={Phone} label="Phone"         value="+44 7700 900132" />
      </div>

      <div className="mt-5 rounded-2xl bg-trustnavy border border-white/10 overflow-hidden">
        <ToggleRow
          icon={Fingerprint}
          label="Enable Face ID"
          value={faceId}
          onToggle={() => {
            setFaceId(v => !v)
            flashToast(faceId ? 'Face ID disabled' : 'Face ID enabled')
          }}
        />
      </div>

      <div className="mt-6 flex items-center justify-between mb-2">
        <Label>Bank Connections</Label>
        <button className="text-[10px] text-teal2 font-semibold flex items-center gap-0.5">
          <Plus className="h-3 w-3" /> Add bank
        </button>
      </div>
      <div className="rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
        {banks.map((b, i) => (
          <div key={b.name} className="flex items-center gap-3 px-4 py-3">
            <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${b.color} flex items-center justify-center text-white font-extrabold text-xs shadow-md`}>
              {b.name.slice(0, 1)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white font-bold leading-tight">{b.name}</p>
              <p className="text-[10px] text-white/40 mt-0.5">{b.last}</p>
            </div>
            <button
              onClick={() => toggleBank(i)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition ${
                b.connected
                  ? 'bg-teal2/15 text-teal2 border-teal2/40'
                  : 'bg-white/5 text-white/60 border-white/10'
              }`}
            >
              {b.connected
                ? <span className="flex items-center gap-1"><Check className="h-3 w-3" />Linked</span>
                : 'Connect'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-5 rounded-2xl bg-trustnavy border border-white/10 overflow-hidden">
        <ToggleRow
          icon={Landmark}
          label={plaid.connected ? `Stewardship Source · ${plaid.institution}` : 'Stewardship Source (Plaid)'}
          value={plaid.connected}
          onToggle={async () => {
            if (plaid.connected) { await provider.disconnectPlaid(); flashToast('Stewardship source disconnected') }
            else { await provider.connectPlaid(); flashToast('Stewardship source connected') }
          }}
        />
      </div>

      <div className="mt-4 flex items-start gap-2 text-[10px] text-white/40 leading-snug px-1">
        <ShieldCheck className="h-3 w-3 mt-0.5 flex-shrink-0 text-teal2/70" />
        <p>We do not sell your data. Your financial stewardship is private.</p>
      </div>

      <button
        onClick={() => flashToast('Profile saved')}
        className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
      >
        Save Changes
      </button>
    </ProfileScreen>
  )
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
        <Icon className="h-4 w-4 text-white/70" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] uppercase tracking-widest text-white/40">{label}</p>
        <p className="text-sm text-white font-semibold truncate">{value}</p>
      </div>
      <button className="text-[10px] text-teal2 font-semibold">Edit</button>
    </div>
  )
}
