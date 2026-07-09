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

await browser.close()
const failed = results.filter(([, ok]) => !ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
process.exit(failed.length ? 1 : 0)
