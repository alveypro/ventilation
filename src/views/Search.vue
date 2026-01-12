<template>
  <div class="search-page">
    <div class="page-header">
      <h1>全站搜索</h1>
      <p>关键词：<strong>{{ keyword || '—' }}</strong></p>
      <p v-if="keyword" class="result-count">共 {{ totalResults }} 条结果</p>
    </div>

    <el-card class="search-bar">
      <el-input v-model="inputValue" placeholder="输入关键词" @keyup.enter="submitSearch">
        <template #append>
          <el-button type="primary" @click="submitSearch">搜索</el-button>
        </template>
      </el-input>
      <div class="external-search" v-if="keyword">
        <span class="external-label">站外搜索</span>
        <el-button size="small" @click="openExternal('baidu')">百度</el-button>
        <el-button size="small" @click="openExternal('bing')">必应</el-button>
        <el-button size="small" @click="openExternal('google')">Google</el-button>
      </div>
    </el-card>

    <el-empty v-if="!keyword" description="请输入关键词开始搜索" />
    <template v-else>
      <el-empty
        v-if="totalResults === 0"
        description="未找到相关内容"
      />

      <div v-else class="results">
        <div class="content-section" v-if="productResults.length">
          <h2>产品库</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in productResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/product/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.name)"></div>
                <div class="result-meta" v-html="highlightText(`${item.brand} · ${item.type}`)"></div>
                <div class="result-desc" v-html="highlightText(item.description)"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="brandResults.length">
          <h2>品牌库</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in brandResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/brand/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.name)"></div>
                <div class="result-meta" v-html="highlightText(item.country)"></div>
                <div class="result-desc" v-html="highlightText(item.description)"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="diseaseResults.length">
          <h2>疾病指南</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in diseaseResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/disease/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.name)"></div>
                <div class="result-meta" v-html="highlightText(`${item.severity} · ${item.classification || '疾病指南'}`)"></div>
                <div class="result-desc" v-html="highlightText(item.description)"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="tutorialResults.length">
          <h2>使用教程</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in tutorialResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/tutorial/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.title)"></div>
                <div class="result-meta" v-html="highlightText(`${item.category} · ${item.difficulty}`)"></div>
                <div class="result-desc" v-html="highlightText(excerpt(item.content))"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="reviewResults.length">
          <h2>测评中心</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in reviewResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="openReview(item)">
                <div class="result-title" v-html="highlightText(item.title || '')"></div>
                <div class="result-meta" v-html="highlightText(`${item.category || ''} · 评分 ${item.rating || ''}`)"></div>
                <div class="result-desc" v-html="highlightText(item.summary || item.content || '')"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="clinicalResults.length">
          <h2>临床知识库</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in clinicalResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/clinical/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.title || '')"></div>
                <div class="result-meta">
                  临床
                  <span v-if="item.category">· {{ item.category }}</span>
                  <span v-if="item.level">· {{ item.level }}</span>
                  <span v-if="item.docType">· {{ item.docType }}</span>
                </div>
                <div class="result-desc" v-html="highlightText(item.summary || '')"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="content-section" v-if="userResults.length">
          <h2>用户知识库</h2>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in userResults" :key="item.id">
              <el-card shadow="hover" class="result-card" @click="goTo(`/user-knowledge/${item.id}`)">
                <div class="result-title" v-html="highlightText(item.title || '')"></div>
                <div class="result-meta">
                  用户
                  <span v-if="item.category">· {{ item.category }}</span>
                  <span v-if="item.level">· {{ item.level }}</span>
                  <span v-if="item.docType">· {{ item.docType }}</span>
                </div>
                <div class="result-desc" v-html="highlightText(item.summary || '')"></div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProducts, fetchBrands, fetchDiseases, fetchTutorials, fetchReviews } from '@/services/dataService'
import type { Product, Brand, Disease, Tutorial, Review } from '@/types'
import type { ReviewItem } from '@/services/dataService'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { publicUserLibraryData } from '@/data/public-user-library'

