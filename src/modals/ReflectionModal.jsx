import { useState } from 'react'
import { X, BookHeart } from 'lucide-react'
import { provider } from '../backend/provider.js'

/** Weekly Stewardship Reflection — auto-opens Sunday evenings (once per week),
 *  or on demand from the Sandbox. Saves straight into the Reflections table. */
export default function ReflectionModal({ onClose, flashToast }) {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)

  const save = async () => {
    if (!content.trim() || saving) return
    setSaving(true)
    try {
      await provider.addReflection(content.trim())
      provider.markReflectionShown()
      flashToast('Reflection saved')
      onClose()
    } catch (e) {
      flashToast(e?.message || 'Could not save reflection')
      setSaving(false)
    }
  }

  return (
    <div className="absolute inset-0 z-[57]">
      <button className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-flashIn" onClick={onClose} />
      <div className="absolute bottom-0 left-0 right-0 bg-trustnavy rounded-t-3xl border-t border-white/10 animate-slideUp p-5">
        <div className="pt-1 pb-3 flex justify-center"><div className="h-1 w-12 rounded-full bg-white/20" /></div>

        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-teal2/15 border border-teal2/30 flex items-center justify-center">
            <BookHeart className="h-5 w-5 text-teal2" />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest text-teal2 font-bold">Sunday evening</p>
            <h2 className="text-base font-extrabold text-white">Weekly Stewardship Reflection</h2>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <p className="text-[12px] text-white/55 mt-2 leading-relaxed">
          Where did you see God's provision this week? Was your spending content — or restless?
        </p>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          autoFocus
          placeholder="Write a few honest sentences…"
          className="mt-3 w-full rounded-xl bg-navydeep border border-white/10 p-3 text-sm text-white/90 placeholder-white/30 focus:outline-none focus:border-teal2/50"
        />

        <div className="mt-4 grid grid-cols-2 gap-2">
          <button onClick={() => { provider.markReflectionShown(); onClose() }} className="py-3 rounded-xl bg-navydeep border border-white/10 text-sm font-bold text-white/70">
            Not this week
          </button>
          <button
            onClick={save}
            disabled={!content.trim() || saving}
            className={`py-3 rounded-xl text-sm font-bold ${
              content.trim() && !saving ? 'bg-gradient-to-r from-teal1 to-teal2 text-white shadow-glow' : 'bg-white/5 text-white/30 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving…' : 'Save reflection'}
          </button>
        </div>
      </div>
    </div>
  )
}
