<template>
  <div class="brands-page">
    <div class="page-header handbook">
      <p class="header-label">品牌库</p>
      <h1>品牌与系列概览</h1>
      <p>聚焦品牌定位、核心系列与市场概况。</p>
    </div>

    <el-card class="brand-filters">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8">
          <el-input v-model="filters.keyword" placeholder="搜索品牌名称..." clearable />
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-select v-model="filters.country" placeholder="选择国家" clearable>
            <el-option v-for="country in countryOptions" :key="country" :label="country" :value="country" />
          </el-select>
        </el-col>
        <el-col :xs="24" :md="8" class="filter-actions">
          <span class="result-count">共 {{ filteredBrands.length }} 个品牌</span>
          <el-button size="small" @click="resetFilters">重置筛选</el-button>
        </el-col>
      </el-row>
    </el-card>

    <el-row v-if="isLoading" :gutter="20" class="brands-grid">
      <el-col :xs="24" :sm="12" :md="8" v-for="i in 6" :key="i">
        <el-skeleton :rows="4" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20" class="brands-grid">
      <el-col :xs="24" :sm="12" :md="8" v-for="brand in filteredBrands" :key="brand.id">
        <el-card shadow="hover" class="brand-card" @click="goBrandDetail(brand.id)">
          <div class="brand-logo">
            <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" />
            <span v-else class="logo-placeholder">{{ brand.name }}</span>
          </div>
          <h3>{{ brand.name }}</h3>
          <div class="brand-info">
            <p>
              <span class="inline-icon info-icon">🌍</span>
              <span>{{ brand.country }}</span>
            </p>
            <p>
              <span class="inline-icon info-icon">📅</span>
              <span>成立于 {{ brand.founded || '—' }}</span>
            </p>
            <p>
              <span class="inline-icon info-icon">🛒</span>
              <span>{{ brand.productCount ?? '—' }} 款产品</span>
            </p>
            <p>
              <span class="inline-icon info-icon">📈</span>
              <span>市占率 {{ brand.marketShare || '—' }}</span>
            </p>
          </div>
          <p class="description">{{ brand.positioning || brand.description }}</p>
          <div class="focus-tags" v-if="brand.focusAreas?.length">
            <el-tag v-for="item in brand.focusAreas.slice(0, 3)" :key="item" size="small" type="info">{{ item }}</el-tag>
          </div>
          <div class="top-products" v-if="topProductsFor(brand.name).length">
            <h4>热销产品</h4>
            <ul>
              <li v-for="p in topProductsFor(brand.name)" :key="p.id">
                <strong>{{ p.name }}</strong> · {{ formatPrice(p.price) }} · ⭐{{ p.rating }}
              </li>
            </ul>
          </div>
          <el-button type="primary" size="small">查看详情</el-button>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!isLoading && filteredBrands.length === 0" description="暂无品牌数据" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchBrands, fetchProducts } from '@/services/dataService'
import type { Brand } from '@/types'

const router = useRouter()
const brands = ref<Brand[]>([])
const products = ref<any[]>([])
const isLoading = ref(true)
const filters = reactive({
  keyword: '',
  country: ''
})

const countryOptions = computed(() => {
  return Array.from(new Set(brands.value.map(item => item.country))).sort()
})

const filteredBrands = computed(() => {
  const keyword = filters.keyword.trim().toLowerCase()
  return brands.value.filter(brand => {
    const matchesCountry = filters.country ? brand.country === filters.country : true
    const matchesKeyword = keyword ? brand.name.toLowerCase().includes(keyword) : true
    return matchesCountry && matchesKeyword
  })
})

onMounted(async () => {
  brands.value = await fetchBrands()
  products.value = await fetchProducts()
  isLoading.value = false
})

const topProductsFor = (brandName: string) => {
  return products.value
    .filter(p => p.brand === brandName)
    .slice()
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 2)
}

const formatPrice = (price: number) => {
  if (!price || price <= 0) return '价格待补充'
  return `¥${price}`
}

const goBrandDetail = (brandId: number) => {
  router.push(`/brand/${brandId}`)
}

const resetFilters = () => {
  filters.keyword = ''
  filters.country = ''
}
</script>

<style scoped>
.brands-page {
  padding: 20px;
}

.brand-filters {
  margin-bottom: 20px;
}

.filter-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #909399;
  font-size: 13px;
}

.result-count {
  white-space: nowrap;
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
  margin-bottom: 8px;
  color: #1f2937;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
}

.brands-grid {
  margin-top: 30px;
}

.brand-card {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  height: 100%;
}

.focus-tags {
  margin: 10px 0 6px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.brand-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 32px rgba(0, 0, 0, 0.15) !important;
}

.brand-logo {
  width: 100%;
  height: 120px;
  background: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
}

.logo-placeholder {
  font-weight: 600;
  color: #909399;
}

.brand-card h3 {
  font-size: 18px;
  margin-bottom: 12px;
  color: #303133;
}

.brand-info {
  text-align: left;
  margin-bottom: 15px;
}

.brand-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #606266;
  margin: 8px 0;
}

.brand-info .info-icon {
  color: #409eff;
  flex-shrink: 0;
}

.description {
  color: #909399;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 15px !important;
  text-align: left;
}

.brand-card .el-button {
  width: 100%;
}

.top-products h4 {
  margin: 10px 0 6px;
  font-size: 13px;
  color: #303133;
}

.top-products ul {
  list-style: none;
  padding-left: 0;
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.top-products li {
  margin: 4px 0;
}
</style>
