import { productApi, reviewApi, diseaseApi, tutorialApi, brandApi } from './index'
import { productsData, brandsData } from '@/data/comprehensive'
import { publicDiseasesData } from '@/data/public-diseases'
import { publicTutorialsData } from '@/data/public-tutorials'
import { enrichProductsWithCatalog } from '@/utils/productCatalog'
import { applyPlatformRules } from '@/utils/platformMatcher'
import { catalogProductsData } from '@/data/catalog-products'
import { catalogBrandsData } from '@/data/catalog-brands'
import type { Product, Disease, Tutorial, Brand } from '@/types'

type ReviewItem = {
  id: number
  author: string
  role?: string
  rating: number
  date: string
  title: string
  content: string
  summary?: string
  category?: string
  helpful: number
  productId: number
  productName: string
}

let productsCache: Product[] | null = null
let diseasesCache: Disease[] | null = null
let tutorialsCache: Tutorial[] | null = null
let brandsCache: Brand[] | null = null
let reviewsCache: ReviewItem[] | null = null

type CrawlerDevice = {
  brand?: string
  model?: string
  price?: string
  pressure_range?: string
  features?: string[]
}

type MarketOffer = {
  title?: string
  url?: string
  prices?: string[]
}

type MarketPayload = {
  platforms?: Record<string, { offers?: MarketOffer[] }>
}

