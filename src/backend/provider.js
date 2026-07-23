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
 * without any page refresh. In live mode it also fires when Supabase reports
 * the session itself has died (SIGNED_OUT / a refresh with no session), so
 * callers that gate UI on hasSession()/getUser() should subscribe rather
 * than read those once — see Storehouse.jsx.
 *
 * Loading state: in live mode, cache.user starts null and is populated
 * asynchronously by refreshLive(). isLoading() returns true until that first
 * fetch completes, so callers can show a loading screen instead of flashing
 * the sign-in page on every refresh.
 */
import { getSupabase, isLive } from './supabaseClient.js'

const K = {
  user: 'sh_user', ledger: 'sh_ledger', goals: 'sh_goals', refl: 'sh_refl', plaid: 'sh_plaid', reflWeek: 'sh_refl_week',
  household: 'sh_household', rewards: 'sh_rewards'
}

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

// Sub-record model: a household member is owned by the account holder, not
// a separate login. Seeded so Control Center's "Approve £5" has someone to
// approve a reward for on first load, matching the existing "Ethan" copy.
const SEED_HOUSEHOLD = [{ id: 1, name: 'Ethan', relationship: 'child' }]
const SEED_REWARDS = []

const read = (k, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(k)); return v ?? fallback } catch { return fallback }
}
const writeRaw = (k, v) => localStorage.setItem(k, JSON.stringify(v))

const listeners = new Set()
const emit = () => listeners.forEach((fn) => fn())
const write = (k, v) => { writeRaw(k, v); emit() }

// ---- live-mode in-memory cache (refreshed via realtime) ----
let cache = {
  ledger: [],
  goals: SEED_GOALS,
  user: null,
  reflections: [],
  plaid: { connected: false, institution: null },
  household: [],
  rewardRequests: []
}
let realtimeReady = false
// In live mode, the first refreshLive() hasn't completed yet. Callers
// should check isLoading() to show a loading screen instead of flashing
// the sign-in page while the session is being restored from storage.
let loading = isLive()

async function refreshLive() {
  const sb = getSupabase()
  const { data: { user } } = await sb.auth.getUser()
  cache.user = user ? { id: user.id, email: user.email, name: user.user_metadata?.name || 'Steward' } : null
  if (!user) {
    cache.reflections = []
    loading = false
    emit()
    return
  }
  const [{ data: ledger }, { data: goals }, { data: household }, { data: rewardRequests }, { data: reflections }] = await Promise.all([
    sb.from('ledger').select('*').order('date', { ascending: false }).order('id', { ascending: false }),
    sb.from('stewardship_goals').select('*').maybeSingle(),
    sb.from('household_members').select('*').order('id', { ascending: true }),
    sb.from('reward_requests').select('*').order('created_at', { ascending: false }),
    sb.from('reflections').select('*').order('date', { ascending: false })
  ])
  cache.ledger = ledger || []
  cache.goals = goals || SEED_GOALS
  cache.household = household || []
  cache.rewardRequests = rewardRequests || []
  cache.reflections = reflections || []
  loading = false
  emit()
}

function ensureRealtime() {
  if (realtimeReady || !isLive()) return
  realtimeReady = true
  const sb = getSupabase()
  sb.channel('sh-ledger')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, refreshLive)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'stewardship_goals' }, refreshLive)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'household_members' }, refreshLive)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reward_requests' }, refreshLive)
    .on('postgres_changes', { event: '*', schema: 'public', table: 'reflections' }, refreshLive)
    .subscribe()
  // A session can go stale server-side (refresh token revoked, password
  // changed elsewhere, a failed background refresh) with no postgres_changes
  // event at all. supabase-js fires SIGNED_OUT (or TOKEN_REFRESHED with no
  // session) on the auth client itself in that case — listen for it so the
  // in-memory cache is dropped and subscribers (see `subscribe` below) hear
  // about it, instead of an already-open tab quietly holding onto cached
  // ledger/goals data under a dead session.
  sb.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT' || (event === 'TOKEN_REFRESHED' && !session)) {
      cache.user = null
      cache.ledger = []
      cache.goals = SEED_GOALS
      cache.household = []
      cache.rewardRequests = []
      cache.reflections = []
      emit()
    }
  })
  refreshLive()
}

// Eagerly start the realtime + session check on module load in live mode,
// instead of waiting for the first subscribe() call. This means cache.user
// starts populating as soon as the module is imported, not after React's
// first useEffect — closing the window where hasSession() falsely returns
// false on a page refresh with a valid persisted session.
if (isLive()) ensureRealtime()

