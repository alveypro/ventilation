<template>
  <div class="encyclopedia-page">
    <div class="page-header handbook">
      <p class="header-label">指南总览</p>
      <h1>呼吸机百科中心</h1>
      <p>聚合疾病、临床专题、教程与用户知识，形成完整知识地图。</p>
    </div>

    <el-card class="hero-card" shadow="never">
      <div class="hero-content">
        <div>
          <h2>一站式呼吸健康参考库</h2>
          <p>覆盖产品选购、临床指南、患者教育、真实测评与使用教程。</p>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="value">{{ stats.products }}</span>
            <span class="label">产品</span>
          </div>
          <div class="stat">
            <span class="value">{{ stats.brands }}</span>
            <span class="label">品牌</span>
          </div>
          <div class="stat">
            <span class="value">{{ stats.diseases }}</span>
            <span class="label">疾病指南</span>
          </div>
          <div class="stat">
            <span class="value">{{ stats.tutorials }}</span>
            <span class="label">教程</span>
          </div>
        </div>
      </div>
    </el-card>

    <div class="content-section">
      <h2>百科入口</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="module in modules" :key="module.id">
          <el-card shadow="hover" class="entry-card" @click="goTo(module.path)">
            <div class="entry-icon">{{ module.icon }}</div>
            <div class="entry-body">
              <h3>{{ module.title }}</h3>
              <p>{{ module.description }}</p>
              <el-tag v-if="module.countLabel" size="small">{{ module.countLabel }}</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>专题索引</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="topic in topicIndex" :key="topic.id">
          <el-card shadow="hover" class="topic-card">
            <div class="topic-header">
              <h3>{{ topic.title }}</h3>
              <el-tag size="small" type="success">搜索专题</el-tag>
            </div>
            <p class="topic-desc">{{ topic.description }}</p>
            <div class="topic-counts">
              <span>产品 {{ topic.counts.products }}</span>
              <span>教程 {{ topic.counts.tutorials }}</span>
              <span>临床 {{ topic.counts.clinical }}</span>
              <span>用户 {{ topic.counts.user }}</span>
            </div>
            <el-button size="small" type="primary" plain @click="goTo(`/topic/${topic.id}`)">
              查看专题
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>权威资源导航</h2>
      <p class="section-note">精选国际学会、制造商与学术资源，便于快速查阅权威资料。</p>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="category in resourceCategories" :key="category.id">
          <el-card shadow="hover" class="resource-card">
            <div class="resource-header">
              <h3>{{ category.title }}</h3>
              <span>{{ category.subtitle }}</span>
            </div>
            <ul class="resource-list">
              <li v-for="item in category.items" :key="item.name">
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  @click.prevent="openExternal(item.url)"
                >
                  {{ item.name }}
                </a>
                <p>{{ item.description }}</p>
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
      <div class="resource-notes">
        <p v-for="note in resourceNotes" :key="note">{{ note }}</p>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts, fetchBrands, fetchDiseases, fetchTutorials, fetchReviews } from '@/services/dataService'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { publicUserLibraryData } from '@/data/public-user-library'
import { topicCatalog } from '@/utils/topics'
import { resourceCategories, resourceNotes } from '@/data/resource-links'
import type { Product, Tutorial } from '@/types'

const router = useRouter()
const stats = ref({
  products: 0,
  brands: 0,
  diseases: 0,
  tutorials: 0,
  reviews: 0,
})
const productsList = ref<Product[]>([])
const tutorialsList = ref<Tutorial[]>([])

const modules = computed(() => [
  {
    id: 'products',
    title: '产品库',
    description: '型号、参数、优缺点与适用人群。',
    icon: '🧭',
    path: '/products',
    countLabel: `${stats.value.products} 款`,
  },
  {
    id: 'brands',
    title: '品牌库',
    description: '品牌介绍、市场份额、代表机型。',
    icon: '🏷️',
    path: '/brands',
    countLabel: `${stats.value.brands} 个`,
  },
  {
    id: 'diseases',
    title: '疾病指南',
    description: 'OSA/COPD 等诊疗与设备建议。',
    icon: '🩺',
    path: '/diseases',
    countLabel: `${stats.value.diseases} 类`,
  },
  {
    id: 'tutorials',
    title: '使用教程',
    description: '开箱、调压、清洁与维护。',
    icon: '📚',
    path: '/tutorials',
    countLabel: `${stats.value.tutorials} 篇`,
  },
  {
    id: 'reviews',
    title: '测评中心',
    description: '专业测评与真实用户反馈。',
    icon: '⭐',
    path: '/reviews',
    countLabel: `${stats.value.reviews} 条`,
  },
  {
    id: 'clinical',
    title: '临床知识库',
    description: '临床应用与操作要点。',
    icon: '🧬',
    path: '/clinical',
    countLabel: `${clinicalHandbookData.length} 条`,
  },
  {
    id: 'clinical-guides',
    title: '临床专题课',
    description: '机型模式、PSG判读、NIV临床应用。',
    icon: '📘',
    path: '/clinical-guides',
  },
  {
    id: 'user-knowledge',
    title: '用户知识库',
    description: '使用、维护与问题排查。',
    icon: '📘',
    path: '/user-knowledge',
    countLabel: `${publicUserLibraryData.length} 条`,
  },
  {
    id: 'compare',
    title: '产品对比',
    description: '2-4 台机器横向对比。',
    icon: '📊',
    path: '/compare',
  },
  {
    id: 'selector',
    title: '智能选机',
    description: '问卷式推荐，快速锁定机型。',
    icon: '🤖',
    path: '/selector',
  },
  {
    id: 'doctor',
    title: '医生中心',
    description: '诊断标准、治疗策略与随访工具。',
    icon: '👨‍⚕️',
    path: '/doctor',
  },
  {
    id: 'patient',
    title: '患者中心',
    description: '通俗解释、使用指南与支持社区。',
    icon: '👤',
    path: '/patient',
  },
  {
    id: 'agent',
    title: '代理商中心',
    description: '市场洞察、客户画像与销售工具。',
    icon: '🧰',
    path: '/agent',
  },
  {
    id: 'manufacturer',
    title: '厂家中心',
    description: '竞品分析、研发重点与合规清单。',
    icon: '🏭',
    path: '/manufacturer',
  },
])


