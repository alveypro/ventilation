<template>
  <div class="selector-page">
    <div class="page-header handbook">
      <p class="header-label">智能选机</p>
      <h1>评分制推荐</h1>
      <p>不直接给型号，先给设备类型与风险提示。</p>
    </div>

    <el-card class="selector-container">
      <el-steps :active="activeStep" align-center>
        <el-step title="基础信息" />
        <el-step title="症状与预算" />
        <el-step title="使用偏好" />
        <el-step title="查看推荐" />
      </el-steps>

      <div class="step-content">
        <div v-if="activeStep === 0" class="step-panel">
          <h3>请选择主要问题</h3>
          <el-radio-group v-model="form.disease" class="option-group">
            <el-radio-button
              v-for="disease in diseases"
              :key="disease.classification || disease.id"
              :label="disease.classification || String(disease.id)"
            >
              {{ disease.name }}
            </el-radio-button>
          </el-radio-group>

          <h3>主要使用场景</h3>
          <el-radio-group v-model="form.useCase" class="option-group">
            <el-radio-button label="home">居家使用</el-radio-button>
            <el-radio-button label="travel">经常出差/旅行</el-radio-button>
            <el-radio-button label="mixed">家用 + 便携兼顾</el-radio-button>
          </el-radio-group>
        </div>

        <div v-else-if="activeStep === 1" class="step-panel">
          <h3>症状严重程度</h3>
          <el-radio-group v-model="form.severity" class="option-group">
            <el-radio-button label="mild">轻度</el-radio-button>
            <el-radio-button label="moderate">中度</el-radio-button>
            <el-radio-button label="severe">重度</el-radio-button>
          </el-radio-group>

          <h3>预算范围（元）</h3>
          <el-input-number v-model="form.budget" :min="2000" :max="30000" :step="500" />
        </div>

        <div v-else-if="activeStep === 2" class="step-panel">
          <h3>便携需求</h3>
          <el-radio-group v-model="form.portability" class="option-group">
            <el-radio-button label="low">不需要</el-radio-button>
            <el-radio-button label="medium">一般</el-radio-button>
            <el-radio-button label="high">非常需要</el-radio-button>
          </el-radio-group>

          <h3>舒适与体验</h3>
          <div class="toggle-group">
            <el-switch v-model="form.noiseSensitive" active-text="对噪音敏感" />
            <el-switch v-model="form.humidification" active-text="需要内置加湿" />
            <el-switch v-model="form.experience" :active-value="'beginner'" :inactive-value="'advanced'" active-text="新手用户" />
          </div>
        </div>

        <div v-else class="step-panel">
          <div class="result-header">
            <h3>推荐结果</h3>
            <el-button @click="restart">重新评估</el-button>
          </div>
          <el-row v-if="isLoading" :gutter="20">
            <el-col :xs="24" :sm="12" :md="6" v-for="i in 4" :key="i">
              <el-skeleton :rows="6" />
            </el-col>
          </el-row>
          <el-row v-else :gutter="20">
            <el-col :xs="24" :sm="12" :md="6" v-for="item in recommendations" :key="item.id">
              <div class="recommend-card">
                <ProductCard :product="item" @detail="goToProduct(item.id)" />
                <div class="match-info">
                  <span class="score">匹配度 {{ item.matchScore || 0 }}</span>
                  <div class="reasons">
                    <el-tag v-for="reason in item.matchReasons || []" :key="reason" size="small">
                      {{ reason }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty v-if="!isLoading && recommendations.length === 0" description="暂无推荐结果" />
        </div>

        <div class="step-actions" v-if="activeStep < 3">
          <el-button :disabled="activeStep === 0" @click="prevStep">上一步</el-button>
          <el-button type="primary" @click="nextStep">下一步</el-button>
        </div>
      </div>
    </el-card>

    <div class="content-section">
      <h2>评分制选型算法说明</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="rule-card">
            <h3>评分维度（总分 100）</h3>
            <ul>
              <li v-for="item in scoringDimensions" :key="item.title">
                <strong>{{ item.title }}</strong>：{{ item.detail }}
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="rule-card">
            <h3>推荐阈值</h3>
            <ul>
              <li v-for="item in scoringThresholds" :key="item.range">
                <strong>{{ item.range }}</strong>：{{ item.recommendation }}
              </li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <div class="content-section">
      <h2>选机提醒与风险提示</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="tip in selectorTips" :key="tip.title">
          <el-card shadow="hover" class="rule-card">
            <h3>{{ tip.title }}</h3>
            <p class="description">{{ tip.description }}</p>
            <ul>
              <li v-for="item in tip.items" :key="item">{{ item }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/ProductCard.vue'
import { fetchDiseases, fetchProducts } from '@/services/dataService'
import { selectorApi } from '@/services'
import type { Disease, Product } from '@/types'

type Recommendation = Product & { matchScore?: number; matchReasons?: string[] }

const router = useRouter()
const activeStep = ref(0)
const diseases = ref<Disease[]>([])
const recommendations = ref<Recommendation[]>([])
const isLoading = ref(false)
const allProducts = ref<Product[]>([])
const disableSelectorApi = import.meta.env.VITE_DISABLE_SELECTOR_API === '1'

const form = reactive({
  disease: '',
  severity: 'moderate',
  budget: 8000,
  portability: 'medium',
  noiseSensitive: true,
  humidification: true,
  useCase: 'home',
  experience: 'beginner',
})

const nextStep = async () => {
  if (activeStep.value === 0 && !form.disease) {
    ElMessage.warning('请选择主要问题类型')
    return
  }
  if (activeStep.value === 2) {
    await getRecommendations()
  }
  if (activeStep.value < 3) {
    activeStep.value += 1
  }
}

const prevStep = () => {
  if (activeStep.value > 0) {
    activeStep.value -= 1
  }
}

const restart = () => {
  activeStep.value = 0
  recommendations.value = []
}

const matchesDisease = (product: Product, disease: string) => {
  if (!disease) return false
  const mapping: Record<string, string[]> = {
    ohs: ['ohs', 'obesity_hypoventilation'],
    sleep_apnea: ['sleep_apnea', 'osa'],
  }
  const targets = mapping[disease] || [disease]
  return targets.some(target => product.suitableFor?.includes(target))
}

const isBilevelPreferred = (product: Product) => {
  return product.type?.includes('双水平')
    || product.deviceType === 'NIV_HOME'
    || (product.modeTags || []).some(tag => ['ST', 'S/T', 'VAuto', 'iVAPS', 'AVAPS'].includes(tag))
}

const scoreProduct = (product: Product) => {
  let score = 0
  const reasons: string[] = []

  if (form.disease && matchesDisease(product, form.disease)) {
    score += 30
    reasons.push('疾病匹配度高')
  }

  const bilevel = isBilevelPreferred(product)
  if (form.severity === 'severe') {
    score += bilevel ? 20 : 10
    reasons.push(bilevel ? '重度更偏好双水平/家用NIV' : '重度建议更高支持')
  } else if (form.severity === 'moderate') {
    score += bilevel ? 16 : 12
    reasons.push(bilevel ? '中度可考虑双水平' : '中度常规支持')
  } else {
    score += bilevel ? 8 : 12
    reasons.push(bilevel ? '轻度更关注舒适度' : '轻度匹配家用场景')
  }

  if (typeof form.budget === 'number') {
    if (product.price > 0 && product.price <= form.budget) {
      score += 15
      reasons.push('价格符合预算')
    } else if (product.price === 0) {
      score += 7
      reasons.push('价格待补充')
    } else {
      score += 5
      reasons.push('价格略超预算')
    }
  }

  if (form.useCase === 'travel' || form.portability === 'high') {
    if (product.tag === '便携' || product.deviceType === 'PAP_TRAVEL' || product.name.toLowerCase().includes('mini')) {
      score += 15
      reasons.push('便携性匹配')
    } else {
      score += 5
      reasons.push('便携性一般')
    }
  } else {
    score += 8
    reasons.push('日常使用稳定性优先')
  }

  if (form.noiseSensitive || form.humidification) {
    const noise = product.specs?.['噪音水平']
    const noiseValue = noise ? Number(noise.match(/[\d.]+/)?.[0] || 99) : 99
    const noiseScore = noiseValue <= 28 ? 6 : noiseValue <= 30 ? 4 : 2
    const humidifier = product.specs?.['湿化器'] || ''
    const humidScore = product.humidifier === '一体' || humidifier.includes('内置') ? 4 : 0
    score += noiseScore + humidScore
    if (noiseScore >= 4) reasons.push('噪音控制较优')
    if (humidScore > 0) reasons.push('湿化配置更舒适')
  }

  if (form.experience === 'beginner') {
    if (product.tag === '入门' || product.price <= 4000) {
      score += 10
      reasons.push('新手友好')
    }
  } else if (product.price >= 12000) {
    score += 6
    reasons.push('高阶配置适合进阶用户')
  }

  return { score: Math.min(100, score), reasons }
}

const getRecommendations = async () => {
  isLoading.value = true
  if (!disableSelectorApi) {
    try {
      const res = await selectorApi.recommend({
        disease: form.disease,
        severity: form.severity as 'mild' | 'moderate' | 'severe',
        budget: form.budget,
        portability: form.portability as 'low' | 'medium' | 'high',
        noiseSensitive: form.noiseSensitive,
        humidification: form.humidification,
        useCase: form.useCase as 'home' | 'travel' | 'mixed',
        experience: form.experience as 'beginner' | 'advanced',
      })
      if (res.code === 200 && Array.isArray(res.data)) {
        recommendations.value = res.data
        isLoading.value = false
        return
      }
    } catch (error) {
      // Fallback to local scoring
    }
  }

  if (!allProducts.value.length) {
    allProducts.value = await fetchProducts()
  }
  const scored = allProducts.value.map(product => {
    const result = scoreProduct(product)
    return {
      ...product,
      matchScore: result.score,
      matchReasons: result.reasons,
    }
  })
  recommendations.value = scored.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0)).slice(0, 4)
  isLoading.value = false
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

onMounted(async () => {
  diseases.value = await fetchDiseases()
  allProducts.value = await fetchProducts()
})

const scoringDimensions = [
  { title: '疾病匹配（30分）', detail: '与适用疾病一致则加分。' },
  { title: '严重程度（20分）', detail: '重度更偏好双水平/家用NIV。' },
  { title: '预算匹配（15分）', detail: '预算内得分更高，超预算得分下降。' },
  { title: '便携需求（15分）', detail: '旅行/便携需求优先便携机型。' },
  { title: '舒适体验（10分）', detail: '噪音与湿化配置综合评分。' },
  { title: '使用经验（10分）', detail: '新手优先易上手机型。' },
]

const scoringThresholds = [
  { range: '≥ 85', recommendation: '高度匹配：优先重点机型与高配方案' },
  { range: '70–84', recommendation: '匹配良好：主流机型可优先考虑' },
  { range: '55–69', recommendation: '基础匹配：建议结合预算与舒适度调整' },
  { range: '< 55', recommendation: '信息不足：建议补充症状或预算再评估' },
]

const selectorTips = [
  {
    title: '必须专业评估的情况',
    description: '以下情况不建议自行选机或调参。',
    items: ['怀疑中枢性呼吸暂停或心衰', '持续低氧或明显通气不足', '合并神经肌肉疾病'],
  },
  {
    title: '选机不等于参数',
    description: '推荐结果只是“方向”，参数需要结合评估。',
    items: ['先选模式，再谈压力', '面罩适配影响疗效', '随访数据比单次更重要'],
  },
  {
    title: '随访是成功关键',
    description: '稳定使用比一次选对更重要。',
    items: ['适应期 1-2 周高频复盘', '关注 AHI/漏气/时长趋势', '不适持续要复评'],
  },
]
</script>

<style scoped>
.selector-page {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 24px;
}

.page-header.handbook {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.header-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.page-header h1 {
  font-size: 32px;
  color: #1f2937;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
}

.content-section {
  margin-top: 30px;
}

.content-section h2 {
  margin-bottom: 16px;
  font-size: 22px;
  border-left: 4px solid #1d4ed8;
  padding-left: 12px;
}

.rule-card ul {
  margin: 0;
  padding-left: 18px;
  color: #475569;
  font-size: 13px;
}

.selector-container {
  max-width: 800px;
  margin: 0 auto;
}

.step-content {
  padding: 30px 0;
}

.step-panel {
  text-align: left;
  margin-top: 20px;
}

.step-panel h3 {
  font-size: 16px;
  margin: 20px 0 12px;
  color: #303133;
}

.option-group {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.toggle-group {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
}

.step-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.recommend-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.match-info {
  margin-top: 10px;
}

.match-info .score {
  display: block;
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
}

.match-info .reasons {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
