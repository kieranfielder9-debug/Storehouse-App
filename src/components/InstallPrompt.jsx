import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'

const DISMISS_KEY = 'storehouse-install-dismissed-v1'

export default function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)
  const [iosHint, setIosHint] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return

    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    if (standalone) return // already installed

    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent)
    if (isIOS) {
      setIosHint(true)
      setShow(true)
      return
    }

    const handler = (e) => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!show) return null

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setShow(false)
  }

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    const { outcome } = await deferred.userChoice
    if (outcome === 'accepted') dismiss()
  }

  return (
    <div className="absolute left-3 right-3 bottom-24 z-[40] animate-flashIn">
      <div className="rounded-2xl p-3 bg-gradient-to-br from-teal1 to-teal2 border border-white/20 shadow-glow flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center flex-shrink-0">
          <Download className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-extrabold text-white leading-tight">Install Storehouse</p>
          <p className="text-[11px] text-white/85 leading-snug">
            {iosHint
              ? <>Tap <Share className="h-3 w-3 inline -mt-0.5" /> Share → "Add to Home Screen"</>
              : 'Get the app icon on your home screen'}
          </p>
        </div>
        {!iosHint && (
          <button onClick={install} className="px-3 py-2 rounded-xl bg-white text-trustnavy font-extrabold text-[11px]">
            Install
          </button>
        )}
        <button onClick={dismiss} className="h-7 w-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0">
          <X className="h-3.5 w-3.5 text-white" />
        </button>
      </div>
    </div>
  )
}
