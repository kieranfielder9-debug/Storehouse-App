/**
 * Data provider — single facade the UI talks to.
 *
 * Two modes, same API:
 *  - SANDBOX (default): localStorage persistence, instant, no keys needed.
 *  - LIVE: Supabase (Postgres + RLS + realtime) when VITE_SUPABASE_* env vars
 *    are set. Every query is scoped by the signed-in user's id; RLS policies
 *    in supabase/schema.sql enforce isolation server-side as well.
 *
 * Reactivity: subscribe(fn) fires on every mutation (local writes in sandbox,
 * postgres_changes realtime events in live mode) so dashboard stats update
 * without any page refresh.
 */
import { getSupabase, isLive } from './supabaseClient.js'

const K = { user: 'sh_user', ledger: 'sh_ledger', goals: 'sh_goals', refl: 'sh_refl', plaid: 'sh_plaid', reflWeek: 'sh_refl_week' }

const iso = (d) => d.toISOString().slice(0, 10)
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return iso(d) }

// Seeded so the dashboard renders exactly as the existing design on first load.
const SEED_LEDGER = [
  { id: 1, date: daysAgo(0), amount: -3.20,   category: 'Food',      description: 'Coffee at Leeds Centre',                    meta: 'Costa Coffee · Today, 09:14', is_contentment_satisfied: null },
  { id: 2, date: daysAgo(0), amount: -210.00, category: 'Giving',    description: 'Tithe — Huddersfield Christian Fellowship', meta: 'Standing Order · Today' },
  { id: 3, date: daysAgo(1), amount: -48.62,  category: 'Groceries', description: "Sainsbury's",                               meta: 'Groceries · Yesterday' },
  { id: 4, date: daysAgo(3), amount: 2840.00, category: 'Income',    description: 'Salary — Riverbank Ltd',                    meta: 'Income · 27 May' },
  { id: 5, date: daysAgo(6), amount: -74.00,  category: 'Giving',    description: 'Compassion UK — Sponsorship',               meta: 'Standing Order · Last week' }
]
const SEED_GOALS = { tithe_percentage: 10, generosity_target: 300 }

const read = (k, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback } catch { return fallback }
}
const writeRaw = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())
const write = (k, v) => { writeRaw(k, v); emit() }

// ---- live-mode in-memory cache (refreshed via realtime) ----
let cache = { ledger: [], goals: SEED_GOALS, user: null, plaid: { connected: false } }
let realtimeReady = false

async function refreshLive() {
  const sb = getSupabase()
  const { data: { user } } = await sb.auth.getUser()
  cache.user = user ? { id: user.id, email: user.email, name: user.user_metadata?.name || 'Steward' } : null
  if (!user) { emit(); return }
  const [{ data: ledger }, { data: goals }] = await Promise.all([
    sb.from('ledger').select('*').order('date', { ascending: false }).order('id', { ascending: false }),
    sb.from('stewardship_goals').select('*').maybeSingle()
  ])
  cache.ledger = ledger || []
  cache.goals = goals || SEED_GOALS
  emit()
}

function ensureRealtime() {
  if (realtimeReady || !isLive()) return
  realtimeReady = true
  getSupabase()
    .channel('sh-ledger')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, refreshLive)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stewardship_goals' }, refreshLive)
    .subscribe()
  refreshLive()
}

