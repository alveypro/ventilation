<template>
  <div class="disease-detail-page">
    <el-skeleton v-if="isLoading" :rows="8" />
    <template v-else>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Diseases' }">疾病指南</el-breadcrumb-item>
      <el-breadcrumb-item>{{ disease.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="disease-header">
      <h1>{{ disease.name }}</h1>
      <div class="disease-tags">
        <el-tag type="info">{{ disease.severity }}</el-tag>
        <el-tag type="success">{{ evidenceLabel }}</el-tag>
        <el-tag>患病人数：{{ disease.prevalence || '—' }}</el-tag>
      </div>
    </div>

    <el-row :gutter="20" class="dual-summary">
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="summary-card">
          <h3>专业解读</h3>
          <p>{{ professionalSummary }}</p>
        </el-card>
      </el-col>
      <el-col :xs="24" :md="12">
        <el-card shadow="hover" class="summary-card plain">
          <h3>通俗解读</h3>
          <p>{{ plainSummary }}</p>
        </el-card>
      </el-col>
    </el-row>

    <el-card shadow="hover" class="evidence-card">
      <h3>内容等级说明</h3>
      <ul>
        <li v-for="item in evidenceGuidelines" :key="item">{{ item }}</li>
      </ul>
    </el-card>

    <el-row :gutter="20">
      <!-- 左侧：内容 -->
      <el-col :xs="24" :md="18">
        <el-tabs>
          <el-tab-pane label="完整长文">
            <div class="content-section">
              <div class="longform-content" v-html="renderMarkdown(longformContent)"></div>
            </div>
          </el-tab-pane>

          <!-- 疾病概览 -->
          <el-tab-pane label="疾病概览">
            <div class="content-section">
              <p class="intro">{{ disease.description }}</p>
            </div>
          </el-tab-pane>

          <!-- 症状 -->
          <el-tab-pane label="症状和表现">
            <div class="content-section">
              <h3>常见症状</h3>
              <ul class="symptom-list">
                <li v-for="(symptom, idx) in disease.symptoms" :key="idx">
                  <span class="inline-icon symptom-icon">⚠️</span>
                  <span>{{ symptom }}</span>
                </li>
              </ul>
            </div>
          </el-tab-pane>

          <!-- 病因 -->
          <el-tab-pane label="发病原因">
            <div class="content-section">
              <h3>主要病因</h3>
              <ul class="cause-list">
                <li v-for="(cause, idx) in disease.causes || []" :key="idx">
                  <span class="inline-icon cause-icon">ℹ️</span>
                  <span>{{ cause }}</span>
                </li>
              </ul>
            </div>
          </el-tab-pane>

          <!-- 诊断 -->
          <el-tab-pane label="诊断方法">
            <div class="content-section">
              <h3>检查诊断</h3>
              <ol class="diagnosis-list">
                <li v-for="(diag, idx) in disease.diagnosis || []" :key="idx">
                  {{ diag }}
                </li>
              </ol>
            </div>
          </el-tab-pane>

          <!-- 治疗 -->
          <el-tab-pane label="治疗方案">
            <div class="content-section">
              <h3>治疗方法</h3>
              <div class="treatment-item" v-for="(treatment, idx) in disease.treatment || []" :key="idx">
                <span class="badge">{{ idx + 1 }}</span>
                <span>{{ treatment }}</span>
              </div>
            </div>
          </el-tab-pane>

          <!-- 推荐产品 -->
          <el-tab-pane label="推荐设备类型">
            <div class="content-section">
              <div class="type-tags">
                <el-tag v-for="item in recommendedDeviceTypes" :key="item" size="small" type="success">
                  {{ item }}
                </el-tag>
              </div>
            </div>
          </el-tab-pane>

          <!-- 并发症 -->
          <el-tab-pane label="并发症">
            <div class="content-section">
              <h3>可能的并发症</h3>
              <el-alert
                v-for="(comp, idx) in disease.complications || []"
                :key="idx"
                :title="comp"
                type="warning"
                :closable="false"
                style="margin-bottom: 10px"
              />
            </div>
          </el-tab-pane>

          <el-tab-pane label="指标图谱">
            <div class="content-section">
              <h3>核心指标图谱</h3>
              <div class="diagram-toggle">
                <el-radio-group v-model="indicatorView" size="small">
                  <el-radio-button label="values">指标示意</el-radio-button>
                  <el-radio-button label="tiers">分层阈值</el-radio-button>
                </el-radio-group>
              </div>
              <div v-if="indicatorView === 'values'" class="diagram-frame" v-html="indicatorDiagram"></div>
              <div v-if="indicatorView === 'tiers'" class="diagram-frame" v-html="severityDiagram"></div>
              <p class="diagram-note">图谱用于理解指标重点，具体阈值需结合临床评估。</p>
            </div>
          </el-tab-pane>

          <el-tab-pane label="参考资料">
            <div class="content-section">
              <h3>参考资料</h3>
              <ul class="source-list" v-if="sourceItems.length">
                <li v-for="source in sourceItems" :key="`${source.title}-${source.org}`">
                  <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">
                    {{ source.title }}
                  </a>
                  <span v-else>{{ source.title }}</span>
                  <span class="source-meta"> · {{ source.org }} · {{ source.date || '—' }}</span>
                </li>
              </ul>
              <p v-else class="source-empty">暂无来源补充</p>
              <el-collapse class="evidence-summary" v-if="authoritySummaries.length">
                <el-collapse-item title="摘要要点" name="summary">
                  <ul>
                    <li v-for="summary in authoritySummaries" :key="summary">{{ summary }}</li>
                  </ul>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-tab-pane>
        </el-tabs>

        <div class="related-section" v-if="recommendedDeviceTypes.length || relatedTutorials.length">
          <h3>相关内容推荐</h3>

          <div v-if="recommendedDeviceTypes.length" class="related-block">
            <h4>推荐设备类型</h4>
            <div class="type-tags">
              <el-tag v-for="item in recommendedDeviceTypes" :key="item" size="small" type="success">
                {{ item }}
              </el-tag>
            </div>
          </div>

          <div v-if="relatedTutorials.length" class="related-block">
            <h4>推荐教程</h4>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" v-for="item in relatedTutorials" :key="item.id">
                <el-card shadow="hover" class="related-card" @click="goToTutorial(item.id)">
                  <h5>{{ item.title }}</h5>
                  <p class="related-desc">{{ item.difficulty }} · {{ item.duration }}</p>
                </el-card>
              </el-col>
            </el-row>
          </div>

        </div>
      </el-col>

      <!-- 右侧：信息卡片 -->
      <el-col :xs="24" :md="6">
        <el-card class="info-card">
          <template #header>
            <div class="card-header">
              <span>疾病概况</span>
            </div>
          </template>

          <div class="info-item">
            <span class="label">患病人数</span>
            <span class="value">{{ disease.prevalence }}</span>
          </div>
          <div class="info-item">
            <span class="label">疾病级别</span>
            <span class="value">{{ disease.severity }}</span>
          </div>
          <div class="info-item">
            <span class="label">诊断方法</span>
            <el-tag v-for="(d, idx) in (disease.diagnosis || []).slice(0, 2)" :key="idx" size="small">
              {{ d }}
            </el-tag>
          </div>
          <div class="info-item">
            <span class="label">治疗周期</span>
            <span class="value">长期治疗</span>
          </div>
        </el-card>

        <el-card class="info-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>预后情况</span>
            </div>
          </template>

          <p>{{ disease.prognosis }}</p>
        </el-card>
      </el-col>
    </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { fetchDiseaseById, fetchTutorials } from '@/services/dataService'
import { getRelatedForDisease } from '@/utils/knowledge'
import type { ContentSource, Disease, Tutorial } from '@/types'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const router = useRouter()
const disease = ref<Disease>({
  id: 0,
  name: '',
  severity: '',
  description: '',
  symptoms: [],
  machines: [],
})
const isLoading = ref(true)
const relatedTutorials = ref<Tutorial[]>([])
const recommendedDeviceTypes = ref<string[]>([])
const longformContent = computed(() => {
  if (disease.value.longform) return disease.value.longform
  return [
    '## 一句话定义',
    disease.value.description || '疾病介绍待完善。',
    '',
    '## 诊断路径',
    ...(disease.value.diagnosis || []).map(item => `- ${item}`),
    '',
    '## 治疗策略',
    ...(disease.value.treatment || []).map(item => `- ${item}`),
    '',
    '## 随访与风险',
    disease.value.prognosis ? `- ${disease.value.prognosis}` : '- 需建立随访节奏。',
  ].join('\\n')
})

const evidenceLabel = computed(() => {
  const sectionCount = [
    disease.value.symptoms?.length,
    disease.value.causes?.length,
    disease.value.diagnosis?.length,
    disease.value.treatment?.length,
    disease.value.longform ? 1 : 0,
  ].filter(Boolean).length
  if (sectionCount >= 4) return '内容等级 A'
  if (sectionCount >= 2) return '内容等级 B'
  return '内容等级 C'
})

const professionalSummary = computed(() => {
  const cls = disease.value.classification || ''
  if (cls === 'sleep_apnea') {
    return 'OSA 以气道阻塞为主，核心指标为 AHI，治疗重点是持续气道正压通气与依从性管理。'
  }
  if (cls === 'copd') {
    return 'COPD 为进行性气流受限，建议评估 FEV1 分级与血气指标，必要时进行无创通气支持。'
  }
  if (cls === 'neuromuscular') {
    return '神经肌肉疾病常伴呼吸肌无力，评估 FVC 与夜间通气需求是关键。'
  }
  return '建议结合临床症状、客观指标与合并症，制定分层治疗方案。'
})

const plainSummary = computed(() => {
  const cls = disease.value.classification || ''
  if (cls === 'sleep_apnea') {
    return '睡觉时呼吸会反复停一下，越严重越容易白天犯困，用呼吸机能明显改善。'
  }
  if (cls === 'copd') {
    return '慢阻肺会让人越走越喘，按时用药加上呼吸机支持，可以更舒服。'
  }
  if (cls === 'neuromuscular') {
    return '肌肉变弱会让呼吸变浅，呼吸机能帮你省力、睡得更踏实。'
  }
  return '通过检查明确严重程度，配合治疗和生活管理，效果会更好。'
})

const sourceItems = computed<ContentSource[]>(() => {
  return disease.value.sources || []
})

const evidenceGuidelines = computed(() => {
  return [
    '内容等级 A：覆盖症状/诊断/治疗/随访等核心要点。',
    '内容等级 B：核心要点较全，部分细节待补充。',
    '内容等级 C：基础概览，需进一步核验。',
  ]
})

const authoritySummaries = computed(() => {
  const cls = disease.value.classification || ''
  if (cls === 'sleep_apnea') {
    return [
      '核心指标为 AHI 与低氧负荷。',
      '依从性管理是改善症状的关键。',
    ]
  }
  if (cls === 'copd') {
    return [
      '肺功能分级影响治疗强度。',
      '急性加重需及时干预与随访。',
    ]
  }
  if (cls === 'neuromuscular') {
    return [
      '夜间通气支持可改善生活质量。',
      '需结合通气监测数据评估。',
    ]
  }
  return ['建议结合个体情况与随访数据调整方案。']
})

const indicatorView = ref<'values' | 'tiers'>('values')

const indicatorDiagram = computed(() => {
  const cls = disease.value.classification || ''
  if (cls === 'sleep_apnea') {
    return buildIndicatorSvg([
      { label: 'AHI', value: 80 },
      { label: 'ODI', value: 65 },
      { label: 'T90', value: 55 },
    ])
  }
  if (cls === 'copd') {
    return buildIndicatorSvg([
      { label: 'FEV1', value: 50 },
      { label: 'PaO2', value: 45 },
      { label: 'PaCO2', value: 70 },
    ])
  }
  if (cls === 'neuromuscular') {
    return buildIndicatorSvg([
      { label: 'FVC', value: 40 },
      { label: '夜间低氧', value: 60 },
      { label: '通气稳定性', value: 55 },
    ])
  }
  return buildIndicatorSvg([
    { label: '症状负担', value: 60 },
    { label: '低氧负荷', value: 55 },
    { label: '依从性', value: 50 },
  ])
})

const severityDiagram = computed(() => {
  const cls = disease.value.classification || ''
  if (cls === 'sleep_apnea') {
    return buildSeveritySvg('AHI 分层', [
      { label: '轻度', value: '5-15' },
      { label: '中度', value: '15-30' },
      { label: '重度', value: '>30' },
    ])
  }
  if (cls === 'copd') {
    return buildSeveritySvg('FEV1 分层', [
      { label: '轻度', value: '≥80%' },
      { label: '中度', value: '50-79%' },
      { label: '重度', value: '<50%' },
    ])
  }
  if (cls === 'neuromuscular') {
    return buildSeveritySvg('FVC 风险', [
      { label: '轻度', value: '≥50%' },
      { label: '中度', value: '30-49%' },
      { label: '重度', value: '<30%' },
    ])
  }
  return buildSeveritySvg('风险分层', [
    { label: '低', value: '症状轻' },
    { label: '中', value: '需评估' },
    { label: '高', value: '需转诊' },
  ])
})

const buildIndicatorSvg = (items: { label: string; value: number }[]) => {
  const barWidth = 90
  const gap = 18
  const baseY = 110
  const maxHeight = 70
  const bars = items.map((item, index) => {
    const x = 40 + index * (barWidth + gap)
    const height = Math.max(20, Math.min(maxHeight, item.value))
    const y = baseY - height
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="#93c5fd" />
      <text x="${x}" y="${baseY + 16}" font-size="11" fill="#1f2937">${item.label}</text>
      <text x="${x}" y="${y - 6}" font-size="11" fill="#1f2937">${item.value}</text>
    `
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      <line x1="30" y1="${baseY}" x2="390" y2="${baseY}" stroke="#94a3b8"/>
      ${bars}
    </svg>
  `.trim()
}

const buildSeveritySvg = (title: string, items: { label: string; value: string }[]) => {
  const width = 360
  const startX = 30
  const cellWidth = width / items.length
  const cells = items.map((item, index) => {
    const x = startX + index * cellWidth
    return `
      <rect x="${x}" y="50" width="${cellWidth}" height="50" fill="#e0e7ff" stroke="#c7d2fe"/>
      <text x="${x + 10}" y="75" font-size="11" fill="#1f2937">${item.label}</text>
      <text x="${x + 10}" y="95" font-size="11" fill="#4b5563">${item.value}</text>
    `
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      <text x="30" y="40" font-size="11" fill="#1f2937">${title}</text>
      ${cells}
    </svg>
  `.trim()
}

const updateDisease = () => {
  const diseaseId = parseInt(route.params.id as string)
  isLoading.value = true
  fetchDiseaseById(diseaseId).then((result) => {
    if (result) {
      disease.value = result
    }
    isLoading.value = false
  })
}

watch(() => route.params.id, updateDisease, { immediate: true })

const loadRelated = async () => {
  const [tutorials] = await Promise.all([
    fetchTutorials(),
  ])
  const related = getRelatedForDisease(disease.value, {
    diseases: [],
    tutorials,
    reviews: [],
    products: [],
    brands: [],
  })
  relatedTutorials.value = related.tutorials
  recommendedDeviceTypes.value = getDeviceTypesForDisease(disease.value.classification || '')
}

watch(() => disease.value.id, () => {
  if (disease.value.id) {
    loadRelated()
  }
})

const goToTutorial = (tutorialId: number) => {
  router.push(`/tutorial/${tutorialId}`)
}

const getDeviceTypesForDisease = (cls: string) => {
  const map: Record<string, string[]> = {
    sleep_apnea: ['CPAP/APAP', '双水平PAP（高压不耐受）', '面罩与配件优化'],
    copd: ['家用NIV（ST）', '氧疗支持', '肺康复配合'],
    neuromuscular: ['家用NIV（目标通气）', '咳嗽辅助', '夜间监测'],
    ohs: ['PAP或NIV', '体重管理', '随访评估'],
    csa: ['专业评估后通气支持', '原发病管理'],
    uars: ['PAP治疗', '气道通畅管理'],
  }
  return map[cls] || ['PAP或NIV评估', '随访管理']
}
</script>

<style scoped>
.disease-detail-page {
  padding: 20px;
}

.disease-header {
  margin-bottom: 30px;
}

.disease-header h1 {
  font-size: 32px;
  margin-bottom: 10px;
  color: #303133;
}

.disease-tags {
  display: flex;
  gap: 10px;
}

.dual-summary {
  margin-bottom: 20px;
}

.summary-card {
  min-height: 120px;
}

.summary-card.plain {
  background: #f8fafc;
}

.evidence-card {
  margin-bottom: 20px;
}

.evidence-card ul {
  padding-left: 18px;
  color: #475569;
}

.content-section {
  padding: 20px;
}

.content-section h3 {
  font-size: 18px;
  margin-bottom: 15px;
  color: #303133;
}

.longform-content :deep(h3) {
  margin-top: 18px;
  font-size: 17px;
  color: #1f2937;
}

.longform-content :deep(p) {
  line-height: 1.7;
  color: #4b5563;
}

.longform-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.longform-content :deep(th),
.longform-content :deep(td) {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
}

.longform-content :deep(th) {
  background: #f8fafc;
  color: #1f2937;
}

.symptom-list,
.cause-list {
  list-style: none;
  padding: 0;
}

.symptom-list li,
.cause-list li {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.symptom-list .symptom-icon {
  color: #e6a23c;
  flex-shrink: 0;
}

.cause-list .cause-icon {
  color: #409eff;
  flex-shrink: 0;
}

.diagnosis-list {
  padding-left: 20px;
}

.diagnosis-list li {
  padding: 10px 0;
  color: #606266;
}

.source-list {
  padding-left: 18px;
  color: #475569;
}

.source-list a {
  color: #1e5aa6;
  text-decoration: none;
}

.source-list a:hover {
  text-decoration: underline;
}

.source-meta {
  color: #6b7280;
  font-size: 12px;
}

.source-empty {
  color: #9ca3af;
  font-size: 13px;
}

.evidence-summary {
  margin-top: 12px;
}

.evidence-summary ul {
  padding-left: 18px;
  color: #475569;
}

.treatment-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  margin-bottom: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  border-left: 4px solid #409eff;
}

.badge {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: #409eff;
  color: white;
  border-radius: 50%;
  font-weight: bold;
  flex-shrink: 0;
}

.machine-card {
  cursor: pointer;
  transition: all 0.3s;
}

.machine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.machine-card h4 {
  margin-bottom: 10px;
  color: #303133;
}

.machine-card p {
  color: #909399;
  margin-bottom: 15px;
}

.info-card {
  position: sticky;
  top: 100px;
}

.card-header {
  font-weight: bold;
}

.info-item {
  padding: 12px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
  color: #303133;
}

.value {
  color: #606266;
}

.info-item .el-tag {
  display: inline-block;
  margin-right: 5px;
  margin-top: 5px;
}

.related-section {
  margin-top: 24px;
}

.related-block {
  margin-top: 16px;
}

.related-card {
  cursor: pointer;
  min-height: 140px;
}

.related-desc {
  color: #606266;
  font-size: 13px;
  margin: 6px 0;
}

.type-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.diagram-frame {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  overflow-x: auto;
}

.diagram-note {
  color: #6b7280;
  font-size: 12px;
  margin-top: 8px;
}

.diagram-toggle {
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .disease-header h1 {
    font-size: 24px;
  }

  .info-card {
    position: relative;
    top: 0;
  }
}
</style>
