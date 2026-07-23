import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Mail, Lock, Bell, BellOff, User, ChevronLeft } from 'lucide-react'
import StorehouseMark from '../StorehouseMark.jsx'

/**
 * Full email OTP auth flow:
 * landing → email → code → push (new users only) → details → done
 *
 * @param {Function} onAuthenticated  Called with no args when the user is fully authenticated.
 * @param {Function} provider         The Storehouse provider instance.
 */
export default function AuthFlow({ onAuthenticated, provider }) {
  const [step, setStep] = useState('landing')
  const [mode, setMode] = useState(null)     // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [resendIn, setResendIn] = useState(0)
  const timerRef = useRef(null)
  const codeRef = useRef(null)

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
  const isLive = provider.mode() === 'live'

  // ---- resend cooldown ----
  useEffect(() => {
    if (resendIn <= 0) { if (timerRef.current) clearInterval(timerRef.current); return }
    timerRef.current = setInterval(() => setResendIn((s) => s - 1), 1000)
    return () => clearInterval(timerRef.current)
  }, [resendIn])

  // Auto-focus the code input when we hit the code step
  useEffect(() => {
    if (step === 'code' && codeRef.current) codeRef.current.focus()
  }, [step])

  // ---- handlers ----
  const startFlow = (m) => {
    setMode(m)
    setError(null)
    setStep('email')
  }

  const sendCode = async () => {
    if (!validateEmail(email)) { setError('Enter a valid email address'); return }
    setBusy(true)
    setError(null)
    try {
      await provider.sendOtp(email, mode === 'signup')
      setResendIn(60)
      setStep('code')
    } catch (e) {
      setError(e?.message || 'Could not send code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const resendCode = async () => {
    if (resendIn > 0) return
    setBusy(true)
    setError(null)
    try {
      await provider.resendOtp(email, mode === 'signup')
      setResendIn(60)
    } catch (e) {
      setError(e?.message || 'Could not resend code.')
    } finally {
      setBusy(false)
    }
  }

  const verifyCode = async () => {
    if (code.length !== 6) { setError('Enter the 6-digit code.'); return }
    setBusy(true)
    setError(null)
    try {
      const { isNewUser } = await provider.verifyOtp(email, code, mode === 'signup')
      if (isNewUser) {
        setStep('push')
      } else {
        // Existing user — straight to dashboard
        onAuthenticated()
      }
    } catch (e) {
      setError(e?.message || 'Could not verify code. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  const handlePushResponse = async (enable) => {
    if (enable && 'Notification' in window) {
      try {
        await Notification.requestPermission()
      } catch {
        // Ignore — not all browsers/platforms support this
      }
    }
    setStep('details')
  }

  const saveDetails = async () => {
    if (!name.trim()) { setError('Enter your name.'); return }
    setBusy(true)
    setError(null)
    try {
      await provider.updateProfile({ name: name.trim() })
      onAuthenticated()
    } catch (e) {
      setError(e?.message || 'Could not save your details.')
    } finally {
      setBusy(false)
    }
  }

  // ---- render ----
  return (
    <div className="absolute inset-0 z-[70] bg-midnight flex flex-col overflow-hidden">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[440px] w-[440px] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      {/* ---- LANDING ---- */}
      {step === 'landing' && (
        <div className="flex-1 flex flex-col justify-center px-7 relative">
          <div className="flex items-center gap-3 mb-12">
            <StorehouseMark />
            <div>
              <h1 className="text-[22px] font-black tracking-[0.18em] leading-none text-white">STOREHOUSE</h1>
              <p className="text-[11px] mt-1 text-teal2/90 italic tracking-wide">Where your treasure is</p>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-white leading-tight">Faithful finances.<br />Simple stewardship.</h2>
          <p className="text-sm text-white/50 mt-3">Track giving, budgeting, and stewardship — all in one place.</p>

          <button
            onClick={() => startFlow('signup')}
            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2"
          >
            Create Account <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={() => startFlow('signin')}
            className="mt-3 w-full py-4 rounded-2xl bg-trustnavy border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2"
          >
            Sign In
          </button>

          <p className="mt-8 text-[10px] text-white/30 text-center">
            🔒 We do not sell your data. Your financial stewardship is private.
          </p>
        </div>
      )}

      {/* ---- EMAIL INPUT ---- */}
      {step === 'email' && (
        <div className="flex-1 flex flex-col justify-center px-7 relative">
          <button onClick={() => { setStep('landing'); setError(null) }} className="absolute top-12 left-7 text-white/40 flex items-center gap-1 text-sm">
            <ChevronLeft className="h-4 w-4" /> Back
          </button>

          <h2 className="text-2xl font-extrabold text-white leading-tight">
            {mode === 'signup' ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-sm text-white/50 mt-2">
            {mode === 'signup' ? 'Enter your email to get started.' : 'Enter your email to sign in.'}
          </p>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Email</p>
            <div className={`flex items-center gap-3 px-3.5 py-3.5 rounded-xl bg-trustnavy border ${error ? 'border-rose-500/60' : 'border-white/10 focus-within:border-teal2/60'}`}>
              <Mail className="h-4 w-4 text-white/40" />
              <input
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null) }}
                onKeyDown={(e) => e.key === 'Enter' && sendCode()}
                type="email"
                autoFocus
                placeholder="you@example.com"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
              />
            </div>
            {error && <p className="text-[10px] text-rose-400 mt-1.5">{error}</p>}
          </div>

          <button
            onClick={sendCode}
            disabled={busy}
            className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? 'Sending code…' : 'Continue'} <ArrowRight className="h-4 w-4" />
          </button>

          <p className="mt-4 text-[11px] text-white/40 text-center">
            We'll send a 6-digit verification code to your email.
          </p>
        </div>
      )}

      {/* ---- CODE VERIFICATION ---- */}
      {step === 'code' && (
        <div className="flex-1 flex flex-col justify-center px-7 relative">
          {busy && (
            <div className="absolute top-12 left-0 right-0 flex flex-col items-center gap-2">
              <div className="h-6 w-6 rounded-full border-2 border-teal2/30 border-t-teal2 animate-spin" />
              <p className="text-[11px] text-white/40">Verifying…</p>
            </div>
          )}

          {!busy && (
            <>
              <h2 className="text-2xl font-extrabold text-white leading-tight">Enter your code</h2>
              <p className="text-sm text-white/50 mt-2">
                We sent a 6-digit code to <span className="text-white/70 font-medium">{email}</span>
              </p>

              <div className="mt-8">
                <input
                  ref={codeRef}
                  value={code}
                  onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(null) }}
                  onKeyDown={(e) => e.key === 'Enter' && code.length === 6 && verifyCode()}
                  type="tel"
                  inputMode="numeric"
                  placeholder="••••••"
                  maxLength={6}
                  className="w-full bg-transparent text-white text-center text-3xl font-bold tracking-[0.5em] focus:outline-none py-3"
                  style={{ caretColor: '#14B8A6' }}
                />
                <div className="flex justify-center gap-2 mt-2">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1 w-8 rounded-full ${code.length > i ? 'bg-teal2' : 'bg-white/10'}`} />
                  ))}
                </div>
                {error && <p className="text-[11px] text-rose-400 mt-3 text-center">{error}</p>}
              </div>

              <button
                onClick={verifyCode}
                disabled={busy || code.length !== 6}
                className="mt-8 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
              >
                Verify <ArrowRight className="h-4 w-4" />
              </button>

              <div className="mt-5 text-center">
                {resendIn > 0 ? (
                  <p className="text-[11px] text-white/30">Resend code in {resendIn}s</p>
                ) : (
                  <button onClick={resendCode} className="text-[11px] text-teal2 font-semibold">
                    Didn't get a code? Resend
                  </button>
                )}
              </div>

              <button onClick={() => { setStep('email'); setError(null); setCode('') }} className="mt-3 text-[11px] text-white/30 font-medium">
                Use a different email
              </button>
            </>
          )}
        </div>
      )}

      {/* ---- PUSH NOTIFICATIONS ---- */}
      {step === 'push' && (
        <div className="flex-1 flex flex-col justify-center px-7 relative">
          <div className="h-16 w-16 rounded-full bg-teal2/15 flex items-center justify-center mb-6">
            <Bell className="h-8 w-8 text-teal2" />
          </div>
          <h2 className="text-2xl font-extrabold text-white leading-tight">Stay on top of your stewardship</h2>
          <p className="text-sm text-white/50 mt-3">
            Get gentle reminders for weekly reflections, budget check-ins, and giving goals. We'll never spam you.
          </p>

          <button
            onClick={() => handlePushResponse(true)}
            disabled={busy}
            className="mt-10 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            Enable Notifications
          </button>
          <button
            onClick={() => handlePushResponse(false)}
            className="mt-3 w-full py-4 rounded-2xl bg-trustnavy border border-white/10 text-white/50 font-semibold text-sm flex items-center justify-center gap-2"
          >
            Maybe Later
          </button>
        </div>
      )}

      {/* ---- ENTER DETAILS ---- */}
      {step === 'details' && (
        <div className="flex-1 flex flex-col justify-center px-7 relative">
          <h2 className="text-2xl font-extrabold text-white leading-tight">Almost there!</h2>
          <p className="text-sm text-white/50 mt-2">What should we call you?</p>

          <div className="mt-8">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Your Name</p>
            <div className={`flex items-center gap-3 px-3.5 py-3.5 rounded-xl bg-trustnavy border ${error ? 'border-rose-500/60' : 'border-white/10 focus-within:border-teal2/60'}`}>
              <User className="h-4 w-4 text-white/40" />
              <input
                value={name}
                onChange={(e) => { setName(e.target.value); setError(null) }}
                onKeyDown={(e) => e.key === 'Enter' && saveDetails()}
                type="text"
                autoFocus
                placeholder="Your name"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
              />
            </div>
            {error && <p className="text-[10px] text-rose-400 mt-1.5">{error}</p>}
          </div>

          <button
            onClick={saveDetails}
            disabled={busy}
            className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Get Started'} <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