const route = useRoute()
const router = useRouter()
const keyword = ref('')
const inputValue = ref('')

const products = ref<Product[]>([])
const brands = ref<Brand[]>([])
const diseases = ref<Disease[]>([])
const tutorials = ref<Tutorial[]>([])
const reviews = ref<(Review | ReviewItem)[]>([])
const clinicalItems = ref(clinicalHandbookData)
const userItems = ref(publicUserLibraryData)

const normalize = (value: string) => value.toLowerCase().replace(/\s+/g, ' ')

const scoreText = (text: string, tokens: string[], weight: number) => {
  const source = normalize(text)
  return tokens.reduce((score, token) => (source.includes(token) ? score + weight : score), 0)
}

const buildScoredList = <T>(items: T[], scoreFn: (item: T, tokens: string[]) => number, tokens: string[]) => {
  return items
    .map(item => ({ item, score: scoreFn(item, tokens) }))
    .filter(result => result.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(result => result.item)
}

const synonymMap: Record<string, string[]> = {
  osa: ['睡眠呼吸暂停', '呼吸暂停', '睡眠打鼾'],
  copd: ['慢阻肺', '慢性阻塞性肺疾病'],
  cpap: ['单水平', '持续气道正压'],
  bipap: ['双水平', '双水平通气'],
  vpap: ['双水平', '医用呼吸机'],
  rct: ['随机对照', '临床试验'],
  niv: ['无创通气', '无创', '非侵袭通气'],
  hfnc: ['高流量', '经鼻高流量'],
  psg: ['睡眠监测', '多导', '多导睡眠监测'],
  aasm: ['睡眠评分', '睡眠判读'],
  mask: ['面罩', '鼻罩', '口鼻罩'],
  oxygen: ['氧疗', '制氧', '血氧'],
  apap: ['自动调压', '自动单水平'],
  st: ['后备频率', '双水平ST'],
}

const expandTokens = (keyword: string) => {
  const raw = keyword.split(/[\s,，。；;、/\\|]+/).filter(Boolean)
  const expanded = raw.flatMap(token => {
    const lower = token.toLowerCase()
    return [lower, ...(synonymMap[lower] || [])]
  })
  return Array.from(new Set(expanded))
}

const escapeHtml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const highlightText = (value: string) => {
  const text = value || ''
  const tokens = expandTokens(normalize(keyword.value))
    .filter(token => token.length >= 2)
    .slice(0, 12)
  if (!tokens.length) return escapeHtml(text)
  const pattern = new RegExp(`(${tokens.map(token => token.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')).join('|')})`, 'gi')
  return escapeHtml(text).replace(pattern, '<mark>$1</mark>')
}

const productResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(products.value, (item, terms) => {
    let score = 0
    score += scoreText(item.name, terms, 8)
    score += scoreText(item.brand, terms, 5)
    score += scoreText(item.type, terms, 4)
    score += scoreText(item.description, terms, 3)
    score += scoreText(item.series || '', terms, 4)
    score += scoreText(item.platformFamily || '', terms, 3)
    score += scoreText(item.modeTags?.join(' ') || '', terms, 2)
    score += scoreText(item.aliasNames?.join(' ') || '', terms, 2)
    score += scoreText(Object.values(item.specs || {}).join(' ') || '', terms, 2)
    score += scoreText(item.highlights?.join(' ') || '', terms, 2)
    return score
  }, tokens)
})

const brandResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(brands.value, (item, terms) => {
    let score = 0
    score += scoreText(item.name, terms, 8)
    score += scoreText(item.country, terms, 3)
    score += scoreText(item.description, terms, 3)
    return score
  }, tokens)
})

const diseaseResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(diseases.value, (item, terms) => {
    let score = 0
    score += scoreText(item.name, terms, 8)
    score += scoreText(item.classification || '', terms, 3)
    score += scoreText(item.description, terms, 4)
    score += scoreText(item.symptoms?.join(' ') || '', terms, 2)
    score += scoreText(item.causes?.join(' ') || '', terms, 2)
    return score
  }, tokens)
})

const tutorialResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(tutorials.value, (item, terms) => {
    let score = 0
    score += scoreText(item.title, terms, 8)
    score += scoreText(item.category, terms, 3)
    score += scoreText(item.content, terms, 2)
    return score
  }, tokens)
})

const reviewResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(reviews.value, (item, terms) => {
    let score = 0
    score += scoreText(item.title || '', terms, 6)
    if ('summary' in item) {
      score += scoreText(item.summary || '', terms, 3)
    }
    score += scoreText(item.content || '', terms, 2)
    score += scoreText(item.category || '', terms, 2)
    return score
  }, tokens)
})

const clinicalResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(clinicalItems.value, (item, terms) => {
    return scoreText(item.title || '', terms, 6) + scoreText(item.summary || '', terms, 3)
  }, tokens)
})

const userResults = computed(() => {
  const tokens = expandTokens(normalize(keyword.value))
  if (!tokens.length) return []
  return buildScoredList(userItems.value, (item, terms) => {
    return scoreText(item.title || '', terms, 6) + scoreText(item.summary || '', terms, 3)
  }, tokens)
})

const totalResults = computed(() =>
  productResults.value.length +
  brandResults.value.length +
  diseaseResults.value.length +
  tutorialResults.value.length +
  reviewResults.value.length +
  clinicalResults.value.length +
  userResults.value.length
)

const openExternal = (engine: 'baidu' | 'bing' | 'google') => {
  if (!keyword.value) return
  const q = encodeURIComponent(keyword.value)
  const urls: Record<string, string> = {
    baidu: `https://www.baidu.com/s?wd=${q}`,
    bing: `https://www.bing.com/search?q=${q}`,
    google: `https://www.google.com/search?q=${q}`,
  }
  window.open(urls[engine], '_blank', 'noopener')
}

const submitSearch = () => {
  const value = inputValue.value.trim()
  if (!value) return
  router.push({ path: '/search', query: { q: value } })
}

const goTo = (path: string) => {
  router.push(path)
}

const openReview = (item: Review | ReviewItem) => {
  if ('productId' in item && item.productId) {
    router.push(`/product/${item.productId}`)
    return
  }
  router.push('/reviews')
}

const excerpt = (content: string) => {
  const plain = content.replace(/[#*`>\-]/g, '').replace(/\s+/g, ' ').trim()
  return plain.slice(0, 80) + (plain.length > 80 ? '...' : '')
}

const syncKeyword = () => {
  const q = route.query.q
  keyword.value = typeof q === 'string' ? q.trim() : ''
  inputValue.value = keyword.value
}

watch(() => route.query.q, syncKeyword, { immediate: true })

onMounted(async () => {
  const [productsRes, brandsRes, diseasesRes, tutorialsRes, reviewsRes] = await Promise.all([
    fetchProducts(),
    fetchBrands(),
    fetchDiseases(),
    fetchTutorials(),
    fetchReviews(),
  ])
  products.value = productsRes
  brands.value = brandsRes
  diseases.value = diseasesRes
  tutorials.value = tutorialsRes
  reviews.value = reviewsRes
})
</script>

<style scoped>
.search-page {
  padding: 10px 0 30px;
}

.result-count {
  font-size: 12px;
  color: #64748b;
  margin-top: 4px;
}

.search-bar {
  margin-bottom: 20px;
}

.external-search {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.external-label {
  font-size: 12px;
  color: #64748b;
  margin-right: 4px;
}

.results {
  margin-top: 20px;
}

.result-card {
  cursor: pointer;
  min-height: 140px;
}

.result-title {
  font-weight: 700;
  margin-bottom: 6px;
}

.result-meta {
  color: #64748b;
  font-size: 13px;
  margin-bottom: 8px;
}

.result-desc {
  color: #4b5563;
  font-size: 13px;
}

mark {
  background: #fef3c7;
  color: #92400e;
  padding: 0 2px;
  border-radius: 4px;
}

.content-section {
  margin-bottom: 24px;
}
</style>
