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

await page.goto('http://localhost:5173/?sandbox=1', { waitUntil: 'networkidle' })

// 1. Auth wiring
await page.waitForSelector('text=Welcome back')
check('Privacy pledge on sign-in screen', await bodyHas('We do not sell your data'))
await click('Sign In')
await page.waitForSelector('text=Good afternoon', { timeout: 5000 })
check('Sign-in creates session via provider', true)
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

await browser.close()
const failed = results.filter(([, ok]) => !ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
