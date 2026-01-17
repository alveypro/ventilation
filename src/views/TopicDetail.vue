<template>
  <div class="topic-detail">
    <div class="page-header">
      <h1>{{ topic?.title || '专题' }}</h1>
      <p>{{ topic?.description || '按主题聚合的产品、教程与临床要点。' }}</p>
    </div>

    <el-card class="topic-stats" shadow="hover">
      <div class="stat-item">
        <span class="stat-value">{{ stats.products }}</span>
        <span class="stat-label">产品</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.tutorials }}</span>
        <span class="stat-label">教程</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.clinical }}</span>
        <span class="stat-label">临床</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ stats.user }}</span>
        <span class="stat-label">用户</span>
      </div>
    </el-card>

    <el-card class="topic-actions" shadow="hover">
      <div class="action-row">
        <div>
          <h3>专题摘要</h3>
          <p>面向不同角色的核心要点与建议。</p>
        </div>
        <el-button type="primary" @click="exportTopic">导出专题 PDF</el-button>
      </div>
      <div class="summary-actions">
        <el-button size="small" plain @click="scrollTo('products')">产品清单</el-button>
        <el-button size="small" plain @click="scrollTo('tutorials')">使用教程</el-button>
        <el-button size="small" plain @click="scrollTo('clinical')">临床要点</el-button>
        <el-button size="small" plain @click="scrollTo('user')">用户指南</el-button>
      </div>
      <div class="summary-grid">
        <div>
          <h4>核心人群</h4>
          <ul>
            <li v-for="item in summary.audiences" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h4>典型场景</h4>
          <ul>
            <li v-for="item in summary.scenarios" :key="item">{{ item }}</li>
          </ul>
        </div>
        <div>
          <h4>关键设备</h4>
          <ul>
            <li v-for="item in summary.devices" :key="item">{{ item }}</li>
          </ul>
        </div>
      </div>
    </el-card>

    <div class="content-section" v-if="matchedProducts.length" id="topic-products">
      <h2>关联产品</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in matchedProducts" :key="item.id">
          <ProductCard :product="item" :show-compare="false" @detail="goToProduct(item.id)" />
        </el-col>
      </el-row>
    </div>

    <div class="content-section" v-if="matchedTutorials.length" id="topic-tutorials">
      <h2>使用教程</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in matchedTutorials" :key="item.id">
          <el-card shadow="hover" class="info-card" @click="goToTutorial(item.id)">
            <h3>{{ item.title }}</h3>
            <p>{{ item.category }} · {{ item.difficulty }}</p>
            <p class="excerpt">{{ excerpt(item.content) }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section" v-if="matchedClinical.length" id="topic-clinical">
      <h2>临床要点</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in matchedClinical" :key="item.id">
          <el-card shadow="hover" class="info-card" @click="goTo(`/clinical/${item.id}`)">
            <h3>{{ item.title }}</h3>
            <p>{{ item.category }} · {{ item.level }} · {{ item.docType }}</p>
            <p class="excerpt">{{ item.summary }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section" v-if="matchedUser.length" id="topic-user">
      <h2>用户指南</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="item in matchedUser" :key="item.id">
          <el-card shadow="hover" class="info-card" @click="goTo(`/user-knowledge/${item.id}`)">
            <h3>{{ item.title }}</h3>
            <p>{{ item.category }} · {{ item.level }} · {{ item.docType }}</p>
            <p class="excerpt">{{ item.summary }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Product, Tutorial } from '@/types'
import { fetchProducts, fetchTutorials } from '@/services/dataService'
import { clinicalHandbookData } from '@/data/clinical-handbook'
import { publicUserLibraryData } from '@/data/public-user-library'
import { topicCatalog } from '@/utils/topics'
import ProductCard from '@/components/ProductCard.vue'
import { openPrint } from '@/utils/print'

const route = useRoute()
const router = useRouter()
const products = ref<Product[]>([])
const tutorials = ref<Tutorial[]>([])
const topic = computed(() => topicCatalog.find(item => item.id === route.params.id))

const topicSummaryMap: Record<string, { audiences: string[]; scenarios: string[]; devices: string[] }> = {
  osa: {
    audiences: ['睡眠门诊医生', '家用呼吸机用户', '随访管理团队'],
    scenarios: ['夜间打鼾与白天嗜睡', '压力滴定与依从性提升', '家庭随访'],
    devices: ['CPAP / APAP', '睡眠监测设备', '面罩与湿化器'],
  },
  copd: {
    audiences: ['呼吸科医生', '慢阻肺患者', '康复护理团队'],
    scenarios: ['稳定期家庭通气', '急性加重期支持', '出院随访'],
    devices: ['BiPAP / NIV', '血氧监测', '高流量氧疗'],
  },
  niv: {
    audiences: ['重症医生', '呼吸治疗师', '护理团队'],
    scenarios: ['急性呼衰支持', '拔管过渡', '家庭无创通气'],
    devices: ['BiPAP / S/T', '面罩', '呼吸监测'],
  },
  hfnc: {
    audiences: ['ICU 医生', '急诊医生', '呼吸治疗师'],
    scenarios: ['低氧血症治疗', '术后呼吸支持', '感染性呼衰'],
    devices: ['HFNC 设备', '湿化系统', '监测设备'],
  },
  'sleep-study': {
    audiences: ['睡眠技师', '睡眠医生', '睡眠中心团队'],
    scenarios: ['PSG 监测', '评分判读', '报告输出'],
    devices: ['PSG 设备', 'G3/Sleepware 软件', '传感器'],
  },
  mask: {
    audiences: ['家用用户', '护理人员', '客服支持'],
    scenarios: ['适配与试戴', '漏气管理', '清洁维护'],
    devices: ['鼻罩/口鼻罩', '头带', '湿化附件'],
  },
  'airway-clearance': {
    audiences: ['康复治疗师', '呼吸科医生', '护理团队'],
    scenarios: ['排痰管理', '气道廓清训练', '术后呼吸支持'],
    devices: ['咳痰机', '震荡排痰', '雾化设备'],
  },
  oxygen: {
    audiences: ['家庭用户', '慢病管理团队', '护理人员'],
    scenarios: ['居家氧疗', '夜间监测', '慢病随访'],
    devices: ['制氧机', '血氧仪', '氧疗附件'],
  },
  'home-care': {
    audiences: ['家庭用户', '随访护士', '客服'],
    scenarios: ['依从性管理', '设备维护', '异常处理'],
    devices: ['家用呼吸机', '面罩', '随访工具'],
  },
}

const summary = computed(() => {
  if (!topic.value) return { audiences: [], scenarios: [], devices: [] }
  return topicSummaryMap[topic.value.id] || { audiences: [], scenarios: [], devices: [] }
})

const matches = (item: any, fields: string[], keywords: string[]) => {
  const content = fields
    .map(field => {
      const value = item[field]
      if (Array.isArray(value)) return value.join(' ')
      return value || ''
    })
    .join(' ')
    .toLowerCase()
  return keywords.some(word => content.includes(word.toLowerCase()))
}

const takeTop = <T>(items: T[], max = 9) => items.slice(0, max)

const matchedProducts = computed(() => {
  if (!topic.value) return []
  return takeTop(products.value.filter(item => matches(item, ['name', 'brand', 'type', 'description', 'highlights'], topic.value!.keywords)))
})

const matchedTutorials = computed(() => {
  if (!topic.value) return []
  return takeTop(tutorials.value.filter(item => matches(item, ['title', 'category', 'content'], topic.value!.keywords)))
})

const matchedClinical = computed(() => {
  if (!topic.value) return []
  return takeTop(clinicalHandbookData.filter(item => matches(item, ['title', 'summary', 'keywords'], topic.value!.keywords)))
})

const matchedUser = computed(() => {
  if (!topic.value) return []
  return takeTop(publicUserLibraryData.filter(item => matches(item, ['title', 'summary', 'keywords'], topic.value!.keywords)))
})

const stats = computed(() => ({
  products: matchedProducts.value.length,
  tutorials: matchedTutorials.value.length,
  clinical: matchedClinical.value.length,
  user: matchedUser.value.length,
}))

const excerpt = (text: string) => {
  if (!text) return ''
  return text.length > 90 ? `${text.slice(0, 90)}...` : text
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const goToTutorial = (id: number) => {
  router.push(`/tutorial/${id}`)
}

const goTo = (path: string) => {
  router.push(path)
}

const exportTopic = () => {
  if (!topic.value) return
  const sections = [
    { title: '核心人群', items: summary.value.audiences },
    { title: '典型场景', items: summary.value.scenarios },
    { title: '关键设备', items: summary.value.devices },
    { title: '推荐产品', items: matchedProducts.value.map(item => item.name) },
    { title: '使用教程', items: matchedTutorials.value.map(item => item.title) },
    { title: '临床要点', items: matchedClinical.value.map(item => item.title) },
    { title: '用户指南', items: matchedUser.value.map(item => item.title) },
  ]
  openPrint(`${topic.value.title} 专题摘要`, sections)
}

const scrollTo = (target: 'products' | 'tutorials' | 'clinical' | 'user') => {
  const map: Record<string, string> = {
    products: '#topic-products',
    tutorials: '#topic-tutorials',
    clinical: '#topic-clinical',
    user: '#topic-user',
  }
  const el = document.querySelector(map[target])
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

onMounted(async () => {
  const [productsRes, tutorialsRes] = await Promise.all([
    fetchProducts(),
    fetchTutorials(),
  ])
  products.value = productsRes
  tutorials.value = tutorialsRes
})
</script>

<style scoped>
.topic-detail {
  padding: 20px 0 30px;
}

.topic-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.topic-actions {
  margin-bottom: 20px;
}

.action-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.action-row h3 {
  margin: 0 0 4px;
}

.action-row p {
  margin: 0;
  color: #606266;
  font-size: 13px;
}

.summary-actions {
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.summary-grid {
  margin-top: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(180px, 1fr));
  gap: 16px;
}

.summary-grid h4 {
  margin: 0 0 6px;
}

.summary-grid ul {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  font-size: 13px;
  line-height: 1.6;
}

.stat-item {
  background: #f8fafc;
  border-radius: 10px;
  padding: 12px;
  text-align: center;
}

.stat-value {
  font-size: 20px;
  font-weight: 700;
  display: block;
}

.stat-label {
  color: #64748b;
  font-size: 12px;
}

.content-section {
  margin-top: 24px;
}

.info-card {
  cursor: pointer;
  min-height: 180px;
}

.info-card h3 {
  margin: 0 0 6px;
}

.info-card p {
  margin: 0 0 6px;
  color: #606266;
  font-size: 13px;
}

.excerpt {
  color: #475569;
}

@media (max-width: 768px) {
  .topic-stats {
    grid-template-columns: repeat(2, minmax(120px, 1fr));
  }

  .summary-grid {
    grid-template-columns: 1fr;
  }

  .content-section {
    margin-top: 18px;
  }

  .info-card {
    min-height: 0;
  }
}
</style>
