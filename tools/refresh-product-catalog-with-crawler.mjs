#!/usr/bin/env node
import fs from 'fs'
import path from 'path'

const ROOT = process.cwd()
const CATALOG_FILE = path.join(ROOT, 'src/data/catalog-products.ts')
const DOMESTIC_FILE = path.join(ROOT, 'public/data/respirators/domestic.json')
const IMPORTED_FILE = path.join(ROOT, 'public/data/respirators/imported.json')
const MARKET_FILE = path.join(ROOT, 'public/data/respirators/free_market_prices.json')

const now = new Date().toISOString()

const readJson = (file, fallback = null) => {
  if (!fs.existsSync(file)) return fallback
  return JSON.parse(fs.readFileSync(file, 'utf-8'))
}

const readTsArray = (file) => {
  const text = fs.readFileSync(file, 'utf-8')
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start < 0 || end < 0 || end <= start) throw new Error(`Cannot parse TS array: ${file}`)
  return JSON.parse(text.slice(start, end + 1))
}

const writeTsArray = (file, exportName, arr) => {
  const content = `// 自动融合更新: ${now}\nexport const ${exportName} = ${JSON.stringify(arr, null, 2)}\n`
  fs.writeFileSync(file, content, 'utf-8')
}

const normalizeBrand = (value = '') => {
  const lower = String(value).toLowerCase()
  if (lower.includes('resmed') || lower.includes('瑞思迈')) return '瑞思迈'
  if (lower.includes('philips') || lower.includes('伟康') || lower.includes('飞利浦')) return '飞利浦伟康'
  if (lower.includes('bmc') || lower.includes('瑞迈特')) return '瑞迈特'
  if (lower.includes('yuwell') || lower.includes('鱼跃')) return '鱼跃'
  if (lower.includes('fisher') || lower.includes('paykel') || lower.includes('费雪')) return '费雪派克'
  if (lower.includes('lowenstein') || lower.includes('löwenstein') || lower.includes('律维施泰因')) return '律维施泰因'
  return String(value).trim()
}

const norm = (value = '') => String(value).toLowerCase().replace(/[™®©]/g, '').replace(/[\s\-_/()（）【】\[\],.]+/g, '')

const uniq = (arr) => Array.from(new Set((arr || []).filter(Boolean)))
const shortUrl = (raw = '') => {
  try {
    const u = new URL(String(raw))
    return `${u.origin}${u.pathname}`
  } catch {
    return String(raw)
  }
}

const extractPrice = (value) => {
  const text = String(value || '')
  const nums = [...text.matchAll(/(?:¥|￥|US\$|\$)?\s*(\d+(?:\.\d+)?)/g)].map((m) => Number(m[1])).filter((n) => Number.isFinite(n) && n > 50)
  if (!nums.length) return null
  if (nums.length === 1) return nums[0]
  nums.sort((a, b) => a - b)
  return (nums[0] + nums[nums.length - 1]) / 2
}

const median = (arr) => {
  if (!arr.length) return null
  const s = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(s.length / 2)
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2
}

const modelTokens = (name = '') => {
  const raw = String(name)
  const tokens = []
  const hits = raw.match(/[A-Za-z]+\d+[A-Za-z0-9-]*/g) || []
  hits.forEach((x) => tokens.push(x.toLowerCase()))
  const parts = raw.split(/\s+/).map((x) => x.trim()).filter(Boolean)
  if (parts.length >= 2) tokens.push(`${parts[0]} ${parts[1]}`.toLowerCase())
  tokens.push(raw.toLowerCase())
  return uniq(tokens).filter((x) => x.length >= 2)
}

const parseCatalog = () => readTsArray(CATALOG_FILE)

const parseCrawlerDevices = () => {
  const domestic = readJson(DOMESTIC_FILE, []) || []
  const imported = readJson(IMPORTED_FILE, []) || []
  return [
    ...domestic.map((x) => ({ ...x, source: 'domestic.json' })),
    ...imported.map((x) => ({ ...x, source: 'imported.json' })),
  ]
}

const parseMarketOffers = () => {
  const data = readJson(MARKET_FILE, {}) || {}
  const platforms = data.platforms || {}
  const offers = []
  for (const [platform, detail] of Object.entries(platforms)) {
    for (const row of detail?.offers || []) {
      offers.push({
        platform,
        title: String(row?.title || ''),
        url: String(row?.url || ''),
        price: extractPrice((row?.prices || [])[0] || row?.snippet || row?.title),
      })
    }
  }
  return offers.filter((x) => x.title && x.price)
}

