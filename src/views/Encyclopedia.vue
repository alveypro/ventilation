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
      <h2>模块定位</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="module in moduleResponsibilities" :key="module.id">
          <el-card shadow="hover" class="module-card clickable" @click="goTo(module.path)">
            <div class="module-header">
              <span class="module-icon">{{ module.icon }}</span>
              <div>
                <h3>{{ module.title }}</h3>
                <p>{{ module.subtitle }}</p>
              </div>
            </div>
            <div class="module-meta">
              <span>目标人群：{{ module.audience }}</span>
              <span>核心产出：{{ module.output }}</span>
            </div>
            <div class="module-tags">
              <el-tag v-for="tag in module.tags" :key="tag" size="small" type="info">{{ tag }}</el-tag>
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
      <h2>学习路径</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="path in paths" :key="path.id">
          <el-card shadow="hover" class="path-card">
            <div class="path-header">
              <span class="path-icon">{{ path.icon }}</span>
              <h4>{{ path.title }}</h4>
            </div>
            <ol>
              <li v-for="step in path.steps" :key="step">{{ step }}</li>
            </ol>
            <el-button type="primary" plain size="small" @click="goTo(path.cta)">
              立即进入
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>知识包下载</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="pack in knowledgePacks" :key="pack.id">
          <el-card shadow="hover" class="entry-card" @click="downloadPack(pack)">
            <div class="entry-icon">{{ pack.icon }}</div>
            <div class="entry-body">
              <h3>{{ pack.title }}</h3>
              <p>{{ pack.description }}</p>
              <div class="pack-actions">
                <el-tag size="small">一键下载</el-tag>
                <el-button size="small" type="primary" plain @click.stop="openPdf(pack)">
                  PDF模板
                </el-button>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchProducts, fetchBrands, fetchDiseases, fetchTutorials, fetchReviews } from '@/services/dataService'
import { buildKnowledgePack } from '@/utils/packs'
import { openPdfTemplate } from '@/utils/pdfTemplates'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { publicUserLibraryData } from '@/data/public-user-library'
import { topicCatalog } from '@/utils/topics'
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

const moduleResponsibilities = [
  {
    id: 'products',
    title: '产品库',
    subtitle: '型号参数与差异化卖点速览',
    audience: '采购决策者、销售、工程师',
    output: '对比清单、选型建议、规格卡',
    tags: ['型号', '参数', '对比', '适应证'],
    icon: '🧭',
    path: '/products',
  },
  {
    id: 'clinical',
    title: '临床知识库',
    subtitle: '循证要点与临床路径',
    audience: '临床医生、呼吸治疗师',
    output: '诊疗要点、适应证、禁忌证',
    tags: ['循证', '诊断', '治疗', '通气策略'],
    icon: '🩺',
    path: '/clinical',
  },
  {
    id: 'user-knowledge',
    title: '用户知识库',
    subtitle: '患者教育与家庭使用',
    audience: '购机用户、家属、客服',
    output: '使用指南、维护清单、常见问题',
    tags: ['佩戴', '清洁', '依从性', '故障排查'],
    icon: '👤',
    path: '/user-knowledge',
  },
  {
    id: 'tutorials',
    title: '使用教程',
    subtitle: '从入门到进阶的操作路径',
    audience: '初学者、护理人员、培训师',
    output: '操作步骤、参数设置、流程模板',
    tags: ['入门', '调压', '维护', '实操'],
    icon: '📚',
    path: '/tutorials',
  },
  {
    id: 'reviews',
    title: '测评中心',
    subtitle: '专业评测与真实反馈',
    audience: '采购、用户、培训人员',
    output: '优缺点、对比点评、性价比结论',
    tags: ['评测', '体验', '差评点', '优选'],
    icon: '⭐',
    path: '/reviews',
  },
  {
    id: 'centers',
    title: '四大中心',
    subtitle: '医生/患者/代理商/厂家协同',
    audience: '多角色协作团队',
    output: '流程模板、清单、工具包',
    tags: ['角色中心', '工具包', '流程', '模板'],
    icon: '🧰',
    path: '/doctor',
  },
]

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

const paths = ref([
  {
    id: 'patient-path',
    icon: '👤',
    title: '患者路径',
    cta: '/patient',
    steps: ['疾病了解', '智能选机', '设备使用', '生活管理'],
  },
  {
    id: 'doctor-path',
    icon: '👨‍⚕️',
    title: '医生路径',
    cta: '/doctor',
    steps: ['诊断标准', '治疗指南', '临床证据', '随访管理'],
  },
  {
    id: 'agent-path',
    icon: '🧰',
    title: '代理商路径',
    cta: '/agent',
    steps: ['客户画像', '竞品对比', '方案推荐', '报价成交'],
  },
  {
    id: 'manufacturer-path',
    icon: '🏭',
    title: '厂家路径',
    cta: '/manufacturer',
    steps: ['市场洞察', '研发重点', '合规准备', '上市路线'],
  },
])

const goTo = (path: string) => {
  router.push(path)
}

const knowledgePacks = ref([
  {
    id: 'doctor',
    icon: '👨‍⚕️',
    title: '医生知识包',
    description: '诊断标准、治疗指南、随访模板。',
  },
  {
    id: 'patient',
    icon: '👤',
    title: '患者知识包',
    description: '通俗疾病认知、使用步骤、维护清单。',
  },
  {
    id: 'agent',
    icon: '🧰',
    title: '代理商知识包',
    description: '客户画像、对比模板、报价清单。',
  },
  {
    id: 'manufacturer',
    icon: '🏭',
    title: '厂家知识包',
    description: '竞品洞察、研发重点、合规清单。',
  },
])

const downloadPack = (pack: { id: string; title: string }) => {
  const content = buildKnowledgePack(pack.id as any)
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${pack.title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const openPdf = (pack: { id: string }) => {
  openPdfTemplate(pack.id as any)
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
