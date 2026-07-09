import { createClient } from '@supabase/supabase-js'

// Live mode activates automatically when these env vars exist (.env / Netlify env).
// Without them the app runs in Sandbox mode (localStorage) — zero setup required.
const url = import.meta.env.VITE_SUPABASE_URL
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY

let client = null
if (url && anon) client = createClient(url, anon)

export const getSupabase = () => client
export const isLive = () => !!client
