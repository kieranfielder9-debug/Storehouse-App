import { chromium } from 'playwright'
import { mkdirSync } from 'fs'
mkdirSync('screenshots', { recursive: true })

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' })
const ctx = await browser.newContext({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: 1.5 })
const page = await ctx.newPage()
page.on('pageerror', (e) => console.error('PAGE ERR:', e.message))

const shoot = async (view, name, full = true) => {
  await page.goto(`http://localhost:5173/?site=wisdom-wallet&view=${view}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `screenshots/ww-${name}.png`, fullPage: full })
  console.log('captured', name)
}

await shoot('home',       '01-home',          true)
await shoot('module',     '02-module',        true)
await shoot('lesson',     '03-lesson',        true)
await shoot('parent',     '04-parent',        true)
await shoot('completion', '05-completion',    true)

// Above-the-fold viewport-only versions
const shootFold = async (view, name) => {
  await page.goto(`http://localhost:5173/?site=wisdom-wallet&view=${view}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(700)
  await page.screenshot({ path: `screenshots/ww-${name}.png`, fullPage: false })
  console.log('captured', name)
}
await shootFold('home',       '01a-home-fold')
await shootFold('parent',     '04a-parent-fold')
await shootFold('completion', '05a-completion-fold')

await browser.close()
console.log('done')
