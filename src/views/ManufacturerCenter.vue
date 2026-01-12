<template>
  <div class="manufacturer-center-page">
    <div class="page-header">
      <h1>厂家中心</h1>
      <p>聚焦市场竞争、临床需求与产品策略洞察。</p>
    </div>

    <el-card class="highlight-card" shadow="hover">
      <div class="highlight-body">
        <div>
          <h2>产品策略仪表盘</h2>
          <p>洞察竞争格局，规划产品路线图与研发重点。</p>
        </div>
        <el-button type="primary" @click="goTo('/products')">查看产品库</el-button>
      </div>
    </el-card>

    <div class="content-section">
      <h2>市场与竞品洞察</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="insight in insights" :key="insight.title">
          <el-card shadow="hover" class="info-card">
            <h3>{{ insight.title }}</h3>
            <p>{{ insight.description }}</p>
            <ul>
              <li v-for="point in insight.points" :key="point">{{ point }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>研发关注点</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="6" v-for="focus in focuses" :key="focus.id">
          <el-card shadow="hover" class="focus-card">
            <div class="focus-icon">{{ focus.icon }}</div>
            <h4>{{ focus.title }}</h4>
            <p>{{ focus.description }}</p>
            <el-tag size="small">{{ focus.metric }}</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>合规与上市准备</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="item in compliance" :key="item.title">
          <el-card shadow="hover" class="tool-card">
            <div class="tool-header">
              <span class="tool-icon">{{ item.icon }}</span>
              <h4>{{ item.title }}</h4>
            </div>
            <p>{{ item.description }}</p>
            <el-button type="primary" plain size="small" @click="downloadTool(item)">
              下载清单
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="pack-card">
        <div class="pack-body">
          <div>
            <h4>厂家知识包</h4>
            <p>竞品矩阵、研发重点、合规清单与上市路线合集。</p>
          </div>
          <div class="pack-actions">
            <el-button type="primary" @click="downloadPack">一键下载</el-button>
            <el-button @click="openPdf">PDF模板</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="content-section">
      <h2>✅ 研发执行清单</h2>
      <el-card shadow="hover" class="checklist-card">
        <el-row :gutter="16" v-for="item in manufacturerChecklist" :key="item.id" class="checklist-row">
          <el-col :xs="24" :md="6">
            <strong>{{ item.title }}</strong>
          </el-col>
          <el-col :xs="24" :md="18">
            <el-input v-model="item.note" placeholder="补充执行要点" />
          </el-col>
        </el-row>
        <div class="checklist-actions">
          <el-button type="primary" @click="exportChecklist">导出PDF</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { buildKnowledgePack } from '@/utils/packs'
import { openPdfTemplate } from '@/utils/pdfTemplates'
import { openPrint } from '@/utils/print'

const router = useRouter()

const insights = ref([
  {
    title: '价格带分布',
    description: '中端价位需求增长最快。',
    points: ['入门竞争激烈，利润有限', '中端需要差异化功能', '高端强调临床证据'],
  },
  {
    title: '功能优先级',
    description: '舒适度与数据能力是复购关键。',
    points: ['噪音控制提升口碑', '加湿体验减少不适', '云端随访增强依从性'],
  },
  {
    title: '临床需求',
    description: '医患双方关注疗效与依从性。',
    points: ['治疗效果可视化', '压力算法稳定可靠', '配件生态完善'],
  },
])

const focuses = ref([
  {
    id: 'comfort',
    icon: '🫧',
    title: '舒适度体验',
    description: '降低漏气与异物感。',
    metric: '噪音 < 28dB',
  },
  {
    id: 'data',
    icon: '📡',
    title: '数据与云端',
    description: '远程随访与依从性监测。',
    metric: '日上传率 > 90%',
  },
  {
    id: 'portability',
    icon: '🎒',
    title: '便携与续航',
    description: '旅行与户外场景适配。',
    metric: '重量 < 1kg',
  },
  {
    id: 'service',
    icon: '🛠️',
    title: '服务体系',
    description: '配件与售后升级。',
    metric: 'T+1 响应',
  },
])

const compliance = ref([
  {
    icon: '✅',
    title: '法规清单',
    description: 'NMPA/FDA/CE 对照清单与资料准备。',
  },
  {
    icon: '🧪',
    title: '临床验证',
    description: '临床试验设计与真实世界数据收集。',
  },
  {
    icon: '📋',
    title: '上市路线图',
    description: '产品发布节奏、培训与渠道策略。',
  },
])

const goTo = (path: string) => {
  router.push(path)
}

const downloadTool = (item: { title: string }) => {
  const content = `清单：${item.title}\n生成时间：${new Date().toLocaleString()}\n\n请在此填写对应准备项。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${item.title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadPack = () => {
  const content = buildKnowledgePack('manufacturer')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '厂家知识包.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const openPdf = () => {
  openPdfTemplate('manufacturer')
}

const manufacturerChecklist = ref([
  { id: 1, title: '竞品矩阵', note: '对比参数、价格与用户评价。' },
  { id: 2, title: '关键指标', note: '噪音、加湿、数据能力指标。' },
  { id: 3, title: '临床验证', note: '设计试验与真实世界数据计划。' },
  { id: 4, title: '合规资料', note: 'NMPA/FDA/CE 文件清单。' },
])

const exportChecklist = () => {
  const items = manufacturerChecklist.value.map(item => `${item.title}: ${item.note || '—'}`)
  openPrint('厂家执行清单', [{ title: '执行清单', items }])
}
</script>

<style scoped>
.manufacturer-center-page {
  padding: 10px 0 30px;
}

.highlight-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #ecfccb 0%, #bbf7d0 100%);
  border: none;
}

.highlight-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.info-card ul {
  padding-left: 18px;
  margin: 8px 0 0;
  color: #475569;
}

.focus-card {
  text-align: center;
  min-height: 200px;
}

.focus-icon {
  font-size: 30px;
  margin-bottom: 8px;
}

.tool-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tool-icon {
  font-size: 20px;
}

.pack-card {
  margin-top: 20px;
}

.pack-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.pack-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.checklist-card {
  padding: 10px;
}

.checklist-row {
  margin-bottom: 12px;
}

.checklist-actions {
  margin-top: 12px;
  text-align: right;
}
</style>
