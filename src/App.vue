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
          <el-menu-item index="home">首页</el-menu-item>
          <el-menu-item index="encyclopedia">指南总览</el-menu-item>
          <el-menu-item index="clinical">临床知识库</el-menu-item>
          <el-menu-item index="clinical-guides">临床专题</el-menu-item>
          <el-menu-item index="diseases">疾病指南</el-menu-item>
          <el-menu-item index="tutorials">教程</el-menu-item>
          <el-menu-item index="user-knowledge">用户知识</el-menu-item>
          <el-menu-item index="products">产品库</el-menu-item>
          <el-menu-item index="brands">品牌库</el-menu-item>
          <el-menu-item index="compare">对比</el-menu-item>
          <el-menu-item index="selector">选机</el-menu-item>
          <el-menu-item index="doctor">医生中心</el-menu-item>
          <el-menu-item index="patient">患者中心</el-menu-item>
          <el-menu-item index="agent">代理商</el-menu-item>
          <el-menu-item index="manufacturer">厂家</el-menu-item>
        </el-menu>
        <div class="header-search">
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
      </div>
    </el-header>

    <!-- 主内容区域 -->
    <el-main class="main-content">
      <router-view />
    </el-main>

    <!-- 底部 -->
    <el-footer class="footer">
      <p>&copy; 2024 呼吸机之家 | 专业呼吸机选购与使用指南</p>
    </el-footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const activeMenu = ref('home')
const searchQuery = ref('')

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

const goSearch = () => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return
  router.push({ path: '/search', query: { q: keyword } })
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
