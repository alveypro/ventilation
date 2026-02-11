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

    <section class="value-section">
      <h2>我们能帮你做什么</h2>
      <div class="value-grid">
        <el-card v-for="item in valueHighlights" :key="item.title" shadow="hover" class="value-card">
          <div class="value-icon">{{ item.icon }}</div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </el-card>
      </div>
    </section>

    <section class="audience-section">
      <h2>人群入口</h2>
      <p class="section-note">按你的角色快速进入常用模块与工具。</p>
      <div class="audience-grid">
        <el-card
          v-for="item in audienceNav"
          :key="item.title"
          shadow="hover"
          class="audience-card"
          @click="goTo(item.path)"
        >
          <div class="audience-icon">{{ item.icon }}</div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <span class="tag">{{ item.tag }}</span>
          </div>
        </el-card>
      </div>
    </section>

    <section class="flow-section">
      <h2>三步获取有效信息</h2>
      <div class="flow-grid">
        <div class="flow-item" v-for="step in useSteps" :key="step.title">
          <div class="flow-index">{{ step.index }}</div>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="scenario-section">
      <h2>按场景直达解决方案</h2>
      <p class="section-note">围绕常见问题，把“该看什么、先做什么”一次讲清。</p>
      <div class="scenario-grid">
        <el-card v-for="item in scenarioCards" :key="item.title" shadow="hover" class="scenario-card">
          <p class="scenario-label">{{ item.label }}</p>
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <el-button text type="primary" @click="goTo(item.path)">进入对应模块</el-button>
        </el-card>
      </div>
    </section>

    <section class="quality-section">
      <h2>内容更新与使用原则</h2>
      <div class="quality-grid">
        <div class="quality-item" v-for="item in qualityPrinciples" :key="item.title">
          <div class="quality-icon">{{ item.icon }}</div>
          <div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="faq-section">
      <h2>高频问题</h2>
      <el-collapse>
        <el-collapse-item v-for="item in faqList" :key="item.q" :title="item.q" :name="item.q">
          <p>{{ item.a }}</p>
        </el-collapse-item>
      </el-collapse>
    </section>

    <div class="content-section resource-section">
      <h2>🧭 权威资源速览</h2>
      <p class="section-note">精选呼吸医学权威网站与制造商官方资源，便于快速查证信息。</p>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" v-for="item in resourceHighlights" :key="item.name">
          <el-card shadow="hover" class="resource-card">
            <h4>{{ item.name }}</h4>
            <p>{{ item.description }}</p>
            <a
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
              @click.prevent="openExternal(item.url)"
            >
              访问官网 →
            </a>
          </el-card>
        </el-col>
      </el-row>
      <div class="resource-footnote">
        权威资源仅用于参考，诊疗与参数需由专业医护评估。
      </div>
    </div>

    <section class="cta-section">
      <h2>开始使用</h2>
      <div class="cta-grid">
        <el-card v-for="item in quickActions" :key="item.title" shadow="hover" class="cta-card">
          <h3>{{ item.title }}</h3>
          <p>{{ item.description }}</p>
          <el-button type="primary" plain @click="trackQuickAction(item)">{{ item.action }}</el-button>
        </el-card>
      </div>
    </section>

    <div class="home-footnote">
      内容仅供学习参考，实际诊疗与参数调整需由专业医护评估。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { resourceCategories } from '@/data/resource-links'

const router = useRouter()
type HmtCommand = [string, string, string, string?]
type HmtQueue = { push: (entry: HmtCommand) => void }
type QuickAction = {
  title: string
  description: string
  action: string
  path: string
}

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
  {
    title: '患者中心',
    description: '用药与随访支持',
    icon: '🧑‍🦱',
    path: '/patient',
  },
  {
    title: '代理商中心',
    description: '产品策略与市场趋势',
    icon: '🧩',
    path: '/agent',
  },
  {
    title: '厂家中心',
    description: '渠道洞察与竞品观察',
    icon: '🏭',
    path: '/manufacturer',
  },
])

const valueHighlights = ref([
  {
    title: '快速定位权威答案',
    description: '把指南、教程与产品参数串成可检索的知识地图。',
    icon: '🧠',
  },
  {
    title: '从症状到设备的路径',
    description: '把疾病评估、模式选择与随访要点连成闭环。',
    icon: '🧭',
  },
  {
    title: '降低选机与使用门槛',
    description: '提供面罩、漏气、湿化等高频问题的处理顺序。',
    icon: '🛠️',
  },
  {
    title: '面向不同角色的入口',
    description: '医生、患者、代理商、厂家都有各自的内容路径。',
    icon: '🧩',
  },
])

