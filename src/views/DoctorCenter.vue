<template>
  <div class="doctor-center-page">
    <div class="page-header">
      <h1>👨‍⚕️ 医生学习中心</h1>
      <p class="subtitle">专业医学知识库 | 诊疗标准 | 循证医学证据</p>
    </div>

    <!-- 诊断标准 -->
    <div class="content-section">
      <h2>🔍 诊断标准</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="standard in diagnosticStandards" :key="standard.id">
          <el-card shadow="hover" class="standard-card">
            <h4>{{ standard.title }}</h4>
            <p class="description">{{ standard.description }}</p>
            <div class="details">
              <p v-for="detail in standard.details" :key="detail" class="detail-item">
                • {{ detail }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 治疗指南 -->
    <div class="content-section">
      <h2>💊 治疗指南</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="guideline in treatmentGuidelines" :key="guideline.id">
          <el-card shadow="hover" class="guideline-card">
            <div class="guideline-header">
              <h4>{{ guideline.title }}</h4>
              <el-tag :type="guideline.severity === '轻度' ? 'info' : guideline.severity === '中度' ? 'warning' : 'danger'">
                {{ guideline.severity }}
              </el-tag>
            </div>
            <p class="indication">适应症: {{ guideline.indication }}</p>
            <div class="treatment">
              <p><strong>推荐机型:</strong></p>
              <p v-for="device in guideline.recommendedDevices" :key="device" class="device-item">
                • {{ device }}
              </p>
            </div>
            <p class="efficacy">患者满意度：{{ guideline.efficacy }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 临床证据 -->
    <div class="content-section">
      <h2>📊 临床证据</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="evidence in clinicalEvidence" :key="evidence.id">
          <el-card shadow="hover" class="evidence-card">
            <div class="evidence-header">
              <h4>{{ evidence.title }}</h4>
              <el-tag type="success" size="small">{{ evidence.type }}</el-tag>
            </div>
            <p class="condition">疾病: {{ evidence.condition }}</p>
            <p class="evidence-text">证据: {{ evidence.evidence }}</p>
            <el-divider />
            <p class="reference">来源: {{ evidence.source }}</p>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 参数调整建议 -->
    <div class="content-section">
      <h2>⚙️ 通气参数建议</h2>
      <el-table :data="parameterGuidance" stripe style="width: 100%">
        <el-table-column prop="scenario" label="场景" min-width="180" />
        <el-table-column prop="mode" label="推荐模式" min-width="140" />
        <el-table-column prop="ipap" label="IPAP" min-width="120" />
        <el-table-column prop="epap" label="EPAP" min-width="120" />
        <el-table-column prop="notes" label="临床要点" min-width="220" />
      </el-table>
    </div>

    <!-- 临床路径工具箱 -->
    <div class="content-section">
      <h2>🧰 临床路径工具箱</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="tool in clinicalTools" :key="tool.id">
          <el-card shadow="hover" class="tool-card">
            <div class="tool-icon">{{ tool.icon }}</div>
            <h4>{{ tool.title }}</h4>
            <p class="description">{{ tool.description }}</p>
            <ul class="tool-list">
              <li v-for="item in tool.items" :key="item">{{ item }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 医院/睡眠中心合作 -->
    <div class="content-section">
      <h2>🏥 医院/睡眠中心合作入口</h2>
      <el-card shadow="hover" class="coop-card">
        <div class="coop-header">
          <div>
            <h3>合作页面模板（公开版）</h3>
            <p>面向医院、睡眠中心与呼吸科的标准合作说明。</p>
          </div>
          <el-button type="primary" plain @click="downloadCoopTemplate">下载模板</el-button>
        </div>
        <el-row :gutter="20" class="coop-grid">
          <el-col :xs="24" :md="6">
            <h4>我们能提供</h4>
            <ul>
              <li v-for="item in cooperationOfferings" :key="item">{{ item }}</li>
            </ul>
          </el-col>
          <el-col :xs="24" :md="6">
            <h4>合作模式</h4>
            <ul>
              <li v-for="item in cooperationModels" :key="item">{{ item }}</li>
            </ul>
          </el-col>
          <el-col :xs="24" :md="6">
            <h4>适配机构</h4>
            <ul>
              <li v-for="item in cooperationFits" :key="item">{{ item }}</li>
            </ul>
          </el-col>
          <el-col :xs="24" :md="6">
            <h4>合作流程</h4>
            <ol>
              <li v-for="item in cooperationSteps" :key="item">{{ item }}</li>
            </ol>
          </el-col>
        </el-row>
      </el-card>
    </div>

    <!-- 标准化培训路径 -->
    <div class="content-section">
      <h2>📘 标准化培训路径</h2>
      <el-card shadow="hover" class="path-card">
        <div class="path-body">
          <div>
            <h4>诊断 → 处方 → 治疗 → 随访</h4>
            <p class="description">结合临床专题课与知识库，形成一致化学习路径。</p>
          </div>
          <div class="path-actions">
            <el-button type="primary" @click="goClinicalGuides">进入临床专题课</el-button>
            <el-button plain @click="goClinicalLibrary">查看临床知识库</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 随访与依从性 -->
    <div class="content-section">
      <h2>📈 随访与依从性管理</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12" v-for="plan in followUpPlans" :key="plan.id">
          <el-card shadow="hover" class="follow-card">
            <div class="follow-header">
              <h4>{{ plan.title }}</h4>
              <el-tag type="info" size="small">{{ plan.frequency }}</el-tag>
            </div>
            <p class="description">{{ plan.summary }}</p>
            <div class="details">
              <p v-for="item in plan.items" :key="item">• {{ item }}</p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 下载与工具 -->
    <div class="content-section">
      <h2>📂 临床资料下载</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="file in downloads" :key="file.id">
          <el-card shadow="hover" class="download-card">
            <div class="download-icon">{{ file.icon }}</div>
            <h4>{{ file.title }}</h4>
            <p class="description">{{ file.description }}</p>
            <el-button size="small" type="primary" @click="downloadTemplate(file)">下载模板</el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="pack-card">
        <div class="pack-body">
          <div>
            <h4>医生知识包</h4>
            <p class="description">诊断标准、治疗路径、随访清单与模板合集。</p>
          </div>
          <div class="pack-actions">
            <el-button type="primary" @click="downloadPack">一键下载</el-button>
            <el-button @click="openPdf">PDF模板</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 个性化推荐 -->
    <div class="content-section">
      <h2>🧭 个性化路径推荐</h2>
      <el-card class="recommend-card">
        <el-row :gutter="20">
          <el-col :xs="24" :md="8">
            <el-select v-model="recommendForm.disease" placeholder="选择疾病">
              <el-option label="OSA" value="sleep_apnea" />
              <el-option label="COPD" value="copd" />
              <el-option label="神经肌肉疾病" value="neuromuscular" />
            </el-select>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-select v-model="recommendForm.severity" placeholder="严重程度">
              <el-option label="轻度" value="mild" />
              <el-option label="中度" value="moderate" />
              <el-option label="重度" value="severe" />
            </el-select>
          </el-col>
          <el-col :xs="24" :md="8">
            <el-select v-model="recommendForm.adherence" placeholder="依从性">
              <el-option label="良好" value="good" />
              <el-option label="一般" value="normal" />
              <el-option label="较差" value="poor" />
            </el-select>
          </el-col>
        </el-row>
        <div class="recommend-result">
          <h4>推荐建议</h4>
          <p>{{ recommendSummary }}</p>
          <el-button size="small" @click="saveRecommend">保存为默认</el-button>
        </div>
      </el-card>
    </div>

    <div class="content-section">
      <h2>✅ 医师执行清单</h2>
      <el-card shadow="hover" class="checklist-card">
        <el-row :gutter="16" v-for="item in doctorChecklist" :key="item.id" class="checklist-row">
          <el-col :xs="24" :md="6">
            <strong>{{ item.title }}</strong>
          </el-col>
          <el-col :xs="24" :md="18">
            <el-input v-model="item.note" placeholder="补充执行要点或备注" />
          </el-col>
        </el-row>
        <div class="checklist-actions">
          <el-button type="primary" @click="exportChecklist">导出PDF</el-button>
        </div>
      </el-card>
    </div>

    <!-- 常见问题 -->
    <div class="content-section faq-section">
      <h2>❓ 医生常见问题</h2>
      <el-collapse>
        <el-collapse-item v-for="faq in doctorFAQs" :key="faq.id" :title="faq.q">
          <p class="faq-answer">{{ faq.a }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { buildKnowledgePack } from '@/utils/packs'
import { openPdfTemplate } from '@/utils/pdfTemplates'
import { openPrint } from '@/utils/print'

const diagnosticStandards = ref([
  {
    id: 1,
    title: 'OSA诊断标准',
    description: 'AASM 2019标准',
    details: [
      'AHI ≥ 5：轻度OSA',
      'AHI 15-30：中度OSA',
      'AHI > 30：重度OSA',
      '需PSG或家庭睡眠监测确诊'
    ]
  },
  {
    id: 2,
    title: 'COPD分级',
    description: 'GOLD 2024标准',
    details: [
      'FEV1 ≥ 80%：GOLD 1',
      'FEV1 50-79%：GOLD 2',
      'FEV1 30-49%：GOLD 3',
      'FEV1 < 30%：GOLD 4'
    ]
  },
  {
    id: 3,
    title: '神经肌肉疾病',
    description: '诊疗指南',
    details: [
      'FVC < 50% 需NIV',
      '口腔压 < 60 cmH2O',
      '最大吸气压异常',
      '睡眠呼吸事件增多'
    ]
  },
  {
    id: 4,
    title: '心衰相关',
    description: '分类评估',
    details: [
      'NYHA分级I-IV',
      '射血分数HFrEF/HFmrEF',
      'BNP/NT-proBNP水平',
      'LVEF评估'
    ]
  }
])

const treatmentGuidelines = ref([
  {
    id: 1,
    title: '轻-中度OSA',
    severity: '轻度',
    indication: 'AHI 5-30',
    recommendedDevices: ['自动PAP设备', '固定压力PAP设备', '舒适度优先机型'],
    efficacy: '改善 75-80%'
  },
  {
    id: 2,
    title: '重度OSA',
    severity: '重度',
    indication: 'AHI > 30',
    recommendedDevices: ['双水平PAP设备', '舒适度增强机型', '高压耐受方案'],
    efficacy: '改善 85-90%'
  },
  {
    id: 3,
    title: 'COPD无创通气',
    severity: '中度',
    indication: 'COPD exacerbation',
    recommendedDevices: ['家用NIV设备', '双水平无创通气', '监测支持设备'],
    efficacy: '改善 80-85%'
  }
])

const clinicalEvidence = ref([
  {
    id: 1,
    title: 'CPAP心血管保护作用',
    type: 'RCT研究',
    condition: '中重度OSA',
    evidence: '系统综述提示持续 PAP 治疗可改善日间嗜睡与血压控制。',
    source: '指南与系统综述'
  },
  {
    id: 2,
    title: '双水平通气的舒适度优势',
    type: '临床共识',
    condition: '重度OSA',
    evidence: '在高压不耐受人群中，双水平可改善舒适度与依从性。',
    source: '共识与临床实践'
  },
  {
    id: 3,
    title: 'NIV在COPD中的应用',
    type: '指南推荐',
    condition: 'COPD急性加重与慢性高碳酸血症',
    evidence: '指南强调适应证评估与监测随访的重要性。',
    source: '指南与共识'
  }
])

const parameterGuidance = ref([
  {
    scenario: '轻-中度OSA',
    mode: 'APAP / CPAP',
    ipap: '—',
    epap: '6-12 cmH2O',
    notes: '以舒适度为先，逐步上调压力'
  },
  {
    scenario: '重度OSA',
    mode: 'CPAP / BiPAP',
    ipap: '12-20 cmH2O',
    epap: '8-14 cmH2O',
    notes: '必要时切换双水平，关注漏气'
  },
  {
    scenario: 'COPD急性加重',
    mode: 'BiPAP / ST',
    ipap: '16-24 cmH2O',
    epap: '6-10 cmH2O',
    notes: '监测CO2潴留与呼吸功'
  },
  {
    scenario: '神经肌肉疾病',
    mode: 'ST / iVAPS',
    ipap: '14-22 cmH2O',
    epap: '4-8 cmH2O',
    notes: '关注潮气量与夜间通气'
  }
])

const clinicalTools = ref([
  {
    id: 1,
    icon: '📋',
    title: '评估模板',
    description: '标准化快速评估',
    items: ['ESS量表', 'STOP-BANG', 'COPD评估']
  },
  {
    id: 2,
    icon: '🧪',
    title: '随访清单',
    description: '提高依从性与疗效',
    items: ['AHI复盘', '漏气评估', '压力复核']
  },
  {
    id: 3,
    icon: '🧰',
    title: '处方要点',
    description: '开机前关键说明',
    items: ['面罩匹配', '压力设定', '加湿建议']
  },
  {
    id: 4,
    icon: '🗂️',
    title: '远程管理',
    description: '云平台监测',
    items: ['依从性追踪', '数据告警', '远程随访']
  }
])

const cooperationOfferings = [
  '标准化呼吸机与睡眠设备数据库',
  '患者教育与随访工具',
  '设备选型与依从性管理支持',
  '专业内容与培训平台',
]

const cooperationModels = [
  '转诊与随访协作',
  '专业内容共建',
  '培训与继续教育',
]

const cooperationFits = [
  '睡眠医学中心',
  '呼吸科',
  '体检中心',
  '康复与慢病管理机构',
]

const cooperationSteps = [
  '填写申请',
  '沟通评估',
  '试点合作',
  '正式合作',
]

const followUpPlans = ref([
  {
    id: 1,
    title: '初始1个月随访',
    frequency: '每周一次',
    summary: '重点关注适应期不适与漏气问题。',
    items: ['检查AHI、漏气、使用时长', '调整压力与加湿设置', '加强患者教育']
  },
  {
    id: 2,
    title: '稳定期随访',
    frequency: '每月一次',
    summary: '评估疗效持续性与长期依从性。',
    items: ['复核心血管风险指标', '评估睡眠结构改善', '建议年度复查PSG']
  }
])

const downloads = ref([
  {
    id: 1,
    icon: '📝',
    title: '初诊评估表',
    description: '首次问诊与症状记录模板'
  },
  {
    id: 2,
    icon: '📊',
    title: '随访记录表',
    description: '依从性与疗效复盘表'
  },
  {
    id: 3,
    icon: '🧰',
    title: '设备处方单',
    description: '模式、压力与加湿参数记录'
  },
  {
    id: 4,
    icon: '🧭',
    title: '风险评估表',
    description: 'STOP-BANG与ESS合集'
  }
])

const recommendForm = ref(loadFromStorage('doctor-recommend-form', {
  disease: 'sleep_apnea',
  severity: 'moderate',
  adherence: 'normal'
}))

const recommendSummary = computed(() => {
  const { disease, severity, adherence } = recommendForm.value
  const diseaseLabel = disease === 'copd' ? 'COPD' : disease === 'neuromuscular' ? '神经肌肉疾病' : 'OSA'
  const severityLabel = severity === 'severe' ? '重度' : severity === 'mild' ? '轻度' : '中度'
  const adherenceLabel = adherence === 'poor' ? '依从性较差' : adherence === 'good' ? '依从性良好' : '依从性一般'
  return `${diseaseLabel} ${severityLabel} 患者，${adherenceLabel}。建议优先评估面罩适配、漏气与舒适度，结合云端数据调整压力与加湿，并设置2-4周随访强化依从性。`
})

const saveRecommend = () => {
  saveToStorage('doctor-recommend-form', recommendForm.value)
}

const downloadTemplate = (file: { title: string }) => {
  const content = `模板：${file.title}\n生成时间：${new Date().toLocaleString()}\n\n请在此填写对应临床信息。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${file.title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadPack = () => {
  const content = buildKnowledgePack('doctor')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '医生知识包.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadCoopTemplate = () => {
  const content = [
    '医院/睡眠中心合作页面模板',
    '',
    '我们能提供：',
    ...cooperationOfferings.map(item => `- ${item}`),
    '',
    '合作模式：',
    ...cooperationModels.map(item => `- ${item}`),
    '',
    '适配机构：',
    ...cooperationFits.map(item => `- ${item}`),
    '',
    '合作流程：',
    ...cooperationSteps.map(item => `- ${item}`),
    '',
    '合作邮箱：xxxxx@xxx.com',
  ].join('\n')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '医院_睡眠中心合作页模板.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}
const openPdf = () => {
  openPdfTemplate('doctor')
}

const doctorChecklist = ref([
  { id: 1, title: '诊断确认', note: '确认AHI/PSG结果与分级。' },
  { id: 2, title: '模式选择', note: 'CPAP/BiPAP/VPAP选择依据。' },
  { id: 3, title: '参数设定', note: '记录压力、加湿与舒适度设置。' },
  { id: 4, title: '随访计划', note: '2-4周随访与依从性策略。' },
])

const exportChecklist = () => {
  const items = doctorChecklist.value.map(item => `${item.title}: ${item.note || '—'}`)
  openPrint('医生执行清单', [{ title: '执行清单', items }])
}
const doctorFAQs = ref([
  {
    id: 1,
    q: 'Q: CPAP治疗什么时候见效？患者需要准备什么心理预期？',
    a: '答：\n• 即刻效果 (首晚)：睡眠中止呼吸暂停，睡眠结构改善\n• 短期效果 (1-2周)：患者能明显感受到精神改善，白天嗜睡缓解\n• 中期效果 (4-8周)：血压开始下降，认知功能改善\n• 长期效果 (3-6个月)：心血管风险显著降低\n\n患者心理准备：初期1-2周可能感到不适（适应期），建议从低压力开始，强调治疗的长期获益。'
  },
  {
    id: 2,
    q: 'Q: 患者对CPAP不耐受怎么办？有哪些解决方案？',
    a: '答：临床选择矩阵：\n\n• CPAP：轻-中度OSA (AHI < 30)，首选最经济\n• BiPAP：中度OSA (AHI 30-60)，患者不耐受CPAP\n• VPAP/iVAPS：重度OSA (AHI > 60)或CO2潴留\n\n决策流程：\n1. 评估诊断和严重程度\n2. 评估患者耐受性\n3. 从CPAP开始，不耐受转BiPAP，重症直接VPAP\n4. 监测疗效和依从性'
  },
  {
    id: 3,
    q: 'Q: 云端数据如何进行远程管理和患者随访？',
    a: '答：远程管理方案：\n• 具备云端功能的设备可上传使用数据\n• 医生可基于依从性与残余事件进行随访调整\n• 建议患者每周自查一次，医生每月复盘一次\n• 依从性差或疗效不佳时，应安排电话或视频复诊'
  }
])

const router = useRouter()

const goClinicalGuides = () => {
  router.push('/clinical-guides')
}

const goClinicalLibrary = () => {
  router.push('/clinical')
}
</script>

<style scoped>
.doctor-center-page {
  padding: 20px 0;
}

.path-card {
  border-radius: 12px;
}

.path-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.path-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.coop-card {
  border-radius: 12px;
}

.coop-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.coop-grid h4 {
  margin-bottom: 8px;
}

.coop-grid ul,
.coop-grid ol {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  font-size: 13px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: white;
}

.page-header h1 {
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

.page-header .subtitle {
  margin: 0;
  font-size: 1.1rem;
  opacity: 0.9;
}

.content-section {
  margin-bottom: 40px;
}

.content-section h2 {
  margin-bottom: 20px;
  color: #303133;
  border-bottom: 3px solid #409EFF;
  padding-bottom: 10px;
}

.standard-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.standard-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.standard-card h4 {
  margin: 0 0 10px 0;
  color: #409EFF;
  font-size: 16px;
}

.standard-card .description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.standard-card .details {
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
}

.detail-item {
  margin: 5px 0;
}

.guideline-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.guideline-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.guideline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.guideline-header h4 {
  margin: 0;
  color: #303133;
}

.guideline-card .indication {
  margin: 10px 0;
  font-size: 13px;
  color: #606266;
}

.guideline-card .treatment {
  background: #f5f7fa;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
}

.guideline-card .treatment p {
  margin: 0 0 5px 0;
  font-size: 13px;
}

.guideline-card .treatment strong {
  color: #303133;
}

.device-item {
  margin: 3px 0;
  color: #606266;
}

.guideline-card .efficacy {
  margin: 10px 0 0 0;
  font-size: 13px;
  color: #10b981;
  font-weight: 500;
}

.evidence-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.evidence-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.evidence-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.evidence-header h4 {
  margin: 0;
  color: #303133;
}

.evidence-card .condition {
  margin: 10px 0;
  font-size: 13px;
  color: #606266;
  font-weight: 500;
}

.evidence-card .evidence-text {
  margin: 10px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
}

.evidence-card .reference {
  margin: 0;
  font-size: 12px;
  color: #909399;
  font-style: italic;
}

.tool-card {
  height: 100%;
}

.tool-icon {
  font-size: 28px;
  margin-bottom: 10px;
}

.tool-list {
  padding-left: 16px;
  color: #606266;
  font-size: 13px;
}

.follow-card {
  height: 100%;
}

.follow-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.download-card {
  text-align: center;
  height: 100%;
}

.download-icon {
  font-size: 32px;
  margin-bottom: 8px;
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

.recommend-card {
  padding: 10px;
}

.recommend-result {
  margin-top: 20px;
}

.faq-section {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.faq-answer {
  white-space: pre-wrap;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.8rem;
  }

  .page-header .subtitle {
    font-size: 0.95rem;
  }
}
</style>
