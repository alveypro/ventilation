#!/usr/bin/env node
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import { chromium } from 'playwright'

const argv = process.argv.slice(2)
const args = new Set(argv)
const loginMode = args.has('--login')
const skipUpload = args.has('--no-upload')
const interactiveBypass = !args.has('--no-interactive')
const pagesArg = argv.find(x => x.startsWith('--pages='))
const maxPages = Math.max(1, Math.min(500, Number(pagesArg?.split('=')[1] || 1) || 1))
const maxOffersArg = argv.find(x => x.startsWith('--max-offers='))
const maxOffers = Math.max(12, Math.min(2000, Number(maxOffersArg?.split('=')[1] || 240) || 240))

const HOME = os.homedir()
const WORK_DIR = process.cwd()
const STATE_DIR = path.join(WORK_DIR, '.cache', 'market-crawler')
const STATE_FILE = path.join(STATE_DIR, 'storage-state.json')
const OUT_FILE = path.join(WORK_DIR, 'public', 'data', 'respirators', 'free_market_prices.json')

const REMOTE_HOST = process.env.REMOTE_HOST || 'root@47.90.160.87'
const REMOTE_KEY = process.env.REMOTE_KEY || path.join(HOME, 'Downloads', 'open.pem')
const REMOTE_OUT = '/home/admin/.openclaw/workspace/data/respirators/free_market_prices.json'

const targets = [
  {
    id: 'taobao',
    urlForPage: page =>
      `https://s.taobao.com/search?page=${page}&q=%E5%91%BC%E5%90%B8%E6%9C%BA&tab=all`,
  },
  {
    id: 'tmall',
    urlForPage: page =>
      `https://s.taobao.com/search?page=${page}&fromTmallRedirect=true&tab=mall&q=%E5%91%BC%E5%90%B8%E6%9C%BA`,
  },
]

const now = () => new Date().toISOString()

const detectBlocked = (html, finalUrl) => {
  const lower = `${html}\n${finalUrl}`.toLowerCase()
  return ['captcha', 'verify', 'robot', 'risk', 'punish', 'blocked', 'forbidden', 'login'].some(x => lower.includes(x))
}

const collectOffers = async (page) => {
  return await page.evaluate(() => {
    const priceRe = /(?:US\$|\$|¥|￥)\s?\d[\d,.]*|\d[\d,.]*\s*元/g
    const rows = []
    const anchors = Array.from(document.querySelectorAll('a[href]'))
    for (const a of anchors) {
      const title = (a.textContent || '').replace(/\s+/g, ' ').trim()
      if (!title || title.length < 6) continue
      const block = (a.closest('div,li,article,section')?.textContent || a.textContent || '').replace(/\s+/g, ' ').trim()
      const prices = block.match(priceRe) || []
      if (!prices.length) continue
      const href = a.href || ''
      if (!href.startsWith('http')) continue
      rows.push({
        title: title.slice(0, 200),
        url: href,
        prices: prices.slice(0, 3),
        snippet: block.slice(0, 320),
      })
      if (rows.length >= 20) break
    }
    return rows
  })
}

const collectFromRawHtml = (html) => {
  const rows = []
  const pushRow = (title, price, url = '') => {
    const t = (title || '').replace(/\s+/g, ' ').trim()
    const p = (price || '').replace(/\s+/g, ' ').trim()
    if (!t || !p) return
    rows.push({ title: t.slice(0, 200), url, prices: [p], snippet: '' })
  }

  const patterns = [
    /"raw_title":"([^"]{6,220})"[^{}]{0,260}?"view_price":"([^"]{1,40})"/g,
    /"title":"([^"]{6,220})"[^{}]{0,260}?"price":"([^"]{1,40})"/g,
    /"title":"([^"]{6,220})"[^{}]{0,260}?"priceText":"([^"]{1,40})"/g,
  ]

  for (const re of patterns) {
    let m
    while ((m = re.exec(html)) !== null) {
      pushRow(m[1], m[2])
      if (rows.length >= 20) break
    }
    if (rows.length >= 20) break
  }

  return rows
}

const scrollPage = async (page) => {
  try {
    await page.evaluate(async () => {
      await new Promise(resolve => {
        let count = 0
        const timer = setInterval(() => {
          window.scrollBy(0, 900)
          count += 1
          if (count >= 8) {
            clearInterval(timer)
            resolve()
          }
        }, 450)
      })
    })
  } catch {}
}

const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true })

const saveResult = (obj) => {
  ensureDir(path.dirname(OUT_FILE))
  fs.writeFileSync(OUT_FILE, JSON.stringify(obj, null, 2), 'utf-8')
}

