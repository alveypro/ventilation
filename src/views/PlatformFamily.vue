<template>
  <div class="platform-page">
    <div class="page-header">
      <h1>{{ platformTitle }}</h1>
      <p>同款平台机型聚合与识别特征。</p>
    </div>

    <el-card class="platform-meta" v-if="platformMeta.length">
      <h3>平台识别特征</h3>
      <ul>
        <li v-for="item in platformMeta" :key="item">{{ item }}</li>
      </ul>
    </el-card>

    <div class="platform-actions" v-if="platformProducts.length >= 2">
      <el-button type="primary" plain @click="comparePlatform">同款对比</el-button>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="item in platformProducts" :key="item.id">
        <ProductCard :product="item" :show-compare="false" @detail="goToProduct(item.id)" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchProducts } from '@/services/dataService'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])

const platformId = computed(() => Number(route.params.id))

const platformProducts = computed(() => {
  return products.value.filter(item => item.platformId === platformId.value)
})

const platformTitle = computed(() => {
  return platformProducts.value[0]?.platformFamily || '平台家族'
})

const platformMeta = computed(() => {
  const first = platformProducts.value[0]
  if (!first) return []
  const items = []
  if (first.uiSignature) items.push(`UI特征：${first.uiSignature}`)
  if (first.dataSignature) items.push(`数据特征：${first.dataSignature}`)
  if (first.hardwareSignature) items.push(`硬件特征：${first.hardwareSignature}`)
  if (first.platformNotes) items.push(`平台风险：${first.platformNotes}`)
  return items
})

const comparePlatform = () => {
  const ids = platformProducts.value.map(item => item.id).slice(0, 4)
  if (ids.length < 2) return
  router.push({ path: '/compare', query: { ids: ids.join(',') } })
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

onMounted(async () => {
  products.value = await fetchProducts()
})
</script>

<style scoped>
.platform-page {
  padding: 20px 0 30px;
}

.platform-meta {
  margin-bottom: 20px;
}

.platform-meta ul {
  padding-left: 18px;
  color: #475569;
}

.platform-actions {
  margin-bottom: 16px;
}
</style>
