<template>
  <div class="agent-center-page">
    <div class="page-header">
      <h1>代理商中心</h1>
      <p>专注市场洞察、销售策略与客户匹配工具。</p>
    </div>

    <el-card class="highlight-card" shadow="hover">
      <div class="highlight-body">
        <div>
          <h2>快速销售作战室</h2>
          <p>对标竞品、拆解卖点、快速生成客户建议。</p>
        </div>
        <el-button type="primary" @click="goTo('/compare')">立即对比</el-button>
      </div>
    </el-card>

    <div class="content-section">
      <h2>市场与渠道</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="item in marketInsights" :key="item.title">
          <el-card shadow="hover" class="info-card">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <ul>
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>客户画像与需求匹配</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="6" v-for="segment in segments" :key="segment.id">
          <el-card shadow="hover" class="segment-card">
            <div class="segment-icon">{{ segment.icon }}</div>
            <h4>{{ segment.title }}</h4>
            <p>{{ segment.description }}</p>
            <el-tag size="small">{{ segment.recommendation }}</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>销售工具包</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="tool in tools" :key="tool.title">
          <el-card shadow="hover" class="tool-card">
            <div class="tool-header">
              <span class="tool-icon">{{ tool.icon }}</span>
              <h4>{{ tool.title }}</h4>
            </div>
            <p>{{ tool.description }}</p>
            <el-button type="primary" plain size="small" @click="downloadTool(tool)">
              下载模板
            </el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="pack-card">
        <div class="pack-body">
          <div>
            <h4>代理商知识包</h4>
            <p>客户画像、竞品清单、成交话术与报价模板合集。</p>
          </div>
          <div class="pack-actions">
            <el-button type="primary" @click="downloadPack">一键下载</el-button>
            <el-button @click="openPdf">PDF模板</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <div class="content-section">
      <h2>✅ 销售执行清单</h2>
      <el-card shadow="hover" class="checklist-card">
        <el-row :gutter="16" v-for="item in agentChecklist" :key="item.id" class="checklist-row">
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

const marketInsights = ref([
  {
    title: '核心品类趋势',
    description: '家用睡眠呼吸暂停设备需求持续增长。',
    points: ['高舒适度与静音成为决策关键', '智能数据追踪提升复购', '入门级需求向中端升级'],
  },
  {
    title: '渠道打法',
    description: '线下体验 + 线上内容教育联动。',
    points: ['建立体验点与复诊合作', '内容种草提高信任度', '定期跟踪依从性'],
  },
  {
    title: '竞争策略',
    description: '对标竞品关键参数与价格段。',
    points: ['优先对比噪音与加湿', '强调售后与远程管理', '设置差异化套餐'],
  },
])

const segments = ref([
  {
    id: 'entry',
    icon: '🌙',
    title: '初次用户',
    description: '预算有限，需要简单易用。',
    recommendation: '推荐入门款 + 基础培训',
  },
  {
    id: 'mid',
    icon: '⚙️',
    title: '升级用户',
    description: '希望提升舒适度与数据管理。',
    recommendation: '推荐自动调压 + 云端随访',
  },
  {
    id: 'clinical',
    icon: '🩺',
    title: '临床合作',
    description: '关注疗效与医护支持。',
    recommendation: '推荐双水平 + 临床工具包',
  },
  {
    id: 'travel',
    icon: '🧳',
    title: '差旅用户',
    description: '高便携性与低噪音。',
    recommendation: '推荐便携款 + 轻量配件',
  },
])

const tools = ref([
  {
    icon: '📄',
    title: '客户需求访谈表',
    description: '快速记录关键症状与预算要求。',
  },
  {
    icon: '📊',
    title: '竞品对比清单',
    description: '型号对比、参数优势与话术。',
  },
  {
    icon: '🧾',
    title: '成交报价模板',
    description: '套餐组合与售后说明。',
  },
])

const goTo = (path: string) => {
  router.push(path)
}

const downloadTool = (tool: { title: string }) => {
  const content = `工具模板：${tool.title}\n生成时间：${new Date().toLocaleString()}\n\n请在此填写客户信息与方案建议。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${tool.title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadPack = () => {
  const content = buildKnowledgePack('agent')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '代理商知识包.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const openPdf = () => {
  openPdfTemplate('agent')
}

const agentChecklist = ref([
  { id: 1, title: '客户画像', note: '记录症状、预算与使用场景。' },
  { id: 2, title: '方案对比', note: '列出2-3款机型对比。' },
  { id: 3, title: '成交策略', note: '强调售后与依从性管理。' },
  { id: 4, title: '售后跟进', note: '制定复购与耗材计划。' },
])

const exportChecklist = () => {
  const items = agentChecklist.value.map(item => `${item.title}: ${item.note || '—'}`)
  openPrint('代理商执行清单', [{ title: '执行清单', items }])
}
</script>

<style scoped>
.agent-center-page {
  padding: 10px 0 30px;
}

.highlight-card {
  margin-bottom: 24px;
  background: linear-gradient(135deg, #fff7ed 0%, #fde68a 100%);
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

.segment-card {
  text-align: center;
  min-height: 200px;
}

.segment-icon {
  font-size: 32px;
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