const uploadToEcs = () => {
  execFileSync('scp', ['-i', REMOTE_KEY, OUT_FILE, `${REMOTE_HOST}:${REMOTE_OUT}`], { stdio: 'inherit' })
  execFileSync('ssh', ['-i', REMOTE_KEY, REMOTE_HOST, '/usr/local/bin/sync_openclaw_respirators.sh'], { stdio: 'inherit' })
}

const run = async () => {
  ensureDir(STATE_DIR)
  const context = await chromium.launchPersistentContext(path.join(STATE_DIR, 'chromium-profile'), {
    headless: false,
    viewport: { width: 1440, height: 2200 },
    locale: 'zh-CN',
    args: [
      '--disable-blink-features=AutomationControlled',
      '--start-maximized',
      '--no-default-browser-check',
      '--disable-dev-shm-usage',
    ],
  })
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined })
  })

  if (loginMode) {
    const page = await context.newPage()
    await page.goto('https://login.taobao.com/', { waitUntil: 'domcontentloaded', timeout: 60000 })
    console.log('请在打开的浏览器里完成淘宝登录，完成后回终端按 Enter 继续...')
    process.stdin.resume()
    await new Promise(resolve => process.stdin.once('data', resolve))
    await context.storageState({ path: STATE_FILE })
    console.log(`已保存登录状态: ${STATE_FILE}`)
  }

  if (fs.existsSync(STATE_FILE)) {
    const state = JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'))
    if (Array.isArray(state.cookies) && state.cookies.length) {
      await context.addCookies(state.cookies)
    }
  }

  const result = {
    generated_at: now(),
    mode: 'local-browser',
    keyword: '呼吸机',
    pages: maxPages,
    max_offers: maxOffers,
    platforms: {},
  }

  for (const t of targets) {
    const page = await context.newPage()
    const seen = new Set()
    const offers = []
    let lastFinalUrl = ''
    let lastBlocked = false
    let crawledPages = 0
    let emptyPages = 0
    let fatalError = null
    try {
      for (let i = 1; i <= maxPages; i += 1) {
        const pageUrl = t.urlForPage(i)
        await page.goto(pageUrl, { waitUntil: 'commit', timeout: 90000 })
        await page.waitForTimeout(8000)
        await scrollPage(page)
        await page.waitForTimeout(2000)

        let html = await page.content()
        let finalUrl = page.url()
        let blocked = detectBlocked(html, finalUrl)
        if (blocked && interactiveBypass) {
          console.log(`[${t.id} p${i}] 检测到拦截，请在浏览器中手动完成验证/滑块，完成后回终端按 Enter 继续...`)
          process.stdin.resume()
          await new Promise(resolve => process.stdin.once('data', resolve))
          await page.waitForTimeout(4000)
          await scrollPage(page)
          await page.waitForTimeout(1500)
          html = await page.content()
          finalUrl = page.url()
          blocked = detectBlocked(html, finalUrl)
        }

        lastFinalUrl = finalUrl
        lastBlocked = blocked
        crawledPages += 1

        const domOffers = await collectOffers(page)
        const rawOffers = collectFromRawHtml(html)
        const merged = [...domOffers, ...rawOffers]
        let pageAdded = 0
        for (const item of merged) {
          const key = `${item.title}|${item.prices?.[0] || ''}|${item.url || ''}`
          if (seen.has(key)) continue
          seen.add(key)
          offers.push(item)
          pageAdded += 1
          if (offers.length >= maxOffers) break
        }

        if (pageAdded === 0) emptyPages += 1
        else emptyPages = 0

        if (offers.length >= maxOffers) break
        if (emptyPages >= 3) break
      }

      result.platforms[t.id] = {
        status: offers.length ? 'ok' : lastBlocked ? 'blocked' : 'empty',
        final_url: lastFinalUrl,
        blocked_hint: lastBlocked,
        pages_crawled: crawledPages,
        offers: offers.slice(0, maxOffers),
        at: now(),
      }
      await page.screenshot({ path: path.join(STATE_DIR, `${t.id}-last.png`), fullPage: true }).catch(() => {})
    } catch (error) {
      fatalError = error
      result.platforms[t.id] = {
        status: 'error',
        error: `${error}`,
        pages_crawled: crawledPages,
        offers: offers.slice(0, maxOffers),
        at: now(),
      }
    } finally {
      await page.close()
    }
    if (fatalError) {
      // Keep going for other platforms even if one platform fails.
    }
  }

  saveResult(result)
  await context.storageState({ path: STATE_FILE })
  console.log(`已写入: ${OUT_FILE}`)

  if (!skipUpload) {
    uploadToEcs()
    console.log('已上传并同步到服务器。')
  }

  await context.close()
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
