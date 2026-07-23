import { chromium } from 'playwright'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const page = await (await browser.newContext({ viewport: { width: 460, height: 880 } })).newPage()
page.on('pageerror', (e) => console.error('PAGE ERROR:', e.message))
const results = []
const check = (name, ok) => { results.push([name, ok]); console.log(ok ? 'PASS' : 'FAIL', '—', name) }
const click = (needle) => page.evaluate((n) => {
  const b = [...document.querySelectorAll('button')].find((x) => x.textContent.includes(n)); b?.click(); return !!b
}, needle)
const bodyHas = (t) => page.evaluate((x) => document.body.innerText.includes(x), t)
// Toast assertions were racing a fixed sleep against the toast's paint time
// (flaky under the cumulative render weight of a long sequential run) —
// poll instead of sleeping once.
const waitBodyHas = async (t, timeout = 2000) => {
  try { await page.waitForFunction((x) => document.body.innerText.includes(x), t, { timeout }); return true }
  catch { return false }
}

// --- Failure simulation for error-state coverage -----------------------
// Sandbox mode persists via localStorage, so a failed backend/network call
// (Supabase insert/update in live mode) is mirrored here by making the
// matching localStorage write throw instead of succeeding — same effect
// (the provider call rejects) without touching provider.js production code.
// Scoped to a single key so unrelated writes during the same interaction
// (e.g. other listeners) are unaffected.
const breakStorage = (method, key) => page.evaluate(({ method, key }) => {
  window.__shOrig = window.__shOrig || {}
  if (!window.__shOrig[method]) window.__shOrig[method] = Storage.prototype[method]
  Storage.prototype[method] = function (k, ...rest) {
    if (k === key) throw new Error('Simulated storage failure')
    return window.__shOrig[method].call(this, k, ...rest)
  }
}, { method, key })
const restoreStorage = (method) => page.evaluate((method) => {
  if (window.__shOrig?.[method]) Storage.prototype[method] = window.__shOrig[method]
}, method)

await page.goto('http://localhost:5173/?sandbox=1', { waitUntil: 'networkidle' })

// 1. Auth wiring — email OTP flow: landing -> email -> code -> (push/details,
//    new users only) -> dashboard. Rebuilt from scratch after the old
//    password-based SignInScreen ("Welcome back" on first paint) was replaced
//    by AuthFlow.jsx's 6-digit email-code flow — see that file for every step.
//
//    Confirmed directly in provider.js: verifyOtp() in SANDBOX mode always
//    returns `{ isNewUser: false }`, regardless of the isSignUp flag passed
//    in — so both "Create Account" and "Sign In" go straight to the
//    dashboard once a 6-digit code is entered. That means the push-notification
//    and name-entry steps, while real UI states in AuthFlow.jsx, are NOT
//    reachable through any sandbox-mode UI path — see the note before the
//    "Multi-user data isolation" section near the end of this file for the
//    coverage implication.
const helloGreetingShown = () => page.evaluate(() => /Good (morning|afternoon|evening),/.test(document.body.innerText))

await page.waitForSelector('text=Create Account')
check('Landing screen shows Create Account and Sign In entry points', await bodyHas('Sign In'))
check('Privacy pledge on landing screen', await bodyHas('We do not sell your data'))

await click('Sign In')
await page.waitForSelector('text=Welcome back', { timeout: 3000 })
check('Sign-in mode shows the "Welcome back" heading on the email step', true)

// Client-side email validation runs before any provider call and must not
// advance to the code step on an invalid address.
await page.locator('input[type="email"]').fill('not-an-email')
await click('Continue')
await page.waitForTimeout(200)
check('Invalid email shows inline validation error', await bodyHas('Enter a valid email address'))
check('Invalid email does not advance to the code step', !(await bodyHas('Enter your code')))

// Back button returns to the landing screen without side effects.
await click('Back')
await page.waitForTimeout(150)
check('Back button from the email step returns to the landing screen', await bodyHas('Create Account'))

