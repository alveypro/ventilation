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
        <el-button size="small" plain @click="scrollTo('toc')">目录</el-button>
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
      <p class="guide-summary">{{ section.summary }}</p>
      <ul v-if="section.points?.length" class="guide-points">
        <li v-for="point in section.points" :key="point">{{ point }}</li>
      </ul>

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

      <section v-if="guide?.clinicalNotes" class="guide-section">
        <h2>临床补充</h2>
        <div class="note-grid">
          <div class="note-card">
            <h3>参考指标</h3>
            <ul>
              <li v-for="item in guide?.clinicalNotes.metrics" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="note-card">
            <h3>证据等级</h3>
            <ul>
              <li v-for="item in guide?.clinicalNotes.evidence" :key="item">{{ item }}</li>
            </ul>
          </div>
          <div class="note-card">
            <h3>禁忌与警示</h3>
            <ul>
              <li v-for="item in guide?.clinicalNotes.contraindications" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>
      </section>

      <section v-if="relatedGuides.length" class="guide-section">
        <h2>延伸专题</h2>
        <div class="related-grid">
          <el-card
            v-for="item in relatedGuides"
            :key="item.id"
            shadow="hover"
            class="related-card"
            @click="goGuide(item.id)"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.subtitle }}</p>
          </el-card>
        </div>
      </section>

      <section v-if="relatedKnowledge.length" class="guide-section">
        <h2>关键知识条目</h2>
        <div class="related-grid">
          <el-card
            v-for="item in relatedKnowledge"
            :key="item.id"
            shadow="hover"
            class="related-card"
            @click="goKnowledge(item.id)"
          >
            <h3>{{ item.title }}</h3>
            <p>{{ item.summary }}</p>
          </el-card>
        </div>
      </section>

      <section class="guide-section">
        <h2>参考指南与资源</h2>
        <div class="reference-list">
          <a
            v-for="item in referenceLinks"
            :key="item.title"
            class="reference-item"
            :href="item.url"
            target="_blank"
            rel="noreferrer"
          >
            <div class="reference-title">{{ item.title }}</div>
            <div class="reference-url">{{ item.url }}</div>
          </a>
        </div>
        <p class="reference-note">参考内容用于临床学习与流程对照，具体执行需结合本地指南与专科评估。</p>
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
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { clinicalGuides } from '@/data/clinical-guides'
import { clinicalHandbookData } from '@/data/clinical-handbook'

const route = useRoute()
const router = useRouter()

const guide = computed(() => clinicalGuides.find(item => item.id === route.params.id))
const relatedGuides = computed(() => {
  if (!guide.value?.related?.length) {
    return []
  }
  return clinicalGuides.filter(item => guide.value?.related?.includes(item.id))
})

const relatedKnowledge = computed(() => {
  if (!guide.value?.id) return []
  return clinicalHandbookData.filter(item => (item as any).relatedGuides?.includes(guide.value?.id))
})

const referenceLinks = [
  { title: 'AARC 临床实践指南', url: 'https://www.aarc.org' },
  { title: 'ERS 国际指南与科学声明', url: 'https://www.ersnet.org' },
  { title: 'ATS 临床实践指南与患者教育', url: 'https://www.thoracic.org' },
  { title: 'PubMed 证据检索', url: 'https://pubmed.ncbi.nlm.nih.gov' },
]

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

const goGuide = (id: string) => {
  router.push(`/clinical-guide/${id}`)
}

const goKnowledge = (id: number) => {
  router.push(`/clinical/${id}`)
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

.guide-summary {
  color: #4b5563;
  line-height: 1.7;
  margin: 0;
}

.guide-points {
  margin: 12px 0 0;
  padding-left: 18px;
  color: #374151;
  font-size: 14px;
  line-height: 1.7;
}

.note-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.note-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fafb;
}

.note-card h3 {
  margin: 0 0 8px;
  font-size: 14px;
}

.note-card ul {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
  line-height: 1.7;
}

.related-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.related-card {
  cursor: pointer;
  border-radius: 12px;
}

.related-card h3 {
  margin-bottom: 4px;
}

.related-card p {
  color: #4b5563;
  font-size: 13px;
}

.reference-list {
  display: grid;
  gap: 10px;
  margin-top: 10px;
}

.reference-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 10px 14px;
  text-decoration: none;
  background: #f9fafb;
}

.reference-title {
  font-weight: 600;
  color: #111827;
}

.reference-url {
  color: #6b7280;
  font-size: 12px;
  margin-top: 4px;
}

.reference-note {
  margin: 10px 0 0;
  color: #6b7280;
  font-size: 12px;
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
