import { Router, Request, Response } from 'express'
import { seedProducts } from '../data/seed.js'

const router = Router()

type SelectorInput = {
  disease?: string
  severity?: 'mild' | 'moderate' | 'severe'
  budget?: number
  portability?: 'low' | 'medium' | 'high'
  noiseSensitive?: boolean
  humidification?: boolean
  useCase?: 'home' | 'travel' | 'mixed'
  experience?: 'beginner' | 'advanced'
}

const parseNoise = (specs?: Record<string, string>) => {
  const noise = specs?.['噪音水平']
  if (!noise) return undefined
  const match = noise.match(/[\d.]+/)
  return match ? Number(match[0]) : undefined
}

const scoreProduct = (product: any, input: SelectorInput) => {
  let score = 50
  const reasons: string[] = []

  if (input.disease && product.suitableFor?.includes(input.disease)) {
    score += 25
    reasons.push('适配疾病类型')
  }

  if (input.severity === 'severe') {
    if (product.type?.includes('双水平')) {
      score += 12
      reasons.push('重症更偏好双水平支持')
    } else {
      score -= 8
    }
  }

  if (typeof input.budget === 'number') {
    if (product.price <= input.budget) {
      score += 12
      reasons.push('价格符合预算')
    } else {
      score -= 15
      reasons.push('价格超出预算')
    }
  }

  if (input.useCase === 'travel' || input.portability === 'high') {
    const portable = product.tag === '便携' || product.name?.toLowerCase().includes('mini')
    if (portable) {
      score += 12
      reasons.push('适合旅行携带')
    } else {
      score -= 6
    }
  }

  if (input.noiseSensitive) {
    const noise = parseNoise(product.specs)
    if (typeof noise === 'number' && noise <= 28) {
      score += 8
      reasons.push('噪音控制更优')
    } else {
      score -= 4
    }
  }

  if (input.humidification) {
    const humidifier = product.specs?.['湿化器'] || ''
    if (humidifier.includes('内置')) {
      score += 8
      reasons.push('内置加湿更舒适')
    }
  }

  if (input.experience === 'beginner') {
    if (product.tag === '入门' || product.price <= 4000) {
      score += 8
      reasons.push('新手友好')
    }
  }

  return { score, reasons }
}

router.post('/', (req: Request, res: Response) => {
  const input = (req.body || {}) as SelectorInput
  const scored = seedProducts.map(product => {
    const result = scoreProduct(product, input)
    return {
      product,
      score: result.score,
      reasons: result.reasons,
    }
  })

  const recommendations = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(item => ({
      ...item.product,
      matchScore: item.score,
      matchReasons: item.reasons,
    }))

  res.json({
    code: 200,
    message: 'Success',
    data: recommendations,
  })
})

export default router