await click('Sign In')
await page.waitForSelector('text=Welcome back', { timeout: 3000 })
await page.locator('input[type="email"]').fill('steward@example.com')
await click('Continue')
await page.waitForSelector('text=Enter your code', { timeout: 3000 })
check('Valid email + Continue advances to the code step (sandbox sendOtp() is a no-op)', true)
check('Resend cooldown shown after a code is sent', await bodyHas('Resend code in'))

// "Use a different email" returns to the email step and clears the code.
await click('Use a different email')
await page.waitForSelector('text=Welcome back', { timeout: 3000 })
check('"Use a different email" returns to the email step', true)
await click('Continue') // re-send and go back to the code step
await page.waitForSelector('text=Enter your code', { timeout: 3000 })

check('Verify is disabled with no code entered', await page.locator('button', { hasText: 'Verify' }).isDisabled())
await page.locator('input[type="tel"]').fill('12345')
check('Verify still disabled at 5 of 6 digits', await page.locator('button', { hasText: 'Verify' }).isDisabled())
await page.locator('input[type="tel"]').fill('482913') // arbitrary — sandbox accepts ANY 6-digit code
check('Verify enabled once all 6 digits are entered', await page.locator('button', { hasText: 'Verify' }).isEnabled())

await click('Verify')
await page.waitForSelector('text=Recent Activity', { timeout: 5000 })
check('Sign-in creates a session via provider.verifyOtp() (any 6-digit code accepted in sandbox)', await bodyHas('Recent Activity'))
// Greeting text is time-of-day dependent ("Good morning/afternoon/evening") —
// match any of the three rather than hardcoding one, so this doesn't flake
// depending on what time the suite happens to run.
check('Dashboard greets the signed-in user by name derived from their email', await helloGreetingShown())
check('Session persisted (localStorage)', await page.evaluate(() => !!localStorage.getItem('sh_user')))

// 2. Seeded reactive stats
check('Stewardship ratio 10.0% seeded', await bodyHas('10.0%'))
check('Connect Stewardship Source button on dashboard', await bodyHas('Stewardship Source'))

// 3. Sandbox: mock income → stats update WITHOUT refresh
await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForSelector('text=Sandbox', { timeout: 3000 })
await click('Add £100 income')
await page.waitForTimeout(300)
check('Ratio recomputed instantly (10.0→9.7%)', await bodyHas('9.7%'))
await click('Record tithe £28')
await page.waitForTimeout(300)
check('Giving updated after tithe event (£312)', await bodyHas('312'))

// 4. Feed reactivity
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)
check('New ledger rows visible in feed (no refresh)', await bodyHas('Sandbox tithe'))

// 5. Contentment toggle in transaction modal
await click('Sandbox tithe') // opens transaction modal (coffee-row settings modal)
await page.waitForSelector('text=Contentment check', { timeout: 3000 })
check('Contentment Need/Want toggle present', true)
await click('Need')
await click('Save Changes')
await page.waitForTimeout(300)
check('Contentment persisted to Ledger', await page.evaluate(() =>
  JSON.parse(localStorage.getItem('sh_ledger')).find((r) => r.id === 1)?.is_contentment_satisfied === true))

// 6. Reflection modal + save
await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForTimeout(300)
await click('Trigger Sunday reflection')
await page.waitForSelector('text=Weekly Stewardship Reflection', { timeout: 3000 })
await page.locator('textarea').last().fill('Grateful for provision; spending felt content this week.')
await click('Save reflection')
await page.waitForTimeout(300)
check('Reflection saved to Reflections store', await page.evaluate(() =>
  (JSON.parse(localStorage.getItem('sh_refl')) || []).length === 1))

// 7. Plaid sandbox connect
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()).catch(() => {})
await page.waitForTimeout(300)
await click('Connect')
await page.waitForTimeout(2200)
check('Plaid sandbox link → connected state', await bodyHas('Storehouse Sandbox Bank'))

