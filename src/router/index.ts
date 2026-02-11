import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('../views/Home.vue'),
    name: 'Home'
  },
  {
    path: '/encyclopedia',
    component: () => import('../views/Encyclopedia.vue'),
    name: 'Encyclopedia'
  },
  {
    path: '/products',
    component: () => import('../views/Products.vue'),
    name: 'Products'
  },
  {
    path: '/product/:id',
    component: () => import('../views/ProductDetail.vue'),
    name: 'ProductDetail'
  },
  {
    path: '/brands',
    component: () => import('../views/Brands.vue'),
    name: 'Brands'
  },
  {
    path: '/brand/:id',
    component: () => import('../views/BrandDetail.vue'),
    name: 'BrandDetail'
  },
  {
    path: '/reviews',
    component: () => import('../views/Reviews.vue'),
    name: 'Reviews'
  },
  {
    path: '/compare',
    component: () => import('../views/Compare.vue'),
    name: 'Compare'
  },
  {
    path: '/diseases',
    component: () => import('../views/Diseases.vue'),
    name: 'Diseases'
  },
  {
    path: '/disease/:id',
    component: () => import('../views/DiseaseDetail.vue'),
    name: 'DiseaseDetail'
  },
  {
    path: '/selector',
    component: () => import('../views/Selector.vue'),
    name: 'Selector'
  },
  {
    path: '/tutorials',
    component: () => import('../views/Tutorials.vue'),
    name: 'Tutorials'
  },
  {
    path: '/tutorial/:id',
    component: () => import('../views/TutorialDetail.vue'),
    name: 'TutorialDetail'
  },
  {
    path: '/search',
    component: () => import('../views/Search.vue'),
    name: 'Search'
  },
  {
    path: '/clinical',
    component: () => import('../views/ClinicalLibrary.vue'),
    name: 'ClinicalLibrary'
  },
  {
    path: '/clinical/:id',
    component: () => import('@/views/KnowledgeDetail.vue'),
    name: 'ClinicalDetail'
  },
  {
    path: '/clinical-guides',
    component: () => import('../views/ClinicalGuides.vue'),
    name: 'ClinicalGuides'
  },
  {
    path: '/clinical-guide/:id',
    component: () => import('../views/ClinicalGuideDetail.vue'),
    name: 'ClinicalGuideDetail'
  },
  {
    path: '/user-knowledge',
    component: () => import('../views/UserLibrary.vue'),
    name: 'UserLibrary'
  },
  {
    path: '/user-knowledge/:id',
    component: () => import('@/views/KnowledgeDetail.vue'),
    name: 'UserKnowledgeDetail'
  },
  {
    path: '/topic/:id',
    component: () => import('../views/TopicDetail.vue'),
    name: 'TopicDetail'
  },
  {
    path: '/platform/:id',
    component: () => import('../views/PlatformFamily.vue'),
    name: 'PlatformFamily'
  },
  {
    path: '/doctor',
    component: () => import('../views/DoctorCenter.vue'),
    name: 'DoctorCenter'
  },
  {
    path: '/patient',
    component: () => import('../views/PatientCenter.vue'),
    name: 'PatientCenter'
  },
  {
    path: '/agent',
    component: () => import('../views/AgentCenter.vue'),
    name: 'AgentCenter'
  },
  {
    path: '/manufacturer',
    component: () => import('../views/ManufacturerCenter.vue'),
    name: 'ManufacturerCenter'
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('../views/NotFound.vue'),
    name: 'NotFound'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

const siteName = '呼吸机之家'
const defaultDescription = '呼吸机选机、临床指南、疾病路径、产品参数与使用教程的专业知识平台。'
const routeSeo: Record<string, { title: string; description: string }> = {
  Home: {
    title: '首页',
    description: '呼吸机之家首页，快速进入指南、选机、产品库和人群入口。',
  },
  Encyclopedia: {
    title: '指南总览',
    description: '整合临床知识、疾病路径、教程与产品信息的一站式入口。',
  },
  ClinicalLibrary: {
    title: '临床知识库',
    description: '聚焦循证要点、评估路径与临床应用建议。',
  },
  ClinicalGuides: {
    title: '临床专题',
    description: '按专题查看分级建议、安全红线与决策要点。',
  },
  Diseases: {
    title: '疾病指南',
    description: '围绕呼吸相关疾病提供诊断、治疗与随访参考路径。',
  },
  Tutorials: {
    title: '公开教程',
    description: '设备使用、护理操作与常见问题处理教程。',
  },
  UserLibrary: {
    title: '用户知识库',
    description: '面罩、漏气、湿化、舒适度等高频问题的处理建议。',
  },
  Products: {
    title: '产品库',
    description: '按品牌、模式、参数和完整度筛选与对比呼吸设备。',
  },
  Brands: {
    title: '品牌库',
    description: '查看主流品牌背景、产品线与定位差异。',
  },
  Compare: {
    title: '机型对比',
    description: '多机型参数对照，辅助做出更清晰的选型决策。',
  },
  Selector: {
    title: '智能选机',
    description: '结合场景与需求，快速形成选机方向与评估重点。',
  },
  Search: {
    title: '站内搜索',
    description: '搜索产品、品牌、指南与教程内容。',
  },
  DoctorCenter: {
    title: '医生中心',
    description: '服务医生与治疗师的临床路径、证据与工具入口。',
  },
  PatientCenter: {
    title: '患者中心',
    description: '面向患者和家属的使用指导、随访与常见问题支持。',
  },
  AgentCenter: {
    title: '代理商中心',
    description: '面向渠道与销售的产品策略、趋势与沟通参考。',
  },
  ManufacturerCenter: {
    title: '厂家中心',
    description: '面向厂家团队的竞品观察、用户反馈与渠道洞察。',
  },
}

const ensureMeta = (name: string) => {
  let tag = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }
  return tag
}

router.afterEach((to) => {
  const routeName = typeof to.name === 'string' ? to.name : ''
  let title = `${siteName} - 专业呼吸机选购与使用指南`
  let description = defaultDescription

  if (routeSeo[routeName]) {
    title = `${routeSeo[routeName].title} | ${siteName}`
    description = routeSeo[routeName].description
  } else if (routeName === 'ProductDetail') {
    title = `产品详情 | ${siteName}`
    description = '查看单机型参数、模式、适用场景与对比入口。'
  } else if (routeName === 'DiseaseDetail') {
    title = `疾病详情 | ${siteName}`
    description = '查看疾病概览、治疗路径与随访要点。'
  } else if (routeName === 'TutorialDetail') {
    title = `教程详情 | ${siteName}`
    description = '查看设备使用与护理操作教程。'
  } else if (routeName === 'ClinicalGuideDetail' || routeName === 'ClinicalDetail' || routeName === 'UserKnowledgeDetail') {
    title = `内容详情 | ${siteName}`
    description = '查看具体条目内容、关键要点与相关入口。'
  }

  document.title = title
  ensureMeta('description').setAttribute('content', description)
})

export default router
