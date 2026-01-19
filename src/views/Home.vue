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

    <div class="home-footnote">
      内容仅供学习参考，实际诊疗与参数调整需由专业医护评估。
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { resourceCategories } from '@/data/resource-links'

const router = useRouter()

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
}
</style>