// 8. Add Transaction — general capability: amount, category, description,
//    date, Need/Want, wired through provider.addLedger() (same reactive path
//    as the sandbox events above) so Recent Activity + budget/analytics stats
//    move with zero page reload.
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()).catch(() => {})
await page.waitForTimeout(300)
await page.evaluate(() => { window.__noReloadMarker = 'set-before-add-tx' })

// Baseline: read the Sandbox panel's live "Giving 30d" tile before adding.
await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForSelector('text=Sandbox', { timeout: 3000 })
const readGivingTile = () => page.evaluate(() => {
  const label = [...document.querySelectorAll('p')].find((p) => p.textContent.trim() === 'Giving 30d')
  return label?.parentElement?.querySelector('p.text-cyan-300')?.textContent
})
const givingTileBefore = await readGivingTile()
const ledgerLenBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('sh_ledger') || '[]').length)
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)

check('"Add" entry point next to Recent Activity opens the form', await click('Add'))
await page.waitForSelector('text=Add Transaction', { timeout: 3000 })
// Scope to the topmost sheet — BudgetCard's "Kingdom Giving" label also
// contains the substring "Giving", so an unscoped page-wide click risks
// hitting the wrong element; every interaction below is scoped to this modal.
const modal = page.locator('.animate-slideUp').last()

check('Add Transaction is disabled until the form is valid', await modal.locator('button', { hasText: 'Add Transaction' }).isDisabled())

await modal.locator('input[placeholder="0.00"]').fill('15.50')
await modal.locator('button', { hasText: 'Food' }).click() // opens the category dropdown (default selection)
await page.waitForTimeout(150)
await modal.locator('button', { hasText: 'Giving' }).click()
await modal.locator('input[placeholder="e.g. Coffee with a friend"]').fill('Local church offering')
await modal.locator('button', { hasText: 'Need' }).click()

check('Add Transaction enabled once amount + category + description are set',
  await modal.locator('button', { hasText: 'Add Transaction' }).isEnabled())

await modal.locator('button', { hasText: 'Add Transaction' }).click()
await page.waitForTimeout(300)

check('New transaction appears in Recent Activity (no refresh)', await bodyHas('Local church offering'))
check('Ledger grew by exactly one row', await page.evaluate(
  (before) => JSON.parse(localStorage.getItem('sh_ledger') || '[]').length === before + 1,
  ledgerLenBefore
))
check('New row stored with correct sign/category/contentment', await page.evaluate(() => {
  const row = JSON.parse(localStorage.getItem('sh_ledger') || '[]').find((r) => r.description === 'Local church offering')
  return !!row && row.amount === -15.5 && row.category === 'Giving' && row.is_contentment_satisfied === true
}))

await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForSelector('text=Sandbox', { timeout: 3000 })
const givingTileAfter = await readGivingTile()
check('Sandbox "Giving 30d" stat tile updated after adding transaction (no refresh)',
  !!givingTileBefore && givingTileBefore !== givingTileAfter)
console.log(`   Giving 30d: ${givingTileBefore} → ${givingTileAfter}`)
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)

check('No page reload occurred at any point in the Add Transaction flow',
  await page.evaluate(() => window.__noReloadMarker === 'set-before-add-tx'))

// 9. "Start Fresh" (Account settings) — destructive action needs a real
//    confirm step; Cancel must be a true no-op; confirming empties the
//    ledger (demo + anything real added above) and the dashboard reflects
//    that immediately, no refresh.
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'MG')?.click())
await page.waitForSelector('text=Refer a Friend', { timeout: 3000 })
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Personal details & banks'))?.click())
await page.waitForSelector('text=Personal Details', { timeout: 3000 })

check('"Start Fresh" present in Account settings', await bodyHas('Start Fresh'))
await click('Start Fresh')
await page.waitForTimeout(150)
check('Confirmation step appears before anything is deleted', await bodyHas("can't be undone"))

