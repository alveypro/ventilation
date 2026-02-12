#!/usr/bin/env node
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execFileSync } from 'child_process'

const WORK_DIR = process.cwd()
const OUT_FILE = path.join(WORK_DIR, 'public', 'data', 'respirators', 'free_market_prices.json')
const HOME = os.homedir()
const REMOTE_HOST = process.env.REMOTE_HOST || 'root@47.90.160.87'
const REMOTE_KEY = process.env.REMOTE_KEY || path.join(HOME, 'Downloads', 'open.pem')
const REMOTE_OUT = '/home/admin/.openclaw/workspace/data/respirators/free_market_prices.json'

const now = () => new Date().toISOString()

const getStats = (file) => {
  if (!fs.existsSync(file)) return { exists: false, total: 0, generated_at: null, platforms: {} }
  try {
    const data = JSON.parse(fs.readFileSync(file, 'utf-8'))
    let total = 0
    const platforms = {}
    for (const [k, v] of Object.entries(data.platforms || {})) {
      const n = (v.offers || []).length
      total += n
      platforms[k] = { status: v.status, count: n, pages: v.pages_crawled || 0 }
    }
    return { exists: true, total, generated_at: data.generated_at || null, data, platforms }
  } catch {
    return { exists: true, total: 0, generated_at: null, platforms: {} }
  }
}

const printStats = (label, stats) => {
  console.log(`\\n[${label}] total=${stats.total} generated_at=${stats.generated_at || '-'} `)
  for (const [k, v] of Object.entries(stats.platforms || {})) {
    console.log(`  - ${k}: ${v.status || '-'} / ${v.count} / pages=${v.pages || 0}`)
  }
}

const runLocalCrawler = ({ withLogin, pages, maxOffers, retry, delayMin, delayMax }) => {
  const args = [
    'tools/crawl-market-local.mjs',
    `--pages=${pages}`,
    `--max-offers=${maxOffers}`,
    `--retry=${retry}`,
    `--delay-min=${delayMin}`,
    `--delay-max=${delayMax}`,
    '--no-upload',
  ]
  if (withLogin) args.push('--login')

  console.log(`\\n[crawl] start with${withLogin ? '' : 'out'} login: ${args.slice(1).join(' ')}`)
  execFileSync('node', args, { stdio: 'inherit' })
}

const uploadToEcs = () => {
  execFileSync('scp', ['-i', REMOTE_KEY, OUT_FILE, `${REMOTE_HOST}:${REMOTE_OUT}`], { stdio: 'inherit' })
  execFileSync('ssh', ['-i', REMOTE_KEY, REMOTE_HOST, '/usr/local/bin/sync_openclaw_respirators.sh'], { stdio: 'inherit' })
}

const main = () => {
  const base = getStats(OUT_FILE)
  printStats('baseline', base)

  const backups = []
  if (base.exists && base.data) backups.push({ tag: 'baseline', stats: base, data: base.data })

  runLocalCrawler({ withLogin: false, pages: 120, maxOffers: 1200, retry: 3, delayMin: 2000, delayMax: 6000 })
  const round1 = getStats(OUT_FILE)
  round1.data && backups.push({ tag: 'round1', stats: round1, data: round1.data })
  printStats('round1', round1)

  let best = backups.sort((a, b) => b.stats.total - a.stats.total)[0] || null

  if (!best || best.stats.total < 120) {
    runLocalCrawler({ withLogin: true, pages: 160, maxOffers: 1600, retry: 4, delayMin: 2500, delayMax: 7000 })
    const round2 = getStats(OUT_FILE)
    round2.data && backups.push({ tag: 'round2', stats: round2, data: round2.data })
    printStats('round2', round2)
    best = backups.sort((a, b) => b.stats.total - a.stats.total)[0] || best
  }

  if (!best || !best.data) {
    throw new Error('No valid crawl result generated.')
  }

  fs.writeFileSync(OUT_FILE, JSON.stringify({ ...best.data, chosen_at: now(), chosen_from: best.tag }, null, 2), 'utf-8')
  console.log(`\\n[choose] use ${best.tag}, total=${best.stats.total}`)

  uploadToEcs()
  console.log('\\n[done] best result uploaded and synced to ECS')
}

main()
