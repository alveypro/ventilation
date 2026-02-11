<template>
  <div id="app">
    <!-- 顶部导航 -->
    <el-header class="header">
      <div class="header-content">
        <div class="logo">
          <span class="inline-icon logo-icon">🌬️</span>
          <div>
            <div class="logo-title">呼吸机之家</div>
            <div class="logo-subtitle">医学指南 · 专业手册</div>
          </div>
        </div>
        <el-menu
          :default-active="activeMenu"
          mode="horizontal"
          @select="handleMenuSelect"
          class="top-menu"
        >
          <el-menu-item
            v-for="item in menuItems"
            :key="item.key"
            :index="item.key"
          >
            {{ item.label }}
          </el-menu-item>
        </el-menu>
        <div class="header-search desktop-only">
          <el-input
            v-model="searchQuery"
            placeholder="搜索产品/品牌/指南/教程"
            clearable
            size="small"
            @keyup.enter="goSearch"
          >
            <template #append>
              <el-button type="primary" size="small" @click="goSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="header-actions mobile-only">
          <el-button class="menu-trigger" @click="mobileMenuOpen = true">导航</el-button>
        </div>
      </div>
    </el-header>

    <el-drawer
      v-model="mobileMenuOpen"
      direction="ltr"
      size="88%"
      class="mobile-drawer"
    >
      <div class="drawer-header">
        <div class="drawer-title">快速导航</div>
        <div class="drawer-subtitle">浏览内容与搜索</div>
      </div>
      <div class="drawer-search">
        <el-input
          v-model="searchQuery"
          placeholder="搜索产品/品牌/指南/教程"
          clearable
          @keyup.enter="goSearch"
        >
          <template #append>
            <el-button type="primary" @click="goSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
      <el-menu
        :default-active="activeMenu"
        mode="vertical"
        class="drawer-menu"
        @select="handleDrawerSelect"
      >
        <el-menu-item
          v-for="item in menuItems"
          :key="item.key"
          :index="item.key"
        >
          {{ item.label }}
        </el-menu-item>
      </el-menu>
    </el-drawer>

    <!-- 主内容区域 -->
    <el-main class="main-content">
      <router-view />
    </el-main>

    <!-- 底部 -->
    <el-footer class="footer">
      <p>&copy; 2024 呼吸机之家 | 专业呼吸机选购与使用指南</p>
    </el-footer>

    <AiAssistant v-if="showAiAssistant" />
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const AiAssistant = defineAsyncComponent(() => import('@/components/AiAssistant.vue'))

const route = useRoute()
const router = useRouter()
const activeMenu = ref('home')
const searchQuery = ref('')
const mobileMenuOpen = ref(false)
const menuItems = [
  { key: 'home', label: '首页' },
  { key: 'encyclopedia', label: '指南总览' },
  { key: 'clinical', label: '临床知识库' },
  { key: 'clinical-guides', label: '临床专题' },
  { key: 'diseases', label: '疾病指南' },
  { key: 'tutorials', label: '教程' },
  { key: 'user-knowledge', label: '用户知识' },
  { key: 'products', label: '产品库' },
  { key: 'brands', label: '品牌库' },
  { key: 'compare', label: '对比' },
  { key: 'selector', label: '选机' },
  { key: 'doctor', label: '医生中心' },
  { key: 'patient', label: '患者中心' },
  { key: 'agent', label: '代理商' },
  { key: 'manufacturer', label: '厂家' },
]
const showAiAssistant = import.meta.env.VITE_SHOW_AI_ASSISTANT === 'true'

const syncActiveMenu = () => {
  const section = route.path.split('/')[1] || 'home'
  const menuKeys = new Set([
    'home',
    'encyclopedia',
    'clinical',
    'products',
    'brands',
    'reviews',
    'compare',
    'diseases',
    'tutorials',
    'selector',
    'clinical-guides',
    'user-knowledge',
    'agent',
    'manufacturer',
    'doctor',
    'patient',
  ])
  if (section === 'product') {
    activeMenu.value = 'products'
    return
  }
  if (section === 'disease') {
    activeMenu.value = 'diseases'
    return
  }
  if (section === 'tutorial') {
    activeMenu.value = 'tutorials'
    return
  }
  if (section === 'clinical') {
    activeMenu.value = 'clinical'
    return
  }
  if (section === 'clinical-guide' || section === 'clinical-guides') {
    activeMenu.value = 'clinical-guides'
    return
  }
  if (section === 'brand') {
    activeMenu.value = 'brands'
    return
  }
  activeMenu.value = menuKeys.has(section) ? section : 'home'
}