const audienceNav = ref([
  {
    title: '医生/治疗师',
    description: '诊断标准、治疗策略、随访工具与风险红线。',
    icon: '👨‍⚕️',
    path: '/doctor',
    tag: '临床路径',
  },
  {
    title: '患者/家属',
    description: '通俗解释、使用教程与常见问题处理。',
    icon: '👤',
    path: '/patient',
    tag: '使用指导',
  },
  {
    title: '代理商',
    description: '趋势洞察、产品策略与客户沟通要点。',
    icon: '🧠',
    path: '/agent',
    tag: '市场视角',
  },
  {
    title: '厂家',
    description: '竞品对比、用户反馈与渠道策略参考。',
    icon: '🏭',
    path: '/manufacturer',
    tag: '品牌策略',
  },
])

const useSteps = ref([
  {
    index: '01',
    title: '先确定场景与目标',
    description: '是筛查、选机、使用问题还是随访优化？先明确目标。',
  },
  {
    index: '02',
    title: '进入匹配模块',
    description: '从指南、教程、产品库与对比中找到最接近的解决路径。',
  },
  {
    index: '03',
    title: '记录与复盘',
    description: '把指标、症状和使用体验一起记录，形成可持续优化。',
  },
])

const scenarioCards = ref([
  {
    label: '入门',
    title: '首次接触呼吸机，不知从哪开始',
    description: '先看疾病基础与设备类型，再通过智能选机建立初始方案。',
    path: '/selector',
  },
  {
    label: '优化',
    title: '已在使用，但效果不稳定',
    description: '优先排查漏气、湿化和面罩匹配，再看数据趋势与参数复评。',
    path: '/user-knowledge',
  },
  {
    label: '临床',
    title: '需要循证依据与治疗路径',
    description: '从临床知识库和专题进入，快速定位指南分级建议与安全红线。',
    path: '/clinical-guides',
  },
  {
    label: '选型',
    title: '需要在多个机型之间做决策',
    description: '用产品筛选和对比报告并行评估参数、模式和长期成本。',
    path: '/compare',
  },
])

const qualityPrinciples = ref([
  {
    icon: '🗂️',
    title: '结构化整合',
    description: '把指南、教程、产品参数统一到同一套导航和检索体系。',
  },
  {
    icon: '🔎',
    title: '可追溯来源',
    description: '关键内容保留权威来源入口，方便复核与进一步阅读。',
  },
  {
    icon: '⚠️',
    title: '安全优先',
    description: '所有建议都强调适应证、禁忌证和医护评估边界。',
  },
  {
    icon: '🔁',
    title: '持续更新',
    description: '根据临床实践和用户高频问题持续迭代内容与工具。',
  },
])

const faqList = ref([
  {
    q: '我需要先看产品库，还是先看疾病与指南？',
    a: '建议先明确疾病类型和治疗目标，再进入产品库筛选。先看病情，再看设备，通常更高效。',
  },
  {
    q: '智能选机结果可以直接用于购买吗？',
    a: '不能直接替代医疗建议。智能选机用于缩小范围，最终仍需医生结合检查结果确认。',
  },
  {
    q: '参数调整出现不适怎么办？',
    a: '应先暂停自行大幅调参，记录不适表现与使用数据，并尽快联系专业医护复评。',
  },
  {
    q: '站内信息多久更新一次？',
    a: '高频问题和产品资料会持续迭代。对于关键诊疗决策，请以最新官方指南和临床意见为准。',
  },
])

const ctaVariant = ref<'A' | 'B'>('A')

onMounted(() => {
  const key = 'home-cta-variant'
  const saved = localStorage.getItem(key)
  if (saved === 'A' || saved === 'B') {
    ctaVariant.value = saved
  } else {
    const daySeed = new Date().getDate()
    ctaVariant.value = daySeed % 2 === 0 ? 'A' : 'B'
    localStorage.setItem(key, ctaVariant.value)
  }
  trackCtaMetric('impression', ctaVariant.value)
})

const quickActions = computed<QuickAction[]>(() => {
  const fastCta = ctaVariant.value === 'B'
  return [
    {
      title: '3分钟建立选机方向',
      description: '通过症状与场景输入快速获得推荐路径。',
      action: fastCta ? '立即开始选机' : '开始智能选机',
      path: '/selector',
    },
    {
      title: '对比主流机型差异',
      description: '一次查看模式、压力范围和数据能力差异。',
      action: fastCta ? '马上查看机型' : '进入产品库',
      path: '/products',
    },
    {
      title: '查阅临床专题',
      description: '定位临床决策中的重点指标与风险边界。',
      action: fastCta ? '快速进入专题' : '查看临床专题',
      path: '/clinical-guides',
    },
  ]
})

const trackCtaMetric = (event: 'impression' | 'click', label: string) => {
  const counterKey = `home-cta-${event}:${label}`
  const current = Number(localStorage.getItem(counterKey) || '0')
  localStorage.setItem(counterKey, String(current + 1))
  const hmt = (window as Window & { _hmt?: HmtQueue })._hmt
  hmt?.push(['_trackEvent', 'home_cta', event, label])
}

