<template>
  <div class="diseases-page">
    <div class="page-header handbook">
      <p class="header-label">疾病指南</p>
      <h1>疾病与呼吸治疗路径</h1>
      <p>依据公开指南与共识整理，强调诊断、治疗与随访流程。</p>
    </div>

    <el-row v-if="isLoading" :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="i in 6" :key="i">
        <el-skeleton :rows="4" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20">
      <el-col :xs="24" :sm="12" :md="8" v-for="disease in diseases" :key="disease.id">
        <el-card shadow="hover" class="disease-card">
          <div class="card-header">
            <h3>{{ disease.name }}</h3>
            <el-tag :type="disease.severity === '严重' ? 'danger' : 'warning'" size="small">
              {{ disease.severity }}
            </el-tag>
          </div>
          <p class="description">{{ disease.description }}</p>
          <div class="meta">
            <span>患病人数：{{ disease.prevalence }}</span>
          </div>
          <div class="symptoms">
            <el-tag v-for="symptom in disease.symptoms.slice(0, 3)" :key="symptom" size="small">
              {{ symptom }}
            </el-tag>
          </div>
          <div class="recommended" v-if="disease.treatment?.length">
            <h4>治疗要点</h4>
            <div class="treatment-tags">
              <el-tag v-for="item in disease.treatment.slice(0, 3)" :key="item" size="small" type="success">
                {{ item }}
              </el-tag>
            </div>
          </div>
          <el-button type="primary" size="small" @click="goToDisease(disease.id)">查看详情</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { fetchDiseases } from '@/services/dataService'
import type { Disease } from '@/types'

const router = useRouter()
const diseases = ref<Disease[]>([])
const isLoading = ref(true)

onMounted(async () => {
  diseases.value = await fetchDiseases()
  isLoading.value = false
})

const goToDisease = (id: number) => {
  router.push(`/disease/${id}`)
}
</script>

<style scoped>
.diseases-page {
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

.disease-card {
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
}

.disease-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
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
  font-size: 12px;
  color: #909399;
  margin-bottom: 12px;
}

.symptoms {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.treatment-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
