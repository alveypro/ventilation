<template>
  <div class="products-page">
    <div class="page-header handbook">
      <p class="header-label">产品库</p>
      <h1>设备与参数总览</h1>
      <p>以模式、参数、适用人群为核心进行筛选与对比。</p>
    </div>

    <el-row :gutter="16" class="overview">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="overview-card">
          <p class="overview-label">产品总量</p>
          <h3>{{ products.length }}</h3>
          <span class="overview-note">去重后有效型号</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="overview-card">
          <p class="overview-label">官方图覆盖</p>
          <h3>{{ officialImageCount }}</h3>
          <span class="overview-note">含官方展示图</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="overview-card">
          <p class="overview-label">官方页面</p>
          <h3>{{ officialPageCount }}</h3>
          <span class="overview-note">含官方页面链接</span>
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="overview-card">
          <p class="overview-label">平均完整度</p>
          <h3>{{ averageCompleteness }}%</h3>
          <span class="overview-note">参数/图/来源综合</span>
        </el-card>
      </el-col>
    </el-row>

    <el-card class="filters">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.brand" placeholder="选择品牌" clearable>
            <el-option v-for="brand in brandOptions" :key="brand" :label="brand" :value="brand" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.type" placeholder="选择类型" clearable>
            <el-option v-for="type in typeOptions" :key="type" :label="type" :value="type" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.deviceType" placeholder="设备类型" clearable>
            <el-option label="睡眠PAP" value="PAP_SLEEP" />
            <el-option label="家用NIV" value="NIV_HOME" />
            <el-option label="便携/旅行" value="PAP_TRAVEL" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.series" placeholder="系列/平台" clearable>
            <el-option v-for="series in seriesOptions" :key="series" :label="series" :value="series" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="filter-row">
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.sort" placeholder="排序方式">
            <el-option label="智能优先" value="smart" />
            <el-option label="评分最高" value="rating" />
            <el-option label="评价最多" value="reviews" />
            <el-option label="资料完整度" value="completeness" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.completenessMin" placeholder="完整度筛选">
            <el-option label="不限" :value="0" />
            <el-option label="≥60%" :value="60" />
            <el-option label="≥75%" :value="75" />
            <el-option label="≥85%" :value="85" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.status" placeholder="上市状态" clearable>
            <el-option label="在售" value="在售" />
            <el-option label="停产" value="停产" />
            <el-option label="不明" value="不明" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.modeTag" placeholder="通气模式" clearable>
            <el-option v-for="mode in modeOptions" :key="mode" :label="mode" :value="mode" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-input v-model="draftFilters.search" placeholder="搜索产品名称/品牌..." clearable />
        </el-col>
      </el-row>
      <div class="filter-actions">
        <span class="result-count">共找到 {{ displayedProducts.length }} 个产品</span>
        <div class="filter-right">
          <el-checkbox v-model="draftFilters.sourceOnly">只看资料提炼</el-checkbox>
          <el-checkbox v-model="draftFilters.officialImage">只看官方图</el-checkbox>
          <el-checkbox v-model="draftFilters.officialPage">只看官方页</el-checkbox>
          <el-tag v-if="isDirty" type="warning" size="small">预览中</el-tag>
          <el-button size="small" type="primary" :disabled="!isDirty" @click="applyFilters">确认筛选</el-button>
          <el-button size="small" :disabled="!isDirty" @click="cancelPreview">取消预览</el-button>
          <el-button size="small" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="appliedSummary.length" class="applied-summary">
      <div class="summary-header">
        <span>已应用筛选</span>
        <el-button size="small" text @click="resetFilters">清空</el-button>
      </div>
      <div class="summary-tags">
        <el-tag v-for="item in appliedSummary" :key="item" size="small" type="info">{{ item }}</el-tag>
      </div>
    </el-card>

    <div class="source-section" v-if="showSourceSection && sourceProducts.length">
      <div class="section-header">
        <h2>资料提炼产品</h2>
        <el-button size="small" type="primary" plain @click="applySourceFilter">查看全部</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in sourceProducts.slice(0, 8)" :key="product.id">
          <ProductCard
            :product="product"
            :show-compare="true"
            :compare-checked="compareIds.includes(product.id)"
            @detail="goToProduct(product.id)"
            @toggleCompare="onToggleCompare"
          />
        </el-col>
      </el-row>
    </div>

    <el-row v-if="isLoading" :gutter="20" class="products-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="i in 8" :key="i">
        <el-skeleton :rows="5" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20" class="products-grid">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in pagedProducts" :key="product.id">
          <ProductCard
            :product="product"
            :show-compare="true"
            :compare-checked="compareIds.includes(product.id)"
            @detail="goToProduct(product.id)"
            @toggleCompare="onToggleCompare"
          />
        </el-col>
    </el-row>

    <el-empty v-if="!isLoading && filteredProducts.length === 0" description="没有匹配的产品" />
    <div class="compare-bar" v-if="compareIds.length">
        <span>已选 {{ compareIds.length }} 个用于对比</span>
      <el-button type="warning" size="small" @click="gotoCompare">前往对比</el-button>
      <el-button size="mini" @click="clearCompare">清除</el-button>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <el-pagination
        background
        :current-page.sync="currentPage"
        :page-size="perPage"
        :total="displayedProducts.length"
        layout="prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { fetchProducts } from '@/services/dataService'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import type { Product } from '@/types'