const topicIndex = ref<
  {
    id: string
    title: string
    description: string
    query: string
    counts: { products: number; tutorials: number; clinical: number; user: number }
  }[]
>([])

const countMatches = (items: any[], fields: string[], keywords: string[]) => {
  const lowerKeywords = keywords.map(item => item.toLowerCase())
  return items.filter(item => {
    const text = fields
      .map(field => {
        const value = item[field]
        if (Array.isArray(value)) return value.join(' ')
        return value || ''
      })
      .join(' ')
      .toLowerCase()
    return lowerKeywords.some(keyword => text.includes(keyword.toLowerCase()))
  }).length
}

const buildTopicIndex = () => {
  topicIndex.value = topicCatalog.map(topic => ({
    id: topic.id,
    title: topic.title,
    description: topic.description,
    query: topic.query,
    counts: {
      products: countMatches(productsList.value, ['name', 'brand', 'type', 'description', 'highlights'], topic.keywords),
      tutorials: countMatches(tutorialsList.value, ['title', 'category', 'content'], topic.keywords),
      clinical: countMatches(clinicalHandbookData, ['title', 'summary', 'keywords'], topic.keywords),
      user: countMatches(publicUserLibraryData, ['title', 'summary', 'keywords'], topic.keywords),
    },
  }))
}


const goTo = (path: string) => {
  router.push(path)
}

const openExternal = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}


onMounted(async () => {
  const [products, brands, diseases, tutorials, reviews] = await Promise.all([
    fetchProducts(),
    fetchBrands(),
    fetchDiseases(),
    fetchTutorials(),
    fetchReviews(),
  ])
  productsList.value = products
  tutorialsList.value = tutorials
  stats.value = {
    products: products.length,
    brands: brands.length,
    diseases: diseases.length,
    tutorials: tutorials.length,
    reviews: reviews.length,
  }
  buildTopicIndex()
})
</script>

<style scoped>
.encyclopedia-page {
  padding: 10px 0 30px;
}

.page-header.handbook {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  margin-bottom: 20px;
}

.header-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.hero-card {
  margin-bottom: 30px;
  background: linear-gradient(135deg, #e0f2fe 0%, #fef9c3 100%);
  border: none;
}

.hero-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.hero-content h2 {
  margin-bottom: 8px;
}

.hero-stats {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.stat {
  background: white;
  border-radius: 8px;
  padding: 10px 14px;
  text-align: center;
  min-width: 88px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.stat .value {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.stat .label {
  font-size: 12px;
  color: #64748b;
}

.section-note {
  margin: 6px 0 18px;
  color: #6b7280;
}

.resource-card {
  min-height: 320px;
}

.resource-header h3 {
  margin-bottom: 4px;
}

.resource-header span {
  color: #6b7280;
  font-size: 13px;
}

.resource-list {
  list-style: none;
  padding: 0;
  margin: 14px 0 0;
}

.resource-list li {
  padding: 10px 0;
  border-bottom: 1px dashed #e5e7eb;
}

.resource-list li:last-child {
  border-bottom: none;
}

.resource-list a {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
}

.resource-list p {
  margin: 6px 0 0;
  color: #6b7280;
  font-size: 13px;
}

.resource-notes {
  margin-top: 16px;
  color: #9ca3af;
  font-size: 12px;
}

.entry-card {
  cursor: pointer;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  min-height: 140px;
}

.entry-icon {
  font-size: 28px;
}

.entry-body h3 {
  margin: 0 0 6px;
}

.entry-body p {
  margin: 0 0 8px;
  color: #606266;
}

.module-card {
  margin-bottom: 16px;
}

.module-card.clickable {
  cursor: pointer;
}

.module-header {
  display: flex;
  gap: 12px;
  align-items: center;
}

.module-icon {
  font-size: 24px;
}

.module-meta {
  margin-top: 8px;
  color: #5f6b7a;
  font-size: 13px;
  display: grid;
  gap: 4px;
}

.module-tags {
  margin-top: 10px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.topic-card {
  margin-bottom: 16px;
}

.topic-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.topic-desc {
  margin: 8px 0;
  color: #606266;
}

.topic-counts {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

.pack-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.path-card ol {
  padding-left: 18px;
  margin: 10px 0 12px;
  color: #475569;
}

.path-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.path-icon {
  font-size: 22px;
}

.content-section {
  margin: 24px 0;
}
</style>
