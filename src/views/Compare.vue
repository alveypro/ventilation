<template>
  <div class="compare-page">
    <div class="page-header handbook">
      <p class="header-label">产品对比</p>
      <h1>参数与差异对照</h1>
      <p>聚焦关键参数与适用场景差异。</p>
    </div>

    <el-alert
      title="选择2-4个产品进行对比"
      type="info"
      :closable="false"
      style="margin-bottom: 20px"
    />

    <el-card class="compare-guide" v-if="!hasProducts">
      <template #header>
        <span>对比指南</span>
      </template>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="tip in compareTips" :key="tip.title">
          <div class="guide-item">
            <div class="icon">{{ tip.icon }}</div>
            <div>
              <h4>{{ tip.title }}</h4>
              <p>{{ tip.description }}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 选择产品 -->
    <el-card class="product-selector" v-if="!hasProducts && products.length">
      <template #header>
        <span>选择要对比的产品</span>
      </template>

      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in products" :key="product.id">
          <el-card shadow="hover" class="product-option" @click="selectProduct(product.id)">
            <div class="placeholder">{{ product.brand }}</div>
            <h4>{{ product.name }}</h4>
            <p>{{ formatPriceRange(product.price) }}</p>
            <el-button type="primary" size="small" @click.stop="selectProduct(product.id)">
              选择
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-row v-if="isLoading" :gutter="20" class="products-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="i in 8" :key="i">
        <el-skeleton :rows="5" />
      </el-col>
    </el-row>

    <el-empty v-if="!isLoading && !products.length" description="暂无可对比产品" />

    <!-- 对比表格 -->
    <div v-if="hasProducts" class="compare-table">
      <el-button @click="clearSelection" class="clear-btn">清除选择</el-button>

      <div class="table-wrapper">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="property-col">规格参数</th>
              <th v-for="product in selectedProducts" :key="product.id" class="product-col">
                <div class="product-header">
                  <div class="product-image">{{ product.brand }}</div>
                  <h4>{{ product.name }}</h4>
                  <p class="price">{{ formatPriceRange(product.price) }}</p>
                  <el-button type="primary" size="small" @click="gotoProduct(product.id)">
                    查看详情
                  </el-button>
                  <el-button size="small" @click="removeProduct(product.id)">移除</el-button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in comparisonRows" :key="row.key">
              <td class="property-col">{{ row.label }}</td>
              <td v-for="product in selectedProducts" :key="product.id" class="product-col">
                <span :class="{ 'diff-cell': row.diff }">{{ row.values[product.id] || '—' }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <el-card class="compare-report" style="margin-top: 20px;">
        <template #header>
          <span>对比结论</span>
        </template>
        <div class="report-content">
          <p>推荐机型：<strong>{{ comparisonReport.recommended || '—' }}</strong></p>
          <p>推荐理由：</p>
          <ul>
            <li v-for="reason in comparisonReport.reasons" :key="reason">{{ reason }}</li>
          </ul>
          <div class="report-actions">
            <el-button type="primary" size="small" @click="downloadReport">下载对比报告</el-button>
            <el-button size="small" @click="printReport">打印/导出PDF</el-button>
          </div>
        </div>
      </el-card>

      <!-- 优缺点对比 -->
      <el-row :gutter="20" class="advantages-comparison" style="margin-top: 30px;">
        <el-col :xs="24" :md="12" v-for="product in selectedProducts" :key="product.id">
          <el-card>
            <template #header>
              <span>{{ product.name }}</span>
            </template>

            <div class="advantages">
              <h4>✓ 优点</h4>
              <ul>
                <li v-for="(adv, idx) in product.advantages?.slice(0, 3)" :key="idx">
                  {{ adv }}
                </li>
              </ul>
            </div>

            <div class="disadvantages" v-if="product.disadvantages?.length">
              <h4>✗ 缺点</h4>
              <ul>
                <li v-for="(dis, idx) in product.disadvantages?.slice(0, 3)" :key="idx">
                  {{ dis }}
                </li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProducts } from '@/services/dataService'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { formatPriceRange } from '@/utils/helpers'
import type { Product } from '@/types'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
const isLoading = ref(true)
const selectedProductIds = ref<number[]>([])
const compareTips = ref([
  {
    icon: '🧩',
    title: '看适配性',
    description: '优先对比适用疾病、模式与压力范围。'
  },
  {
    icon: '🔇',
    title: '看舒适度',
    description: '噪音、加湿与面罩兼容决定使用体验。'
  },
  {
    icon: '📈',
    title: '看长期成本',
    description: '滤网、面罩、管路更换周期影响总成本。'
  },
  {
    icon: '🧠',
    title: '看数据能力',
    description: '云端数据、依从性追踪对长期管理很关键。'
  }
])

onMounted(async () => {
  products.value = await fetchProducts()
  isLoading.value = false
})