// ------------------------------------------------------------------ facade
export const provider = {
  mode: () => (isLive() ? 'live' : 'sandbox'),

  subscribe(fn) {
    listeners.add(fn)
    ensureRealtime()
    return () => listeners.delete(fn)
  },

  // ---- auth ----
  hasSession() {
    if (isLive()) return !!cache.user
    return !!read(K.user, null)
  },
  getUser() {
    if (isLive()) return cache.user
    return read(K.user, null)
  },
  /** Sign in to an EXISTING account only. Throws Supabase's real error
   *  message (e.g. "Invalid login credentials") on wrong password/unknown
   *  email — never silently falls back to creating a new account. */
  async signIn(email, password) {
    if (isLive()) {
      const sb = getSupabase()
      const { error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw error
      await refreshLive()
      if (!cache.user) throw new Error('Signed in, but no session was returned. Please try again.')
      return
    }
    write(K.user, { id: 'sandbox-user', email, name: 'Michael Gladstone' })
  },

  /** Create a NEW account. Returns { needsEmailConfirmation }. Throws a
   *  friendly error if the email is already registered (Supabase returns
   *  this as an empty `identities` array rather than a real error, to
   *  avoid leaking which emails exist — we translate that here). */
  async signUp(email, password, name = 'Steward') {
    if (isLive()) {
      const sb = getSupabase()
      const res = await sb.auth.signUp({ email, password, options: { data: { name } } })
      if (res.error) throw res.error
      const alreadyRegistered = res.data?.user?.identities?.length === 0
      if (alreadyRegistered) throw new Error('An account with this email already exists — try signing in instead.')
      if (!res.data.session) return { needsEmailConfirmation: true }
      await refreshLive()
      return { needsEmailConfirmation: false }
    }
    write(K.user, { id: 'sandbox-user', email, name: 'Michael Gladstone' })
    return { needsEmailConfirmation: false }
  },

  /** Send a password-reset email. No-ops safely in sandbox mode. */
  async resetPassword(email) {
    if (!email) throw new Error('Enter your email address first.')
    if (isLive()) {
      const { error } = await getSupabase().auth.resetPasswordForEmail(email, { redirectTo: window.location.origin })
      if (error) throw error
      return
    }
    // Sandbox: nothing to reset — caller shows a sandbox-specific message.
  },
  async signOut() {
    if (isLive()) { await getSupabase().auth.signOut(); cache.user = null; emit(); return }
    localStorage.removeItem(K.user); emit()
  },

  // ---- ledger ----
  getLedger() {
    if (isLive()) return cache.ledger
    return read(K.ledger, SEED_LEDGER)
  },
  async addLedger(entry) {
    if (isLive()) {
      const { error } = await getSupabase().from('ledger').insert({ ...entry, user_id: cache.user.id })
      if (error) throw error
      return // realtime event refreshes cache
    }
    const rows = this.getLedger()
    const id = Math.max(0, ...rows.map((r) => r.id)) + 1
    write(K.ledger, [{ id, date: iso(new Date()), ...entry }, ...rows])
  },
  async updateLedger(id, patch) {
    if (isLive()) {
      const { error } = await getSupabase().from('ledger').update(patch).eq('id', id)
      if (error) throw error
      return
    }
    write(K.ledger, this.getLedger().map((r) => (r.id === id ? { ...r, ...patch } : r)))
  },

  // ---- goals ----
  getGoals() {
    if (isLive()) return cache.goals
    return read(K.goals, SEED_GOALS)
  },
  async updateGoals(patch) {
    if (isLive()) {
      const { error } = await getSupabase().from('stewardship_goals').update(patch).eq('user_id', cache.user.id)
      if (error) throw error
      return
    }
    write(K.goals, { ...this.getGoals(), ...patch })
  },

  // ---- reflections ----
  getReflections() {
    if (isLive()) return [] // fetched on demand in live mode; not needed for MVP UI
    return read(K.refl, [])
  },
  async addReflection(content) {
    if (isLive()) {
      const { error } = await getSupabase().from('reflections').insert({ user_id: cache.user.id, content })
      if (error) throw error
      return
    }
    write(K.refl, [{ date: iso(new Date()), content }, ...this.getReflections()])
  },
  markReflectionShown() { writeRaw(K.reflWeek, weekKey()) },
  reflectionDueNow() {
    const now = new Date()
    const isSundayEvening = now.getDay() === 0 && now.getHours() >= 17
    return isSundayEvening && read(K.reflWeek, '') !== weekKey()
  },

  // ---- plaid ----
  plaidStatus() {
    return read(K.plaid, { connected: false, institution: null })
  },
  async connectPlaid() {
    if (isLive()) return connectPlaidLive()
    // Sandbox: simulate the Link flow. No credentials ever touch our code.
    await new Promise((r) => setTimeout(r, 1500))
    write(K.plaid, { connected: true, institution: 'Storehouse Sandbox Bank' })
  },
  async disconnectPlaid() {
    write(K.plaid, { connected: false, institution: null })
  },

  // ---- derived stats (Stewardship Ratio, Giving progress) ----
  computeStats() {
    const goals = this.getGoals()
    const cutoff = daysAgo(30)
    const rows = this.getLedger().filter((r) => r.date >= cutoff)
    const income = rows.filter((r) => r.amount > 0).reduce((s, r) => s + r.amount, 0)
    const giving = rows.filter((r) => r.category === 'Giving').reduce((s, r) => s + Math.abs(r.amount), 0)
    const titheTarget = (income * (goals.tithe_percentage ?? 10)) / 100
    return {
      income,
      giving,
      ratio: income ? (giving / income) * 100 : 0,
      givingPct: titheTarget ? Math.min(100, (giving / titheTarget) * 100) : 0,
      titheTarget,
      generosityTarget: goals.generosity_target,
      needCount: rows.filter((r) => r.is_contentment_satisfied === true).length,
      wantCount: rows.filter((r) => r.is_contentment_satisfied === false).length
    }
  },

  // ---- sandbox utilities ----
  resetSandbox() {
    ;[K.ledger, K.goals, K.refl, K.plaid, K.reflWeek].forEach((k) => localStorage.removeItem(k))
    emit()
  }
}

function weekKey() {
  const d = new Date()
  const jan1 = new Date(d.getFullYear(), 0, 1)
  return `${d.getFullYear()}-w${Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7)}`
}

/** Real Plaid Link flow (live mode): link_token from serverless fn → Plaid Link
 *  → public_token exchanged server-side. Raw credentials never touch this app;
 *  the access token is stored server-side only (plaid_items, deny-all RLS). */
async function connectPlaidLive() {
  const sb = getSupabase()
  const { data: { session } } = await sb.auth.getSession()
  const res = await fetch('/.netlify/functions/plaid-create-link-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` }
  })
  const { link_token } = await res.json()
  await loadPlaidScript()
  return new Promise((resolve, reject) => {
    const handler = window.Plaid.create({
      token: link_token,
      onSuccess: async (public_token, metadata) => {
        await fetch('/.netlify/functions/plaid-exchange-public-token', {
          method: 'POST',
          headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ public_token })
        })
        write(K.plaid, { connected: true, institution: metadata.institution?.name || 'Linked bank' })
        resolve()
      },
      onExit: (err) => (err ? reject(err) : resolve())
    })
    handler.open()
  })
}

function loadPlaidScript() {
  if (window.Plaid) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.plaid.com/link/v2/stable/link-initialize.js'
    s.onload = resolve
    s.onerror = reject
    document.head.appendChild(s)
  })
}
