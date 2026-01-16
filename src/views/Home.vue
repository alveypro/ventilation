<template>
  <div class="home-page">
    <section class="guide-hero">
      <div class="hero-content">
        <p class="hero-label">医学指南 · 专业手册</p>
        <h1>呼吸机之家 · 专业指南与选机入口</h1>
        <p class="hero-subtitle">
          以权威指南为基础，帮助医生与家庭快速找到可信信息与设备参考。
        </p>
        <div class="hero-actions">
          <el-button type="primary" @click="goTo('/encyclopedia')">进入指南总览</el-button>
          <el-button plain @click="goTo('/selector')">智能选机</el-button>
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

    <div class="content-section resource-section">
      <h2>🧭 权威资源速览</h2>
      <p class="section-note">精选呼吸医学权威网站与制造商官方资源，便于快速查证信息。</p>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" v-for="item in resourceHighlights" :key="item.name">
          <el-card shadow="hover" class="resource-card">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
            <a :href="item.url" target="_blank" rel="noopener">访问官网 →</a>
          </el-card>
        </el-col>
      </el-row>
      <div class="resource-footnote">
        权威资源仅用于参考，诊疗与参数需由专业医护评估。
      </div>
    </div>

    <div class="home-footnote">
      内容仅供学习参考，实际诊疗与参数调整需由专业医护评估。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clinicalGuides } from '@/data/clinical-guides'
import { resourceCategories } from '@/data/resource-links'
import { fetchDiseases, fetchTutorials } from '@/services/dataService'

const router = useRouter()

const diseaseCount = ref(0)
const tutorialCount = ref(0)
const clinicalGuideCount = ref(clinicalGuides.length)

const resourceHighlights = computed(() => resourceCategories.flatMap(category => category.items).slice(0, 6))

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
    title: '公开教程',
    description: '设备使用与护理实操',
    icon: '🎓',
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
  {
    title: '品牌库',
    description: '主流品牌与产品线',
    icon: '🏷️',
    path: '/brands',
  },
  {
    title: '对比',
    description: '多机型参数对照报告',
    icon: '⚖️',
    path: '/compare',
  },
  {
    title: '智能选机',
    description: '适配推荐与场景匹配',
    icon: '✨',
    path: '/selector',
  },
  {
    title: '医生中心',
    description: '指南、证据与病例讨论',
    icon: '👨‍⚕️',
    path: '/doctor',
  },
])

onMounted(async () => {
  const [diseasesRes, tutorialsRes] = await Promise.all([
    fetchDiseases(),
    fetchTutorials(),
  ])
  diseaseCount.value = diseasesRes.length
  tutorialCount.value = tutorialsRes.length
})

const goTo = (path: string) => {
  router.push(path)
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

.section-note {
  margin: 8px 0 18px;
  color: #6b7280;
}

.resource-section .resource-card {
  min-height: 140px;
}

.resource-section a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.resource-footnote {
  margin-top: 12px;
  color: #9ca3af;
  font-size: 12px;
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

.content-section {
  margin-top: 32px;
  padding: 20px;
}

.content-section h2 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #1f2937;
  border-left: 4px solid #1d4ed8;
  padding-left: 12px;
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

.home-footnote {
  margin-top: 28px;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 768px) {
  .guide-hero h1 {
    font-size: 22px;
  }

  .hero-subtitle {
    font-size: 13px;
  }

  .hero-actions {
    flex-direction: column;
  }

  .hero-actions .el-button {
    width: 100%;
  }

  .hero-metrics {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

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
