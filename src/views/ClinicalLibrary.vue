<template>
  <div class="clinical-guide">
    <header class="guide-hero">
      <div>
        <p class="guide-label">临床指南 · 专业手册</p>
        <h1>临床知识库</h1>
      </div>
    </header>

    <div class="guide-layout">
      <aside class="guide-nav">
        <div class="nav-block">
          <div class="nav-title">导航</div>
          <a href="#overview">总览</a>
          <a href="#disease-track">疾病线</a>
          <a v-for="item in diseaseSections" :key="item.id" :href="`#disease-${item.id}`">
            {{ item.name }}
          </a>
          <a href="#tech-track">技术线</a>
          <a v-for="item in techSections" :key="item.id" :href="`#tech-${item.id}`">
            {{ item.title }}
          </a>
          <a href="#library">条目库</a>
        </div>
      </aside>

      <main class="guide-content">
        <section id="disease-track" class="guide-section">
          <div class="section-header">
            <h2>疾病线</h2>
          </div>

          <div v-for="disease in diseaseSections" :key="disease.id" :id="`disease-${disease.id}`" class="disease-block">
            <div class="disease-header">
              <div>
                <h3>{{ disease.name }}</h3>
              </div>
              <div class="disease-tags">
                <span class="tag">{{ disease.severity }}</span>
                <span class="tag">{{ disease.prevalence }}</span>
              </div>
            </div>

            <div class="disease-grid">
              <div class="disease-card">
                <h4>临床表现</h4>
                <ul>
                  <li v-for="item in disease.symptoms" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="disease-card">
                <h4>诊断要点</h4>
                <ul>
                  <li v-for="item in disease.diagnosis" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="disease-card">
                <h4>治疗策略</h4>
                <ul>
                  <li v-for="item in disease.treatment" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="disease-card">
                <h4>随访与结局</h4>
                <ul>
                  <li>{{ disease.prognosis }}</li>
                  <li v-for="item in disease.complications" :key="item">并发风险：{{ item }}</li>
                </ul>
              </div>
            </div>

            <div class="related-block" v-if="disease.items.length">
              <h4>相关临床条目</h4>
              <div class="guide-list">
                <article v-for="item in disease.items.slice(0, 6)" :key="item.id" class="guide-item clickable" @click="goToItem(item.id)">
                  <div class="guide-item-header">
                    <h5>{{ item.title }}</h5>
                    <span class="tag soft">{{ item.docType || '资料' }}</span>
                  </div>
                  <ul v-if="item.keyPoints?.length" class="guide-item-points">
                    <li v-for="point in item.keyPoints.slice(0, 3)" :key="point">{{ point }}</li>
                  </ul>
                  <div class="guide-item-meta">
                    <span v-if="item.level">{{ item.level }}</span>
                    <span v-if="item.category">{{ item.category }}</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="tech-track" class="guide-section">
          <div class="section-header">
            <h2>技术线</h2>
          </div>

          <div v-for="track in techSections" :key="track.id" :id="`tech-${track.id}`" class="tech-block">
            <div class="tech-header">
              <div>
                <h3>{{ track.title }}</h3>
              </div>
              <div class="tech-tags">
                <span class="tag">{{ track.scope }}</span>
                <span class="tag soft">{{ track.focus }}</span>
              </div>
            </div>

            <div class="tech-grid">
              <div class="tech-card">
                <h4>适用场景</h4>
                <ul>
                  <li v-for="item in track.indications" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="tech-card">
                <h4>核心参数</h4>
                <ul>
                  <li v-for="item in track.parameters" :key="item">{{ item }}</li>
                </ul>
              </div>
              <div class="tech-card">
                <h4>风险提示</h4>
                <ul>
                  <li v-for="item in track.risks" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>

            <div class="related-block" v-if="track.items.length">
              <h4>相关临床条目</h4>
              <div class="guide-list">
                <article v-for="item in track.items.slice(0, 6)" :key="item.id" class="guide-item clickable" @click="goToItem(item.id)">
                  <div class="guide-item-header">
                    <h5>{{ item.title }}</h5>
                    <span class="tag soft">{{ item.docType || '资料' }}</span>
                  </div>
                  <ul v-if="item.keyPoints?.length" class="guide-item-points">
                    <li v-for="point in item.keyPoints.slice(0, 3)" :key="point">{{ point }}</li>
                  </ul>
                  <div class="guide-item-meta">
                    <span v-if="item.level">{{ item.level }}</span>
                    <span v-if="item.category">{{ item.category }}</span>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="library" class="guide-section">
          <div class="section-header">
            <h2>条目库</h2>
          </div>

          <el-card class="filters">
            <div class="filter-row">
              <el-input v-model="query" placeholder="搜索关键词" clearable />
              <el-select v-model="category" placeholder="分类" clearable>
                <el-option v-for="item in categoryOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="level" placeholder="等级" clearable>
                <el-option v-for="item in levelOptions" :key="item" :label="item" :value="item" />
              </el-select>
              <el-select v-model="docType" placeholder="类型" clearable>
                <el-option v-for="item in docTypeOptions" :key="item" :label="item" :value="item" />
              </el-select>
            </div>
          </el-card>

          <div class="guide-list">
            <article v-for="item in filteredItems" :key="item.id" class="guide-item clickable" @click="goToItem(item.id)">
              <div class="guide-item-header">
                <h5>{{ item.title }}</h5>
                <span class="tag soft">{{ item.docType || '资料' }}</span>
              </div>
              <ul v-if="item.keyPoints?.length" class="guide-item-points">
                <li v-for="point in item.keyPoints.slice(0, 3)" :key="point">{{ point }}</li>
              </ul>
              <div class="guide-item-meta">
                <span v-if="item.level">{{ item.level }}</span>
                <span v-if="item.category">{{ item.category }}</span>
              </div>
            </article>
          </div>
        </section>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { publicDiseasesData } from '@/data/public-diseases'
