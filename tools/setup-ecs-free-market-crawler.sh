#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="${REMOTE_HOST:-root@47.90.160.87}"
REMOTE_KEY="${REMOTE_KEY:-$HOME/Downloads/open.pem}"

ssh -i "$REMOTE_KEY" "$REMOTE_HOST" 'bash -s' <<'REMOTE'
set -euo pipefail

install -d -m 755 /opt/airivo-crawler
install -d -m 755 /opt/airivo-crawler/cookies
install -d -m 755 /home/admin/.openclaw/workspace/data/respirators

cat >/opt/airivo-crawler/crawl_marketplaces_free.mjs <<'EOF'
import fs from 'fs'
import { chromium } from 'playwright'

const OUTPUT = '/home/admin/.openclaw/workspace/data/respirators/free_market_prices.json'
const KEYWORD = '呼吸机'

const targets = [
  { id: 'jd', url: 'https://search.jd.com/Search?keyword=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'taobao', url: 'https://s.taobao.com/search?q=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'tmall', url: 'https://s.taobao.com/search?fromTmallRedirect=true&tab=mall&q=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'xiaohongshu', url: 'https://www.xiaohongshu.com/search_result/?keyword=%E5%91%BC%E5%90%B8%E6%9C%BA' },
  { id: 'alibaba', url: 'https://www.alibaba.com/trade/search?SearchText=cpap+machine' },
]

const now = () => new Date().toISOString()

const detectBlocked = (text, url) => {
  const lower = `${text}\n${url}`.toLowerCase()
  const signals = ['captcha', 'verify', 'robot', 'risk', 'punish', 'blocked', 'forbidden', 'service unavailable']
  return signals.some(s => lower.includes(s))
}

const collectOffers = async page => {
  return await page.evaluate(() => {
    const priceRe = /(?:US\$|\$|¥|￥)\s?\d[\d,.]*/g
    const anchors = Array.from(document.querySelectorAll('a[href]'))
    const offers = []
    for (const a of anchors) {
      const title = (a.textContent || '').replace(/\s+/g, ' ').trim()
      if (!title || title.length < 6) continue
      const parent = a.closest('div,li,article,section') || a
      const block = (parent.textContent || '').replace(/\s+/g, ' ').trim()
      const prices = block.match(priceRe) || []
      if (!prices.length) continue
      const href = a.href || ''
      if (!href.startsWith('http')) continue
      offers.push({
        title: title.slice(0, 200),
        url: href,
        prices: prices.slice(0, 3),
        snippet: block.slice(0, 300),
      })
      if (offers.length >= 25) break
    }
    return offers
  })
}

const loadCookies = platform => {
  const p = `/opt/airivo-crawler/cookies/${platform}.json`
  if (!fs.existsSync(p)) return []
  try {
    const raw = JSON.parse(fs.readFileSync(p, 'utf-8'))
    return Array.isArray(raw) ? raw : []
  } catch {
    return []
  }
}

const run = async () => {
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-dev-shm-usage'],
  })

  const result = {
    generated_at: now(),
    keyword: KEYWORD,
    note: 'free mode: browser crawling with optional cookie injection',
    platforms: {},
  }

  for (const t of targets) {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      viewport: { width: 1440, height: 2200 },
      locale: 'zh-CN',
    })
    const cookies = loadCookies(t.id)
    if (cookies.length) {
      try {
        await context.addCookies(cookies)
      } catch {}
    }
    const page = await context.newPage()
    try {
      await page.goto(t.url, { waitUntil: 'domcontentloaded', timeout: 45000 })
      await page.waitForTimeout(4500)
      const html = await page.content()
      const finalUrl = page.url()
      const blocked = detectBlocked(html, finalUrl)
      const offers = blocked ? [] : await collectOffers(page)
      result.platforms[t.id] = {
        status: blocked ? 'blocked' : offers.length ? 'ok' : 'empty',
        final_url: finalUrl,
        cookie_loaded: cookies.length > 0,
        html_length: html.length,
        offers: offers.slice(0, 12),
        at: now(),
      }
    } catch (err) {
      result.platforms[t.id] = {
        status: 'error',
        error: `${err}`,
        cookie_loaded: cookies.length > 0,
        at: now(),
      }
    } finally {
      await context.close()
    }
  }

  await browser.close()
  fs.writeFileSync(OUTPUT, JSON.stringify(result, null, 2), 'utf-8')
  console.log(`written: ${OUTPUT}`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
EOF

cd /opt/airivo-crawler
if [ ! -f package.json ]; then
  npm init -y >/dev/null 2>&1
fi
npm install playwright >/tmp/market-crawler-npm.log 2>&1 || true
npx playwright install chromium >/tmp/market-crawler-browser.log 2>&1 || true

if ! grep -q "crawl_marketplaces_free.mjs" /etc/crontab; then
  echo "27 * * * * root /usr/bin/env node /opt/airivo-crawler/crawl_marketplaces_free.mjs >> /var/log/market-crawler.log 2>&1" >> /etc/crontab
fi

/usr/bin/env node /opt/airivo-crawler/crawl_marketplaces_free.mjs || true
ls -lah /home/admin/.openclaw/workspace/data/respirators
tail -n 40 /var/log/market-crawler.log 2>/dev/null || true
REMOTE