watch(() => route.path, syncActiveMenu, { immediate: true })
watch(
  () => route.query.q,
  (value) => {
    searchQuery.value = typeof value === 'string' ? value : ''
  }
)

const handleMenuSelect = (index: string) => {
  activeMenu.value = index
  router.push(`/${index}`)
}

const handleDrawerSelect = (index: string) => {
  mobileMenuOpen.value = false
  handleMenuSelect(index)
}

const goSearch = () => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return
  router.push({ path: '/search', query: { q: keyword } })
  mobileMenuOpen.value = false
}
</script>

<style scoped>
.header {
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px);
  padding: 0;
  height: auto !important;
  box-shadow: 0 10px 20px rgba(15, 23, 42, 0.08);
  border-bottom: 1px solid rgba(30, 90, 166, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 12px;
}

.logo {
  display: flex;
  align-items: center;
  color: #0f172a;
  font-size: 20px;
  font-weight: 700;
  padding: 10px 18px;
  margin-right: 20px;
  flex-shrink: 0;
  gap: 12px;
  border-radius: 12px;
  background: rgba(230, 240, 251, 0.8);
  border: 1px solid rgba(30, 90, 166, 0.18);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.logo-title {
  line-height: 1.2;
}

.logo-subtitle {
  font-size: 11px;
  color: #1e5aa6;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.logo-icon {
  font-size: 28px;
}

.header-search {
  flex-shrink: 0;
  min-width: 240px;
  max-width: 320px;
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

.header-actions {
  margin-left: auto;
}

.menu-trigger {
  border-radius: 12px;
  background: rgba(30, 90, 166, 0.12);
  border: 1px solid rgba(30, 90, 166, 0.2);
  color: #1e5aa6;
  font-weight: 600;
}

:deep(.mobile-drawer) {
  --el-drawer-padding-primary: 20px;
}

.drawer-header {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.drawer-title {
  font-size: 18px;
  font-weight: 700;
  color: #0f172a;
}

.drawer-subtitle {
  font-size: 12px;
  color: #64748b;
}

.drawer-search {
  margin-bottom: 16px;
}

.drawer-menu {
  border-right: none;
  background: transparent;
}

:deep(.top-menu) {
  flex: 1;
  min-width: 400px;
  background: transparent;
  border-bottom: none;
}

:deep(.top-menu .el-menu-item) {
  color: #1f2937;
  height: 56px;
  border-radius: 10px;
  margin: 0 4px;
}

:deep(.top-menu .el-menu-item.is-active) {
  color: #1e5aa6;
  background: rgba(30, 90, 166, 0.12);
  border-bottom: none;
}

.main-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  min-height: calc(100vh - 200px);
  position: relative;
  z-index: 1;
  animation: pageIn 0.5s ease both;
}

.footer {
  text-align: center;
  padding: 28px 20px;
  background: linear-gradient(180deg, rgba(244, 247, 251, 0) 0%, rgba(30, 90, 166, 0.08) 100%);
  border-top: 1px solid rgba(30, 90, 166, 0.15);
  color: #475569;
  margin-top: 40px;
  position: relative;
  z-index: 1;
}

@media (max-width: 768px) {
  .header-search {
    width: 100%;
    max-width: none;
  }

  .logo {
    padding: 8px 12px;
    font-size: 16px;
    gap: 8px;
  }

  .logo-subtitle {
    display: none;
  }

  :deep(.top-menu) {
    display: none;
  }

  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .header-content {
    justify-content: space-between;
    padding: 6px 10px 12px;
  }
}

@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
