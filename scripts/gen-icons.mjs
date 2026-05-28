import sharp from 'sharp'
import { readFileSync } from 'fs'

const svg = readFileSync('public/icon.svg')

const sizes = [
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'icon-192.png' },
  { size: 512, name: 'icon-512.png' },
  { size: 32,  name: 'favicon-32.png' }
]

for (const { size, name } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(`public/${name}`)
  console.log('  rendered', name)
}

// Maskable variant with safe area (inner 80% holds the mark)
await sharp(svg)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: { r: 13, g: 148, b: 136, alpha: 1 } })
  .png()
  .toFile('public/icon-512-maskable.png')
console.log('  rendered icon-512-maskable.png')

console.log('icons generated.')
