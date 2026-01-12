const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

;(async () => {
  const outDir = path.resolve(__dirname, '..', 'screenshots')
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })

  const browser = await chromium.launch({ args: ['--no-sandbox'] })
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } })

  const urls = [
    'http://localhost:5173/',
    'http://localhost:5173/products',
    'http://localhost:5173/brands',
    'http://localhost:5173/doctor',
    'http://localhost:5173/product/1',
    'http://localhost:5173/compare'
  ]

  for (const u of urls) {
    try {
      console.log('Goto', u)
      await page.goto(u, { waitUntil: 'networkidle', timeout: 30000 })
      const name = u.replace(/[:\/]+/g, '_').replace(/[^a-zA-Z0-9_\-\.]/g, '')
      const out = path.join(outDir, `${name}.png`)
      await page.screenshot({ path: out, fullPage: true })
      console.log('Saved', out)
    } catch (e) {
      console.error('Failed to capture', u, e.message)
    }
  }

  await browser.close()
  console.log('Done')
})()
