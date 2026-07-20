import { useState } from 'react'
import { ArrowRight, Eye, EyeOff, Fingerprint, Mail, Lock } from 'lucide-react'
import StorehouseMark from '../StorehouseMark.jsx'

export default function SignInScreen({ onSignIn, onCreateAccount, onForgotPassword, onFaceId, busy }) {
  const [email, setEmail] = useState('michael.gladstone@example.com')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)

  return (
    <div className="absolute inset-0 z-[70] bg-midnight flex flex-col">
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[440px] w-[440px] rounded-full bg-teal-500/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-amber-400/5 blur-3xl pointer-events-none" />

      <div className="pt-16 px-7 relative">
        <div className="flex items-center gap-3">
          <StorehouseMark />
          <div>
            <h1 className="text-[22px] font-black tracking-[0.18em] leading-none text-white">STOREHOUSE</h1>
            <p className="text-[11px] mt-1 text-teal2/90 italic tracking-wide">Where your treasure is</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-7 relative">
        <h2 className="text-3xl font-extrabold text-white leading-tight">Welcome back.</h2>
        <p className="text-sm text-white/50 mt-2">Sign in to your steward account.</p>

        <div className="mt-8 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Email</p>
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-trustnavy border border-white/10 focus-within:border-teal2/60">
              <Mail className="h-4 w-4 text-white/40" />
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none"
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Password</p>
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-trustnavy border border-white/10 focus-within:border-teal2/60">
              <Lock className="h-4 w-4 text-white/40" />
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? 'text' : 'password'}
                placeholder="Enter your password"
                className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder-white/25"
              />
              <button onClick={() => setShowPw(v => !v)}>
                {showPw ? <EyeOff className="h-4 w-4 text-white/40" /> : <Eye className="h-4 w-4 text-white/40" />}
              </button>
            </div>
          </div>

          <button onClick={() => onForgotPassword(email)} className="text-[11px] text-teal2 font-semibold">Forgot password?</button>
        </div>

        <button
          onClick={() => onSignIn(email, password)}
          disabled={busy}
          className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-teal1 to-teal2 text-white font-bold text-sm shadow-glow flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Sign In'} <ArrowRight className="h-4 w-4" />
        </button>

        <div className="mt-5 flex items-center gap-3">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[10px] uppercase tracking-widest text-white/30">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          onClick={onFaceId}
          className="mt-5 w-full py-3.5 rounded-2xl bg-trustnavy border border-white/10 text-white font-semibold text-sm flex items-center justify-center gap-2"
        >
          <Fingerprint className="h-4 w-4 text-teal2" /> Sign in with Face ID
        </button>
      </div>

      <div className="pb-10 px-7 text-center relative">
        <p className="text-[11px] text-white/40">
          New to Storehouse? <button onClick={() => onCreateAccount(email, password)} disabled={busy} className="text-teal2 font-bold disabled:opacity-60">Create account</button>
        </p>
        <p className="mt-3 text-[10px] text-white/30">
          🔒 We do not sell your data. Your financial stewardship is private.
        </p>
      </div>
    </div>
  )
}