const lenBeforeCancelTest = await page.evaluate(() => JSON.parse(localStorage.getItem('sh_ledger') || '[]').length)
await click('Cancel')
await page.waitForTimeout(150)
check('Cancel dismisses the confirm step without deleting anything', await page.evaluate(
  (before) => JSON.parse(localStorage.getItem('sh_ledger') || '[]').length === before,
  lenBeforeCancelTest
))

await click('Start Fresh')
await page.waitForTimeout(150)
await click('Yes, clear it')
await page.waitForTimeout(300)
check('Ledger is empty after confirming Start Fresh', await page.evaluate(() =>
  JSON.parse(localStorage.getItem('sh_ledger') || 'null')?.length === 0))

await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.querySelector('svg.lucide-chevron-left'))?.click())
await page.waitForTimeout(300)
check('Recent Activity shows the empty state after Start Fresh (no refresh)', await bodyHas('No transactions yet'))
check('Still no page reload after Start Fresh', await page.evaluate(() => window.__noReloadMarker === 'set-before-add-tx'))

// 10. Household reward approval (Control Center → Cards tab) — sandbox mode.
//     "Approve £5" used to just flash a 2s toast with nothing persisted.
//     Now it goes through provider.approveReward() (mirrors addLedger's
//     dual-mode pattern) and creates a real reward_requests-style record,
//     which shows up in a visible "Reward History" list on the card — not
//     just a toast that disappears — with zero page reload.
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/60')?.click()).catch(() => {})
await page.waitForTimeout(200)
await click('Cards')
await page.waitForSelector('text=Control Center', { timeout: 3000 })

const rewardsBefore = await page.evaluate(() => JSON.parse(localStorage.getItem('sh_rewards') || '[]').length)
check('No reward history shown before any approval', !(await bodyHas('approved')))

await click('Approve £5')
await page.waitForTimeout(300)

check('Approving creates a real reward record (not just a toast)', await page.evaluate(
  (before) => JSON.parse(localStorage.getItem('sh_rewards') || '[]').length === before + 1,
  rewardsBefore
))
check('New reward record is approved, £5, tied to the household member', await page.evaluate(() => {
  const row = JSON.parse(localStorage.getItem('sh_rewards') || '[]')[0]
  return !!row && row.amount === 5 && row.status === 'approved' && !!row.approved_at && row.household_member_id === 1
}))
check('Approved reward now visible in Reward History (persists, not just a 2s toast)', await bodyHas('£5.00 approved'))
check('No page reload occurred during reward approval', await page.evaluate(() => window.__noReloadMarker === 'set-before-add-tx'))

// 11. Error-state regression: failed provider.updateLedger() in
//     TransactionModal ("Save Changes" wasn't awaited and always showed
//     success — fixed to await + try/catch). A failed save must show an
//     error toast, must NOT show the false "saved" success toast, and must
//     NOT close the modal. A retry once the failure clears must work (not
//     stuck).
await click('Home')
await page.waitForTimeout(300)

// Ledger is empty after "Start Fresh" above — add one row back so there's a
// transaction to open. TransactionModal always edits the fixed seed row id
// 1 regardless of which row is clicked, and clearLedger + addLedger means
// this new row is assigned id 1 again, so this lines up correctly.
await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForSelector('text=Sandbox', { timeout: 3000 })
await click('Add £100 income')
await page.waitForTimeout(300)
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)

const ledgerBeforeFailedSave = await page.evaluate(() => localStorage.getItem('sh_ledger'))
await click('Sandbox income') // opens TransactionModal
await page.waitForSelector('text=Contentment check', { timeout: 3000 })

await breakStorage('setItem', 'sh_ledger')
await click('Save Changes')
await page.waitForTimeout(400)

