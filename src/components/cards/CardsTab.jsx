import { useState } from 'react'
import DebitCard from './DebitCard.jsx'
import ControlCenter from './ControlCenter.jsx'

export default function CardsTab({ flashToast, onOpenCardOptions }) {
  const [freeze, setFreeze] = useState({ p: false, t: false })

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h2 className="text-xl font-extrabold text-white">Household Card Manager</h2>
        <p className="text-xs text-white/40 mt-1">2 active cards · Gladstone family</p>
      </div>

      <DebitCard
        variant="primary"
        name="Michael Gladstone"
        subtitle="Storehouse Primary"
        number="•••• •••• •••• 4421"
        frozen={freeze.p}
        onClick={() => onOpenCardOptions?.({
          variant: 'primary',
          name: 'Michael Gladstone',
          subtitle: 'Storehouse Primary',
          number: '•••• •••• •••• 4421'
        })}
      />

      <DebitCard
        variant="teen"
        name="Ethan (Wisdom Wallet)"
        subtitle="Chore Rewards & Curriculum Track Active"
        number="•••• •••• •••• 9120"
        frozen={freeze.t}
        onClick={() => onOpenCardOptions?.({
          variant: 'teen',
          name: 'Ethan (Wisdom Wallet)',
          subtitle: 'Wisdom Wallet',
          number: '•••• •••• •••• 9120'
        })}
      />

      <ControlCenter freeze={freeze} setFreeze={setFreeze} flashToast={flashToast} />
    </div>
  )
}
