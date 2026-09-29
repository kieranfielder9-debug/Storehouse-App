// Live-mode auth checks against a MOCK Supabase — no real project, keys or network.
//
// verify-backend.mjs only sees SANDBOX mode (no VITE_SUPABASE_* vars), where
// verifyOtp() is a stub. The behaviours below exist only in LIVE mode, so this
// starts its own Vite dev server with the Supabase env pointed at a fake URL
// (provider.js then runs its real live code path) and answers every request to
// that URL from the browser with canned GoTrue / PostgREST responses.
//
//   node verify-auth-live.mjs        (no `npm run dev` needed; uses port 5174)
//
// Covers: the invite-only message through the real UI, generic text for opaque
// server errors, verifyOtp refusing to sign anyone in without a session, and the
// name-overwrite fix (existing users are never asked for / never have a name set;
// genuinely new users still are).
import { chromium } from 'playwright'
import { createServer } from 'vite'

const FAKE = 'http://127.0.0.1:54399'   // nothing listens here — page.route answers everything
process.env.VITE_SUPABASE_URL = FAKE
process.env.VITE_SUPABASE_ANON_KEY = 'fake-anon-key'
const server = await createServer({ server: { port: 5174, strictPort: true }, logLevel: 'error' })
await server.listen()
const APP = 'http://localhost:5174/'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const results = []
const check = (name, ok) => { results.push([name, ok]); console.log(ok ? 'PASS' : 'FAIL', '—', name) }

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const jwt = () => `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: 'user-1', role: 'authenticated', aud: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.sig`
const userJson = (meta) => ({ id: 'user-1', aud: 'authenticated', role: 'authenticated', email: 'steward@example.com', user_metadata: meta })
const sessionJson = (meta) => ({
  access_token: jwt(), token_type: 'bearer', expires_in: 3600, expires_at: Math.floor(Date.now() / 1000) + 3600,
  refresh_token: 'fake-refresh', user: userJson(meta)
})
const CORS = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-allow-methods': '*' }
const json = (status, body) => ({ status, headers: { ...CORS, 'content-type': 'application/json' }, body: JSON.stringify(body) })

/** Runs one scenario in a fresh browser context. `mock` decides the GoTrue answers. */
async function scenario(mock, run) {
  const ctx = await browser.newContext({ viewport: { width: 460, height: 880 } })
  const page = await ctx.newPage()
  const calls = []                     // every request the app made to the fake Supabase
  let signedIn = false                 // becomes true once /verify has handed out a session
  await ctx.route(`${FAKE}/**`, async (route) => {
    const req = route.request(); const url = new URL(req.url()); const p = url.pathname; const m = req.method()
    if (m === 'OPTIONS') return route.fulfill({ status: 204, headers: CORS })
    let body = null; try { body = JSON.parse(req.postData() || 'null') } catch { /* not JSON */ }
    calls.push({ m, p, body })
    if (p === '/auth/v1/otp') return route.fulfill(mock.otp ? json(...mock.otp) : json(200, {}))
    if (p === '/auth/v1/verify') { const r = mock.verify; if (r?.[0] === 200 && r[1].access_token) signedIn = true; return route.fulfill(json(...r)) }
    if (p === '/auth/v1/user' && m === 'GET') return signedIn ? route.fulfill(json(200, userJson(mock.meta || {}))) : route.fulfill(json(401, { msg: 'invalid JWT' }))
    if (p === '/auth/v1/user' && m === 'PUT') return route.fulfill(json(200, userJson(body?.data || {})))
    if (p.startsWith('/rest/v1/')) return route.fulfill(json(200, []))       // empty ledger, goals, household, ...
    if (p === '/auth/v1/logout') return route.fulfill({ status: 204, headers: CORS })
    return route.fulfill(json(404, {}))
  })
  await page.routeWebSocket(/realtime/, (ws) => ws.close())                   // realtime isn't under test
  await page.goto(APP, { waitUntil: 'domcontentloaded' })
  const has = (t) => page.evaluate((x) => document.body.innerText.includes(x), t)
  const waitHas = (t, timeout = 4000) => page.waitForFunction((x) => document.body.innerText.includes(x), t, { timeout }).then(() => true, () => false)
  const click = (n) => page.evaluate((x) => { [...document.querySelectorAll('button')].find((b) => b.textContent.includes(x))?.click() }, n)
  // Drive the email -> code steps. mode: 'Sign In' | 'Create Account'.
  const toCodeStep = async (mode, email = 'steward@example.com') => {
    await page.waitForSelector('text=Create Account')
    await click(mode)
    await page.locator('input[type="email"]').fill(email)
    await click('Continue')
  }
  const enterCode = async () => { await page.waitForSelector('text=Enter your code'); await page.locator('input[type="tel"]').fill('123456'); await click('Verify') }
  try { await run({ page, calls, has, waitHas, click, toCodeStep, enterCode }) } finally { await ctx.close() }
}

