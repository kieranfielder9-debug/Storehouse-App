import { chromium } from 'playwright'

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({
  viewport: { width: 460, height: 880 },
  deviceScaleFactor: 2,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1'
})
const page = await ctx.newPage()

await page.goto('http://localhost:5173/', { waitUntil: 'networkidle' })
await page.waitForSelector('text=Welcome back', { timeout: 10000 })
await page.locator('button:has-text("Sign In")').first().click()
await page.waitForTimeout(800)

await page.screenshot({ path: 'screenshots/pwa-install-prompt.png' })
console.log('captured pwa-install-prompt.png')

await browser.close()
