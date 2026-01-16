<template>
  <div class="knowledge-detail-page">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="scopePath">{{ scopeLabel }}</el-breadcrumb-item>
      <el-breadcrumb-item>{{ article?.title || '知识条目' }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="page-header handbook">
      <p class="header-label">{{ scopeLabel }}</p>
      <h1>{{ article?.title || '知识条目' }}</h1>
      <p>{{ article?.summary || '临床/用户知识条目' }}</p>
    </div>

    <el-row :gutter="20">
      <el-col :xs="24" :md="18">
        <el-card shadow="hover">
          <div class="article-content" v-html="renderMarkdown(articleContent)"></div>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="6">
        <el-card class="sidebar-card">
          <template #header>
            <div class="card-header">
              <span>条目信息</span>
            </div>
          </template>
          <div class="sidebar-item">
            <span class="label">分类</span>
            <span class="value">{{ article?.category || '未分类' }}</span>
          </div>
          <div class="sidebar-item">
            <span class="label">等级</span>
            <span class="value">{{ article?.level || '—' }}</span>
          </div>
          <div class="sidebar-item">
            <span class="label">类型</span>
            <span class="value">{{ article?.docType || '—' }}</span>
          </div>
          <div class="sidebar-item" v-if="article?.keywords?.length">
            <span class="label">关键词</span>
            <div class="keyword-tags">
              <el-tag v-for="tag in article!.keywords" :key="tag" size="small" type="info">{{ tag }}</el-tag>
            </div>
          </div>
          <div class="sidebar-item" v-if="article?.sourcePath">
            <span class="label">来源</span>
            <span class="value">{{ article?.sourcePath }}</span>
          </div>

          <div class="sidebar-block" v-if="authorityReferences.length">
            <h4>循证依据</h4>
            <ul>
              <li v-for="item in authorityReferences" :key="item">{{ item }}</li>
            </ul>
          </div>

          <div class="sidebar-block warning" v-if="safetyWarnings.length">
            <h4>安全提示</h4>
            <ul>
              <li v-for="item in safetyWarnings" :key="item">{{ item }}</li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { publicUserLibraryData } from '@/data/public-user-library'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const isClinical = computed(() => route.path.startsWith('/clinical'))
const scopeLabel = computed(() => (isClinical.value ? '临床知识库' : '用户知识库'))
const scopePath = computed(() => (isClinical.value ? '/clinical' : '/user-knowledge'))
const dataset = computed(() => (isClinical.value ? clinicalHandbookData : publicUserLibraryData))

const article = computed(() => {
  const id = Number(route.params.id)
  return dataset.value.find(item => item.id === id)
})

const buildFallback = (item: any) => {
  if (!item) return '内容不存在。'
  return [
    '## 一句话定义',
    item.summary || `${item.title}是呼吸治疗中的常见主题。`,
    '',
    '## 适用人群与场景',
    '- 面向需要了解呼吸治疗基础概念的读者。',
    '- 适合复习临床路径与关键参数。',
    '',
    '## 核心流程',
    '1. 明确适应证或关注点。',
    '2. 结合监测指标与症状评估。',
    '3. 执行治疗/管理策略并随访。',
    '',
    '## 常见问题',
    '- 参数或指标需结合临床背景解释。',
    '- 如出现持续低氧或明显不适需就医。',
    '',
    '## 合规提示',
    '- 仅用于教育目的，不替代医疗决策。',
  ].join('\n')
}

const articleContent = computed(() => article.value?.content || buildFallback(article.value))

const authorityReferences = computed(() => {
  const text = `${article.value?.title || ''} ${article.value?.summary || ''} ${(article.value?.keywords || []).join(' ')}`.toLowerCase()
  if (text.includes('osa') || text.includes('睡眠呼吸暂停')) return ['AASM 临床指南', '睡眠医学评分共识']
  if (text.includes('copd')) return ['GOLD 指南', '呼吸学会共识']
  if (text.includes('niv') || text.includes('无创通气')) return ['ERS/ATS 无创通气共识', '临床实践要点']
  if (text.includes('psg') || text.includes('多导')) return ['AASM PSG评分手册', '睡眠中心操作规范']
  return ['公开医学共识', '临床实践建议']
})

const safetyWarnings = computed(() => {
  const text = `${article.value?.title || ''} ${(article.value?.keywords || []).join(' ')}`.toLowerCase()
  const warnings = []
  if (text.includes('asv')) warnings.push('ASV 属于高风险模式，需严格评估适应证。')
  if (text.includes('中枢')) warnings.push('中枢性事件需先处理原发病因。')
  if (text.includes('低氧') || text.includes('呼衰')) warnings.push('严重低氧或呼衰请优先就医。')
  return warnings
})

</script>

<style scoped>
.knowledge-detail-page {
  padding: 20px 0 30px;
}

.page-header.handbook {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  margin: 16px 0 20px;
}

.header-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.article-content :deep(h3) {
  margin-top: 20px;
  font-size: 18px;
  color: #1f2937;
}

.article-content :deep(p) {
  line-height: 1.7;
  color: #4b5563;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.article-content :deep(th),
.article-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
}

.article-content :deep(th) {
  background: #f8fafc;
  color: #1f2937;
}

.sidebar-card {
  margin-top: 0;
}

.sidebar-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 13px;
  color: #6b7280;
  gap: 12px;
}

.sidebar-item .value {
  color: #1f2937;
  text-align: right;
}

.keyword-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.sidebar-block {
  margin-top: 16px;
  border-top: 1px dashed #e5e7eb;
  padding-top: 12px;
}

.sidebar-block.warning {
  color: #b45309;
}

.sidebar-block ul {
  padding-left: 18px;
  margin: 8px 0 0;
}

@media (max-width: 768px) {
  .sidebar-card {
    margin-top: 12px;
  }

  .sidebar-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .sidebar-item .value {
    text-align: left;
  }
}
</style>
