<template>
  <el-card shadow="hover" class="product-card" @click="handleClick">
    <template #header>
      <div class="product-header">
        <h4>{{ product.name }}</h4>
        <div class="header-right">
          <el-tag v-if="product.tag" :type="product.tagType">{{ product.tag }}</el-tag>
          <el-checkbox
            v-if="showCompare"
            v-model="localCompare"
            @change.stop="toggleCompare"
            size="small"
          >
            对比
          </el-checkbox>
        </div>
      </div>
    </template>

    <div class="product-body">
      <div class="product-image">
        <img v-if="displayImage" :src="displayImage" :alt="product.name" />
        <div v-else class="placeholder">{{ product.brand }}</div>
      </div>

      <div class="product-info">
        <p class="product-type">{{ product.type }}</p>
        <p class="product-series" v-if="product.series">{{ product.series }}</p>
        <div class="device-tags" v-if="product.deviceType || product.platformFamily">
          <el-tag v-if="product.deviceType" size="small" type="warning">{{ deviceTypeLabel }}</el-tag>
          <el-tag v-if="product.platformFamily" size="small" type="info">{{ product.platformFamily }}</el-tag>
          <el-tag v-if="product.platformConfidence" size="small" type="success">归类 {{ product.platformConfidence }}%</el-tag>
          <el-tag v-if="hasOfficialImage" size="small" type="success">官方图</el-tag>
          <el-tag v-if="hasOfficialPage" size="small" type="info">官方页</el-tag>
          <el-tag v-if="completenessLabel" size="small" :type="completenessType">{{ completenessLabel }}</el-tag>
        </div>
        <div class="rating">
          <el-rate :model-value="product.rating || 0" disabled size="small"></el-rate>
          <span class="count">({{ product.reviewCount }})</span>
        </div>
        <div class="specs-preview">
          <el-tag v-for="(val, key) in previewSpecs" :key="key" size="small" type="info">
            {{ key }}: {{ val }}
          </el-tag>
        </div>
      </div>

      <div class="product-footer">
        <span class="price">{{ priceLabel }}</span>
        <el-button type="primary" size="small" @click.stop="handleDetail">详情</el-button>
      </div>

      <div class="highlights" v-if="product.highlights?.length || product.suitableFor?.length">
        <el-tag v-for="tag in product.highlights.slice(0, 3)" :key="tag" size="small">
          {{ tag }}
        </el-tag>
        <el-tag v-for="item in suitableLabels" :key="item" size="small" type="success">
          适用 {{ item }}
        </el-tag>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { formatPriceRange } from '@/utils/helpers'
import type { Product } from '@/types'

const props = defineProps<{
  product: Product
  showCompare?: boolean
  compareChecked?: boolean
}>()

const emits = defineEmits<{
  (event: 'click'): void
  (event: 'detail'): void
  (event: 'toggleCompare', id: number, checked: boolean): void
}>()

const localCompare = ref(Boolean(props.compareChecked))
const isSyncing = ref(false)

watch(localCompare, (v) => {
  if (isSyncing.value) return
  emits('toggleCompare', props.product.id, v)
})

watch(
  () => props.compareChecked,
  (value) => {
    isSyncing.value = true
    localCompare.value = Boolean(value)
    isSyncing.value = false
  }
)

const handleClick = () => {
  emits('click')
}

const handleDetail = () => {
  emits('detail')
}

const priceLabel = computed(() => formatPriceRange(props.product.price))

const previewSpecs = computed(() => {
  const s = props.product.specs || {}
  return Object.keys(s).slice(0, 2).reduce((acc: Record<string, any>, key) => {
    acc[key] = s[key]
    return acc
  }, {})
})

const displayImage = computed(() => {
  return props.product.image || props.product.images?.[0] || ''
})

const deviceTypeLabel = computed(() => {
  switch (props.product.deviceType) {
    case 'PAP_SLEEP':
      return '睡眠PAP'
    case 'NIV_HOME':
      return '家用NIV'
    case 'PAP_TRAVEL':
      return '便携/旅行'
    default:
      return ''
  }
})

const hasOfficialImage = computed(() => {
  return Boolean(props.product.image && props.product.image.startsWith('http'))
})

const hasOfficialPage = computed(() => {
  return Boolean(props.product.specs && props.product.specs['官方页面'])
})

const completenessValue = computed(() => props.product.dataCompleteness || 0)

const completenessLabel = computed(() => {
  if (!completenessValue.value) return ''
  return `完整度 ${completenessValue.value}%`
})

const completenessType = computed(() => {
  if (completenessValue.value >= 85) return 'success'
  if (completenessValue.value >= 70) return 'warning'
  return 'info'
})

const suitableLabels = computed(() => {
  const map: Record<string, string> = {
    sleep_apnea: '睡眠呼吸暂停',
    copd: '慢阻肺',
    neuromuscular: '神经肌肉',
    heart_failure: '心衰',
    ohs: '肥胖低通气',
    csa: '中枢性呼吸暂停',
  }
  return (props.product.suitableFor || []).slice(0, 2).map(item => map[item] || item)
})

const toggleCompare = () => {
  // handled by watch
}
</script>

<style scoped>
.product-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.product-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.product-header h4 {
  flex: 1;
  margin: 0;
  font-size: 16px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.header-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.product-body {
  padding: 0;
}

.product-image {
  width: 100%;
  height: 150px;
  background: linear-gradient(135deg, #e2e8f0 0%, #f8fafc 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.placeholder {
  color: white;
  font-weight: bold;
  font-size: 14px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.product-info {
  margin-bottom: 12px;
}

.product-type {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.product-series {
  font-size: 12px;
  color: #1e5aa6;
  margin-bottom: 8px;
}

.device-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 4px;
}

.count {
  font-size: 12px;
  color: #909399;
}

.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.price {
  font-size: 18px;
  color: #f56c6c;
  font-weight: bold;
}

.highlights {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.specs-preview {
  margin-top: 8px;
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.spec {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .product-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .product-header h4 {
    white-space: normal;
    line-height: 1.3;
  }

  .header-right {
    flex-wrap: wrap;
  }

  .product-image {
    height: 100px;
  }

  .product-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .product-footer .el-button {
    width: 100%;
  }

  .price {
    font-size: 16px;
  }
}
</style>