import { clinicalHandbookData } from '@/data/clinical-handbook'

const query = ref('')
const category = ref('')
const level = ref('')
const docType = ref('')
const router = useRouter()

const categoryOptions = Array.from(
  new Set(clinicalHandbookData.map(item => item.category).filter(Boolean))
) as string[]
const levelOptions = Array.from(
  new Set(clinicalHandbookData.map(item => item.level).filter(Boolean))
) as string[]
const docTypeOptions = Array.from(
  new Set(clinicalHandbookData.map(item => item.docType).filter(Boolean))
) as string[]

const normalize = (value: string) => value.toLowerCase()

const hasKeyword = (content: string, keyword: string) =>
  normalize(content).includes(normalize(keyword))

const matchesKeywords = (item: any, keywords: string[]) => {
  const content = `${item.title || ''} ${item.summary || ''} ${(item.keywords || []).join(' ')}`
  return keywords.some(keyword => hasKeyword(content, keyword))
}

const diseaseKeywordMap: Record<string, string[]> = {
  sleep_apnea: ['OSA', '睡眠呼吸暂停', '睡眠呼吸暂停综合征', 'sleep apnea', 'SDB'],
  copd: ['COPD', '慢阻肺', '慢性阻塞性肺疾病', 'AECOPD'],
  neuromuscular: ['神经肌肉', 'ALS', '肌营养不良', 'SMA', '重症肌无力'],
}

const diseaseSections = computed(() =>
  publicDiseasesData.map(disease => {
    const keywords = diseaseKeywordMap[disease.classification] || [disease.name]
    const items = clinicalHandbookData.filter(item => matchesKeywords(item, keywords))
    return { ...disease, items }
  })
)

const techTracks = [
  {
    id: 'pap',
    title: '睡眠PAP治疗',
    description: '以OSA为核心的睡眠相关呼吸障碍治疗路径。',
    scope: '睡眠相关',
    focus: 'CPAP / APAP / BiPAP',
    indications: ['OSA与SDB的长期治疗', '呼吸暂停、低通气明显的患者', '夜间低氧与白天嗜睡人群'],
    parameters: ['EPAP/CPAP范围', '漏气控制', '舒适度与加湿'],
    risks: ['依从性下降', '不适导致中断治疗', '面罩漏气'],
    keywords: ['OSA', '睡眠', 'CPAP', 'APAP', 'BiPAP', 'SDB', '面罩'],
  },
  {
    id: 'niv',
    title: 'NIV无创通气',
    description: '面向呼吸衰竭与慢病管理的通气支持策略。',
    scope: '急性/慢病',
    focus: 'S / ST / AVAPS / iVAPS',
    indications: ['AECOPD与稳定期COPD', '神经肌肉疾病', '术后或急性呼衰支持'],
    parameters: ['IPAP/EPAP设定', '备份频率', '潮气量或目标通气'],
    risks: ['CO2潴留', '血氧改善不足', '参数不匹配导致不耐受'],
    keywords: ['无创通气', 'NIV', 'S/T', 'ST', 'iVAPS', 'AVAPS', '呼吸衰竭', 'COPD'],
  },
  {
    id: 'hfnc',
    title: '高流量氧疗 (HFNC)',
    description: '以湿化高流量改善氧合与呼吸功。',
    scope: '氧疗',
    focus: '湿化与流量',
    indications: ['轻中度I型呼吸衰竭', '气道分泌物多', '术后呼吸支持'],
    parameters: ['流量与FiO2', '温度与湿化', '鼻导管选择'],
    risks: ['延误升级治疗', '流量设置不当', '面部不适'],
    keywords: ['HFNC', '高流量', '氧疗'],
  },
  {
    id: 'psg',
    title: '睡眠监测与PSG',
    description: '睡眠分期、呼吸事件与多导监测技术。',
    scope: '诊断评估',
    focus: 'AASM / PSG',
    indications: ['睡眠呼吸障碍评估', '复杂睡眠问题', '治疗前后复评'],
    parameters: ['传感器安装', '事件判读', '分期与评分'],
    risks: ['数据采集伪迹', '判读标准不一致', '传感器脱落'],
    keywords: ['PSG', '睡眠监测', 'AASM', '分期', '判读'],
  },
  {
    id: 'airway',
    title: '气道与面罩管理',
    description: '覆盖面罩适配、气道管理与舒适度提升。',
    scope: '设备适配',
    focus: '面罩/漏气',
    indications: ['依从性不佳', '漏气严重', '皮肤不适'],
    parameters: ['面罩尺寸与材质', '头带张力', '漏气与压疮评估'],
    risks: ['皮肤压伤', '持续漏气', '睡眠碎片化'],
    keywords: ['面罩', '漏气', '气道', '舒适', '压疮'],
  },
  {
    id: 'cleaning',
    title: '消毒与维护',
    description: '围绕设备清洁、消毒与长期维护流程。',
    scope: '安全维护',
    focus: '消毒/清洁',
    indications: ['居家长期使用', '医院复用环境', '感染控制需求'],
    parameters: ['清洁频次', '消毒剂选择', '部件更换周期'],
    risks: ['交叉感染', '材料损伤', '过滤器堵塞'],
    keywords: ['消毒', '清洁', '维护', '感染', '滤芯'],
  },
]

