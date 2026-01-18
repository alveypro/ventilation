// 产品类型
export interface Product {
  id: number
  name: string
  brand: string
  type: string
  price: number
  rating: number
  reviewCount: number
  tag?: string
  tagType?: string
  highlights: string[]
  description: string
  suitableFor: string[]
  specs: Record<string, string | undefined>
  image?: string
  images?: string[]
  sourcePaths?: string[]
  modeTags?: string[]
  scenarioTags?: string[]
  sourceTypes?: string[]
  dataCompleteness?: number
  deviceType?: 'PAP_SLEEP' | 'NIV_HOME' | 'PAP_TRAVEL'
  platformFamily?: string
  status?: '在售' | '停产' | '不明'
  epapMin?: number
  epapMax?: number
  ipapMin?: number
  ipapMax?: number
  backupRate?: boolean
  targetVentilation?: boolean
  asv?: boolean
  humidifier?: '无' | '一体' | '可选'
  heatedTube?: '不支持' | '支持' | '可选'
  noiseDb?: string
  weightKg?: number
  connectivity?: string[]
  power?: string[]
  channels?: string[]
  refurbRisk?: '低' | '中' | '高'
  overclaimRisk?: '低' | '中' | '高'
  aliasNames?: string[]
  platformNotes?: string
  uiSignature?: string
  dataSignature?: string
  hardwareSignature?: string
  platformId?: number
  brandId?: number
  series?: string
  platformConfidence?: number
  platformRuleHits?: string[]
  platformRuleNotes?: string[]
  advantages?: string[]
  disadvantages?: string[]
  reviews?: ProductReview[]
  clinicalIndications?: string[]
  contraindications?: string[]
  evidenceSummaries?: string[]
  evidenceSources?: ContentSource[]
  monitoringNotes?: string[]
  followupNotes?: string[]
}

export interface ProductReview {
  id: number
  author: string
  role?: string
  rating: number
  date: string
  title: string
  content: string
  helpful: number
}

export interface ContentSource {
  title: string
  org?: string
  url?: string
  date?: string
}

// 测评类型
export interface Review {
  id: number
  title: string
  category: string
  date: string
  summary: string
  content: string
  rating: number
  tagType: string
}

// 疾病指南类型
export interface Disease {
  id: number
  name: string
  classification?: string
  severity: string
  prevalence?: string
  description: string
  symptoms: string[]
  causes?: string[]
  diagnosis?: string[]
  treatment?: string[]
  longform?: string
  sources?: ContentSource[]
  recommendedMachines?: RecommendedMachine[]
  prognosis?: string
  complications?: string[]
  machines?: string[]
}

export interface RecommendedMachine {
  id: number
  name: string
}

// 教程类型
export interface Tutorial {
  id: number
  title: string
  category: string
  difficulty: string
  duration?: string
  views?: number
  rating?: number
  content: string
  images?: string[]
  sourcePath?: string
  sources?: ContentSource[]
}

// 品牌类型
export interface Brand {
  id: number
  name: string
  country: string
  founded?: number
  productCount?: number
  marketShare?: string
  logo?: string
  description: string
  website?: string
  positioning?: string
  story?: string
  strengths?: string[]
  focusAreas?: string[]
  cautions?: string[]
  sources?: ContentSource[]
  milestones?: { year: string; title: string; description: string }[]
  technologyFocus?: string[]
}

// 用户类型
export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  createdAt: string
}

// API 响应类型
export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
