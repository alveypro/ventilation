<template>
  <div class="guides-page">
    <header class="guides-hero">
      <div>
        <p class="hero-label">临床专题课</p>
        <h1>睡眠诊断与呼吸治疗体系</h1>
        <p class="hero-subtitle">面向临床沟通与执行路径的专题化内容，突出关键流程与决策节点。</p>
      </div>
      <el-button type="primary" @click="goClinical">返回临床知识库</el-button>
    </header>

    <section class="guides-grid">
      <el-card
        v-for="guide in clinicalGuides"
        :key="guide.id"
        shadow="hover"
        class="guide-card"
        @click="openGuide(guide.id)"
      >
        <h3>{{ guide.title }}</h3>
        <p>{{ guide.subtitle }}</p>
        <div class="guide-tags">
          <span class="tag">临床路径</span>
          <span class="tag soft">结构化要点</span>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { clinicalGuides } from '@/data/clinical-guides'

const router = useRouter()

const openGuide = (id: string) => {
  router.push(`/clinical-guide/${id}`)
}

const goClinical = () => {
  router.push('/clinical')
}
</script>

<style scoped>
.guides-page {
  padding: 24px 0 40px;
  color: #1f2937;
}

.guides-hero {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  padding: 24px;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #f9fafb;
}

.hero-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 6px;
}

.hero-subtitle {
  color: #4b5563;
}

.guides-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.guide-card {
  cursor: pointer;
  border-radius: 14px;
}

.guide-card h3 {
  margin-bottom: 6px;
}

.guide-card p {
  color: #4b5563;
  font-size: 13px;
}

.guide-tags {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 999px;
  background: #e0e7ff;
  color: #1d4ed8;
}

.tag.soft {
  background: #f3f4f6;
  color: #4b5563;
}

@media (max-width: 960px) {
  .guides-hero {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
