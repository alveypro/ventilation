import { platformRules } from '@/data/platform-rules'
import type { Product } from '@/types'

type PlatformRule = {
  id: string
  type: 'hard' | 'platform'
  pattern: string
  modelId?: number | null
  platformId?: number | null
  confidence?: number | null
}

const normalize = (value: string) => value.toLowerCase()

const buildHaystack = (product: Product) => {
  const parts = [
    product.name,
    product.series || '',
    product.platformFamily || '',
    (product.aliasNames || []).join(' '),
    (product.modeTags || []).join(' '),
  ]
  return normalize(parts.join(' '))
}

export const applyPlatformRules = (product: Product) => {
  const haystack = buildHaystack(product)
  const hits: { id: string; type: string; confidence: number }[] = []
  let confidence = 0

  ;(platformRules as PlatformRule[]).forEach(rule => {
    if (!rule.pattern) return
    const regex = new RegExp(rule.pattern, 'i')
    if (!regex.test(haystack)) return
    if (rule.platformId && product.platformId && rule.platformId !== product.platformId) return
    const score = rule.confidence || (rule.type === 'hard' ? 90 : 70)
    hits.push({ id: rule.id, type: rule.type, confidence: score })
    if (score > confidence) confidence = score
  })

  return {
    platformConfidence: confidence || undefined,
    platformRuleHits: hits.map(item => item.id),
    platformRuleNotes: hits.map(item => (item.type === 'hard' ? '型号硬匹配' : '平台匹配')),
  }
}