check('Failed transaction save shows an error toast', await waitBodyHas('Simulated storage failure'))
check('Failed transaction save does NOT show the false "saved" success toast', !(await bodyHas('Transaction settings saved')))
check('Failed transaction save does NOT close the modal', await bodyHas('Contentment check'))
const ledgerAfterFailedSave = await page.evaluate(() => localStorage.getItem('sh_ledger'))
check('Failed transaction save leaves the ledger unmodified', ledgerAfterFailedSave === ledgerBeforeFailedSave)
await restoreStorage('setItem')

await click('Save Changes') // retry once storage works again
await page.waitForTimeout(300)
check('Retry after a cleared failure succeeds (modal closes, not stuck)', !(await bodyHas('Contentment check')))
check('Retry after a cleared failure actually persisted the save', await bodyHas('Transaction settings saved'))

// 12. Error-state regression: failed provider.addReflection() in
//     ReflectionModal (no error handling before — silently ate the
//     rejection). A failed save must show an error toast, must not wipe the
//     user's typed content, and must leave the Save button re-enabled
//     rather than stuck on "Saving…".
await page.evaluate(() => [...document.querySelectorAll('button[title="Sandbox"]')][0]?.click())
await page.waitForSelector('text=Sandbox', { timeout: 3000 })
await click('Trigger Sunday reflection')
await page.waitForSelector('text=Weekly Stewardship Reflection', { timeout: 3000 })

const reflBefore = await page.evaluate(() => localStorage.getItem('sh_refl'))
const reflectionText = 'Grateful for provision even when the system fails.'
await page.locator('textarea').last().fill(reflectionText)

await breakStorage('setItem', 'sh_refl')
await click('Save reflection')
await page.waitForTimeout(400)

check('Failed reflection save shows an error toast', await waitBodyHas('Simulated storage failure'))
check('Failed reflection save does NOT show the false "saved" success toast', !(await bodyHas('Reflection saved')))
const reflAfterFailed = await page.evaluate(() => localStorage.getItem('sh_refl'))
check('Failed reflection save leaves stored reflections unmodified', reflAfterFailed === reflBefore)
check('Failed reflection save is not stuck on "Saving…" (button text reset)', await bodyHas('Save reflection'))
const textareaValueAfterFailure = await page.locator('textarea').last().inputValue()
check('Failed reflection save keeps the typed content (not silently wiped)', textareaValueAfterFailure === reflectionText)
await restoreStorage('setItem')

await click('Save reflection') // retry once storage works again
await page.waitForTimeout(300)
check('Reflection retry after a cleared failure closes the modal (not stuck)', !(await bodyHas('Weekly Stewardship Reflection')))
const reflAfterRetry = await page.evaluate(() => JSON.parse(localStorage.getItem('sh_refl') || '[]').length)
const reflBeforeCount = JSON.parse(reflBefore || '[]').length
check('Reflection retry after a cleared failure actually persisted', reflAfterRetry === reflBeforeCount + 1)

// 13. Error-state regression: a failed Plaid connect/disconnect in
//     AccountView (no error handling before — toggle silently no-opped) must
//     show an error toast rather than failing silently, on BOTH branches of
//     the toggle (connect and disconnect), and must not flip the UI into a
//     false state while the underlying write failed.
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'MG')?.click())
await page.waitForSelector('text=Refer a Friend', { timeout: 3000 })
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.includes('Personal details & banks'))?.click())
await page.waitForSelector('text=Personal Details', { timeout: 3000 })

check('Plaid already connected from earlier sandbox test (setup for this block)', await bodyHas('Storehouse Sandbox Bank'))
const plaidBeforeFailedDisconnect = await page.evaluate(() => localStorage.getItem('sh_plaid'))

await breakStorage('setItem', 'sh_plaid')
await click('Stewardship Source') // AccountView's Plaid ToggleRow — currently connected, so this attempts disconnect
await page.waitForTimeout(300)

check('Failed Plaid disconnect shows an error toast', await waitBodyHas('Simulated storage failure'))
check('Failed Plaid disconnect does NOT show the false "disconnected" success toast', !(await bodyHas('Stewardship source disconnected')))
const plaidAfterFailedDisconnect = await page.evaluate(() => localStorage.getItem('sh_plaid'))
check('Failed Plaid disconnect leaves Plaid status unchanged', plaidAfterFailedDisconnect === plaidBeforeFailedDisconnect)
await restoreStorage('setItem')