const trackQuickAction = (item: QuickAction) => {
  trackCtaMetric('click', `${ctaVariant.value}:${item.path}`)
  goTo(item.path)
}

const goTo = (path: string) => {
  router.push(path)
}

const openExternal = (url: string) => {
  window.open(url, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.home-page {
  padding: 20px 0 40px;
  color: #1f2937;
}

.guide-hero {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: center;
  padding: 28px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  background:
    radial-gradient(circle at 10% 10%, rgba(59, 130, 246, 0.12), transparent 45%),
    radial-gradient(circle at 90% 20%, rgba(16, 185, 129, 0.12), transparent 40%),
    linear-gradient(120deg, #f8fafc 0%, #eef2ff 100%);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.08);
  overflow: hidden;
}

.guide-hero::after {
  content: '';
  position: absolute;
  right: -80px;
  bottom: -120px;
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.18), transparent 70%);
  pointer-events: none;
}

.hero-label {
  font-size: 12px;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.hero-content {
  max-width: 560px;
}

.hero-content h1 {
  font-size: 32px;
  line-height: 1.2;
  letter-spacing: 0.02em;
}

.hero-subtitle {
  color: #475569;
  max-width: 520px;
  margin: 10px 0 0;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.hero-actions :deep(.el-button--primary) {
  box-shadow: 0 12px 24px rgba(30, 90, 166, 0.2);
}

.value-section,
.audience-section,
.flow-section,
.scenario-section,
.quality-section,
.faq-section,
.cta-section {
  margin-top: 28px;
}

.value-grid,
.audience-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.value-card,
.audience-card {
  cursor: pointer;
  border-radius: 14px;
  transition: all 0.25s ease;
  height: 100%;
}

.value-card:hover,
.audience-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12) !important;
}

.value-icon,
.audience-icon {
  font-size: 24px;
  margin-bottom: 8px;
}

.audience-card .tag {
  display: inline-block;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 12px;
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.flow-item {
  display: flex;
  gap: 14px;
  padding: 16px;
  border-radius: 14px;
  border: 1px dashed #d1d5db;
  background: #f9fafb;
}

.scenario-grid,
.cta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.scenario-card,
.cta-card {
  height: 100%;
}

.scenario-label {
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 8px;
}

.quality-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 14px;
}

.quality-item {
  display: flex;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #dbeafe;
  background: #f8fbff;
}

.quality-icon {
  font-size: 20px;
}

.flow-index {
  font-size: 14px;
  font-weight: 700;
  color: #2563eb;
  background: #e0f2fe;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.hero-actions :deep(.el-button) {
  border-radius: 12px;
  padding: 10px 18px;
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

.faq-section :deep(.el-collapse-item__header) {
  font-weight: 600;
  color: #1f2937;
}

.faq-section :deep(.el-collapse-item__content) {
  color: #4b5563;
  line-height: 1.7;
}

.nav-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.nav-card {
  position: relative;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  cursor: pointer;
  border-radius: 14px;
  border: 1px solid rgba(148, 163, 184, 0.4);
  background: linear-gradient(140deg, #ffffff 0%, #f8fafc 100%);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}

.nav-card h3 {
  margin: 0 0 6px;
  font-size: 16px;
  letter-spacing: 0.01em;
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
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.18), rgba(99, 102, 241, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #1d4ed8;
  flex-shrink: 0;
}

.nav-card p {
  color: #64748b;
  line-height: 1.5;
}

.nav-card::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 14px;
  border: 1px solid transparent;
  transition: border-color 0.25s ease;
  pointer-events: none;
}

.nav-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 28px rgba(15, 23, 42, 0.12);
  border-color: rgba(59, 130, 246, 0.45);
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
}

.home-footnote {
  margin-top: 28px;
  text-align: center;
  color: #94a3b8;
  font-size: 12px;
}

@media (max-width: 768px) {
  .home-page {
    padding: 10px 0 28px;
  }

  .guide-hero h1 {
    font-size: 22px;
  }

  .guide-hero {
    padding: 18px;
    border-radius: 16px;
  }

  .hero-label {
    letter-spacing: 0.18em;
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

  .nav-grid {
    grid-template-columns: 1fr;
  }

  .nav-card {
    padding: 2px;
  }

  .nav-card h3 {
    font-size: 15px;
  }

  .nav-card p {
    font-size: 12px;
  }

  .nav-icon {
    width: 38px;
    height: 38px;
    font-size: 18px;
  }

  .banner-item h2 {
    font-size: 1.5rem;
  }

  .banner-item p {
    font-size: 1rem;
  }

  .content-section {
    padding: 12px 0;
  }

  .guide-nav h2,
  .content-section h2 {
    font-size: 18px;
  }

  .quality-item {
    padding: 12px;
  }
}
</style>
