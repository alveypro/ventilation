<template>
  <div class="home-page">
    <section class="guide-hero">
      <div class="hero-content">
        <p class="hero-label">医学指南 · 专业手册</p>
        <h1>呼吸机之家 · 呼吸治疗知识总览</h1>
        <p class="hero-subtitle">
          从诊断到处方，从设备选择到随访管理，覆盖呼吸治疗全流程。
        </p>
        <div class="hero-actions">
          <el-button type="primary" @click="goTo('/encyclopedia')">进入指南总览</el-button>
          <el-button plain @click="goTo('/clinical-guides')">临床专题课</el-button>
          <el-button plain @click="goTo('/diseases')">疾病指南</el-button>
        </div>
      </div>
      <div class="hero-metrics">
        <div class="metric-card">
          <span>公开指南条目</span>
          <strong>{{ diseaseCount }}</strong>
        </div>
        <div class="metric-card">
          <span>临床专题</span>
          <strong>{{ clinicalGuideCount }}</strong>
        </div>
        <div class="metric-card">
          <span>公开教程</span>
          <strong>{{ tutorialCount }}</strong>
        </div>
      </div>
    </section>

    <section class="guide-nav">
      <h2>快速导航</h2>
      <div class="nav-grid">
        <el-card
          v-for="item in primaryNav"
          :key="item.title"
          shadow="hover"
          class="nav-card"
          @click="goTo(item.path)"
        >
          <div class="nav-icon">{{ item.icon }}</div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </el-card>
      </div>
    </section>

    <!-- 角色入口 -->
    <div class="content-section role-section">
      <h2>🎯 角色入口</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="role in roleEntries" :key="role.id">
          <el-card shadow="hover" class="role-card" @click="goTo(role.path)">
            <div class="role-icon">{{ role.icon }}</div>
            <h3>{{ role.title }}</h3>
            <p>{{ role.description }}</p>
            <el-button type="primary" plain size="small">进入</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 热门产品推荐 -->
    <div class="content-section">
      <h2>🔥 热门产品推荐</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in hotProducts" :key="product.id">
          <ProductCard :product="product" @detail="goToProduct(product.id)" />
        </el-col>
      </el-row>
    </div>

    <div class="content-section ranking-section">
      <h2>📕 红皮书榜单</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="rank-card">
            <h3>年度高评分 TOP</h3>
            <ol>
              <li v-for="item in topRatedProducts" :key="item.id">
                <span>{{ item.name }}</span>
                <el-tag size="small">{{ item.rating }}分</el-tag>
              </li>
            </ol>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="rank-card">
            <h3>热度最高 TOP</h3>
            <ol>
              <li v-for="item in topReviewedProducts" :key="item.id">
                <span>{{ item.name }}</span>
                <el-tag size="small">{{ item.reviewCount }}评价</el-tag>
              </li>
            </ol>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section badge-section">
      <h2>🏅 内容质量徽章体系</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="badge in authorityBadges" :key="badge.title">
          <el-card shadow="hover" class="badge-card">
            <div class="badge-icon">{{ badge.icon }}</div>
            <h4>{{ badge.title }}</h4>
            <p>{{ badge.description }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 疾病指南 -->
    <div class="content-section">
      <h2>📋 常见疾病指南</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="disease in diseases" :key="disease.id">
          <el-card shadow="hover" class="disease-card" @click="goToDisease(disease.id)">
            <div class="disease-header">
              <h4>{{ disease.name }}</h4>
              <el-tag :type="disease.severity === '严重' ? 'danger' : 'warning'">
                {{ disease.severity }}
              </el-tag>
            </div>
            <p class="description">{{ disease.description }}</p>
            <div class="symptoms">
              <el-tag v-for="symptom in disease.symptoms.slice(0, 2)" :key="symptom" size="small">
                {{ symptom }}
              </el-tag>
            </div>
            <el-button type="primary" size="small" class="view-btn">查看详情</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 使用教程 -->
    <div class="content-section">
      <h2>📚 热门教程</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="tutorial in tutorials" :key="tutorial.id">
          <el-card shadow="hover" class="tutorial-card" @click="goToTutorial(tutorial.id)">
            <div class="tutorial-header">
              <h4>{{ tutorial.title }}</h4>
              <el-tag type="info" size="small">{{ tutorial.difficulty }}</el-tag>
            </div>
            <div class="meta">
              <span>⏱️ {{ tutorial.duration }}</span>
              <span>👁️ {{ tutorial.views }}</span>
            </div>
            <el-rate :model-value="tutorial.rating || 0" disabled size="small"></el-rate>
            <el-button type="primary" size="small" class="view-btn">阅读</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 品牌介绍 -->
    <div class="content-section">
      <h2>🌍 全球品牌</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="brand in brands" :key="brand.id">
          <el-card shadow="hover" class="brand-card" @click="goToBrand(brand.id)">
            <div class="brand-logo">{{ brand.name }}</div>
            <h4>{{ brand.name }}</h4>
            <p class="origin">🌐 {{ brand.country }} | 成立于 {{ brand.founded }}</p>
            <p class="description">{{ brand.description }}</p>
            <el-row :gutter="10" class="stats">
              <el-col :span="12">
                <div class="stat-item">
                  <span class="label">产品数</span>
                  <span class="value">{{ brand.productCount }}</span>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="stat-item">
                  <span class="label">市占率</span>
                  <span class="value">{{ brand.marketShare }}</span>
                </div>
              </el-col>
            </el-row>
            <el-button type="primary" size="small" class="view-btn" @click.stop="goToBrand(brand.id)">了解更多</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 医生学习中心 -->
    <div class="content-section doctor-center">
      <h2>👨‍⚕️ 医生学习中心</h2>
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">专业医学知识库</h3>
        <p>AASM 2019 诊疗标准 | GOLD 2024 COPD指南 | 循证医学证据 | 典型病例讨论</p>
        <el-button type="light" size="large" @click="goTo('/doctor')">进入医生中心 →</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card" @click="goTo('/doctor')">
            <div class="module-icon">🔍</div>
            <h4>诊断标准</h4>
            <p>OSA分类、COPD分级、诊断流程</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card" @click="goTo('/doctor')">
            <div class="module-icon">💊</div>
            <h4>治疗指南</h4>
            <p>NIV指示、CPAP/BiPAP选择、机型推荐</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card" @click="goTo('/doctor')">
            <div class="module-icon">📊</div>
            <h4>临床证据</h4>
            <p>RCT数据、疗效分析、心血管保护</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card" @click="goTo('/doctor')">
            <div class="module-icon">👨‍⚕️</div>
            <h4>病例讨论</h4>
            <p>典型案例、诊疗方案、预期效果</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 患者自学中心 -->
    <div class="content-section patient-center">
      <h2>👤 患者自学中心</h2>
      <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="margin-top: 0;">患者教育与支持</h3>
        <p>疾病认知 | 使用指南 | 生活管理 | 故障排查 | 社区支持</p>
        <el-button type="light" size="large" @click="goTo('/patient')">进入患者中心 →</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card green" @click="goTo('/patient')">
            <div class="module-icon">🧠</div>
            <h4>疾病认知</h4>
            <p>OSA机制、风险因素、分级对比</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card green" @click="goTo('/patient')">
            <div class="module-icon">⚙️</div>
            <h4>使用指南</h4>
            <p>开箱检查、面罩选择、4周适应计划</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card green" @click="goTo('/patient')">
            <div class="module-icon">🏃</div>
            <h4>生活管理</h4>
            <p>睡眠环保、饮食、运动、体重管理</p>
          </el-card>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-card class="module-card green" @click="goTo('/patient')">
            <div class="module-icon">💬</div>
            <h4>社区支持</h4>
            <p>患者故事、资源分享、心理支持</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- FAQ -->
    <div class="content-section">
      <h2>❓ 常见问题</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="faq in faqs" :key="faq.id">
          <el-card class="faq-card">
            <h4 class="question">Q: {{ faq.question }}</h4>
            <p class="answer">A: {{ faq.answer }}</p>
            <div class="footer">
              <el-button type="text" size="small">👍 有帮助 ({{ faq.helpful }})</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { faqsData } from '@/data/comprehensive'
import { clinicalGuides } from '@/data/clinical-guides'
import { fetchProducts, fetchDiseases, fetchTutorials, fetchBrands } from '@/services/dataService'
import type { Product, Disease, Tutorial, Brand } from '@/types'

const router = useRouter()

const products = ref<Product[]>([])
const diseases = ref<Disease[]>([])
const tutorials = ref<Tutorial[]>([])
const brands = ref<Brand[]>([])
const diseaseCount = ref(0)
const tutorialCount = ref(0)
const clinicalGuideCount = ref(clinicalGuides.length)
const faqs = ref(faqsData.slice(0, 2))

const hotProducts = computed(() => products.value.filter(p => p.tag).slice(0, 4))
const topRatedProducts = computed(() =>
  products.value.slice().sort((a, b) => b.rating - a.rating).slice(0, 5)
)
const topReviewedProducts = computed(() =>
  products.value.slice().sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 5)
)

