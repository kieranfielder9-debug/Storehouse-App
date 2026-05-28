import { chromium } from 'playwright'
import { mkdirSync } from 'fs'

mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'
})

const ctx = await browser.newContext({
  viewport: { width: 460, height: 880 },
  deviceScaleFactor: 2
})
const page = await ctx.newPage()

page.on('pageerror', (err) => console.error('PAGE ERROR:', err.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') console.error('CONSOLE ERROR:', msg.text())
})

console.log('navigating...')
await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=STOREHOUSE', { timeout: 10000 })
await page.waitForTimeout(600)

const shots = []
const shoot = async (name) => {
  const path = `screenshots/${name}.png`
  await page.screenshot({ path, fullPage: false })
  shots.push(path)
  console.log('captured', path)
}

// 1. Dashboard
await shoot('01-dashboard')

// 2. Weekly Wrap takeover
await page.getByText('Your Weekly Stewardship').click()
await page.waitForTimeout(500)
await shoot('02-weekly-wrap')

// advance to next wrap slide
await page.locator('button[aria-label="next"]').click()
await page.waitForTimeout(400)
await shoot('03-weekly-wrap-slide2')

// close wrap
await page.locator('button:has-text("Back to Storehouse")').click()
await page.waitForTimeout(400)

// 3. Transaction modal
await page.getByText('Coffee at Leeds Centre').click()
await page.waitForTimeout(500)
await shoot('04-transaction-modal')

// open category dropdown
await page.getByRole('button', { name: 'Food', exact: false }).first().click().catch(()=>{})
await page.waitForTimeout(400)
await shoot('05-transaction-category-open')

// close transaction modal
await page.locator('button:has-text("Save Changes")').click()
await page.waitForTimeout(500)

// 4. Invest tab
await page.getByRole('button', { name: /Invest/ }).first().click()
await page.waitForTimeout(500)
await shoot('06-invest')

// click Auto-Copy to show syncing
await page.locator('button:has-text("Auto-Copy")').first().click()
await page.waitForTimeout(800)
await shoot('07-invest-syncing')
await page.waitForTimeout(1500)
await shoot('08-invest-synced')

// click a pie slice — dispatch click via JS so React handler fires
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Kingdom Tech Expansion'))
  btn?.click()
})
await page.waitForSelector('text=Allocation Pie', { timeout: 5000 })
await page.waitForTimeout(400)
await shoot('09-pie-detail')
await page.evaluate(() => {
  const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'Adjust Allocation')
  btn?.click()
})
await page.waitForTimeout(400)

// 5. Cards tab
await page.getByRole('button', { name: /Cards/ }).first().click()
await page.waitForTimeout(500)
await shoot('10-cards')

// toggle freeze
await page.getByText('Freeze Primary Card').click()
await page.waitForTimeout(500)
await shoot('11-cards-frozen')

// approve allowance
await page.locator('button:has-text("Approve £5")').click()
await page.waitForTimeout(500)
await shoot('12-cards-approve')

// 6. Kingdom Capital tab
await page.getByRole('button', { name: /Kingdom/ }).first().click()
await page.waitForTimeout(500)
await shoot('13-capital')

// open invest modal
await page.locator('button:has-text("Invest Now")').first().click()
await page.waitForTimeout(500)
await shoot('14-capital-invest-modal')

await browser.close()
console.log('\nDone. shots:', shots.length)