const router = useRouter()
const products = ref<Product[]>([])
const isLoading = ref(true)
const createDefaultFilters = () => ({
  brand: '',
  type: '',
  deviceType: '',
  series: '',
  modeTag: '',
  search: '',
  sort: 'smart',
  completenessMin: 0,
  status: '',
  sourceOnly: false,
  officialImage: false,
  officialPage: false,
})
const draftFilters = reactive(createDefaultFilters())
const appliedFilters = ref(createDefaultFilters())
const compareIds = ref<number[]>(loadFromStorage('compare-ids', []))
const currentPage = ref(1)
const perPage = ref(8)

onMounted(async () => {
  products.value = await fetchProducts()
  isLoading.value = false
})

const brandOptions = computed(() => {
  return Array.from(new Set(products.value.map(product => product.brand))).sort()
})

const typeOptions = computed(() => {
  return Array.from(new Set(products.value.map(product => product.type))).sort()
})

const seriesOptions = computed(() => {
  return Array.from(new Set(products.value.map(product => product.series).filter(Boolean) as string[])).sort()
})

const modeOptions = computed(() => {
  const modes = products.value.flatMap(product => product.modeTags || [])
  return Array.from(new Set(modes)).sort()
})

const officialImageCount = computed(() => {
  return products.value.filter(product => Boolean(product.image && product.image.startsWith('http'))).length
})

const officialPageCount = computed(() => {
  return products.value.filter(product => Boolean(product.specs && product.specs['官方页面'])).length
})

const averageCompleteness = computed(() => {
  if (!products.value.length) return 0
  const total = products.value.reduce((sum, item) => sum + (item.dataCompleteness || 0), 0)
  return Math.round(total / products.value.length)
})

const filterWith = (filters: ReturnType<typeof createDefaultFilters>) => {
  const keyword = filters.search.trim().toLowerCase()
  const tokens = keyword.split(/[\s,，。；;、/\\|]+/).filter(Boolean)
  let result = products.value.filter(product => {
    const matchesBrand = filters.brand ? product.brand === filters.brand : true
    const matchesType = filters.type ? product.type === filters.type : true
    const matchesDeviceType = filters.deviceType ? product.deviceType === filters.deviceType : true
    const matchesSeries = filters.series ? product.series === filters.series : true
    const matchesMode = filters.modeTag ? product.modeTags?.includes(filters.modeTag) : true
    const matchesStatus = filters.status ? product.status === filters.status : true
    const matchesSource = filters.sourceOnly
      ? Boolean(product.sourcePaths?.length) || product.tag === '资料'
      : true
    const matchesOfficialImage = filters.officialImage
      ? Boolean(product.image && product.image.startsWith('http'))
      : true
    const matchesOfficialPage = filters.officialPage
      ? Boolean(product.specs && product.specs['官方页面'])
      : true
    const matchesCompleteness = filters.completenessMin
      ? (product.dataCompleteness || 0) >= filters.completenessMin
      : true
    const searchTarget = [
      product.name,
      product.brand,
      product.series,
      product.platformFamily,
      (product.modeTags || []).join(' '),
      (product.aliasNames || []).join(' '),
    ].filter(Boolean).join(' ')
    const matchesSearch = keyword
      ? searchTarget.toLowerCase().includes(keyword)
      : true
    return matchesBrand
      && matchesType
      && matchesDeviceType
      && matchesSeries
      && matchesMode
      && matchesStatus
      && matchesSearch
      && matchesSource
      && matchesOfficialImage
      && matchesOfficialPage
      && matchesCompleteness
  })

  const rankScore = (item: Product) => {
    let score = item.dataCompleteness || 0
    if (item.image && item.image.startsWith('http')) score += 20
    if (item.specs?.['官方页面']) score += 10
    if (item.epapMin || item.epapMax || item.ipapMax) score += 2
    return score
  }

  switch (filters.sort) {
    case 'smart':
      if (tokens.length) {
        const scoreSearch = (item: Product) => {
          const text = [
            item.name,
            item.brand,
            item.series,
            item.platformFamily,
            (item.modeTags || []).join(' '),
            (item.aliasNames || []).join(' '),
            Object.values(item.specs || {}).join(' '),
          ].filter(Boolean).join(' ').toLowerCase()
          return tokens.reduce((score, token) => (text.includes(token) ? score + 1 : score), 0)
        }
        result = result.slice().sort((a, b) => {
          const diff = scoreSearch(b) - scoreSearch(a)
          return diff !== 0 ? diff : rankScore(b) - rankScore(a)
        })
      } else {
        result = result.slice().sort((a, b) => rankScore(b) - rankScore(a))
      }
      break
    case 'rating':
      result = result.slice().sort((a, b) => b.rating - a.rating)
      break
    case 'reviews':
      result = result.slice().sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'completeness':
      result = result.slice().sort((a, b) => (b.dataCompleteness || 0) - (a.dataCompleteness || 0))
      break
    default:
      result = result.slice().sort((a, b) => {
        const aOfficial = a.image && a.image.startsWith('http') ? 1 : 0
        const bOfficial = b.image && b.image.startsWith('http') ? 1 : 0
        if (aOfficial !== bOfficial) return bOfficial - aOfficial
        const aPage = a.specs?.['官方页面'] ? 1 : 0
        const bPage = b.specs?.['官方页面'] ? 1 : 0
        if (aPage !== bPage) return bPage - aPage
        const completenessDelta = (b.dataCompleteness || 0) - (a.dataCompleteness || 0)
        if (completenessDelta !== 0) return completenessDelta
        if (a.tag && !b.tag) return -1
        if (!a.tag && b.tag) return 1
        return b.rating - a.rating
      })
      break
  }

  return result
}