/** Detects Supabase/GoTrue returning an opaque 5xx ("AuthRetryableFetchError")
 *  on signup, with no usable error body — supabase-js treats *any* 5xx from
 *  the API as a "retryable transport error" and never parses the JSON body
 *  in that case (see lib/fetch.js NETWORK_ERROR_CODES / handleError), so the
 *  thrown error's `.code` is `undefined` and `.message` is a useless
 *  stringified Response. `.status` is the one field that reliably survives.
 *
 *  IMPORTANT — this used to be named isSignupEmailTimeout() and assumed the
 *  500 always meant "a slow confirmation-email send, account is probably
 *  fine, go check your inbox." That assumption is now known to be FALSE for
 *  this project: on 2026-07-20, a batch of signups that all hit this exact
 *  error path created NO row in auth.users at all (confirmed directly in the
 *  Supabase dashboard) — most likely because a server-side trigger on
 *  auth.users (handle_new_user(), see supabase/schema.sql) was throwing and
 *  rolling back the entire signup transaction. A generic 5xx here can mean
 *  either "harmless email delay" or "signup outright failed" and there is no
 *  way to tell which from this response alone — so we must NOT reassure the
 *  user their account likely exists. See supabase/schema.sql for the fix
 *  applied to the trigger after this was found. */
function isOpaqueServerError(error) {
  if (!error) return false
  if (typeof error.status === 'number' && error.status >= 500) return true
  if (error.code === 'unexpected_failure') return true
  return /sending confirmation email/i.test(error.message || '')
}

/** Maps raw Supabase auth errors to user-friendly messages. Raw error
 *  strings like "Invalid login credentials" never reach the UI — users
 *  see a sentence they can act on instead. */
function mapAuthError(error) {
  if (!error) return new Error("Something went wrong. Please try again or contact support.")
  const msg = error.message || ""
  const code = error.code || ""
  // Sign-in: wrong password OR non-existent email — same message to
  // prevent email enumeration (Supabase already does this server-side).
  if (/invalid login credentials/i.test(msg))
    return new Error("No account found with this email, or the password is incorrect.")
  // Sign-up: password too short
  if (/password.*at least 6/i.test(msg) || code === "weak_password")
    return new Error("Password must be at least 6 characters.")
  // Rate limiting
  if (/rate limit/i.test(msg) || code === "over_request_rate_limit")
    return new Error("Too many attempts. Please wait a minute and try again.")
  // Email not confirmed
  if (/email.*not.*confirmed/i.test(msg) || code === "email_not_confirmed")
    return new Error("Check your email to confirm your account, then sign in.")
  // Network / connection errors
  if (/failed to fetch|networkerror|fetch error/i.test(msg))
    return new Error("Could not connect to the server. Check your internet and try again.")
  // Not a normal GoTrue error shape — this comes back when the request
  // never reached Auth's business logic at all (e.g. a malformed
  // VITE_SUPABASE_URL producing a mangled path, or the endpoint being
  // unreachable at the project's Auth server). Never the user's fault, so
  // don't imply a mistyped email/code.
  if (/invalid path specified in request url/i.test(msg))
    return new Error("We're having trouble reaching the account service right now. Please try again shortly, or contact support if this keeps happening.")
  // OTP: code expired or invalid
  if (/token.*expired|invalid.*token|otp/i.test(msg) && /expired|invalid/i.test(msg))
    return new Error("That code has expired or is invalid. Request a new one and try again.")
  // OTP: user not found (trying to sign in with shouldCreateUser: false)
  if (/user not found|not.*registered|no.*account/i.test(msg))
    return new Error("No account found with this email. Try creating an account instead.")
  // OTP: rate limit on email sending
  if (/email.*rate|too many.*email/i.test(msg))
    return new Error("We just sent you a code. Please wait a minute before requesting another.")
  // Fallback: preserve the message if it is already friendly (from our own
  // throws), otherwise use the generic fallback so no raw Supabase string leaks.
  if (error instanceof Error && !/^[A-Z]/.test(msg))
    return error  // already a friendly message from our own code
  return new Error(msg || "Something went wrong. Please try again or contact support.")
}