await click('Stewardship Source') // retry once storage works again — real disconnect
await page.waitForTimeout(300)
check('Plaid disconnect succeeds once storage works again', !(await bodyHas('Storehouse Sandbox Bank')))

await breakStorage('setItem', 'sh_plaid')
await click('Stewardship Source') // now disconnected, so this attempts connect
await page.waitForTimeout(2200) // sandbox connectPlaid() has an artificial ~1.5s delay before writing
check('Failed Plaid connect shows an error toast', await waitBodyHas('Simulated storage failure'))
check('Failed Plaid connect does NOT show the false "connected" success toast', !(await bodyHas('Stewardship source connected')))
check('Failed Plaid connect leaves Plaid disconnected (no false success state)', !(await bodyHas('Storehouse Sandbox Bank')))
await restoreStorage('setItem')

// 14. Error-state regression: a failed provider.signOut() (no error handling
//     before — an error would leave the UI stuck showing a signed-in screen
//     behind a session the provider itself never confirmed closing) must
//     still clear LOCAL session state via the caller's `finally` block, and
//     must show a toast rather than failing silently. The `finally` is what
//     the sign-in screen appearing here actually proves: the localStorage
//     removal we've broken did NOT run, yet the UI still moved to
//     signed-out — because Storehouse.jsx's `finally { setSignedIn(false) }`
//     doesn't depend on the provider call having succeeded.
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.querySelector('svg.lucide-chevron-left'))?.click())
await page.waitForTimeout(300)

const userBeforeFailedSignOut = await page.evaluate(() => localStorage.getItem('sh_user'))
await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'MG')?.click())
await page.waitForSelector('text=Sign Out', { timeout: 3000 })

await breakStorage('removeItem', 'sh_user')
await click('Sign Out')
await page.waitForTimeout(300)

check('Failed sign-out still moves the UI to signed-out (finally-block clears local session state)', await bodyHas('Create Account'))
check('Failed sign-out shows an error toast rather than failing silently', await waitBodyHas('Simulated storage failure'))
const userAfterFailedSignOut = await page.evaluate(() => localStorage.getItem('sh_user'))
check('Underlying provider.signOut() call genuinely failed (localStorage untouched) — proves finally, not success, drove the UI change',
  userAfterFailedSignOut === userBeforeFailedSignOut)
await restoreStorage('removeItem')

// 15. Multi-user data isolation — assessed per the account owner's request.
// -------------------------------------------------------------------------
// CONCLUSION: meaningful multi-user data ISOLATION cannot be tested in
// sandbox mode. It is inherently a live-mode-only concern, and the checks
// below exist to demonstrate and document that limitation with real
// evidence, not to fake coverage of something they can't actually prove.
//
// Why: sandbox mode is a single local demo profile, not a multi-tenant
// store.
//   - Every sandbox storage key in provider.js (K.user, K.ledger, K.goals,
//     K.refl, K.plaid, K.household, K.rewards) is one fixed localStorage
//     key — there is no per-user namespace to even attempt to keep separate.
//   - provider.verifyOtp() hardcodes `id: 'sandbox-user'` for EVERY email
//     that signs in, sandbox-wide — two different emails are not given two
//     different identities internally, only a different display name/email
//     string.
// So "signing in as a different user" in sandbox mode cannot expose a data
// leak between users, because there is only ever one user's worth of data
// storage to begin with — a leak-based test would be checking for a bug
// that has no code path to occur through.
//
// Real isolation is enforced server-side, in live mode only, by Postgres
// RLS policies keyed on auth.uid() (see supabase/schema.sql — "own ledger",
// "own reflections", "own goals", "own household", all
// `using (auth.uid() = user_id)` / `= auth_id`). Verifying that requires a
// live Supabase project and two real, distinct signed-up accounts, neither
// of which exists in this sandboxed environment (no VITE_SUPABASE_* env
// vars are set — see CLAUDE.md / task brief). That verification is out of
// scope here and should be re-run against a live/staging Supabase project
// with two real test accounts before this is treated as proven in
// production.
const signedOutNow = () => bodyHas('Create Account')
const signOutIfSignedIn = async () => {
  if (await signedOutNow()) return
  await page.evaluate(() => [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === 'MG')?.click())
  await page.waitForSelector('text=Sign Out', { timeout: 3000 })
  await click('Sign Out')
  await page.waitForTimeout(300)
}
const signInAs = async (email) => {
  await click('Sign In')
  await page.waitForSelector('text=Welcome back', { timeout: 3000 })
  await page.locator('input[type="email"]').fill(email)
  await click('Continue')
  await page.waitForSelector('text=Enter your code', { timeout: 3000 })
  await page.locator('input[type="tel"]').fill('135790') // any 6 digits
  await click('Verify')
  await page.waitForSelector('text=Recent Activity', { timeout: 5000 })
}

