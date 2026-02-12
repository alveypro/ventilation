#!/usr/bin/env node
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'
import { chromium } from 'playwright'

const args = new Set(process.argv.slice(2))
const loginMode = args.has('--login')
const skipUpload = args.has('--no-upload')
const interactiveBypass = !args.has('--no-interactive')

const HOME = os.homedir()
const WORK_DIR = process.cwd()
const STATE_DIR = path.join(WORK_DIR, '.cache', 'market-crawler')
const STATE_FILE = path.join(STATE_DIR, 'storage-state.json')
const OUT_FILE = path.join(WORK_DIR, 'public', 'data', 'respirators', 'free_market_prices.json')

const REMOTE_HOST = process.env.REMOTE_HOST || 'root@47.90.160.87'
const REMOTE_KEY = process.env.REMOTE_KEY || path.join(HOME, 'Downloads', 'open.pem')
const REMOTE_OUT = '/home/admin/.openclaw/workspace/data/respirators/free_market_prices.json'

const targets = [
  { id: 'taobao', url: 'https://s.taobao.com/search?q=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'tmall', url: 'https://s.taobao.com/search?fromTmallRedirect=true&tab=mall&q=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'xianyu', url: 'https://www.goofish.com/search?q=%E5%91%BC%E5%90%B8%E6%9C%BA' },
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
    platforms: {},
  }

  for (const t of targets) {
    const page = await context.newPage()
    try {
      await page.goto(t.url, { waitUntil: 'commit', timeout: 90000 })
      await page.waitForTimeout(10000)
      await scrollPage(page)
      await page.waitForTimeout(2500)
      let html = await page.content()
      let finalUrl = page.url()
      let blocked = detectBlocked(html, finalUrl)
      if (blocked && interactiveBypass) {
        console.log(`[${t.id}] 检测到拦截，请在浏览器中手动完成验证/滑块，完成后回终端按 Enter 继续...`)
        process.stdin.resume()
        await new Promise(resolve => process.stdin.once('data', resolve))
        await page.waitForTimeout(4000)
        await scrollPage(page)
        await page.waitForTimeout(2000)
        html = await page.content()
        finalUrl = page.url()
        blocked = detectBlocked(html, finalUrl)
      }
      const domOffers = await collectOffers(page)
      const rawOffers = collectFromRawHtml(html)
      const merged = [...domOffers, ...rawOffers]
      const seen = new Set()
      const offers = merged.filter(item => {
        const key = `${item.title}|${item.prices?.[0] || ''}|${item.url || ''}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      result.platforms[t.id] = {
        status: offers.length ? 'ok' : blocked ? 'blocked' : 'empty',
        final_url: finalUrl,
        blocked_hint: blocked,
        offers: offers.slice(0, 12),
        at: now(),
      }
      await page.screenshot({ path: path.join(STATE_DIR, `${t.id}-last.png`), fullPage: true }).catch(() => {})
    } catch (error) {
      result.platforms[t.id] = {
        status: 'error',
        error: `${error}`,
        at: now(),
      }
    } finally {
      await page.close()
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