export const fetchProducts = async (): Promise<Product[]> => {
  if (productsCache) return productsCache
  try {
    const res = await productApi.getAll()
    if (res.code === 200 && Array.isArray(res.data)) {
      productsCache = res.data
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  const merged = [...catalogProductsData, ...productsData] as Product[]
  const mergedByName = new Map<string, Product>()
  merged.forEach(item => {
    const key = item.name.toLowerCase()
    if (!mergedByName.has(key)) {
      mergedByName.set(key, item)
      return
    }
    const existing = mergedByName.get(key) as Product
    const existingScore = (existing.dataCompleteness || 0) + (existing.sourcePaths?.length || 0)
    const nextScore = (item.dataCompleteness || 0) + (item.sourcePaths?.length || 0)
    mergedByName.set(key, nextScore >= existingScore ? item : existing)
  })
  const normalized = enrichProductsWithCatalog(Array.from(mergedByName.values()))
    .map(item => ({
      ...item,
      ...applyPlatformRules(item),
    }))
  const enriched = await enrichByCrawlerFeeds(normalized)
  productsCache = sanitizeProducts(enriched)
  return productsCache
}

export const fetchProductById = async (id: number): Promise<Product | undefined> => {
  if (productsCache) {
    const cached = productsCache.find(item => item.id === id)
    if (cached) return cached
  }
  try {
    const res = await productApi.getById(id)
    if (res.code === 200 && res.data) {
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  const merged = productsCache
    || sanitizeProducts(await enrichByCrawlerFeeds(enrichProductsWithCatalog([...catalogProductsData, ...productsData] as Product[]).map(item => ({
      ...item,
      ...applyPlatformRules(item),
    }))))
  return merged.find(item => item.id === id) as Product | undefined
}

const isRespiratoryProduct = (item: Product) => {
  if (item.deviceType) return true
  const name = `${item.name || ''}`.toLowerCase()
  const type = `${item.type || ''}`.toLowerCase()
  const blocked = ['面罩', '过滤器', '管路', '配件', '附件', '湿化器', '水箱', '头带']
  if (blocked.some(term => name.includes(term) || type.includes(term))) return false
  const typeSignals = ['呼吸机', 'pap', 'cpap', 'apap', 'bipap', 'niv', '无创', '通气']
  if (typeSignals.some(term => name.includes(term) || type.includes(term))) return true
  const modeSignals = ['CPAP', 'APAP', 'BIPAP', 'ST', 'S/T', 'AVAPS', 'IVAPS', 'ASV']
  return (item.modeTags || []).some(tag => modeSignals.includes(tag.toUpperCase()))
}

const sanitizeProducts = (items: Product[]) => {
  const cleaned = items
    .filter(item => isRespiratoryProduct(item))
    .map(item => ({
      ...item,
      brand: normalizeBrand(item.brand || ''),
      series: item.series?.trim(),
      type: item.type?.trim(),
      dataCompleteness: Math.max(item.dataCompleteness || 0, computeCompleteness(item)),
      image: resolveProductImage(item),
      images: undefined,
    }))
  return dedupeProducts(cleaned)
}

const resolveProductImage = (item: Product) => {
  if (item.image && item.image.startsWith('/images/products/')) {
    return item.image
  }
  if (item.image && /^https?:\/\//.test(item.image)) {
    return item.image
  }
  return defaultProductImage(item)
}

const computeCompleteness = (item: Product) => {
  let score = 40
  if (item.deviceType) score += 8
  if (item.modeTags?.length) score += 10
  if (item.specs && Object.keys(item.specs).length >= 3) score += 10
  if (item.specs?.['官方页面']) score += 8
  if (item.series) score += 4
  if (item.image && /^https?:\/\//.test(item.image)) score += 12
  if (item.epapMin || item.epapMax || item.ipapMax) score += 8
  return Math.min(95, score)
}

const normalizeKey = (value: string) => {
  return value
    .toLowerCase()
    .replace(/[™®©]/g, '')
    .replace(/[\s\-_()［］【】\[\].,/]+/g, '')
}

const parsePriceNumber = (value: string | number | undefined) => {
  if (typeof value === 'number' && value > 0) return value
  const text = String(value || '')
  const nums = [...text.matchAll(/(?:¥|￥|US\$|\$)?\s*(\d+(?:\.\d+)?)/g)]
    .map(m => Number(m[1]))
    .filter(n => Number.isFinite(n) && n > 50)
  if (!nums.length) return 0
  if (nums.length === 1) return nums[0]
  nums.sort((a, b) => a - b)
  return (nums[0] + nums[nums.length - 1]) / 2
}

const modelTokens = (name: string) => {
  const raw = name || ''
  const hits = raw.match(/[A-Za-z]+\d+[A-Za-z0-9-]*/g) || []
  const pair = raw.split(/\s+/).slice(0, 2).join(' ')
  return Array.from(new Set([raw, pair, ...hits].map(x => normalizeKey(x)).filter(Boolean)))
}

const fetchCrawlerJson = async (file: string) => {
  const bases = ['https://ai.airivo.cn/data/respirators', '/data/respirators']
  for (const base of bases) {
    try {
      const res = await fetch(`${base}/${file}?t=${Date.now()}`, { cache: 'no-store' })
      if (res.ok) return await res.json()
    } catch {}
  }
  return null
}

const enrichByCrawlerFeeds = async (items: Product[]) => {
  const [domestic, imported, market] = await Promise.all([
    fetchCrawlerJson('domestic.json') as Promise<CrawlerDevice[] | null>,
    fetchCrawlerJson('imported.json') as Promise<CrawlerDevice[] | null>,
    fetchCrawlerJson('free_market_prices.json') as Promise<MarketPayload | null>,
  ])

  const products = items.map(item => ({ ...item }))
  const crawlerDevices = [...(Array.isArray(domestic) ? domestic : []), ...(Array.isArray(imported) ? imported : [])]

  crawlerDevices.forEach(device => {
    const brand = normalizeBrand(device.brand || '')
    const model = (device.model || '').trim()
    if (!brand || !model) return
    const match = products.find(p =>
      normalizeBrand(p.brand || '') === brand
      && (normalizeKey(p.name || '').includes(normalizeKey(model)) || normalizeKey(model).includes(normalizeKey(p.name || '')))
    )
    if (!match) return
    const price = parsePriceNumber(device.price)
    if ((match.price || 0) <= 0 && price > 0) match.price = Math.round(price)
    match.highlights = mergeArrays(match.highlights, [
      ...(device.features || []),
      device.pressure_range ? `压力范围 ${device.pressure_range}` : '',
    ]).slice(0, 8)
    match.specs = mergeSpecs(match.specs, {
      '压力范围': match.specs?.['压力范围'] || device.pressure_range,
      '快照参考价': match.specs?.['快照参考价'] || (device.price || ''),
    })
    match.sourceTypes = mergeArrays(match.sourceTypes, ['爬虫'])
    match.sourcePaths = mergeArrays(match.sourcePaths, ['respirators/domestic.json', 'respirators/imported.json'])
    match.dataCompleteness = Math.min(95, Math.max(match.dataCompleteness || 0, 84))
  })

  const offers = Object.values(market?.platforms || {})
    .flatMap(platform => platform.offers || [])
    .map(offer => ({
      title: offer.title || '',
      price: parsePriceNumber(offer.prices?.[0]),
      url: offer.url || '',
    }))
    .filter(offer => offer.title && offer.price > 0)

  products.forEach(item => {
    const brandKey = normalizeKey(normalizeBrand(item.brand || ''))
    const tokens = modelTokens(item.name || '')
    const hits = offers.filter(offer => {
      const text = normalizeKey(offer.title)
      return text.includes(brandKey) && tokens.some(token => token && text.includes(token))
    })
    if (!hits.length) return
    const prices = hits.map(hit => hit.price).filter(Boolean).sort((a, b) => a - b)
    const mid = prices[Math.floor(prices.length / 2)] || 0
    if ((item.price || 0) <= 0 && mid > 0) item.price = Math.round(mid)
    item.specs = mergeSpecs(item.specs, {
      '市场参考价': mid > 0 ? `¥${Math.round(mid)}` : undefined,
      '市场样本数': String(hits.length),
    })
    item.sourceTypes = mergeArrays(item.sourceTypes, ['爬虫'])
    item.sourcePaths = mergeArrays(item.sourcePaths, hits.map(hit => hit.url).filter(Boolean).slice(0, 2))
    item.dataCompleteness = Math.min(95, Math.max(item.dataCompleteness || 0, 88))
  })

  return products
}

const scoreProduct = (item: Product) => {
  let score = item.dataCompleteness || 0
  if (item.image && /^https?:\/\//.test(item.image)) score += 20
  if (item.specs?.['官方页面']) score += 10
  if (item.price) score += 2
  if (item.epapMin || item.epapMax || item.ipapMax) score += 2
  return score
}

const mergeArrays = <T>(a?: T[], b?: T[]) => {
  const list = [...(a || []), ...(b || [])]
  return Array.from(new Set(list))
}

const mergeSpecs = (a?: Record<string, string | undefined>, b?: Record<string, string | undefined>) => {
  return { ...(a || {}), ...(b || {}) }
}

const normalizeBrand = (value: string) => {
  const raw = value.trim()
  if (!raw) return raw
  const lower = raw.toLowerCase()
  if (lower.includes('resmed')) return '瑞思迈'
  if (lower.includes('philips')) return '飞利浦伟康'
  if (lower.includes('bmc')) return '瑞迈特'
  if (lower.includes('yuwell')) return '鱼跃'
  if (lower.includes('fisher') || lower.includes('paykel')) return '费雪派克'
  if (lower.includes('löwenstein') || lower.includes('lowenstein')) return '律维施泰因'
  if (lower.includes('breas')) return '博毅雅'
  if (lower.includes('devilbiss') || lower.includes('drive')) return '德威比斯'
  if (lower.includes('apex') || lower.includes('wellell')) return '亚培克斯'
  return raw
}

const dedupeProducts = (items: Product[]) => {
  const byKey = new Map<string, Product>()
  items.forEach(item => {
    const brandKey = normalizeKey(item.brand || '')
    const nameKeys = [item.name, ...(item.aliasNames || [])].filter(Boolean)
      .map(name => `${brandKey}_${normalizeKey(String(name))}`)
    let existing: Product | undefined
    for (const key of nameKeys) {
      const hit = byKey.get(key)
      if (hit) {
        existing = hit
        break
      }
    }
    if (!existing) {
      nameKeys.forEach(key => byKey.set(key, item))
      return
    }
    const primary = scoreProduct(item) >= scoreProduct(existing) ? item : existing
    const secondary = primary === item ? existing : item
    const merged: Product = {
      ...secondary,
      ...primary,
      highlights: mergeArrays(secondary.highlights, primary.highlights),
      modeTags: mergeArrays(secondary.modeTags, primary.modeTags),
      suitableFor: mergeArrays(secondary.suitableFor, primary.suitableFor),
      aliasNames: mergeArrays(secondary.aliasNames, primary.aliasNames),
      sourceTypes: mergeArrays(secondary.sourceTypes, primary.sourceTypes),
      sourcePaths: mergeArrays(secondary.sourcePaths, primary.sourcePaths),
      specs: mergeSpecs(secondary.specs as Record<string, string>, primary.specs as Record<string, string>),
    }
    nameKeys.forEach(key => byKey.set(key, merged))
  })
  return Array.from(new Set(byKey.values()))
}

const defaultProductImage = (item: Product) => {
  if (item.deviceType === 'PAP_SLEEP') return '/images/product-pap.svg'
  if (item.deviceType === 'NIV_HOME') return '/images/product-niv.svg'
  if (item.deviceType === 'PAP_TRAVEL') return '/images/product-travel.svg'
  return '/images/product-pap.svg'
}

export const fetchDiseases = async (): Promise<Disease[]> => {
  if (diseasesCache) return diseasesCache
  try {
    const res = await diseaseApi.getAll()
    if (res.code === 200 && Array.isArray(res.data)) {
      diseasesCache = res.data
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  diseasesCache = publicDiseasesData as Disease[]
  return diseasesCache
}

export const fetchDiseaseById = async (id: number): Promise<Disease | undefined> => {
  if (diseasesCache) {
    const cached = diseasesCache.find(item => item.id === id)
    if (cached) return cached
  }
  try {
    const res = await diseaseApi.getById(id)
    if (res.code === 200 && res.data) {
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  return (diseasesCache || publicDiseasesData).find(item => item.id === id) as Disease | undefined
}

export const fetchTutorials = async (): Promise<Tutorial[]> => {
  if (tutorialsCache) return tutorialsCache
  try {
    const res = await tutorialApi.getAll()
    if (res.code === 200 && Array.isArray(res.data)) {
      tutorialsCache = res.data
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  tutorialsCache = publicTutorialsData as Tutorial[]
  return tutorialsCache
}

export const fetchTutorialById = async (id: number): Promise<Tutorial | undefined> => {
  if (tutorialsCache) {
    const cached = tutorialsCache.find(item => item.id === id)
    if (cached) return cached
  }
  try {
    const res = await tutorialApi.getById(id)
    if (res.code === 200 && res.data) {
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  return (tutorialsCache || publicTutorialsData).find(item => item.id === id) as Tutorial | undefined
}

export const fetchBrands = async (): Promise<Brand[]> => {
  if (brandsCache) return brandsCache
  try {
    const res = await brandApi.getAll()
    if (res.code === 200 && Array.isArray(res.data)) {
      brandsCache = res.data
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  const merged = [...catalogBrandsData, ...brandsData] as Brand[]
  const mergedByName = new Map<string, Brand>()
  merged.forEach(item => {
    const key = item.name.toLowerCase()
    if (!mergedByName.has(key)) {
      mergedByName.set(key, item)
    }
  })
  brandsCache = Array.from(mergedByName.values())
  return brandsCache
}

export const fetchBrandById = async (id: number): Promise<Brand | undefined> => {
  if (brandsCache) {
    const cached = brandsCache.find(item => item.id === id)
    if (cached) return cached
  }
  try {
    const res = await brandApi.getById(id)
    if (res.code === 200 && res.data) {
      return res.data
    }
  } catch (error) {
    // Fallback to local data
  }
  const fallback = brandsCache || ([...catalogBrandsData, ...brandsData] as Brand[])
  return fallback.find(item => item.id === id) as Brand | undefined
}

export const fetchReviews = async (): Promise<ReviewItem[]> => {
  if (reviewsCache) return reviewsCache
  try {
    const res = await reviewApi.getAll()
    if (res.code === 200 && Array.isArray(res.data)) {
      reviewsCache = res.data.map((item: any) => ({
        ...item,
        productName: item.productName || '产品',
        productId: item.productId || item.product?._id || item.product || 0,
      }))
      return reviewsCache
    }
  } catch (error) {
    // Fallback to local data
  }
  reviewsCache = productsData.flatMap(product =>
    (product.reviews || []).map(review => ({
      ...review,
      productId: product.id,
      productName: product.name,
    }))
  ) as ReviewItem[]
  return reviewsCache
}

export type { ReviewItem }
