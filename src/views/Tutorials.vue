<template>
  <div class="tutorials-page">
    <div class="page-header handbook">
      <p class="header-label">公开教程</p>
      <h1>使用与维护教程</h1>
      <p>面向使用者的操作与维护指南，强调可执行步骤。</p>
    </div>

    <el-row v-if="isLoading" :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="i in 9" :key="i">
        <el-skeleton :rows="4" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="tutorial in tutorials" :key="tutorial.id">
        <el-card shadow="hover" class="tutorial-card" @click="goToTutorial(tutorial.id)">
          <div class="card-header">
            <h3>{{ tutorial.title }}</h3>
            <el-tag type="info" size="small">{{ tutorial.difficulty }}</el-tag>
          </div>
          <p class="description">{{ getExcerpt(tutorial.content) }}</p>
          <div class="meta">
            <span>⏱️ {{ tutorial.duration }}</span>
            <span>👁️ {{ tutorial.views }}</span>
          </div>
          <el-rate :model-value="tutorial.rating || 0" disabled size="small" />
          <el-button type="primary" size="small">阅读教程</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchTutorials } from '@/services/dataService'
import type { Tutorial } from '@/types'

const router = useRouter()
const tutorials = ref<Tutorial[]>([])
const isLoading = ref(true)

onMounted(async () => {
  tutorials.value = await fetchTutorials()
  isLoading.value = false
})

const goToTutorial = (id: number) => {
  router.push(`/tutorial/${id}`)
}

const getExcerpt = (content: string) => {
  const plain = content.replace(/[#*`>\-]/g, '').replace(/\s+/g, ' ').trim()
  return plain.slice(0, 70) + (plain.length > 70 ? '...' : '')
}
</script>

<style scoped>
.tutorials-page {
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

.tutorial-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.tutorial-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
}

.card-header h3 {
  font-size: 16px;
  margin: 0;
  color: #303133;
}

.description {
  color: #606266;
  font-size: 14px;
  line-height: 1.6;
  margin-bottom: 12px;
}

.meta {
  display: flex;
  gap: 12px;
  color: #909399;
  font-size: 12px;
  margin-bottom: 12px;
}
</style>
