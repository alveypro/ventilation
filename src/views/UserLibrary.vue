<template>
  <div class="user-library-page">
    <div class="page-header handbook">
      <p class="header-label">用户知识库</p>
      <h1>使用与问题处理指南</h1>
      <p>公开版知识整理（共 {{ filteredItems.length }} 条）。</p>
    </div>

    <section class="learning-path">
      <div class="path-header">
        <h2>学习路径</h2>
        <p>从入门到长期管理的最短路线，先看重点再深入细节。</p>
      </div>
      <el-row :gutter="16">
        <el-col :xs="24" :md="12" v-for="path in learningPath" :key="path.title">
          <el-card class="path-card">
            <div class="path-top">
              <h3>{{ path.title }}</h3>
              <el-tag size="small" type="info">{{ path.tag }}</el-tag>
            </div>
            <p class="path-desc">{{ path.description }}</p>
            <ul class="path-steps">
              <li v-for="step in path.steps" :key="step">{{ step }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </section>

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

const learningPath = [
  {
    title: '入门与判断',
    tag: '先弄清',
    description: '先分清打鼾与 OSA，再理解报告与诊断流程。',
    steps: ['先做筛查或监测', '按指标判断严重度', '确认是否需要用机']
  },
  {
    title: '选购与适应',
    tag: '先舒服',
    description: '选对机型与面罩，第一周重点是舒适与习惯。',
    steps: ['机型与面罩匹配', '湿化与睡姿优化', '7 天适应计划']
  },
  {
    title: '问题处理',
    tag: '先排查',
    description: '不适大多可调整，优先排查漏气与设置。',
    steps: ['漏气与口干处理', '压力不适沟通', '必要时复评']
  },
  {
    title: '长期管理',
    tag: '先稳定',
    description: '关注随访、生活方式与合并症，稳住长期效果。',
    steps: ['定期随访记录', '作息与体重管理', '合并症风险控制']
  }
]

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

.learning-path {
  margin: 10px 0 24px;
}

.path-header h2 {
  font-size: 20px;
  color: #111827;
  margin-bottom: 4px;
}

.path-header p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 14px;
}

.path-card {
  border: 1px solid #e5e7eb;
  background: #ffffff;
  margin-bottom: 12px;
}

.path-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.path-top h3 {
  font-size: 16px;
  color: #111827;
  margin: 0;
}

.path-desc {
  color: #4b5563;
  font-size: 14px;
  margin: 8px 0 10px;
}

.path-steps {
  padding-left: 18px;
  margin: 0;
  color: #475569;
  font-size: 13px;
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