// ------------------------------------------------------------------ facade
export const provider = {
  mode: () => (isLive() ? 'live' : 'sandbox'),

  /** True until the first refreshLive() completes in live mode. Callers
   *  should show a loading screen while this is true, instead of flashing
   *  the sign-in page (hasSession() returns false until the session is
   *  restored from storage, even if the user is actually signed in). */
  isLoading() {
    return loading
  },

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
      if (error) throw mapAuthError(error)
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
      if (res.error) {
        // See isOpaqueServerError above: a generic 5xx here does NOT
        // reliably mean the account was created — be honest, not falsely
        // reassuring. Never auto-retry here — retrying signUp with the same
        // email risks colliding with the "already registered" path below,
        // and we can't know whether a prior attempt already went through.
        if (isOpaqueServerError(res.error)) {
          throw new Error('Something went wrong creating your account and it was not created. Please wait a moment and try again — if it keeps happening, contact support.')
        }
        throw mapAuthError(res.error)
      }
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
      if (error) throw mapAuthError(error)
      return
    }
    // Sandbox: nothing to reset — caller shows a sandbox-specific message.
  },
  async signOut() {
    if (isLive()) { await getSupabase().auth.signOut(); cache.user = null; emit(); return }
    localStorage.removeItem(K.user); emit()
  },

  // ---- email OTP auth ----
  /** Send a 6-digit OTP code to the user's email. In live mode this calls
   *  Supabase auth.signInWithOtp; in sandbox it's a no-op (any code works).
   *  isSignUp=true creates a new account if the email is unknown; false
   *  requires an existing account. */
  async sendOtp(email, isSignUp) {
    if (!email) throw new Error('Enter your email address first.')
    if (isLive()) {
      const sb = getSupabase()
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: { shouldCreateUser: isSignUp }
      })
      if (error) throw mapAuthError(error)
      return
    }
    // Sandbox: pretend to send — any 6-digit code will work.
  },

  /** Verify a 6-digit OTP code. Returns { isNewUser } so the UI can decide
   *  whether to show the "enter your details" step. */
  async verifyOtp(email, token, isSignUp) {
    if (!token || token.length !== 6) throw new Error('Enter the 6-digit code.')
    if (isLive()) {
      const sb = getSupabase()
      const { data, error } = await sb.auth.verifyOtp({
        email,
        token,
        type: isSignUp ? 'signup' : 'email'
      })
      if (error) throw mapAuthError(error)
      await refreshLive()
      const isNewUser = isSignUp && !cache.user?.user_metadata?.name
      return { isNewUser }
    }
    // Sandbox: accept any 6-digit code, create fake user.
    write(K.user, { id: 'sandbox-user', email, name: email.split('@')[0] })
    return { isNewUser: false }
  },

  /** Update the signed-in user's profile (name, etc.). Called after OTP
   *  verification for new users who need to enter their details. */
  async updateProfile({ name }) {
    if (!name || !name.trim()) throw new Error('Enter your name.')
    if (isLive()) {
      const sb = getSupabase()
      const { error } = await sb.auth.updateUser({ data: { name: name.trim() } })
      if (error) throw mapAuthError(error)
      await refreshLive()
      return
    }
    const user = read(K.user, null)
    if (user) write(K.user, { ...user, name: name.trim() })
  },

  /** Resend OTP — same as sendOtp but exposed as a separate method so the
   *  UI can track a 60-second cooldown without a separate API call. */
  async resendOtp(email, isSignUp) {
    return this.sendOtp(email, isSignUp)
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
  /** "Start Fresh": delete every ledger row so a hand-entered real ledger can
   *  start from zero. Scoped to the ledger only (goals/reflections/Plaid
   *  status are untouched) — this is a data reset, not an account reset.
   *  Live mode deletes only the signed-in user's own rows; RLS ("own ledger"
   *  policy, auth.uid() = user_id) enforces that server-side regardless, the
   *  explicit .eq() here is belt-and-braces, not a bypass of it. */
  async clearLedger() {
    if (isLive()) {
      const { error } = await getSupabase().from('ledger').delete().eq('user_id', cache.user.id)
      if (error) throw error
      return // realtime event refreshes cache
    }
    write(K.ledger, [])
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
    if (isLive()) return cache.reflections
    return read(K.refl, [])
  },
  async addReflection(content) {
    if (isLive()) {
      const { error } = await getSupabase().from('reflections').insert({ user_id: cache.user.id, content })
      if (error) throw error
      return // realtime event refreshes cache
    }
    write(K.refl, [{ date: iso(new Date()), content }, ...this.getReflections()])
  },
  markReflectionShown() { writeRaw(K.reflWeek, weekKey()) },
  reflectionDueNow() {
    const now = new Date()
    const isSundayEvening = now.getDay() === 0 && now.getHours() >= 17
    return isSundayEvening && read(K.reflWeek, '') !== weekKey()
  },

  // ---- household (literal household members only, owner's own consent —
  // sub-records of the account owner, NOT separate login/auth identities) ----
  getHouseholdMembers() {
    if (isLive()) return cache.household
    return read(K.household, SEED_HOUSEHOLD)
  },
  /** Finds an existing household member by name (case-insensitive), or adds
   *  one under the signed-in owner. There is no self-serve signup for a
   *  household member — only the account owner can create these records. */
  async ensureHouseholdMember(name, relationship = 'child') {
    const existing = this.getHouseholdMembers().find((m) => m.name.toLowerCase() === name.toLowerCase())
    if (existing) return existing
    if (isLive()) {
      const { data, error } = await getSupabase()
        .from('household_members')
        .insert({ auth_id: cache.user.id, name, relationship })
        .select()
        .single()
      if (error) throw error
      await refreshLive()
      return data
    }
    const rows = this.getHouseholdMembers()
    const id = Math.max(0, ...rows.map((m) => m.id)) + 1
    const member = { id, name, relationship }
    write(K.household, [...rows, member])
    return member
  },

  // ---- reward requests ----
  getRewardRequests() {
    if (isLive()) return cache.rewardRequests
    return read(K.rewards, SEED_REWARDS)
  },
  /** Parent/guardian approves a reward for a household member. There's no
   *  child-initiated request flow yet (no child login) — the parent is the
   *  one taking the action, so this creates and approves in a single step. */
  async approveReward({ memberName, relationship = 'child', amount, reason }) {
    const member = await this.ensureHouseholdMember(memberName, relationship)
    const now = new Date().toISOString()
    const entry = {
      household_member_id: member.id,
      amount,
      reason,
      status: 'approved',
      approved_by: this.getUser()?.id ?? null,
      approved_at: now
    }
    if (isLive()) {
      const { data, error } = await getSupabase().from('reward_requests').insert(entry).select().single()
      if (error) throw error
      return data // realtime event refreshes cache
    }
    const rows = this.getRewardRequests()
    const id = Math.max(0, ...rows.map((r) => r.id)) + 1
    const record = { id, created_at: now, ...entry }
    write(K.rewards, [record, ...rows])
    return record
  },

  // ---- plaid ----
  plaidStatus() {
    if (isLive()) return cache.plaid
    return read(K.plaid, { connected: false, institution: null })
  },
  async connectPlaid() {
    // Deliberately separate from isLive(): Supabase going live (Phase 1) must
    // not silently start routing to real Plaid functions (Phase 2) before
    // Plaid credentials actually exist in this environment. Opt-in only.
    if (isLive() && import.meta.env.VITE_PLAID_LIVE === 'true') return connectPlaidLive()
    // Sandbox: simulate the Link flow. No credentials ever touch our code.
    await new Promise((r) => setTimeout(r, 1500))
    write(K.plaid, { connected: true, institution: 'Storehouse Sandbox Bank' })
  },
  async disconnectPlaid() {
    if (isLive() && import.meta.env.VITE_PLAID_LIVE === 'true') {
      await disconnectPlaidLive()
      return
    }
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
    ;[K.ledger, K.goals, K.refl, K.plaid, K.reflWeek, K.household, K.rewards].forEach((k) => localStorage.removeItem(k))
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
  if (!session) throw new Error('No active session — please sign in again.')

  const linkRes = await fetch('/.netlify/functions/plaid-create-link-token', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` }
  })
  if (!linkRes.ok) {
    const body = await linkRes.text().catch(() => '')
    throw new Error(`Could not start bank linking (${linkRes.status}). ${body}`)
  }
  const { link_token } = await linkRes.json()
  if (!link_token) throw new Error('Bank linking failed — no link token returned. Please try again.')

  await loadPlaidScript()
  return new Promise((resolve, reject) => {
    const handler = window.Plaid.create({
      token: link_token,
      onSuccess: async (public_token, metadata) => {
        try {
          const exchangeRes = await fetch('/.netlify/functions/plaid-exchange-public-token', {
            method: 'POST',
            headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ public_token })
          })
          if (!exchangeRes.ok) {
            throw new Error(`Could not complete bank linking (${exchangeRes.status}). Please try again.`)
          }
          cache.plaid = { connected: true, institution: metadata.institution?.name || 'Linked bank' }
          emit()
          resolve()
        } catch (err) {
          reject(err)
        }
      },
      onExit: (err) => (err ? reject(err) : resolve())
    })
    handler.open()
  })
}

/** Disconnect a live Plaid link: calls a serverless function to invalidate
 *  the token at Plaid (itemRemove) and delete the plaid_items row, then
 *  clears the local cache. The access token is no longer valid at Plaid
 *  after this — not just hidden in the UI. */
async function disconnectPlaidLive() {
  const sb = getSupabase()
  const { data: { session } } = await sb.auth.getSession()
  if (!session) throw new Error('No active session — please sign in again.')

  const res = await fetch('/.netlify/functions/plaid-remove-item', {
    method: 'POST',
    headers: { Authorization: `Bearer ${session.access_token}` }
  })
  if (!res.ok) {
    // Still clear locally — the user's intent is to disconnect regardless
    // of whether the server-side cleanup succeeds. Log for debugging.
    console.warn('plaid-remove-item returned non-OK:', res.status)
  }
  cache.plaid = { connected: false, institution: null }
  emit()
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
