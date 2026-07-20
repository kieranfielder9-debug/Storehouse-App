import { useState } from 'react'
import { Moon, Sun, Layers, Bell, MessageSquare, TrendingUp, HandCoins } from 'lucide-react'
import ProfileScreen from './ProfileScreen.jsx'
import ToggleRow from '../ui/ToggleRow.jsx'
import Label from '../ui/Label.jsx'

export default function PreferencesView({ onBack, flashToast }) {
  const [theme, setTheme] = useState('dark')
  const [pushNotif, setPushNotif] = useState(true)
  const [emailDigest, setEmailDigest] = useState(true)
  const [investAlerts, setInvestAlerts] = useState(false)
  const [givingNudge, setGivingNudge] = useState(true)
  const [organise, setOrganise] = useState({
    weeklyWrap: true,
    autoRoundUps: true,
    smartCategorise: true,
    sabbathMode: false
  })

  const flip = (k) => setOrganise(o => ({ ...o, [k]: !o[k] }))

  return (
    <ProfileScreen title="Preferences" onBack={onBack}>
      <Label>Appearance</Label>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          onClick={() => { setTheme('dark'); flashToast('Dark theme on') }}
          className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 ${
            theme === 'dark'
              ? 'bg-gradient-to-br from-teal1/30 to-trustnavy border-teal2/50 shadow-glow'
              : 'bg-trustnavy border-white/10'
          }`}
        >
          <div className="h-12 w-12 rounded-xl bg-midnight border border-white/20 flex items-center justify-center">
            <Moon className="h-5 w-5 text-teal2" />
          </div>
          <span className="text-sm font-bold text-white">Dark</span>
        </button>
        <button
          onClick={() => { setTheme('light'); flashToast('Light theme on') }}
          className={`p-4 rounded-2xl border transition flex flex-col items-center gap-2 ${
            theme === 'light'
              ? 'bg-gradient-to-br from-amber-400/20 to-trustnavy border-amber-400/50 shadow-glow'
              : 'bg-trustnavy border-white/10'
          }`}
        >
          <div className="h-12 w-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
          <span className="text-sm font-bold text-white">Light</span>
        </button>
      </div>
      <p className="text-[10px] text-white/40 mt-2">Light theme is a preview — full skin coming soon.</p>

      <div className="mt-6">
        <Label>Organise Your Experience</Label>
        <div className="mt-2 rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
          <ToggleRow icon={Layers}     label="Weekly Stewardship Wrap"     value={organise.weeklyWrap}      onToggle={() => flip('weeklyWrap')} />
          <ToggleRow icon={HandCoins}  label="Auto Round-Ups"              value={organise.autoRoundUps}    onToggle={() => flip('autoRoundUps')} />
          <ToggleRow icon={TrendingUp} label="Smart-Categorise Spending"   value={organise.smartCategorise} onToggle={() => flip('smartCategorise')} />
          <ToggleRow icon={Moon}       label="Sabbath Mode (mute Sundays)" value={organise.sabbathMode}     onToggle={() => flip('sabbathMode')} />
        </div>
      </div>

      <div className="mt-6">
        <Label>Notifications</Label>
        <div className="mt-2 rounded-2xl bg-trustnavy border border-white/10 divide-y divide-white/5 overflow-hidden">
          <ToggleRow icon={Bell}          label="Push notifications"       value={pushNotif}    onToggle={() => setPushNotif(v => !v)} />
          <ToggleRow icon={MessageSquare} label="Weekly email digest"      value={emailDigest}  onToggle={() => setEmailDigest(v => !v)} />
          <ToggleRow icon={TrendingUp}    label="Investment movement alerts" value={investAlerts} onToggle={() => setInvestAlerts(v => !v)} />
          <ToggleRow icon={HandCoins}     label="Giving target nudges"     value={givingNudge}  onToggle={() => setGivingNudge(v => !v)} />
        </div>
      </div>

      <button
        onClick={() => flashToast('Preferences saved')}
        className="mt-6 w-full py-3.5 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow"
      >
        Save Preferences
      </button>
    </ProfileScreen>
  )
}
