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
const resumeEnabled = !args.has('--no-resume')
const resetCheckpoint = args.has('--reset-checkpoint')

const pagesArg = argv.find(x => x.startsWith('--pages='))
const maxPages = Math.max(1, Math.min(500, Number(pagesArg?.split('=')[1] || 1) || 1))

const maxOffersArg = argv.find(x => x.startsWith('--max-offers='))
const maxOffers = Math.max(12, Math.min(2000, Number(maxOffersArg?.split('=')[1] || 240) || 240))

const retryArg = argv.find(x => x.startsWith('--retry='))
const maxRetries = Math.max(0, Math.min(10, Number(retryArg?.split('=')[1] || 2) || 2))

const delayMinArg = argv.find(x => x.startsWith('--delay-min='))
const delayMaxArg = argv.find(x => x.startsWith('--delay-max='))
const delayMin = Math.max(500, Math.min(60000, Number(delayMinArg?.split('=')[1] || 1800) || 1800))
const delayMax = Math.max(delayMin, Math.min(120000, Number(delayMaxArg?.split('=')[1] || 5200) || 5200))

const HOME = os.homedir()
const WORK_DIR = process.cwd()
const STATE_DIR = path.join(WORK_DIR, '.cache', 'market-crawler')
const STATE_FILE = path.join(STATE_DIR, 'storage-state.json')
const CHECKPOINT_FILE = path.join(STATE_DIR, 'checkpoint.json')
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
const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1))
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
const waitRandom = async (min, max) => sleep(randInt(min, max))

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

const loadCheckpoint = () => {
  if (!resumeEnabled) return null
  if (!fs.existsSync(CHECKPOINT_FILE)) return null
  try {
    return JSON.parse(fs.readFileSync(CHECKPOINT_FILE, 'utf-8'))
  } catch {
    return null
  }
}

const saveCheckpoint = (checkpoint) => {
  ensureDir(path.dirname(CHECKPOINT_FILE))
  fs.writeFileSync(CHECKPOINT_FILE, JSON.stringify(checkpoint, null, 2), 'utf-8')
}

const saveResult = (obj) => {
  ensureDir(path.dirname(OUT_FILE))
  fs.writeFileSync(OUT_FILE, JSON.stringify(obj, null, 2), 'utf-8')
}

const uploadToEcs = () => {
  execFileSync('scp', ['-i', REMOTE_KEY, OUT_FILE, `${REMOTE_HOST}:${REMOTE_OUT}`], { stdio: 'inherit' })
  execFileSync('ssh', ['-i', REMOTE_KEY, REMOTE_HOST, '/usr/local/bin/sync_openclaw_respirators.sh'], { stdio: 'inherit' })
}

const runOnePage = async ({ page, platformId, pageNo, urlForPage }) => {
  const pageUrl = urlForPage(pageNo)
  await page.goto(pageUrl, { waitUntil: 'commit', timeout: 90000 })
  await waitRandom(3500, 9000)
  await scrollPage(page)
  await waitRandom(1200, 3200)

  let html = await page.content()
  let finalUrl = page.url()
  let blocked = detectBlocked(html, finalUrl)

  if (blocked && interactiveBypass) {
    console.log(`[${platformId} p${pageNo}] 检测到拦截，请在浏览器手动完成验证后回终端按 Enter 继续...`)
    process.stdin.resume()
    await new Promise(resolve => process.stdin.once('data', resolve))
    await waitRandom(3000, 6000)
    await scrollPage(page)
    await waitRandom(1000, 2500)
    html = await page.content()
    finalUrl = page.url()
    blocked = detectBlocked(html, finalUrl)
  }

  const domOffers = await collectOffers(page)
  const rawOffers = collectFromRawHtml(html)
  const merged = [...domOffers, ...rawOffers]

  return { html, finalUrl, blocked, merged }
}

