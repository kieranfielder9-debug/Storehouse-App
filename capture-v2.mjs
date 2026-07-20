import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
})
const ctx = await browser.newContext({ viewport: { width: 460, height: 880 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()

page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message))

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Welcome back', { timeout: 10000 })
await page.waitForTimeout(400)

const shoot = async (name) => {
  await page.screenshot({ path: `screenshots/v2-${name}.png`, fullPage: false })
  console.log('captured', name)
}

await shoot('01-signin')

// click Sign In
await page.locator('button:has-text("Sign In")').first().click()
await page.waitForSelector('text=Good afternoon', { timeout: 5000 })
await page.waitForTimeout(500)
await shoot('02-dashboard')

// scroll down to show analytics
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 600, behavior: 'instant' }))
await page.waitForTimeout(300)
await shoot('03-dashboard-scrolled')

// scroll back to top
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 0, behavior: 'instant' }))
await page.waitForTimeout(300)

// open profile menu
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'MG')
  b?.click()
})
await page.waitForSelector('text=Refer a Friend', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('04-profile-menu')

// open account view
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Personal details & banks'))
  b?.click()
})
await page.waitForSelector('text=Personal Details', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('05-account')

// back, open preferences
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.querySelector('svg.lucide-chevron-left'))
  b?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'MG')
  b?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Appearance & notifications'))
  b?.click()
})
await page.waitForSelector('text=Organise Your Experience', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('06-preferences')

// back to dashboard
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.querySelector('svg.lucide-chevron-left'))
  b?.click()
})
await page.waitForTimeout(300)

// open notifications
await page.evaluate(() => {
  const bells = [...document.querySelectorAll('button')].filter(b => b.querySelector('svg.lucide-bell'))
  bells[0]?.click()
})
await page.waitForSelector('text=Notifications', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('07-notifications')

// close, open balance detail (Everyday)
await page.keyboard.press('Escape').catch(() => {})
await page.evaluate(() => {
  document.querySelector('div.fixed, .absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
// click everyday card
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Everyday') && b.textContent.includes('1,420'))
  b?.click()
})
await page.waitForSelector('text=Balance now', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('08-balance-detail')

// close and open budget
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Monthly Budget') && b.textContent.includes('May 2026 cycle'))
  b?.click()
})
await page.waitForSelector('text=Categories', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('09-budget-detail')

// close and open Pay
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Pay')
  b?.click()
})
await page.waitForSelector('text=Pay or Transfer', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('10-pay-transfer')

// QR mode
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('QR Code'))
  b?.click()
})
await page.waitForTimeout(300)
await shoot('11-pay-qr')

// close, open Give
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Give')
  b?.click()
})
await page.waitForSelector('text=Tithes, missions', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('12-give')

// close and go to Invest
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Invest') && b.querySelector('svg'))
  b?.click()
})
await page.waitForTimeout(500)
// scroll to leaderboard
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 250, behavior: 'instant' }))
await page.waitForTimeout(300)
await shoot('13-invest-leaderboard')

// scroll to AI suggestions
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 1400, behavior: 'instant' }))
await page.waitForTimeout(300)
await shoot('14-invest-ai')

// open values quiz
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Update my values profile'))
  b?.click()
})
await page.waitForSelector('text=How comfortable are you with risk', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('15-values-quiz')

// close, click watchlist row
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/80')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 700, behavior: 'instant' }))
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Trinity BioSciences'))
  b?.click()
})
await page.waitForSelector('text=Stewardship Screen', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('16-stock-detail')

// close, go to Cards tab
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Cards') && b.querySelector('svg'))
  b?.click()
})
await page.waitForTimeout(500)
await shoot('17-cards-gladstone')

// click first card
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Michael Gladstone'))
  b?.click()
})
await page.waitForSelector('text=Card options', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('18-card-options')

// close, go to Capital
await page.evaluate(() => {
  document.querySelector('.absolute.inset-0.bg-black\\/70')?.click()
})
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Kingdom') && b.querySelector('svg'))
  b?.click()
})
await page.waitForTimeout(500)
await shoot('19-capital-expanded')

await browser.close()
console.log('done')