const roleEntries = ref([
  {
    id: 'doctor',
    title: '医生',
    description: '诊断标准、治疗指南、随访工具。',
    icon: '👨‍⚕️',
    path: '/doctor',
  },
  {
    id: 'patient',
    title: '患者',
    description: '疾病认知、使用指南、生活管理。',
    icon: '👤',
    path: '/patient',
  },
  {
    id: 'agent',
    title: '代理商',
    description: '品牌信息、产品对比、测评资料。',
    icon: '🧰',
    path: '/agent',
  },
  {
    id: 'manufacturer',
    title: '厂家',
    description: '市场概况、竞品对标、需求洞察。',
    icon: '🏭',
    path: '/manufacturer',
  },
])

const primaryNav = ref([
  {
    title: '指南总览',
    description: '知识地图与模块入口',
    icon: '🧭',
    path: '/encyclopedia',
  },
  {
    title: '临床知识库',
    description: '指南条目与循证要点',
    icon: '🧬',
    path: '/clinical',
  },
  {
    title: '临床专题',
    description: 'A/B/C + 安全红线',
    icon: '📘',
    path: '/clinical-guides',
  },
  {
    title: '疾病指南',
    description: '诊断-治疗-随访路径',
    icon: '🩺',
    path: '/diseases',
  },
  {
    title: '教程与用户知识',
    description: '入门、依从性与维护',
    icon: '📚',
    path: '/tutorials',
  },
  {
    title: '用户知识库',
    description: '面罩/漏气/舒适度',
    icon: '📗',
    path: '/user-knowledge',
  },
  {
    title: '产品库',
    description: '参数、模式与对比',
    icon: '🧪',
    path: '/products',
  },
])
const authorityBadges = ref([
  { icon: '🧠', title: '资料等级', description: '标注信息完整度与覆盖范围。' },
  { icon: '📑', title: '参考来源', description: '明确资料出处与补充状态。' },
  { icon: '🧪', title: '参数校验', description: '核心参数与场景匹配可核对。' },
  { icon: '🔎', title: '可追溯', description: '重要信息可检索、可更新。' },
])

