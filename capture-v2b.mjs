import { chromium } from 'playwright'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width: 460, height: 880 }, deviceScaleFactor: 2 })
const page = await ctx.newPage()

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Welcome back')
await page.locator('button:has-text("Sign In")').first().click()
await page.waitForTimeout(800)

const shoot = async (n) => {
  await page.screenshot({ path: `screenshots/v2-${n}.png` })
  console.log('captured', n)
}

// go to invest tab
await page.evaluate(() => {
  const btns = [...document.querySelectorAll('button')]
  const t = btns.find(b => b.textContent.trim() === 'Invest')
  t?.click()
})
await page.waitForTimeout(700)

// Scroll all the way down so AI Suggestions card is fully visible
await page.evaluate(() => {
  const m = document.querySelector('main')
  m?.scrollTo({ top: m.scrollHeight, behavior: 'instant' })
})
await page.waitForTimeout(400)

// Tap "Update my values profile"
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Update my values'))
  b?.click()
})
await page.waitForSelector('text=How comfortable are you with risk', { timeout: 5000 })
await page.waitForTimeout(400)
await shoot('15-values-quiz')

// pick Balanced and Next
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Balanced'))
  b?.click()
})
await page.waitForTimeout(200)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim().startsWith('Next'))
  b?.click()
})
await page.waitForTimeout(300)
await shoot('15b-values-step2')

// close modal
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/80')?.click())
await page.waitForTimeout(300)

// scroll up to watchlist
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 750, behavior: 'instant' }))
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Trinity BioSciences'))
  b?.click()
})
await page.waitForSelector('text=Stewardship Screen', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('16-stock-detail')

// close, go to Cards
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Cards')
  b?.click()
})
await page.waitForTimeout(600)
await shoot('17-cards-gladstone')

// tap card
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Michael Gladstone') && b.textContent.includes('Cardholder'))
  b?.click()
})
await page.waitForSelector('text=Apple Wallet', { timeout: 3000 })
await page.waitForTimeout(400)
await shoot('18-card-options')

// close, go Kingdom
await page.evaluate(() => document.querySelector('.absolute.inset-0.bg-black\\/70')?.click())
await page.waitForTimeout(300)
await page.evaluate(() => {
  const b = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Kingdom')
  b?.click()
})
await page.waitForTimeout(600)
await shoot('19-capital-expanded')

// scroll Capital
await page.evaluate(() => document.querySelector('main')?.scrollTo({ top: 500, behavior: 'instant' }))
await page.waitForTimeout(300)
await shoot('20-capital-scrolled')

await browser.close()
console.log('done')