const enrichWithCrawlerDevices = (products, devices) => {
  let nextId = Math.max(...products.map((x) => Number(x.id) || 0), 30000) + 1
  let matched = 0
  let added = 0

  for (const d of devices) {
    const brand = normalizeBrand(d.brand)
    const model = String(d.model || '').trim()
    const dKey = `${norm(brand)}_${norm(model)}`
    let target = products.find((p) => `${norm(normalizeBrand(p.brand))}_${norm(p.name)}`.includes(dKey) || dKey.includes(`${norm(normalizeBrand(p.brand))}_${norm(p.name)}`))

    if (!target) {
      const p = {
        id: nextId++,
        name: model || '未知型号',
        brand,
        type: '睡眠呼吸机',
        price: Math.round(extractPrice(d.price) || 0),
        rating: 0,
        reviewCount: 0,
        tag: '爬虫',
        tagType: 'warning',
        highlights: uniq([...(d.features || []), d.pressure_range ? `压力范围 ${d.pressure_range}` : '']).slice(0, 6),
        description: '由爬虫快照补充的机型数据。',
        suitableFor: ['sleep_apnea'],
        specs: {
          '压力范围': String(d.pressure_range || '-'),
          '快照参考价': String(d.price || '-'),
          '数据来源': `respirators/${d.source}`,
        },
        image: null,
        sourcePaths: [`respirators/${d.source}`],
        deviceType: 'PAP_SLEEP',
        platformFamily: brand,
        status: '不明',
        modeTags: [],
        sourceTypes: ['爬虫'],
        dataCompleteness: 72,
      }
      products.push(p)
      added += 1
      continue
    }

    matched += 1
    const quickPrice = extractPrice(d.price)
    if ((target.price || 0) <= 0 && quickPrice) target.price = Math.round(quickPrice)

    target.highlights = uniq([...(target.highlights || []), ...((d.features || []).map((x) => String(x))), d.pressure_range ? `压力范围 ${d.pressure_range}` : '']).slice(0, 8)
    target.specs = {
      ...(target.specs || {}),
      '压力范围': target.specs?.['压力范围'] || String(d.pressure_range || '-'),
      '快照参考价': target.specs?.['快照参考价'] || String(d.price || '-'),
    }
    target.sourceTypes = uniq([...(target.sourceTypes || []), '爬虫'])
    target.sourcePaths = uniq([...(target.sourcePaths || []), `respirators/${d.source}`])
    target.dataCompleteness = Math.min(95, Math.max(Number(target.dataCompleteness || 0), 82))
  }

  return { matched, added }
}

const enrichWithMarketOffers = (products, offers) => {
  let enriched = 0
  for (const p of products) {
    const brand = normalizeBrand(p.brand)
    const brandToken = norm(brand)
    const tokens = modelTokens(p.name)
    const hits = offers.filter((o) => {
      const t = norm(o.title)
      if (brandToken && !t.includes(brandToken)) return false
      return tokens.some((tok) => t.includes(norm(tok)))
    })
    if (!hits.length) continue

    const prices = hits.map((h) => h.price).filter(Boolean)
    const med = median(prices)
    if (med && ((p.price || 0) <= 0 || Math.abs((p.price || 0) - med) / med > 0.4)) {
      p.price = Math.round(med)
    }

    const sampleCount = hits.length
    const platformSet = uniq(hits.map((h) => h.platform))
    p.highlights = uniq([...(p.highlights || []), `市场样本 ${sampleCount} 条`, `渠道 ${platformSet.join('/')}`]).slice(0, 8)
    p.specs = {
      ...(p.specs || {}),
      '市场参考价': med ? `¥${Math.round(med)}` : (p.specs?.['市场参考价'] || '-'),
      '市场样本数': String(sampleCount),
      '抓取渠道': platformSet.join('/'),
    }
    p.sourceTypes = uniq([...(p.sourceTypes || []), '爬虫'])
    const urls = hits.map((h) => shortUrl(h.url)).filter((u) => u.startsWith('http')).slice(0, 3)
    p.sourcePaths = uniq([...(p.sourcePaths || []), ...urls])
    p.dataCompleteness = Math.min(95, Math.max(Number(p.dataCompleteness || 0), 86))
    enriched += 1
  }
  return enriched
}

const main = () => {
  const products = parseCatalog()
  const devices = parseCrawlerDevices()
  const offers = parseMarketOffers()

  const baseCount = products.length
  const { matched, added } = enrichWithCrawlerDevices(products, devices)
  const enriched = enrichWithMarketOffers(products, offers)

  writeTsArray(CATALOG_FILE, 'catalogProductsData', products)

  console.log(`catalog products: ${baseCount} -> ${products.length}`)
  console.log(`crawler device matched: ${matched}, added: ${added}`)
  console.log(`market price enriched: ${enriched}`)
  console.log(`market offers loaded: ${offers.length}`)
}

main()