onMounted(async () => {
  const [productsRes, diseasesRes, tutorialsRes, brandsRes] = await Promise.all([
    fetchProducts(),
    fetchDiseases(),
    fetchTutorials(),
    fetchBrands(),
  ])
  products.value = productsRes
  diseaseCount.value = diseasesRes.length
  tutorialCount.value = tutorialsRes.length
  diseases.value = diseasesRes.slice(0, 3)
  tutorials.value = tutorialsRes.slice(0, 3)
  brands.value = brandsRes
})

const goTo = (path: string) => {
  router.push(path)
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const goToDisease = (id: number) => {
  router.push(`/disease/${id}`)
}

const goToTutorial = (id: number) => {
  router.push(`/tutorial/${id}`)
}

const goToBrand = (id: number) => {
  router.push(`/brand/${id}`)
}
</script>

<style scoped>
.home-page {
  padding: 20px 0 40px;
  color: #1f2937;
}

.guide-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background: linear-gradient(120deg, #f8fafc 0%, #eef2ff 100%);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
}

.hero-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.hero-subtitle {
  color: #4b5563;
  margin: 10px 0 0;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.hero-metrics {
  display: grid;
  gap: 12px;
  min-width: 180px;
}

.metric-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #475569;
  box-shadow: 0 10px 18px rgba(15, 23, 42, 0.06);
}

.metric-card strong {
  font-size: 20px;
  color: #1d4ed8;
}

.guide-nav {
  margin-top: 24px;
}

.guide-nav h2 {
  font-size: 22px;
  margin-bottom: 16px;
  border-left: 4px solid #1d4ed8;
  padding-left: 12px;
}

.nav-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.nav-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  border-radius: 14px;
}

