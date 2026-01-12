<template>
  <div class="patient-center-page">
    <div class="page-header">
      <h1>👤 患者自学中心</h1>
      <p class="subtitle">疾病认知 | 使用指南 | 生活管理 | 故障排查</p>
    </div>

    <!-- 疾病认知 -->
    <div class="content-section">
      <h2>🧠 疾病认知</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="disease in diseaseKnowledge" :key="disease.id">
          <el-card shadow="hover" class="knowledge-card">
            <div class="disease-icon">{{ disease.icon }}</div>
            <h4>{{ disease.name }}</h4>
            <p class="description">{{ disease.description }}</p>
            <div class="details">
              <p v-for="detail in disease.details" :key="detail" class="detail-item">
                • {{ detail }}
              </p>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 使用指南 -->
    <div class="content-section">
      <h2>⚙️ 使用指南</h2>
      <el-timeline>
        <el-timeline-item v-for="step in usageGuide" :key="step.id" :timestamp="step.week" placement="top">
          <el-card>
            <h4>{{ step.title }}</h4>
            <p class="description">{{ step.description }}</p>
            <div class="tips">
              <p v-for="tip in step.tips" :key="tip" class="tip-item">
                💡 {{ tip }}
              </p>
            </div>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>

    <!-- 面罩选择 -->
    <div class="content-section">
      <h2>😷 面罩选择指南</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="mask in maskGuide" :key="mask.id">
          <el-card shadow="hover" class="mask-card">
            <div class="mask-icon">{{ mask.icon }}</div>
            <h4>{{ mask.title }}</h4>
            <p class="description">{{ mask.description }}</p>
            <ul class="mask-list">
              <li v-for="item in mask.points" :key="item">{{ item }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 生活管理 -->
    <div class="content-section">
      <h2>🏃 生活管理</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="lifestyle in lifestyleManagement" :key="lifestyle.id">
          <el-card shadow="hover" class="lifestyle-card">
            <div class="lifestyle-icon">{{ lifestyle.icon }}</div>
            <h4>{{ lifestyle.title }}</h4>
            <p class="description">{{ lifestyle.description }}</p>
            <ul class="lifestyle-list">
              <li v-for="item in lifestyle.recommendations" :key="item">
                {{ item }}
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 维护周期 -->
    <div class="content-section">
      <h2>🧼 设备维护周期表</h2>
      <el-table :data="maintenanceSchedule" stripe style="width: 100%">
        <el-table-column prop="item" label="部件" min-width="140" />
        <el-table-column prop="frequency" label="建议频率" min-width="160" />
        <el-table-column prop="notes" label="说明" min-width="240" />
      </el-table>
    </div>

    <!-- 故障排查 -->
    <div class="content-section faq-section">
      <h2>🔧 故障排查与常见问题</h2>
      <el-collapse>
        <el-collapse-item v-for="problem in troubleshooting" :key="problem.id" :title="problem.problem">
          <p class="solution">{{ problem.solution }}</p>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 自测量表 -->
    <div class="content-section">
      <h2>📝 自测量表与康复工具</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="tool in selfTools" :key="tool.id">
          <el-card shadow="hover" class="resource-card">
            <div class="resource-icon">{{ tool.icon }}</div>
            <h4>{{ tool.title }}</h4>
            <p class="description">{{ tool.description }}</p>
            <el-button type="primary" size="small" @click="downloadTool(tool)">{{ tool.action }}</el-button>
          </el-card>
        </el-col>
      </el-row>
      <el-card shadow="hover" class="pack-card">
        <div class="pack-body">
          <div>
            <h4>患者知识包</h4>
            <p class="description">通俗认知、使用步骤、维护清单与复诊记录。</p>
          </div>
          <div class="pack-actions">
            <el-button type="primary" @click="downloadPack">一键下载</el-button>
            <el-button @click="openPdf">PDF模板</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 收藏清单 -->
    <div class="content-section">
      <h2>⭐ 我的收藏清单</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="item in favorites" :key="item.id">
          <el-card shadow="hover" class="favorite-card">
            <div class="favorite-icon">{{ item.icon }}</div>
            <h4>{{ item.title }}</h4>
            <p class="description">{{ item.description }}</p>
            <el-button size="small" @click="toggleFavorite(item.id)">
              {{ favoriteIds.includes(item.id) ? '已收藏' : '加入收藏' }}
            </el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>✅ 个人执行清单</h2>
      <el-card shadow="hover" class="checklist-card">
        <el-row :gutter="16" v-for="item in patientChecklist" :key="item.id" class="checklist-row">
          <el-col :xs="24" :md="6">
            <strong>{{ item.title }}</strong>
          </el-col>
          <el-col :xs="24" :md="18">
            <el-input v-model="item.note" placeholder="记录自己的执行情况" />
          </el-col>
        </el-row>
        <div class="checklist-actions">
          <el-button type="primary" @click="exportChecklist">导出PDF</el-button>
        </div>
      </el-card>
    </div>

    <!-- 进度追踪 -->
    <div class="content-section">
      <h2>✅ 使用进度追踪</h2>
      <el-card>
        <el-progress :percentage="progressPercent" status="success" />
        <el-checkbox-group v-model="progressChecklist" class="progress-list">
          <el-checkbox v-for="item in progressItems" :key="item.id" :label="item.id">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
        <el-button size="small" @click="resetProgress">清空进度</el-button>
      </el-card>
    </div>

    <!-- 患者成功故事 -->
    <div class="content-section">
      <h2>✨ 患者成功故事</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="story in successStories" :key="story.id">
          <el-card shadow="hover" class="story-card">
            <div class="story-avatar">{{ story.avatar }}</div>
            <h4>{{ story.name }}</h4>
            <p class="age">年龄: {{ story.age }} | 诊断: {{ story.diagnosis }}</p>
            <p class="story-text">"{{ story.story }}"</p>
            <div class="results">
              <el-tag v-for="result in story.results" :key="result" type="success" size="small">
                {{ result }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 资源与支持 -->
    <div class="content-section">
      <h2>📚 资源与支持</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="resource in resources" :key="resource.id">
          <el-card shadow="hover" class="resource-card">
            <div class="resource-icon">{{ resource.icon }}</div>
            <h4>{{ resource.title }}</h4>
            <p class="description">{{ resource.description }}</p>
            <el-button type="primary" size="small">了解更多</el-button>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 统计信息 -->
    <div class="content-section stats-section">
      <h2>📊 疾病与治疗统计</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-box">
            <div class="stat-number">9亿</div>
            <div class="stat-label">全球睡眠呼吸暂停患者</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-box">
            <div class="stat-number">2亿</div>
            <div class="stat-label">正在接受治疗的患者</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-box">
            <div class="stat-number">85%+</div>
            <div class="stat-label">治疗有效率</div>
          </div>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <div class="stat-box">
            <div class="stat-number">30%</div>
            <div class="stat-label">心梗风险降低</div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { buildKnowledgePack } from '@/utils/packs'
import { openPdfTemplate } from '@/utils/pdfTemplates'
import { openPrint } from '@/utils/print'

const diseaseKnowledge = ref([
  {
    id: 1,
    icon: '😴',
    name: '睡眠呼吸暂停',
    description: 'OSA是最常见的睡眠呼吸疾病',
    details: [
      '睡眠中反复停止呼吸',
      '打鼾、昼间嗜睡',
      'AHI指数用于分级',
      '可导致心脑血管病'
    ]
  },
  {
    id: 2,
    icon: '💨',
    name: '慢阻肺',
    description: 'COPD需要长期管理',
    details: [
      '肺功能逐步下降',
      '呼吸困难加重',
      '容易急性加重',
      '需要早期干预'
    ]
  },
  {
    id: 3,
    icon: '❤️',
    name: '心衰',
    description: '心衰患者需无创通气支持',
    details: [
      '心脏泵血功能减弱',
      '液体潴留在肺部',
      '夜间阵发呼吸困难',
      '多位置正压通气有效'
    ]
  },
  {
    id: 4,
    icon: '💪',
    name: '肌肉病',
    description: '神经肌肉疾病需要重症支持',
    details: [
      '呼吸肌逐步衰弱',
      '需要渐进式NIV',
      '24小时可能需要支持',
      '生活质量明显改善'
    ]
  }
])

const usageGuide = ref([
  {
    id: 1,
    week: '第1周',
    title: '开箱检查与准备',
    description: '初次使用的准备工作，确保所有组件齐全无损。',
    tips: [
      '检查机器、面罩、管路、加湿器是否完整',
      '阅读产品说明书和安全指南',
      '选择合适的面罩大小，确保舒适度',
      '放在稳定、通风的位置'
    ]
  },
  {
    id: 2,
    week: '第2-3周',
    description: '适应阶段，建议从低压力开始。',
    title: '适应压力与使用习惯',
    tips: [
      '从低压力开始逐步适应',
      '建议睡前30分钟用坡度斜度模式',
      '每晚使用至少4小时',
      '遵照医生处方设置压力、湿度、温度等参数'
    ]
  },
  {
    id: 3,
    week: '第4周',
    description: '稳定期，按处方继续使用。',
    title: '常规使用与监测',
    tips: [
      '每晚使用不少于7小时',
      '定期检查面罩状况和舒适度',
      '监测呼吸机数据和睡眠质量',
      '记录治疗反应和任何不适'
    ]
  },
  {
    id: 4,
    week: '第5-8周',
    description: '效果评估，调整治疗方案。',
    title: '效果评估与调整',
    tips: [
      '进行复查PSG或云数据分析',
      '评估白天嗜睡改善情况',
      '根据数据调整压力设置',
      '必要时与医生沟通方案调整'
    ]
  }
])

const maskGuide = ref([
  {
    id: 1,
    icon: '🌙',
    title: '鼻罩',
    description: '适合鼻呼吸顺畅、追求轻便的人群。',
    points: ['佩戴轻盈', '适合轻中度漏气', '对侧睡友好']
  },
  {
    id: 2,
    icon: '💤',
    title: '全面罩',
    description: '适合口呼吸或鼻塞频繁的患者。',
    points: ['覆盖口鼻', '漏气控制更好', '需要更精细调节']
  },
  {
    id: 3,
    icon: '🌬️',
    title: '鼻枕',
    description: '适合不喜欢面罩压迫感的用户。',
    points: ['接触面积小', '适合高舒适需求', '对鼻腔敏感者慎选']
  }
])

const lifestyleManagement = ref([
  {
    id: 1,
    icon: '🛏️',
    title: '睡眠环保',
    description: '改善睡眠环境，提高治疗效果',
    recommendations: [
      '卧室温度16-20℃',
      '避免过亮环境',
      '隔音与通风',
      '舒适的床垫与枕头'
    ]
  },
  {
    id: 2,
    icon: '🍎',
    title: '饮食管理',
    description: '合理饮食配合治疗',
    recommendations: [
      '避免高脂肪食物',
      '减少钠盐摄入',
      '戒烟限酒',
      '睡前避免进食'
    ]
  },
  {
    id: 3,
    icon: '🏋️',
    title: '运动锻炼',
    description: '适度运动改善症状',
    recommendations: [
      '每周150分钟有氧运动',
      '中等强度最佳',
      '避免睡前剧烈运动',
      '循序渐进增加强度'
    ]
  },
  {
    id: 4,
    icon: '⚖️',
    title: '体重管理',
    description: '体重管理至关重要',
    recommendations: [
      '肥胖患者减重5-10%',
      '可显著改善AHI',
      '循序渐进目标',
      '配合医学监测'
    ]
  }
])

const maintenanceSchedule = ref([
  {
    item: '面罩与头带',
    frequency: '每周清洗，3-6个月更换',
    notes: '温水中性清洁剂清洗，避免暴晒'
  },
  {
    item: '管路',
    frequency: '每周清洗，6-12个月更换',
    notes: '洗后自然风干，避免折叠'
  },
  {
    item: '加湿水箱',
    frequency: '每日换水，每周清洁',
    notes: '使用蒸馏水更佳，防止水垢'
  },
  {
    item: '过滤网',
    frequency: '每2-4周清洁，3-6个月更换',
    notes: '灰尘多环境需缩短周期'
  }
])

const troubleshooting = ref([
  {
    id: 1,
    problem: '面罩漏气',
    solution: '1. 检查面罩是否正确佩戴\n2. 适度调整面罩松紧度\n3. 如果仍然漏气，尝试更换其他类型面罩\n4. 检查面罩垫是否磨损，需要更换\n5. 如果是常见问题，联系医生更换面罩型号'
  },
  {
    id: 2,
    problem: '没有明显效果',
    solution: '1. 检查使用时间是否足够（需要7小时以上）\n2. 确认压力设置是否正确\n3. 给身体足够适应时间（通常需要4-8周）\n4. 检查是否有其他医学问题\n5. 确认是否坚持生活改善\n6. 联系医生调整治疗方案'
  },
  {
    id: 3,
    problem: '机器报警或故障',
    solution: '1. 管路脱落 → 检查管路连接\n2. 湿度过高 → 调低湿度设置\n3. 电源问题 → 检查插头是否松动\n4. 传感器错误 → 清洁传感器\n5. 面罩漏气太多 → 检查并调整面罩\n6. 无法解决时联系客服或医生'
  },
  {
    id: 4,
    problem: '不适应使用',
    solution: '1. 逐步适应 → 从每天1小时开始\n2. 调整压力 → 使用坡度或斜度模式\n3. 更换面罩 → 尝试不同类型\n4. 心理调适 → 了解治疗重要性\n5. 定期复诊 → 与医生讨论进展\n6. 加入患者社区 → 获得支持和建议'
  }
])

const selfTools = ref([
  {
    id: 1,
    icon: '🧭',
    title: 'ESS嗜睡量表',
    description: '快速评估白天嗜睡程度。',
    action: '开始测评'
  },
  {
    id: 2,
    icon: '📏',
    title: 'STOP-BANG量表',
    description: '评估OSA风险等级。',
    action: '立即评估'
  },
  {
    id: 3,
    icon: '🫁',
    title: '呼吸训练指南',
    description: '改善肺功能与耐力。',
    action: '查看训练'
  },
  {
    id: 4,
    icon: '📊',
    title: '睡眠记录表',
    description: '记录睡眠质量与设备使用。',
    action: '下载模板'
  }
])

const favorites = ref([
  {
    id: 1,
    icon: '📘',
    title: '适应期指南',
    description: '从第1天到第30天的使用计划'
  },
  {
    id: 2,
    icon: '🛠️',
    title: '漏气排查清单',
    description: '常见漏气场景与解决方法'
  },
  {
    id: 3,
    icon: '🧼',
    title: '维护周期表',
    description: '面罩/管路/滤网更换周期'
  },
  {
    id: 4,
    icon: '📊',
    title: '睡眠记录模板',
    description: '记录睡眠质量与设备使用'
  }
])

const favoriteIds = ref<number[]>(loadFromStorage('patient-favorites', []))

const toggleFavorite = (id: number) => {
  if (favoriteIds.value.includes(id)) {
    favoriteIds.value = favoriteIds.value.filter(item => item !== id)
  } else {
    favoriteIds.value = [...favoriteIds.value, id]
  }
}

watch(favoriteIds, () => {
  saveToStorage('patient-favorites', favoriteIds.value)
}, { deep: true })

const progressItems = ref([
  { id: 'setup', label: '完成开箱与配置' },
  { id: 'mask', label: '找到适合的面罩' },
  { id: 'habit', label: '连续使用7天' },
  { id: 'review', label: '完成第1次复诊' },
])

const progressChecklist = ref<string[]>(loadFromStorage('patient-progress', []))

const progressPercent = computed(() => {
  if (!progressItems.value.length) return 0
  return Math.round((progressChecklist.value.length / progressItems.value.length) * 100)
})

watch(progressChecklist, () => {
  saveToStorage('patient-progress', progressChecklist.value)
}, { deep: true })

const resetProgress = () => {
  progressChecklist.value = []
}

const downloadTool = (tool: { title: string }) => {
  const content = `工具：${tool.title}\n生成时间：${new Date().toLocaleString()}\n\n请在此填写对应内容。`
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${tool.title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

const downloadPack = () => {
  const content = buildKnowledgePack('patient')
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = '患者知识包.txt'
  link.click()
  URL.revokeObjectURL(link.href)
}

const openPdf = () => {
  openPdfTemplate('patient')
}

const patientChecklist = ref([
  { id: 1, title: '首次使用', note: '完成开箱检查与面罩调试。' },
  { id: 2, title: '坚持使用', note: '每晚至少6小时。' },
  { id: 3, title: '清洁维护', note: '每周清洁面罩与管路。' },
  { id: 4, title: '复诊记录', note: '记录AHI与不适情况。' },
])

const exportChecklist = () => {
  const items = patientChecklist.value.map(item => `${item.title}: ${item.note || '—'}`)
  openPrint('患者执行清单', [{ title: '执行清单', items }])
}
const successStories = ref([
  {
    id: 1,
    avatar: '👨‍💼',
    name: '李先生',
    age: '55岁',
    diagnosis: '重度OSA',
    story: '医生告诉我如果不治疗，可能会有心梗。这对我触动很大。现在坚持使用呼吸机，定期体检，AHI从78降到6。妻子也很开心，因为我不再打鼾了！',
    results: ['AHI大幅下降', '精神改善', '血压下降']
  },
  {
    id: 2,
    avatar: '👩‍🏫',
    name: '王女士',
    age: '48岁',
    diagnosis: '中度OSA',
    story: '一开始适应困难，总觉得不舒服。后来在医生和患者社区的支持下，坚持了3周。现在感觉白天精神多了，工作效率提高，再也不会开会时瞌睡了！',
    results: ['精神充沛', '工作效率提高', '生活质量改善']
  },
  {
    id: 3,
    avatar: '👴',
    name: '张大爷',
    age: '72岁',
    diagnosis: '轻度OSA+COPD',
    story: '年纪大了，本以为这辈子就这样了。没想到用呼吸机后，呼吸变顺畅了，走路都有力气了。现在是我们社区的"技术达人"，还经常指导其他老伙伴如何使用。',
    results: ['呼吸改善', '活动能力提高', '生活更独立']
  }
])

const resources = ref([
  {
    id: 1,
    icon: '📖',
    title: '医生咨询',
    description: '联系您的医生进行专业指导和参数调整'
  },
  {
    id: 2,
    icon: '👥',
    title: '患者社区',
    description: '加入患者社区，分享经验和建议'
  },
  {
    id: 3,
    icon: '📚',
    title: '教育材料',
    description: '下载使用手册和患者教育材料'
  },
  {
    id: 4,
    icon: '📱',
    title: '移动应用',
    description: '使用官方APP追踪治疗进展'
  }
])
</script>

<style scoped>
.patient-center-page {
  padding: 20px 0;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 20px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
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
  border-bottom: 3px solid #10b981;
  padding-bottom: 10px;
}

.knowledge-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.knowledge-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.disease-icon {
  font-size: 48px;
  margin-bottom: 10px;
  text-align: center;
}

.knowledge-card h4 {
  margin: 0 0 8px 0;
  color: #10b981;
  font-size: 16px;
}

.knowledge-card .description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.knowledge-card .details {
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
}

.detail-item {
  margin: 5px 0;
}

:deep(.el-timeline-item__wrapper) {
  padding: 0 0 30px 0;
}

:deep(.el-card) {
  margin-bottom: 0;
}

.el-card h4 {
  margin: 0 0 10px 0;
  color: #10b981;
}

.el-card .description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
}

.tips {
  background: #f0fdf4;
  padding: 10px;
  border-left: 3px solid #10b981;
}

.tip-item {
  margin: 5px 0;
  font-size: 13px;
  color: #059669;
  line-height: 1.6;
}

.mask-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.mask-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.mask-icon {
  font-size: 40px;
  text-align: center;
  margin-bottom: 10px;
}

.mask-list {
  margin: 0;
  padding-left: 18px;
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
}

.lifestyle-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.lifestyle-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.lifestyle-icon {
  font-size: 48px;
  text-align: center;
  margin-bottom: 10px;
}

.lifestyle-card h4 {
  margin: 0 0 8px 0;
  color: #303133;
  text-align: center;
}

.lifestyle-card .description {
  margin: 0 0 10px 0;
  color: #606266;
  font-size: 13px;
  text-align: center;
}

.lifestyle-list {
  margin: 0;
  padding-left: 20px;
  font-size: 12px;
  color: #909399;
  line-height: 1.8;
}

.lifestyle-list li {
  margin: 5px 0;
}

.faq-section {
  background: #f5f7fa;
  padding: 20px;
  border-radius: 8px;
}

.solution {
  white-space: pre-wrap;
  color: #606266;
  font-size: 14px;
  line-height: 1.8;
}

.story-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.story-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.story-avatar {
  font-size: 48px;
  text-align: center;
  margin-bottom: 10px;
}

.story-card h4 {
  margin: 0 0 5px 0;
  color: #303133;
  text-align: center;
}

.story-card .age {
  margin: 0 0 10px 0;
  font-size: 12px;
  color: #909399;
  text-align: center;
}

.story-card .story-text {
  margin: 10px 0;
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  font-style: italic;
}

.story-card .results {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.resource-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
}

.resource-card:hover {
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
  transform: translateY(-4px);
}

.resource-icon {
  font-size: 48px;
  margin-bottom: 10px;
}

.resource-card h4 {
  margin: 0 0 8px 0;
  color: #303133;
}

.resource-card .description {
  margin: 0 0 12px 0;
  color: #606266;
  font-size: 13px;
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

.favorite-card {
  height: 100%;
  text-align: center;
}

.favorite-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.progress-list {
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stats-section {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 12px;
  padding: 40px 20px;
}

.stats-section h2 {
  color: white;
  border-bottom-color: white;
}

.stat-box {
  background: white;
  padding: 30px 20px;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
  color: #10b981;
  margin-bottom: 10px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
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