const parseIds = (value: unknown) => {
  if (!value) return []
  const raw = Array.isArray(value) ? value.join(',') : String(value)
  return raw
    .split(',')
    .map(item => Number(item))
    .filter(id => Number.isFinite(id))
}

const syncSelectionFromQuery = () => {
  const stored = loadFromStorage('compare-ids', [])
  const fromQuery = parseIds(route.query.ids)
  const merged = Array.from(new Set([...(stored as number[]), ...fromQuery]))
  selectedProductIds.value = merged.slice(0, 4)
}

watch(() => route.query.ids, syncSelectionFromQuery, { immediate: true })

watch(selectedProductIds, () => {
  saveToStorage('compare-ids', selectedProductIds.value)
}, { deep: true })
const selectedProducts = computed(() =>
  products.value.filter(p => selectedProductIds.value.includes(p.id))
)

const hasProducts = computed(() => selectedProductIds.value.length >= 2)

const buildRow = (key: string, label: string, getter: (product: Product) => string) => {
  const values: Record<number, string> = {}
  selectedProducts.value.forEach(product => {
    values[product.id] = getter(product) || '—'
  })
  const diff = selectedProducts.value.length > 1 && new Set(Object.values(values)).size > 1
  return { key, label, values, diff }
}

const comparisonRows = computed(() => {
  if (selectedProducts.value.length === 0) return []
  const rows = [
    buildRow('deviceType', '设备类型', p => p.deviceType === 'PAP_SLEEP' ? '睡眠PAP' : p.deviceType === 'NIV_HOME' ? '家用NIV' : p.deviceType === 'PAP_TRAVEL' ? '便携/旅行' : p.type),
    buildRow('modeTags', '支持模式', p => p.modeTags?.join(' / ') || ''),
    buildRow('epap', '压力范围', p => p.epapMin !== undefined && p.epapMax !== undefined ? `${p.epapMin}-${p.epapMax} cmH2O` : p.specs?.['EPAP'] || ''),
    buildRow('ipap', 'IPAP 上限', p => p.ipapMax ? `${p.ipapMax} cmH2O` : p.specs?.['IPAP上限'] || ''),
    buildRow('backupRate', '后备频率', p => p.backupRate === undefined ? '' : p.backupRate ? '支持' : '不支持'),
    buildRow('targetVentilation', '目标通气', p => p.targetVentilation === undefined ? '' : p.targetVentilation ? '支持' : '不支持'),
    buildRow('humidifier', '湿化器', p => p.humidifier || ''),
    buildRow('heatedTube', '加温管路', p => p.heatedTube || ''),
    buildRow('connectivity', '连接方式', p => p.connectivity?.join(' / ') || ''),
    buildRow('weight', '重量', p => p.weightKg ? `${p.weightKg} kg` : ''),
    buildRow('noise', '噪音', p => p.noiseDb || ''),
  ]
  const extraKeys = new Set<string>()
  selectedProducts.value.forEach(product => {
    Object.keys(product.specs || {}).forEach(key => extraKeys.add(key))
  })
  extraKeys.forEach(key => {
    if (rows.some(row => row.label === key)) return
    rows.push(buildRow(`spec-${key}`, key, p => p.specs?.[key] || ''))
  })
  return rows
})

const comparisonReport = computed(() => {
  if (selectedProducts.value.length === 0) {
    return { recommended: '', reasons: [] as string[] }
  }
  const sorted = [...selectedProducts.value].sort((a, b) => (b.dataCompleteness || 0) - (a.dataCompleteness || 0))
  const best = sorted[0]
  const reasons = [
    `资料完整度 ${best.dataCompleteness || 0}%`,
    `适用类型：${best.type}`,
    `支持模式：${best.modeTags?.join(' / ') || '—'}`
  ]
  return {
    recommended: best.name,
    reasons
  }
})

const buildReportText = () => {
  const header = `呼吸机对比报告\n生成时间：${new Date().toLocaleString()}`
  const products = selectedProducts.value
    .map(product => `- ${product.name}（${formatPriceRange(product.price)}）`)
    .join('\n')
  const specs = comparisonRows.value.map(row => {
    const values = selectedProducts.value.map(product => `${product.name}: ${row.values[product.id] || '—'}`).join(' | ')
    return `${row.label}: ${values}`
  }).join('\n')
  const reasons = comparisonReport.value.reasons.map(item => `- ${item}`).join('\n')
  const platforms = selectedProducts.value.map(product => `- ${product.name}: ${product.platformFamily || '—'}`).join('\n')
  return `${header}\n\n对比机型：\n${products}\n\n平台家族：\n${platforms}\n\n核心参数：\n${specs}\n\n推荐结论：\n${comparisonReport.value.recommended}\n理由：\n${reasons}\n`
}