const techSections = computed(() =>
  techTracks.map(track => ({
    ...track,
    items: clinicalHandbookData.filter(item => matchesKeywords(item, track.keywords)),
  }))
)

const filteredItems = computed(() => {
  const keyword = query.value.trim().toLowerCase()
  return clinicalHandbookData.filter(item => {
    const matchesKeyword = !keyword
      || `${item.title} ${item.summary} ${(item.keywords || []).join(' ')}`.toLowerCase().includes(keyword)
    const matchesCategory = !category.value || item.category === category.value
    const matchesLevel = !level.value || item.level === level.value
    const matchesDocType = !docType.value || item.docType === docType.value
    return matchesKeyword && matchesCategory && matchesLevel && matchesDocType
  })
})

const goToItem = (id: number) => {
  router.push(`/clinical/${id}`)
}
</script>

<style scoped>
.clinical-guide {
  padding: 24px 0 40px;
  color: #1f2937;
}

.guide-hero {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  align-items: flex-start;
  padding: 20px 24px;
  background: linear-gradient(120deg, #f5f7ff 0%, #f9fbff 100%);
  border-radius: 16px;
  border: 1px solid #e5e7eb;
}

.guide-label {
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #4b5563;
  margin-bottom: 8px;
}

.guide-layout {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 24px;
  margin-top: 24px;
}

.guide-nav {
  position: sticky;
  top: 100px;
  height: fit-content;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  padding: 16px;
}

.nav-title {
  font-weight: 600;
  margin-bottom: 12px;
  color: #111827;
}

.nav-block a {
  display: block;
  color: #4b5563;
  text-decoration: none;
  font-size: 13px;
  margin-bottom: 8px;
  line-height: 1.4;
}

.nav-block a:hover {
  color: #1d4ed8;
}

.guide-content {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.guide-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px 24px;
}

.section-header h2 {
  margin-bottom: 4px;
}

.disease-block,
.tech-block {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px dashed #e5e7eb;
}

.disease-header,
.tech-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.disease-grid,
.tech-grid {
  display: grid;
  gap: 12px;
  margin-top: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.disease-card,
.tech-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f8fafc;
}

.disease-card h4,
.tech-card h4 {
  margin-bottom: 8px;
  font-size: 14px;
}

.disease-card ul,
.tech-card ul {
  margin: 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
}

.related-block {
  margin-top: 16px;
}

.guide-list {
  display: grid;
  gap: 12px;
  margin-top: 10px;
}

.guide-item {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 16px;
  background: #fff;
}

.guide-item.clickable {
  cursor: pointer;
}

.guide-item-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.guide-item h5 {
  margin: 0;
  font-size: 15px;
  color: #111827;
}

.guide-item ul {
  margin: 6px 0 0;
  padding-left: 18px;
  color: #374151;
  font-size: 13px;
}

.guide-item-points {
  margin-top: 6px;
}

.guide-item-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  color: #6b7280;
  font-size: 12px;
}

.filters {
  margin-top: 16px;
}

.filter-row {
  display: grid;
  grid-template-columns: minmax(240px, 1fr) repeat(3, minmax(140px, 200px));
  gap: 12px;
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
  .guide-layout {
    grid-template-columns: 1fr;
  }

  .guide-nav {
    position: static;
  }

  .guide-hero {
    flex-direction: column;
  }
}

@media (max-width: 768px) {
  .guide-hero {
    padding: 20px;
  }

  .guide-section {
    padding: 16px;
  }

  .guide-nav {
    padding: 12px;
  }

  .nav-block a {
    font-size: 12px;
  }

  .guide-item-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }
}
</style>