const INVITE_ONLY = "Storehouse is invite-only at the moment. If you've been invited, use the email your invite was sent to."
const GENERIC = 'Something went wrong. Please try again, or contact support if it keeps happening.'
const NOT_SIGNED_IN = "We couldn't sign you in with that code. Please request a new code and try again."

// 1. "Signups not allowed for otp" (real GoTrue answer for closed signups / unknown email in sign-in mode)
for (const mode of ['Sign In', 'Create Account']) {
  await scenario({ otp: [422, { code: 422, error_code: 'otp_disabled', msg: 'Signups not allowed for otp' }] }, async ({ has, waitHas, toCodeStep }) => {
    await toCodeStep(mode)
    check(`[${mode}] "Signups not allowed for otp" shows the invite-only message`, await waitHas(INVITE_ONLY))
    check(`[${mode}] ...and never the raw Supabase text`, !(await has('Signups not allowed')))
    check(`[${mode}] ...and stays on the email step (no code screen)`, !(await has('Enter your code')))
  })
}

// 2. Opaque 5xx (supabase-js gives these a useless message like "{}") -> generic text
await scenario({ otp: [500, { msg: 'Database error saving new user' }] }, async ({ has, waitHas, toCodeStep }) => {
  await toCodeStep('Create Account')
  check('Opaque server error on sendOtp shows the generic message', await waitHas(GENERIC))
  check('...not the raw response text', !(await has('Database error')) && !(await has('{}')))
})

// 3. verifyOtp answers OK but without a session -> nobody is signed in
await scenario({ verify: [200, { user: userJson({}) }] }, async ({ page, has, waitHas, toCodeStep, enterCode }) => {
  await toCodeStep('Create Account'); await enterCode()
  check('verifyOtp without a session shows a clear error', await waitHas(NOT_SIGNED_IN))
  await page.waitForTimeout(400)
  check('...stays on the code step (does NOT advance to the app or the details steps)',
    (await has('Enter your code')) && !(await has('Stay on top of your stewardship')) && !(await has('Almost there')) && !(await has('Recent Activity')))
  check('...and no session was stored in the browser', await page.evaluate(() => !Object.keys(localStorage).some((k) => /auth-token/.test(k))))
})

// 4. EXISTING user (already has a name) using "Create Account" -> straight in, name untouched
await scenario({ verify: [200, sessionJson({ name: 'Existing Person' })], meta: { name: 'Existing Person' } }, async ({ calls, has, waitHas, toCodeStep, enterCode }) => {
  await toCodeStep('Create Account'); await enterCode()
  check('Existing user with a name goes straight to the dashboard', await waitHas('Recent Activity', 6000))
  check('...is NOT sent through the "enter your details" steps', !(await has('Stay on top of your stewardship')) && !(await has('Almost there')))
  check('...and their name is never overwritten (no user-update request sent)', !calls.some((c) => c.m === 'PUT' && c.p === '/auth/v1/user'))
})

// 5. Genuinely NEW user (no name yet) -> still asked for their name, and it is saved
await scenario({ verify: [200, sessionJson({})], meta: {} }, async ({ page, calls, has, waitHas, click, toCodeStep, enterCode }) => {
  await toCodeStep('Create Account'); await enterCode()
  check('New user (no name yet) is taken to the notifications step', await waitHas('Stay on top of your stewardship', 6000))
  await click('Maybe Later')
  check('...then asked for their name', await waitHas('Almost there'))
  await page.locator('input[placeholder="Your name"]').fill('New Steward')
  await click('Get Started')
  check('...and lands on the dashboard', await waitHas('Recent Activity', 6000))
  check('...with their name saved once', calls.filter((c) => c.m === 'PUT' && c.p === '/auth/v1/user' && c.body?.data?.name === 'New Steward').length === 1)
})

// 6. Plain sign-in of an existing user still works end to end
await scenario({ verify: [200, sessionJson({ name: 'Existing Person' })], meta: { name: 'Existing Person' } }, async ({ calls, waitHas, toCodeStep, enterCode }) => {
  await toCodeStep('Sign In'); await enterCode()
  check('Sign-in with a valid code reaches the dashboard', await waitHas('Recent Activity', 6000))
  check('...using the "email" OTP type', calls.some((c) => c.p === '/auth/v1/verify' && c.body?.type === 'email'))
})

await browser.close()
await server.close()
const failed = results.filter(([, ok]) => !ok)
console.log(`\n${results.length - failed.length}/${results.length} live-mode auth checks passed`)
process.exit(failed.length ? 1 : 0)