const filteredProducts = computed(() => filterWith(draftFilters))
const appliedProducts = computed(() => filterWith(appliedFilters.value))
const isDirty = computed(() => JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters.value))
const displayedProducts = computed(() => (isDirty.value ? filteredProducts.value : appliedProducts.value))
const isDefaultApplied = computed(() => JSON.stringify(appliedFilters.value) === JSON.stringify(createDefaultFilters()))
const showSourceSection = computed(() => isDefaultApplied.value && !isDirty.value && !draftFilters.search)

const appliedSummary = computed(() => {
  const items: string[] = []
  if (appliedFilters.value.brand) items.push(`品牌 ${appliedFilters.value.brand}`)
  if (appliedFilters.value.series) items.push(`系列 ${appliedFilters.value.series}`)
  if (appliedFilters.value.deviceType) {
    const label = appliedFilters.value.deviceType === 'PAP_SLEEP'
      ? '睡眠PAP'
      : appliedFilters.value.deviceType === 'NIV_HOME'
        ? '家用NIV'
        : '便携/旅行'
    items.push(`设备类型 ${label}`)
  }
  if (appliedFilters.value.modeTag) items.push(`模式 ${appliedFilters.value.modeTag}`)
  if (appliedFilters.value.status) items.push(`状态 ${appliedFilters.value.status}`)
  if (appliedFilters.value.completenessMin) items.push(`完整度 ≥${appliedFilters.value.completenessMin}%`)
  if (appliedFilters.value.officialImage) items.push('仅官方图')
  if (appliedFilters.value.officialPage) items.push('仅官方页')
  if (appliedFilters.value.sourceOnly) items.push('资料提炼')
  if (appliedFilters.value.search) items.push(`关键词 ${appliedFilters.value.search}`)
  return items
})

const sourceProducts = computed(() => {
  return products.value.filter(product => Boolean(product.sourcePaths?.length) || product.tag === '资料')
})

const totalPages = computed(() => Math.max(1, Math.ceil(displayedProducts.value.length / perPage.value)))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return displayedProducts.value.slice(start, start + perPage.value)
})

const onToggleCompare = (id: number, checked: boolean) => {
  if (checked) {
    if (!compareIds.value.includes(id)) compareIds.value.push(id)
  } else {
    compareIds.value = compareIds.value.filter(i => i !== id)
  }
}

const gotoCompare = () => {
  if (compareIds.value.length < 2) return
  // navigate to compare page and pre-select via query
  const q = compareIds.value.join(',')
  router.push({ path: '/compare', query: { ids: q } })
}

const clearCompare = () => { compareIds.value = [] }

watch(compareIds, () => {
  saveToStorage('compare-ids', compareIds.value)
}, { deep: true })

const resetFilters = () => {
  Object.assign(draftFilters, createDefaultFilters())
  appliedFilters.value = createDefaultFilters()
  currentPage.value = 1
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const applySourceFilter = () => {
  draftFilters.sourceOnly = true
  appliedFilters.value = { ...draftFilters }
  currentPage.value = 1
}

const applyFilters = () => {
  appliedFilters.value = { ...draftFilters }
  currentPage.value = 1
}

const cancelPreview = () => {
  Object.assign(draftFilters, appliedFilters.value)
}
</script>

<style scoped>
.products-page {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
}

.page-header.handbook {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.header-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.page-header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
}

.filters {
  margin-bottom: 30px;
}

.filter-row {
  margin-top: 12px;
}

.applied-summary {
  margin: 12px 0 20px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
}

.summary-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.overview {
  margin-bottom: 20px;
}

.overview-card {
  text-align: left;
}

.overview-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}

.overview-card h3 {
  font-size: 24px;
  color: #1f2937;
  margin-bottom: 4px;
}

.overview-note {
  font-size: 12px;
  color: #94a3b8;
}

.filter-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #909399;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-count {
  font-size: 13px;
}

.products-grid {
  margin-top: 30px;
}
</style>