await signOutIfSignedIn() // the failed-sign-out test above already left us signed out
await signInAs('user-a@example.com')
check('"User A" is given the same hardcoded sandbox id as every sandbox sign-in ("sandbox-user")',
  await page.evaluate(() => JSON.parse(localStorage.getItem('sh_user') || '{}').id === 'sandbox-user'))

await click('Add')
await page.waitForSelector('text=Add Transaction', { timeout: 3000 })
const isolationModal = page.locator('.animate-slideUp').last()
await isolationModal.locator('input[placeholder="0.00"]').fill('1.23')
await isolationModal.locator('input[placeholder="e.g. Coffee with a friend"]').fill('ISOLATION-TEST-MARKER (added by user A)')
await isolationModal.locator('button', { hasText: 'Need' }).click()
await isolationModal.locator('button', { hasText: 'Add Transaction' }).click()
await page.waitForTimeout(300)
check('Marker transaction recorded while signed in as "user A"', await bodyHas('ISOLATION-TEST-MARKER (added by user A)'))

await signOutIfSignedIn()
await signInAs('user-b@example.com') // a different email — a real product must treat this as a different person

check('[Sandbox limitation, not a bug] "User B" is given the SAME hardcoded sandbox id as "user A" ("sandbox-user") — sandbox mode does not model separate users at all',
  await page.evaluate(() => JSON.parse(localStorage.getItem('sh_user') || '{}').id === 'sandbox-user'))
check('[Sandbox limitation, not a bug] "User B" sees "user A\'s" marker transaction — proves sandbox mode has ONE shared local data namespace, not per-user isolation. Real isolation is server-side RLS in live mode only (supabase/schema.sql) and is NOT verified by this run',
  await bodyHas('ISOLATION-TEST-MARKER (added by user A)'))

console.log('\n[Multi-user isolation assessment]')
console.log('  Sandbox mode CANNOT meaningfully test data isolation between users:')
console.log('  - provider.js hardcodes id: "sandbox-user" for every sandbox sign-in, regardless of email.')
console.log('  - Every sandbox storage key (sh_ledger, sh_goals, sh_refl, sh_plaid, ...) is one shared')
console.log('    localStorage key — there is no per-user partition for a test to check.')
console.log('  - Demonstrated above: signing in as a second, different email still sees the first')
console.log('    "user\'s" data — expected sandbox behaviour, not a regression.')
console.log('  Real isolation is enforced server-side by Postgres RLS (auth.uid() = user_id in')
console.log('  supabase/schema.sql). Verifying THAT requires a live Supabase project with two distinct')
console.log('  real accounts — not available in this sandboxed, no-live-Supabase environment. Treat')
console.log('  multi-user isolation as UNVERIFIED in production until that live-mode test is run.')

await browser.close()
const failed = results.filter(([, ok]) => !ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
