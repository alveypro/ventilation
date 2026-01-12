<template>
  <div class="reviews-page">
    <div class="page-header">
      <h1>测评中心</h1>
      <p>专业的产品测评与对比</p>
    </div>

    <el-tabs v-model="activeTab">
      <el-tab-pane label="全部测评" name="all" />
      <el-tab-pane label="医生观点" name="doctor" />
      <el-tab-pane label="用户体验" name="user" />
    </el-tabs>

    <el-row v-if="isLoading" :gutter="20">
      <el-col :xs="24" :sm="12" v-for="i in 6" :key="i">
        <el-skeleton :rows="4" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20">
      <el-col :xs="24" :sm="12" v-for="review in filteredReviews" :key="`${review.productId}-${review.id}`">
        <el-card shadow="hover" class="review-card" @click="goToProduct(review.productId)">
          <div class="review-header">
            <h3>{{ review.title }}</h3>
            <el-tag size="small" :type="review.role === '医生' ? 'success' : 'info'">
              {{ review.role || '用户' }}
            </el-tag>
          </div>
          <p class="summary">{{ review.content }}</p>
          <div class="meta">
            <span>产品：{{ review.productName }}</span>
            <span>作者：{{ review.author }}</span>
          </div>
          <div class="footer">
            <el-rate :model-value="review.rating || 0" disabled size="small" />
            <span class="helpful">👍 {{ review.helpful }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-empty v-if="!isLoading && filteredReviews.length === 0" description="暂无测评内容" />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchReviews } from '@/services/dataService'
import { ElMessage } from 'element-plus'
import type { ReviewItem } from '@/services/dataService'

const router = useRouter()
const activeTab = ref('all')
const isLoading = ref(true)

const allReviews = ref<ReviewItem[]>([])

onMounted(async () => {
  const reviews = await fetchReviews()
  allReviews.value = reviews.map(review => ({
    ...review,
    role: review.role === '呼吸科医生' || review.role === '医生' ? '医生' : '用户',
  }))
  isLoading.value = false
})

const filteredReviews = computed(() => {
  if (activeTab.value === 'doctor') {
    return allReviews.value.filter(review => review.role === '医生')
  }
  if (activeTab.value === 'user') {
    return allReviews.value.filter(review => review.role !== '医生')
  }
  return allReviews.value
})

const goToProduct = (productId: number) => {
  if (!productId) {
    ElMessage.info('该测评暂无关联产品')
    return
  }
  router.push(`/product/${productId}`)
}
</script>

<style scoped>
.reviews-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
  padding: 30px 0;
}

.page-header h1 {
  font-size: 32px;
  color: #303133;
  margin-bottom: 10px;
}

.page-header p {
  font-size: 16px;
  color: #909399;
}

.review-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.review-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.review-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.review-header h3 {
  font-size: 16px;
  margin: 0;
  color: #303133;
}

.summary {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  gap: 8px;
}

.footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #909399;
  font-size: 12px;
}

.helpful {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
</style>