const downloadReport = () => {
  const text = buildReportText()
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'compare-report.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const printReport = () => {
  const doc = `
    <html>
      <head>
        <title>对比报告</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #333; }
          h1 { font-size: 20px; margin-bottom: 12px; }
          h2 { font-size: 16px; margin: 16px 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f5f7fa; text-align: left; }
        </style>
      </head>
      <body>
        <h1>呼吸机对比报告</h1>
        <div>生成时间：${new Date().toLocaleString()}</div>
        <h2>对比机型</h2>
        <ul>${selectedProducts.value.map(product => `<li>${product.name}（${formatPriceRange(product.price)}）</li>`).join('')}</ul>
        <h2>核心参数</h2>
        <table>
          <thead>
            <tr>
              <th>参数</th>
              ${selectedProducts.value.map(product => `<th>${product.name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${comparisonRows.value.map(row => `
              <tr>
                <td>${row.label}</td>
                ${selectedProducts.value.map(product => `<td>${row.values[product.id] || '—'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <h2>推荐结论</h2>
        <div><strong>${comparisonReport.value.recommended || '—'}</strong></div>
        <ul>${comparisonReport.value.reasons.map(reason => `<li>${reason}</li>`).join('')}</ul>
      </body>
    </html>
  `
  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(doc)
  win.document.close()
  win.focus()
  win.print()
}
const selectProduct = (productId: number) => {
  if (selectedProductIds.value.includes(productId)) {
    selectedProductIds.value = selectedProductIds.value.filter(id => id !== productId)
  } else {
    if (selectedProductIds.value.length < 4) {
      selectedProductIds.value.push(productId)
    }
  }
}

const removeProduct = (productId: number) => {
  selectedProductIds.value = selectedProductIds.value.filter(id => id !== productId)
}

const clearSelection = () => {
  selectedProductIds.value = []
}

const gotoProduct = (productId: number) => {
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.compare-page {
  padding: 20px;
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

.product-option {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
}

.product-option:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.placeholder {
  width: 100%;
  height: 100px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  border-radius: 4px;
  margin-bottom: 10px;
}

.product-option h4 {
  margin-bottom: 10px;
  color: #303133;
  font-size: 14px;
  height: 2.8em;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.product-option p {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 10px;
}

.product-option .el-button {
  width: 100%;
}

.compare-guide {
  margin-bottom: 20px;
}

.guide-item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.guide-item .icon {
  font-size: 22px;
}

.guide-item h4 {
  margin: 0 0 6px;
  font-size: 14px;
  color: #303133;
}

.guide-item p {
  margin: 0;
  font-size: 12px;
  color: #606266;
}

.clear-btn {
  margin-bottom: 20px;
}

.table-wrapper {
  overflow-x: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.diff-cell {
  font-weight: 600;
  color: #f56c6c;
}

.report-actions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.compare-report ul {
  margin: 10px 0 0;
  padding-left: 20px;
  color: #606266;
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.comparison-table th,
.comparison-table td {
  padding: 15px;
  text-align: left;
  border: 1px solid #dcdfe6;
}

.comparison-table th {
  background: #f5f7fa;
  font-weight: 600;
  color: #303133;
  position: sticky;
  top: 0;
}

.property-col {
  width: 150px;
  min-width: 150px;
  background: #f5f7fa !important;
  font-weight: 600;
}

.product-col {
  min-width: 200px;
}

.product-header {
  text-align: center;
}

.product-image {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-bottom: 10px;
  font-size: 12px;
}

.product-header h4 {
  margin-bottom: 5px;
  color: #303133;
  font-size: 13px;
}

.price {
  color: #f56c6c;
  font-weight: bold;
  margin-bottom: 10px;
  font-size: 14px;
}

.product-header .el-button {
  width: 100%;
  margin-bottom: 5px;
}

.advantages,
.disadvantages {
  margin-bottom: 15px;
}

.advantages h4,
.disadvantages h4 {
  margin-bottom: 8px;
  font-size: 14px;
  color: #303133;
}

.advantages ul,
.disadvantages ul {
  list-style: none;
  padding-left: 0;
}

.advantages li,
.disadvantages li {
  padding: 5px 0;
  color: #606266;
  font-size: 13px;
}

.advantages li::before {
  content: '✓ ';
  color: #67c23a;
  font-weight: bold;
  margin-right: 5px;
}

.disadvantages li::before {
  content: '✗ ';
  color: #f56c6c;
  font-weight: bold;
  margin-right: 5px;
}

@media (max-width: 768px) {
  .comparison-table {
    font-size: 12px;
  }

  .comparison-table th,
  .comparison-table td {
    padding: 8px;
  }

  .property-col {
    width: 100px;
    min-width: 100px;
  }

  .product-col {
    min-width: 150px;
  }
}
</style>
