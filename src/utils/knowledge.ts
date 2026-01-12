import type { Product, Disease, Tutorial, Brand } from '@/types'

type ReviewLike = {
  id: number
  title?: string
  content?: string
  summary?: string
  rating?: number
  category?: string
  productId?: number
  product?: any
}

export type KnowledgeContext = {
  products: Product[]
  diseases: Disease[]
  tutorials: Tutorial[]
  reviews: ReviewLike[]
  brands: Brand[]
}

const uniqueById = <T extends { id: number }>(items: T[]) => {
  const seen = new Set<number>()
  return items.filter(item => {
    if (seen.has(item.id)) return false
    seen.add(item.id)
    return true
  })
}

const toLower = (value: string) => value.toLowerCase()

const includesAny = (text: string, keywords: string[]) => {
  const lower = toLower(text)
  return keywords.some(keyword => lower.includes(keyword))
}

const pickByCategory = (tutorials: Tutorial[], categories: string[], limit: number) => {
  const matches = tutorials.filter(item => categories.includes(item.category))
  if (matches.length >= limit) return matches.slice(0, limit)
  const fallback = tutorials.filter(item => !categories.includes(item.category))
  return matches.concat(fallback).slice(0, limit)
}

const pickTopRated = <T extends { rating?: number }>(items: T[], limit: number) => {
  return [...items].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, limit)
}

const normalizeProductId = (review: ReviewLike) => {
  const id = review.productId || review.product?._id || review.product
  return typeof id === 'number' ? id : Number(id)
}

export const getRelatedForProduct = (product: Product, ctx: KnowledgeContext) => {
  const diseases = ctx.diseases.filter(d =>
    product.suitableFor?.includes(d.classification || '')
  )

  const brandMatches = ctx.products.filter(p => p.brand === product.brand && p.id !== product.id)
  const typeMatches = ctx.products.filter(p => p.type === product.type && p.id !== product.id)
  const products = uniqueById([...brandMatches, ...typeMatches]).slice(0, 4)

  const preferredCategories = product.type.includes('双水平')
    ? ['intermediate', 'maintenance']
    : ['beginner', 'maintenance']
  const tutorials = pickByCategory(ctx.tutorials, preferredCategories, 3)

  const reviews = ctx.reviews.filter(review => normalizeProductId(review) === product.id)

  return { diseases: diseases.slice(0, 3), products, tutorials, reviews: reviews.slice(0, 3) }
}

export const getRelatedForDisease = (disease: Disease, ctx: KnowledgeContext) => {
  let products: Product[] = []
  if (disease.recommendedMachines?.length) {
    products = disease.recommendedMachines
      .map(item => ctx.products.find(product => product.id === item.id))
      .filter(Boolean) as Product[]
  }
  if (!products.length) {
    products = ctx.products.filter(product =>
      product.suitableFor?.includes(disease.classification || '')
    )
  }

  const categoryMap: Record<string, string[]> = {
    sleep_apnea: ['beginner', 'intermediate'],
    copd: ['intermediate', 'maintenance'],
    neuromuscular: ['intermediate', 'maintenance'],
    heart_failure: ['intermediate', 'maintenance'],
  }
  const categories = categoryMap[disease.classification || ''] || ['beginner', 'maintenance']
  const tutorials = pickByCategory(ctx.tutorials, categories, 3)

  const reviewMatches = ctx.reviews.filter(review => {
    const productId = normalizeProductId(review)
    return products.some(product => product.id === productId)
  })

  const brands = uniqueById(
    products
      .map(product => ctx.brands.find(brand => brand.name === product.brand))
      .filter(Boolean) as Brand[]
  ).slice(0, 3)

  return {
    products: products.slice(0, 4),
    tutorials,
    reviews: reviewMatches.slice(0, 3),
    brands,
  }
}

export const getRelatedForTutorial = (tutorial: Tutorial, ctx: KnowledgeContext) => {
  const content = tutorial.content || ''
  const text = toLower(`${tutorial.title} ${content}`)

  let products: Product[] = []
  if (includesAny(text, ['双水平', 'bipap', 'bilevel'])) {
    products = ctx.products.filter(product => product.type.includes('双水平'))
  } else if (includesAny(text, ['cpap', '压力', 'auto'])) {
    products = ctx.products.filter(product => product.type.includes('CPAP'))
  } else if (includesAny(text, ['清洁', '维护', '保养'])) {
    products = pickTopRated(ctx.products, 4)
  } else {
    products = pickTopRated(ctx.products, 4)
  }

  const diseases = ctx.diseases.filter(disease => {
    const name = toLower(disease.name || '')
    if (includesAny(text, ['osa', '睡眠呼吸暂停'])) return disease.classification === 'sleep_apnea'
    if (includesAny(text, ['copd', '慢阻肺'])) return disease.classification === 'copd'
    if (includesAny(text, ['神经肌肉'])) return disease.classification === 'neuromuscular'
    return includesAny(name, [text])
  })

  const reviews = ctx.reviews.filter(review => {
    const productId = normalizeProductId(review)
    return products.some(product => product.id === productId)
  })

  return { products: products.slice(0, 4), diseases: diseases.slice(0, 3), reviews: reviews.slice(0, 3) }
}
