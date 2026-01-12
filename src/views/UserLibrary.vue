<template>
  <div class="user-library-page">
    <div class="page-header handbook">
      <p class="header-label">用户知识库</p>
      <h1>使用与问题处理指南</h1>
      <p>公开版知识整理（共 {{ filteredItems.length }} 条）。</p>
    </div>

    <el-card class="filters">
      <div class="filter-row">
        <el-input v-model="query" placeholder="搜索用户知识" clearable />
        <el-select v-model="category" placeholder="分类" clearable>
          <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="level" placeholder="等级" clearable>
          <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
        </el-select>
        <el-select v-model="docType" placeholder="类型" clearable>
          <el-option v-for="item in docTypeOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </div>
    </el-card>

    <el-row :gutter="20">
      <el-col :xs="24" :md="12" v-for="item in filteredItems" :key="item.id">
        <el-card shadow="hover" class="library-card clickable" @click="goToItem(item.id)">
          <h3>{{ item.title }}</h3>
          <p class="summary">{{ item.summary }}</p>
          <ul class="points" v-if="item.keyPoints?.length">
            <li v-for="point in item.keyPoints" :key="point">{{ point }}</li>
          </ul>
          <div class="meta">
            <el-tag size="small" type="success">用户</el-tag>
            <el-tag v-if="item.category" size="small" type="warning">{{ item.category }}</el-tag>
            <el-tag v-if="item.level" size="small" type="primary">{{ item.level }}</el-tag>
            <el-tag v-if="item.docType" size="small" type="danger">{{ item.docType }}</el-tag>
            <el-tag v-for="tag in item.keywords || []" :key="tag" size="small" type="info">{{ tag }}</el-tag>
            <span v-if="item.sourcePath" class="source">{{ item.sourcePath }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { publicUserLibraryData } from '@/data/public-user-library'

const query = ref('')
const category = ref('')
const level = ref('')
const docType = ref('')

const categoryOptions = Array.from(
  new Set(publicUserLibraryData.map(item => item.category).filter(Boolean))
) as string[]
const levelOptions = Array.from(
  new Set(publicUserLibraryData.map(item => item.level).filter(Boolean))
) as string[]
const docTypeOptions = Array.from(
  new Set(publicUserLibraryData.map(item => item.docType).filter(Boolean))
) as string[]
const router = useRouter()

const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return publicUserLibraryData.filter(item => {
    const matchesKeyword = !keyword
      || `${item.title} ${item.summary} ${(item.keywords || []).join(' ')}`.toLowerCase().includes(keyword)
    const matchesCategory = !category.value || item.category === category.value
    const matchesLevel = !level.value || item.level === level.value
    const matchesDocType = !docType.value || item.docType === docType.value
    return matchesKeyword && matchesCategory && matchesLevel && matchesDocType
  })
})

const goToItem = (id: number) => {
  router.push(`/user-knowledge/${id}`)
}
</script>

<style scoped>
.user-library-page {
  padding: 20px 0 30px;
}

.page-header {
  margin-bottom: 20px;
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
  margin-bottom: 20px;
}

.filter-row {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) repeat(3, minmax(140px, 200px));
  gap: 12px;
}

.library-card {
  margin-bottom: 16px;
}

.library-card.clickable {
  cursor: pointer;
}

.summary {
  color: #606266;
  font-size: 14px;
  margin: 10px 0;
}

.points {
  padding-left: 18px;
  color: #475569;
  font-size: 13px;
  margin: 0 0 10px;
}

.meta {
  display: flex;
  gap: 10px;
  align-items: center;
  color: #909399;
  font-size: 12px;
  flex-wrap: wrap;
}

.source {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