const run = async () => {
  ensureDir(STATE_DIR)

  if (resetCheckpoint && fs.existsSync(CHECKPOINT_FILE)) {
    fs.unlinkSync(CHECKPOINT_FILE)
    console.log(`已清理断点文件: ${CHECKPOINT_FILE}`)
  }

  const checkpoint = loadCheckpoint() || {
    created_at: now(),
    keyword: '呼吸机',
    pages: maxPages,
    max_offers: maxOffers,
    platforms: {},
  }

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
    await page.close()
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
    retries: maxRetries,
    delay_range_ms: [delayMin, delayMax],
    platforms: {},
  }

  for (const t of targets) {
    const cp = checkpoint.platforms?.[t.id] || {}
    const page = await context.newPage()

    const seen = new Set(Array.isArray(cp.seen_keys) ? cp.seen_keys : [])
    const offers = Array.isArray(cp.offers) ? cp.offers : []
    let startPage = Number(cp.next_page || 1)
    if (!Number.isFinite(startPage) || startPage < 1) startPage = 1
    if (startPage > maxPages) startPage = maxPages

    let lastFinalUrl = cp.final_url || ''
    let lastBlocked = Boolean(cp.blocked_hint)
    let crawledPages = Number(cp.pages_crawled || 0)
    let emptyPages = 0
    let fatalError = null

    console.log(`[${t.id}] 从第 ${startPage} 页开始，当前累计 ${offers.length} 条`)

    try {
      for (let i = startPage; i <= maxPages; i += 1) {
        if (i > startPage) await waitRandom(delayMin, delayMax)

        let pageSucceeded = false
        let lastErr = null

        for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
          try {
            if (attempt > 0) {
              const backoff = randInt(3500, 9000) * attempt
              console.log(`[${t.id} p${i}] 第 ${attempt} 次重试，等待 ${backoff}ms`)
              await sleep(backoff)
            }

            const one = await runOnePage({ page, platformId: t.id, pageNo: i, urlForPage: t.urlForPage })
            lastFinalUrl = one.finalUrl
            lastBlocked = one.blocked
            crawledPages += 1

            let pageAdded = 0
            for (const item of one.merged) {
              const key = `${item.title}|${item.prices?.[0] || ''}|${item.url || ''}`
              if (seen.has(key)) continue
              seen.add(key)
              offers.push(item)
              pageAdded += 1
              if (offers.length >= maxOffers) break
            }

            if (pageAdded === 0) emptyPages += 1
            else emptyPages = 0

            checkpoint.platforms[t.id] = {
              next_page: i + 1,
              pages_crawled: crawledPages,
              offers: offers.slice(0, maxOffers),
              seen_keys: Array.from(seen).slice(-5000),
              final_url: lastFinalUrl,
              blocked_hint: lastBlocked,
              updated_at: now(),
            }
            saveCheckpoint(checkpoint)

            console.log(`[${t.id} p${i}] 新增 ${pageAdded} 条，累计 ${offers.length} 条`)
            pageSucceeded = true
            break
          } catch (err) {
            lastErr = err
            if (attempt >= maxRetries) break
          }
        }

        if (!pageSucceeded) {
          fatalError = lastErr || new Error('unknown page error')
          break
        }

        if (offers.length >= maxOffers) break
        if (emptyPages >= 3) break
      }

      result.platforms[t.id] = {
        status: offers.length ? 'ok' : lastBlocked ? 'blocked' : fatalError ? 'error' : 'empty',
        final_url: lastFinalUrl,
        blocked_hint: lastBlocked,
        pages_crawled: crawledPages,
        offers: offers.slice(0, maxOffers),
        error: fatalError ? `${fatalError}` : undefined,
        at: now(),
      }

      await page.screenshot({ path: path.join(STATE_DIR, `${t.id}-last.png`), fullPage: true }).catch(() => {})
    } finally {
      await page.close()
    }
  }

  saveResult(result)
  if (fs.existsSync(CHECKPOINT_FILE)) fs.unlinkSync(CHECKPOINT_FILE)
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