.nav-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
}

.nav-card p {
  color: #64748b;
  font-size: 12px;
  margin: 0;
}

.nav-icon {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: #e0e7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #1d4ed8;
  flex-shrink: 0;
}

.ranking-section ol {
  padding-left: 18px;
  margin: 12px 0 0;
}

.rank-card li {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.badge-card {
  text-align: center;
  min-height: 160px;
}

.badge-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.role-section .role-card {
  text-align: center;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.role-icon {
  font-size: 40px;
  margin-bottom: 12px;
}

.entry-col {
  min-height: 200px;
}

.entry-col .el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.entry-col .el-card .entry-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.content-section {
  margin-top: 40px;
  padding: 20px;
}

.content-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #1f2937;
  border-left: 4px solid #1d4ed8;
  padding-left: 12px;
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

.disease-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.disease-header h4 {
  flex: 1;
  margin: 0;
  color: #303133;
}

.disease-card .description {
  color: #606266;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.disease-card .symptoms {
  margin-bottom: 12px;
}

.disease-card .el-tag {
  margin-right: 5px;
  margin-bottom: 5px;
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

.tutorial-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.tutorial-header h4 {
  flex: 1;
  margin: 0;
  color: #303133;
}

.tutorial-card .meta {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.brand-card {
  cursor: pointer;
  text-align: center;
  transition: all 0.3s;
  height: 100%;
}

.brand-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.brand-logo {
  width: 100%;
  height: 80px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  margin-bottom: 12px;
  font-weight: bold;
}

.brand-card h4 {
  margin-bottom: 8px;
  color: #303133;
}

.brand-card .origin {
  font-size: 12px;
  color: #909399;
  margin-bottom: 8px;
}

.brand-card .description {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 12px;
}

.stats {
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-item .label {
  font-size: 12px;
  color: #909399;
}

.stat-item .value {
  font-size: 18px;
  color: #409EFF;
  font-weight: bold;
}

.view-btn {
  width: 100%;
}

.faq-card {
  height: 100%;
}

@media (max-width: 900px) {
  .guide-hero {
    flex-direction: column;
    align-items: flex-start;
  }

  .hero-metrics {
    width: 100%;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  }
}

.doctor-center {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px 20px !important;
}

.patient-center {
  background: #f0fdf4;
  border-radius: 12px;
  padding: 30px 20px !important;
}

.module-card {
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  height: 100%;
  border: 2px solid transparent;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  border-color: #409EFF;
}

.module-card.green:hover {
  border-color: #10b981;
}

.module-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.module-card h4 {
  margin-bottom: 8px;
  color: #303133;
  font-size: 16px;
}

.module-card p {
  margin: 0;
  color: #909399;
  font-size: 12px;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .banner-item h2 {
    font-size: 1.5rem;
  }

  .banner-item p {
    font-size: 1rem;
  }

  .content-section {
    padding: 20px 0;
  }
}
</style>
