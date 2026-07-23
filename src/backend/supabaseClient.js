import { createClient } from '@supabase/supabase-js'

// Live mode activates automatically when these env vars exist (.env / Netlify env).
// Without them the app runs in Sandbox mode (localStorage) — zero setup required.
const rawUrl = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

/** VITE_SUPABASE_URL must be the bare project URL (e.g.
 *  "https://xxxxx.supabase.co") — no trailing slash, no "/rest/v1",
 *  "/auth/v1" etc. supabase-js appends its own "/auth/v1/<endpoint>" path
 *  internally, so a pasted value that already includes an API suffix
 *  produces a mangled path (e.g. ".../rest/v1/auth/v1/otp"). Supabase's
 *  edge rejects that outright with a generic "Invalid path specified in
 *  request URL" — not a normal GoTrue JSON error, so it wouldn't otherwise
 *  be caught by mapAuthError()'s pattern matching below. Normalising here
 *  is a safety net for a copy-paste mistake in the Netlify env var; it does
 *  nothing when the value is already a bare URL. */
function normalizeSupabaseUrl(u) {
  if (!u) return u
  const trimmed = u.trim()
  const stripped = trimmed.replace(/\/+$/, '').replace(/\/(rest|auth|storage|realtime|functions)\/v1$/i, '')
  if (stripped !== trimmed) {
    console.warn(`[supabase] VITE_SUPABASE_URL looks malformed ("${trimmed}") — using "${stripped}" instead. Fix the Netlify env var so this warning goes away.`)
  }
  return stripped
}

const url = normalizeSupabaseUrl(rawUrl)

let client = null
if (url && anon) client = createClient(url, anon)

export const getSupabase = () => client
export const isLive = () => !!client
