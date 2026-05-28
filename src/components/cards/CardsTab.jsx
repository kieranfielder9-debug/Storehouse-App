import { useState } from 'react'
import DebitCard from './DebitCard.jsx'
import ControlCenter from './ControlCenter.jsx'

export default function CardsTab({ flashToast }) {
  const [freeze, setFreeze] = useState({ p: false, t: false })

  return (
    <div className="space-y-5 pt-2">
      <div>
        <h2 className="text-xl font-extrabold text-white">Household Card Manager</h2>
        <p className="text-xs text-white/40 mt-1">2 active cards • Gladders family</p>
      </div>

      <DebitCard
        variant="primary"
        name="Michael Gladders"
        subtitle="Storehouse Primary"
        number="•••• •••• •••• 4421"
        frozen={freeze.p}
      />

      <DebitCard
        variant="teen"
        name="Ethan (Wisdom Wallet)"
        subtitle="Chore Rewards & Curriculum Track Active"
        number="•••• •••• •••• 9120"
        frozen={freeze.t}
      />

      <ControlCenter freeze={freeze} setFreeze={setFreeze} flashToast={flashToast} />
    </div>
  )
}
