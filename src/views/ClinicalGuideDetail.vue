<template>
  <div class="guide-detail">
    <div v-if="!guide" class="guide-empty">
      <h1>未找到该专题</h1>
      <p>请返回专题列表选择其他内容。</p>
      <el-button type="primary" @click="goList">返回专题列表</el-button>
    </div>
    <template v-else>
      <header class="guide-header">
      <p class="guide-label">临床专题课</p>
      <h1>{{ guide?.title }}</h1>
      <p class="guide-subtitle">{{ guide?.subtitle }}</p>
      <div class="guide-actions">
        <el-radio-group v-model="viewMode" size="small">
          <el-radio-button label="pro">专业版</el-radio-button>
          <el-radio-button label="plain">通俗版</el-radio-button>
        </el-radio-group>
        <el-button size="small" plain @click="scrollTo('toc')">目录</el-button>
      </div>
      <div class="guide-disclaimer">
        {{ guide?.disclaimer }}
      </div>
    </header>

    <section id="toc" class="guide-section">
      <h2>内容目录</h2>
      <div class="toc-grid">
        <el-button
          v-for="section in guide?.sections || []"
          :key="section.id"
          size="small"
          plain
          @click="scrollTo(section.id)"
        >
          {{ section.title }}
        </el-button>
      </div>
    </section>

    <section
      v-for="section in guide?.sections || []"
      :key="section.id"
      :id="section.id"
      class="guide-section"
    >
      <h2>{{ section.title }}</h2>
      <p>{{ viewMode === 'pro' ? section.pro : section.plain }}</p>

      <div v-if="section.diagram" class="guide-diagram">
        <h3>{{ section.diagram.title }}</h3>
        <div class="diagram-frame" v-html="section.diagram.svg"></div>
      </div>

      <div v-if="section.table" class="guide-table">
        <h3>{{ section.table.title }}</h3>
        <table>
          <thead>
            <tr>
              <th v-for="header in section.table.headers" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in section.table.rows" :key="index">
              <td v-for="(cell, idx) in row" :key="idx">{{ cell }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="section.flow" class="guide-flow">
        <h3>{{ section.flow.title }}</h3>
        <ol>
          <li v-for="step in section.flow.steps" :key="step">{{ step }}</li>
        </ol>
      </div>
    </section>

      <section class="guide-section">
        <h2>返回与下一步</h2>
        <div class="cta-row">
          <el-button type="primary" @click="goList">返回专题列表</el-button>
          <el-button plain @click="goClinical">进入临床知识库</el-button>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clinicalGuides } from '@/data/clinical-guides'

const route = useRoute()
const router = useRouter()
const viewMode = ref<'pro' | 'plain'>('pro')

const guide = computed(() => clinicalGuides.find(item => item.id === route.params.id))

const scrollTo = (id: string) => {
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const goList = () => {
  router.push('/clinical-guides')
}

const goClinical = () => {
  router.push('/clinical')
}
</script>

<style scoped>
.guide-detail {
  padding: 24px 0 40px;
  color: #1f2937;
}

.guide-empty {
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  padding: 24px;
  background: #f9fafb;
  text-align: center;
}

.guide-header {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 24px;
}

.guide-label {
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: #6b7280;
}

.guide-subtitle {
  color: #4b5563;
  margin-top: 6px;
}

.guide-actions {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.guide-disclaimer {
  margin-top: 12px;
  font-size: 12px;
  color: #6b7280;
  background: #fff7ed;
  border: 1px solid #fed7aa;
  padding: 8px 12px;
  border-radius: 10px;
}

.guide-section {
  margin-top: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 18px 20px;
  background: #fff;
}

.guide-section h2 {
  margin-bottom: 8px;
}

.guide-section p {
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
}

.guide-table {
  margin-top: 12px;
}

.guide-diagram {
  margin-top: 12px;
}

.diagram-frame {
  border: 1px solid #e5e7eb;
  background: #fff;
  border-radius: 10px;
  padding: 10px;
  overflow-x: auto;
}

.guide-table h3,
.guide-flow h3 {
  margin: 10px 0 8px;
  font-size: 14px;
  color: #111827;
}

.guide-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.guide-table th,
.guide-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
  color: #374151;
}

.guide-table th {
  background: #f3f4f6;
}

.guide-flow ol {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
}

.toc-grid {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.cta-row {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}
</style>
