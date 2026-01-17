<template>
  <div class="product-detail-page">
    <el-skeleton v-if="isLoading" :rows="8" />
    <template v-else>
    <div class="page-header handbook">
      <div class="header-row">
        <div>
          <p class="header-label">产品详情</p>
          <h1>{{ product.name }}</h1>
          <p>{{ product.brand }} · {{ product.type }}</p>
        </div>
        <el-button v-if="brandEntry" size="small" plain @click="goToBrand">品牌详情</el-button>
      </div>
    </div>

    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Products' }">产品库</el-breadcrumb-item>
      <el-breadcrumb-item>{{ product.name }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="detail-container">
      <!-- 左侧：产品图片和基本信息 -->
      <div class="left-section">
        <div class="product-image">
          <img v-if="product.image || product.images?.length" :src="product.image || product.images?.[0]" :alt="product.name" />
          <div v-else class="image-placeholder">{{ product.brand }}</div>
        </div>

        <el-card class="basic-info">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>

          <div class="info-item">
            <span class="label">品牌：</span>
            <span class="value">{{ product.brand }}</span>
          </div>
          <div class="info-item">
            <span class="label">类型：</span>
            <span class="value">{{ product.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">价格：</span>
            <span class="value price">{{ priceLabel }}</span>
          </div>
          <div class="info-item">
            <span class="label">评分：</span>
            <el-rate :model-value="product.rating || 0" disabled></el-rate>
            <span class="count">({{ product.reviewCount }}条评价)</span>
          </div>

          <el-button type="primary" size="large" class="buy-btn" @click="handleBuy">
            了解购买
          </el-button>
        </el-card>
      </div>

      <!-- 右侧：详细信息 -->
      <div class="right-section">
        <h1>{{ product.name }}</h1>
        <p class="description">{{ product.description }}</p>
        <p class="one-liner">{{ positioning }}</p>

        <div class="knowledge-tags">
          <el-tag type="success">{{ infoLabel }}</el-tag>
          <el-tag type="info">适用人群：{{ audienceLabel }}</el-tag>
          <el-tag type="warning">专业级参数</el-tag>
        </div>

        <el-row :gutter="16" class="dual-summary">
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
          <h3>资料等级说明</h3>
          <ul>
            <li v-for="item in evidenceGuidelines" :key="item">{{ item }}</li>
          </ul>
        </el-card>

        <!-- 适用疾病 -->
        <div class="suitable-diseases">
          <h3>适用疾病</h3>
          <el-tag v-for="disease in product.suitableFor" :key="disease">
            {{ getDiseaseLabel(disease) }}
          </el-tag>
        </div>

        <div class="data-profile" v-if="product.dataCompleteness || product.sourceTypes?.length">
          <h3>资料完整度</h3>
          <div class="profile-row">
            <el-progress :percentage="product.dataCompleteness || 0" :stroke-width="10" />
            <span class="profile-note">依据参数、适应证、场景与来源类型综合计算</span>
          </div>
          <div class="profile-tags" v-if="product.sourceTypes?.length">
            <el-tag v-for="item in product.sourceTypes" :key="item" size="small" type="info">来源 {{ item }}</el-tag>
          </div>
        </div>

        <div class="scenario-section" v-if="product.scenarioTags?.length">
          <h3>应用场景</h3>
          <el-tag v-for="item in product.scenarioTags" :key="item" type="success">{{ item }}</el-tag>
        </div>

        <div class="mode-section" v-if="visibleModeTags.length || product.asv">
          <h3>通气模式</h3>
          <el-tag v-for="item in visibleModeTags" :key="item" type="warning">{{ item }}</el-tag>
          <el-tag v-if="product.asv" type="danger">ASV（高风险提示）</el-tag>
        </div>

        <div class="structured-section" v-if="structuredSpecs.length">
          <h3>结构化参数</h3>
          <div class="structured-grid">
            <div class="structured-item" v-for="item in structuredSpecs" :key="item.label">
              <span class="structured-label">{{ item.label }}</span>
              <span class="structured-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <div class="alias-section" v-if="product.aliasNames?.length">
          <h3>别名/渠道名</h3>
          <el-tag v-for="item in product.aliasNames" :key="item" type="info">{{ item }}</el-tag>
        </div>

        <div class="channel-section" v-if="product.channels?.length || product.refurbRisk || product.overclaimRisk">
          <h3>渠道与风险提示</h3>
          <div class="channel-grid">
            <div class="channel-item" v-if="product.channels?.length">
              <span class="channel-label">渠道</span>
              <span class="channel-value">{{ product.channels.join(' / ') }}</span>
            </div>
            <div class="channel-item" v-if="product.refurbRisk">
              <span class="channel-label">翻新风险</span>
              <span class="channel-value">{{ product.refurbRisk }}</span>
            </div>
            <div class="channel-item" v-if="product.overclaimRisk">
              <span class="channel-label">虚标风险</span>
              <span class="channel-value">{{ product.overclaimRisk }}</span>
            </div>
            <div class="channel-item" v-if="product.status">
              <span class="channel-label">上市状态</span>
              <span class="channel-value">{{ product.status }}</span>
            </div>
          </div>
        </div>

        <el-card shadow="hover" class="longform-card">
          <h3>专业长文</h3>
          <div class="longform-content" v-html="renderMarkdown(longformContent)"></div>
        </el-card>

        <div class="platform-section" v-if="product.platformFamily || product.uiSignature || product.dataSignature || product.hardwareSignature">
          <div class="platform-header">
            <h3>平台识别特征</h3>
            <el-button v-if="product.platformId" size="small" type="primary" plain @click="goToPlatform">查看平台家族</el-button>
          </div>
          <div class="platform-grid">
            <div class="platform-item" v-if="product.platformFamily">
              <span class="platform-label">平台家族</span>
              <span class="platform-value">{{ product.platformFamily }}</span>
            </div>
            <div class="platform-item" v-if="product.platformConfidence">
              <span class="platform-label">归类置信度</span>
              <span class="platform-value">{{ product.platformConfidence }}%</span>
            </div>
            <div class="platform-item" v-if="product.uiSignature">
              <span class="platform-label">UI特征</span>
              <span class="platform-value">{{ product.uiSignature }}</span>
            </div>
            <div class="platform-item" v-if="product.dataSignature">
              <span class="platform-label">数据特征</span>
              <span class="platform-value">{{ product.dataSignature }}</span>
            </div>
            <div class="platform-item" v-if="product.hardwareSignature">
              <span class="platform-label">硬件特征</span>
              <span class="platform-value">{{ product.hardwareSignature }}</span>
            </div>
            <div class="platform-item" v-if="product.platformNotes">
              <span class="platform-label">平台风险</span>
              <span class="platform-value">{{ product.platformNotes }}</span>
            </div>
            <div class="platform-item" v-if="product.platformRuleHits?.length">
              <span class="platform-label">归类规则</span>
              <span class="platform-value">{{ product.platformRuleHits.join(' / ') }}</span>
            </div>
          </div>
        </div>

        <div class="platform-siblings" v-if="samePlatformModels.length">
          <div class="platform-header">
            <h3>同款平台机型</h3>
            <el-button size="small" type="primary" plain @click="comparePlatform">同款对比</el-button>
          </div>
          <el-row :gutter="16">
            <el-col :xs="24" :sm="12" :md="8" v-for="item in samePlatformModels" :key="item.id">
              <ProductCard :product="item" :show-compare="false" @detail="goToProduct(item.id)" />
            </el-col>
          </el-row>
        </div>

        <el-card class="model-block" v-if="platformEvidence.length">
          <h3>同款/贴牌识别证据</h3>
          <ul class="evidence-list">
            <li v-for="item in platformEvidence" :key="item">{{ item }}</li>
          </ul>
        </el-card>

        <el-card class="model-block">
          <h3>核心参数卡</h3>
          <div class="key-specs-grid">
            <div class="key-spec-item" v-for="item in keySpecs" :key="item.label">
              <span class="key-spec-label">{{ item.label }}</span>
              <span class="key-spec-value">{{ item.value }}</span>
            </div>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>参数图谱</h3>
          <div class="diagram-frame" v-html="parameterGraphSvg"></div>
        </el-card>

        <el-card class="model-block">
          <h3>适用场景矩阵</h3>
          <div class="diagram-frame" v-html="scenarioMatrixSvg"></div>
        </el-card>

        <el-card class="model-block">
          <h3>适用人群与使用场景</h3>
          <div class="block-row">
            <div>
              <h4>推荐人群</h4>
              <ul>
                <li v-for="item in recommendedPeople" :key="item">{{ item }}</li>
              </ul>
            </div>
            <div>
              <h4>使用场景</h4>
              <ul>
                <li v-for="item in scenarioList" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
          <div class="block-caution" v-if="cautionList.length">
            <h4>需谨慎/不推荐</h4>
            <ul>
              <li v-for="item in cautionList" :key="item">{{ item }}</li>
            </ul>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>模式与算法体验</h3>
          <div class="block-row">
            <div>
              <h4>同步性</h4>
              <p>触发：{{ modeExperience.trigger }}</p>
              <p>切换：{{ modeExperience.cycle }}</p>
              <p>漏气补偿：{{ modeExperience.leak }}</p>
            </div>
            <div>
              <h4>舒适功能</h4>
              <p>呼气减压/舒适算法：{{ modeExperience.comfort }}</p>
              <p>湿化与结露控制：{{ modeExperience.humidification }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>数据与软件</h3>
          <div class="block-row">
            <div>
              <h4>数据介质</h4>
              <p>{{ dataProfile.medium }}</p>
              <h4>可用软件</h4>
              <p>{{ dataProfile.software }}</p>
            </div>
            <div>
              <h4>可导出内容</h4>
              <p>{{ dataProfile.exports }}</p>
              <h4>注意事项</h4>
              <p>{{ dataProfile.cautions }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>配件与兼容</h3>
          <div class="block-row">
            <div>
              <h4>面罩接口</h4>
              <p>{{ accessoryProfile.maskInterface }}</p>
              <h4>加热管</h4>
              <p>{{ accessoryProfile.heatedTube }}</p>
            </div>
            <div>
              <h4>电源/电池</h4>
              <p>{{ accessoryProfile.power }}</p>
              <h4>常见替换件</h4>
              <p>{{ accessoryProfile.consumables }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>价格与渠道</h3>
          <p class="price-note">价格区间为市场参考，实际以渠道报价与售后政策为准。</p>
          <div class="block-row">
            <div>
              <h4>电商参考价</h4>
              <p>{{ priceProfile.ecom }}</p>
              <h4>线下参考价</h4>
              <p>{{ priceProfile.offline }}</p>
            </div>
            <div>
              <h4>二手参考价</h4>
              <p>{{ priceProfile.used }}</p>
              <h4>常见渠道</h4>
              <p>{{ priceProfile.channels }}</p>
              <h4>购买避坑</h4>
              <p>{{ priceProfile.pitfalls }}</p>
            </div>
          </div>
        </el-card>

        <el-card class="model-block">
          <h3>常见问题</h3>
          <ol>
            <li v-for="item in faqList" :key="item">{{ item }}</li>
          </ol>
        </el-card>

        <el-card class="model-block">
          <h3>卖点卡片</h3>
          <div class="selling-grid">
            <div v-for="item in sellingCards" :key="item.title" class="selling-card">
              <div class="selling-title">{{ item.title }}</div>
              <div class="selling-desc">{{ item.description }}</div>
            </div>
          </div>
        </el-card>

        <!-- 核心特性 -->
        <div class="highlights-section">
          <h3>核心特性</h3>
          <el-row :gutter="15">
            <el-col :xs="24" :sm="12" v-for="(highlight, idx) in product.highlights" :key="idx">
              <div class="highlight-item">
                <span class="inline-icon highlight-icon">✅</span>
                <span>{{ highlight }}</span>
              </div>
            </el-col>
          </el-row>
        </div>

        <!-- Tabs -->
        <el-tabs class="detail-tabs">
          <!-- 参数规格 -->
          <el-tab-pane label="参数规格">
            <div class="specs-table">
              <div class="spec-row" v-for="(value, key) in product.specs" :key="key">
                <span class="spec-label">{{ key }}</span>
                <span class="spec-value">{{ value }}</span>
              </div>
            </div>
          </el-tab-pane>

          <!-- 优点 -->
          <el-tab-pane label="优点" v-if="product.advantages">
            <ul class="advantages-list">
              <li v-for="(adv, idx) in product.advantages" :key="idx">
                <span class="inline-icon advantage-icon">✔️</span>
                <span>{{ adv }}</span>
              </li>
            </ul>
          </el-tab-pane>

          <!-- 缺点 -->
          <el-tab-pane label="缺点" v-if="product.disadvantages">
            <ul class="disadvantages-list">
              <li v-for="(dis, idx) in product.disadvantages" :key="idx">
                <span class="inline-icon disadvantage-icon">⚠️</span>
                <span>{{ dis }}</span>
              </li>
            </ul>
          </el-tab-pane>

          <!-- 用户评价 -->
          <el-tab-pane label="用户评价">
            <div class="reviews-section">
              <div class="review-item" v-for="review in product.reviews || []" :key="review.id">
                <div class="review-header">
                  <span class="author">{{ review.author }}</span>
                  <span class="date">{{ review.date }}</span>
                  <el-rate :model-value="review.rating || 0" disabled size="small"></el-rate>
                </div>
                <h4>{{ review.title }}</h4>
                <p>{{ review.content }}</p>
                <div class="review-footer">
                  <el-button type="text" size="small">👍 有帮助 ({{ review.helpful }})</el-button>
                </div>
              </div>

              <el-button type="primary" class="write-review-btn">
                写评价
              </el-button>
            </div>
          </el-tab-pane>

          <el-tab-pane label="资料与参考">
            <ul class="evidence-list">
              <li v-for="note in evidenceNotes" :key="note">{{ note }}</li>
            </ul>
            <div class="evidence-sources">
              <h4>参考资料</h4>
              <el-tag v-for="source in authorityReferences" :key="source" size="small">{{ source }}</el-tag>
            </div>
            <el-collapse class="evidence-summary" v-if="authoritySummaries.length">
              <el-collapse-item title="摘要要点" name="summary">
                <ul>
                  <li v-for="summary in authoritySummaries" :key="summary">{{ summary }}</li>
                </ul>
              </el-collapse-item>
            </el-collapse>
            <div class="source-paths" v-if="product.sourcePaths?.length">
              <h4>资料来源</h4>
              <ul>
                <li v-for="path in product.sourcePaths" :key="path">{{ path }}</li>
              </ul>
            </div>
          </el-tab-pane>
        </el-tabs>

        <!-- 对比功能 -->
        <div class="compare-section">
          <el-button @click="addToCompare" :type="isInCompare ? 'warning' : 'default'">
            {{ isInCompare ? '✓ 已添加到对比' : '+ 加入对比' }}
          </el-button>
        </div>

        <div class="related-section" v-if="relatedProducts.length || relatedDiseases.length || relatedTutorials.length">
          <h3>相关内容推荐</h3>

          <div v-if="relatedProducts.length" class="related-block">
            <h4>同类产品</h4>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedProducts" :key="item.id">
                <ProductCard :product="item" :show-compare="false" @detail="goToProduct(item.id)" />
              </el-col>
            </el-row>
          </div>

          <div v-if="relatedDiseases.length" class="related-block">
            <h4>适用疾病</h4>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedDiseases" :key="item.id">
                <el-card shadow="hover" class="related-card" @click="goToDisease(item.id)">
                  <h5>{{ item.name }}</h5>
                  <p class="related-desc">{{ item.description }}</p>
                  <el-tag size="small">{{ item.severity }}</el-tag>
                </el-card>
              </el-col>
            </el-row>
          </div>

          <div v-if="relatedTutorials.length" class="related-block">
            <h4>推荐教程</h4>
            <el-row :gutter="16">
              <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedTutorials" :key="item.id">
                <el-card shadow="hover" class="related-card" @click="goToTutorial(item.id)">
                  <h5>{{ item.title }}</h5>
                  <p class="related-desc">{{ item.difficulty }} · {{ item.duration }}</p>
                  <el-button type="primary" size="small">阅读</el-button>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>

        <div class="gallery-section" v-if="product.images?.length">
          <h3>产品图库</h3>
          <el-row :gutter="12">
            <el-col :xs="12" :sm="8" :md="6" v-for="(img, idx) in product.images" :key="`${img}-${idx}`">
              <div class="gallery-item">
                <img :src="img" :alt="`${product.name}-${idx + 1}`" />
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchProductById, fetchProducts, fetchDiseases, fetchTutorials, fetchBrands } from '@/services/dataService'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import { getRelatedForProduct } from '@/utils/knowledge'
import { formatPriceRange, getPriceBand } from '@/utils/helpers'
import type { Product } from '@/types'
import ProductCard from '@/components/ProductCard.vue'
import type { Brand, Disease, Tutorial } from '@/types'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const router = useRouter()
const product = ref<Product>({
  id: 0,
  name: '',
  brand: '',
  type: '',
  price: 0,
  rating: 0,
  reviewCount: 0,
  highlights: [],
  description: '',
  suitableFor: [],
  specs: {},
})
const compareList = ref<number[]>(loadFromStorage('compare-ids', []))
const isLoading = ref(true)
const relatedProducts = ref<Product[]>([])
const relatedDiseases = ref<Disease[]>([])
const relatedTutorials = ref<Tutorial[]>([])
const allProducts = ref<Product[]>([])
const allBrands = ref<Brand[]>([])

const formatRange = (min?: number | null, max?: number | null, unit?: string) => {
  const safeMin = min == null ? undefined : min
  const safeMax = max == null ? undefined : max
  if (safeMin === undefined && safeMax === undefined) return ''
  if (safeMin !== undefined && safeMax !== undefined) return `${safeMin} - ${safeMax}${unit || ''}`
  if (safeMin !== undefined) return `${safeMin}${unit || ''}`
  return `${safeMax}${unit || ''}`
}

const structuredSpecs = computed(() => {
  const items: { label: string; value: string }[] = []
  if (product.value.platformFamily) items.push({ label: '平台系列', value: product.value.platformFamily })
  if (product.value.deviceType) {
    const label = product.value.deviceType === 'PAP_SLEEP'
      ? '睡眠PAP'
      : product.value.deviceType === 'NIV_HOME'
        ? '家用NIV'
        : '便携/旅行'
    items.push({ label: '设备类型', value: label })
  }
  const epap = formatRange(product.value.epapMin, product.value.epapMax, ' cmH2O')
  if (epap) items.push({ label: 'EPAP', value: epap })
  const ipap = formatRange(product.value.ipapMin, product.value.ipapMax, ' cmH2O')
  if (ipap) items.push({ label: 'IPAP', value: ipap })
  if (product.value.humidifier) items.push({ label: '湿化器', value: product.value.humidifier })
  if (product.value.heatedTube) items.push({ label: '加温管路', value: product.value.heatedTube })
  if (product.value.noiseDb) items.push({ label: '噪音', value: product.value.noiseDb })
  if (product.value.weightKg) items.push({ label: '重量', value: `${product.value.weightKg} kg` })
  if (product.value.connectivity?.length) items.push({ label: '连接方式', value: product.value.connectivity.join(' / ') })
  if (product.value.power?.length) items.push({ label: '供电', value: product.value.power.join(' / ') })
  if (product.value.backupRate !== undefined) items.push({ label: '后备频率', value: product.value.backupRate ? '支持' : '不支持' })
  if (product.value.targetVentilation !== undefined) items.push({ label: '目标通气', value: product.value.targetVentilation ? '支持' : '不支持' })
  if (product.value.refurbRisk) items.push({ label: '翻新风险', value: product.value.refurbRisk })
  if (product.value.overclaimRisk) items.push({ label: '虚标风险', value: product.value.overclaimRisk })
  if (product.value.status) items.push({ label: '上市状态', value: product.value.status })
  return items
})

const visibleModeTags = computed(() => {
  return (product.value.modeTags || []).filter(tag => tag !== 'ASV')
})

const samePlatformModels = computed(() => {
  if (!allProducts.value.length) return []
  const targetPlatformId = product.value.platformId
  const targetFamily = product.value.platformFamily
  return allProducts.value.filter(item => {
    if (item.id === product.value.id) return false
    if (targetPlatformId && item.platformId) return item.platformId === targetPlatformId
    if (targetFamily) return item.platformFamily === targetFamily
    return false
  }).slice(0, 6)
})

const brandEntry = computed(() => {
  if (!product.value.brand) return undefined
  return allBrands.value.find(brand => brand.name === product.value.brand)
})

const platformEvidence = computed(() => {
  const items: string[] = []
  if (product.value.uiSignature) items.push(`UI特征：${product.value.uiSignature}`)
  if (product.value.dataSignature) items.push(`数据特征：${product.value.dataSignature}`)
  if (product.value.hardwareSignature) items.push(`硬件特征：${product.value.hardwareSignature}`)
  if (product.value.platformRuleHits?.length) items.push(`规则命中：${product.value.platformRuleHits.join(' / ')}`)
  if (product.value.platformNotes) items.push(`平台风险：${product.value.platformNotes}`)
  return items
})

const positioning = computed(() => {
  const device = product.value.deviceType === 'PAP_SLEEP'
    ? '睡眠PAP'
    : product.value.deviceType === 'NIV_HOME'
      ? '家用NIV'
      : product.value.deviceType === 'PAP_TRAVEL'
        ? '便携PAP'
        : product.value.type
  const modes = product.value.modeTags?.length ? product.value.modeTags.join(' / ') : '标准模式'
  const scenario = product.value.scenarioTags?.length ? product.value.scenarioTags[0] : '日常通气'
  return `${device}定位，主打${modes}，适用于${scenario}。`
})

const keySpecs = computed(() => {
  return [
    { label: '设备类型', value: product.value.deviceType === 'PAP_SLEEP' ? '睡眠PAP' : product.value.deviceType === 'NIV_HOME' ? '家用NIV' : product.value.deviceType === 'PAP_TRAVEL' ? '便携/旅行' : product.value.type },
    { label: '支持模式', value: product.value.modeTags?.length ? product.value.modeTags.join(' / ') : '—' },
    { label: '压力范围', value: formatRange(product.value.epapMin, product.value.epapMax, ' cmH2O') || '—' },
    { label: 'IPAP 上限', value: product.value.ipapMax ? `${product.value.ipapMax} cmH2O` : '—' },
    { label: '后备频率', value: product.value.backupRate !== undefined ? (product.value.backupRate ? '支持' : '不支持') : '—' },
    { label: '目标通气', value: product.value.targetVentilation !== undefined ? (product.value.targetVentilation ? '支持' : '不支持') : '—' },
    { label: '加湿器', value: product.value.humidifier || '—' },
    { label: '加热管', value: product.value.heatedTube || '—' },
    { label: '连接方式', value: product.value.connectivity?.length ? product.value.connectivity.join(' / ') : '—' },
    { label: '重量', value: product.value.weightKg ? `${product.value.weightKg} kg` : '—' },
  ]
})

const priceLabel = computed(() => formatPriceRange(product.value.price))

const parameterGraphSvg = computed(() => {
  const epap = product.value.epapMax ?? product.value.epapMin ?? 20
  const ipap = product.value.ipapMax ?? product.value.ipapMin ?? epap
  const weight = product.value.weightKg ?? 3
  const scale = (value: number, max: number) => Math.max(20, Math.min(100, Math.round((value / max) * 100)))
  const bars = [
    { label: 'EPAP Max', value: epap, percent: scale(epap, 30) },
    { label: 'IPAP Max', value: ipap, percent: scale(ipap, 30) },
    { label: '重量(kg)', value: weight, percent: scale(weight, 10) },
  ]
  const barWidth = 90
  const gap = 18
  const baseY = 110
  const maxHeight = 70
  const rects = bars.map((bar, index) => {
    const x = 40 + index * (barWidth + gap)
    const height = Math.round((bar.percent / 100) * maxHeight)
    const y = baseY - height
    return `
      <rect x="${x}" y="${y}" width="${barWidth}" height="${height}" fill="#93c5fd" />
      <text x="${x}" y="${baseY + 16}" font-size="11" fill="#1f2937">${bar.label}</text>
      <text x="${x}" y="${y - 6}" font-size="11" fill="#1f2937">${bar.value}</text>
    `
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      <line x1="30" y1="${baseY}" x2="390" y2="${baseY}" stroke="#94a3b8"/>
      ${rects}
    </svg>
  `.trim()
})

const scenarioMatrixSvg = computed(() => {
  const columns = [
    { title: '人群', items: recommendedPeople.value },
    { title: '场景', items: scenarioList.value },
    { title: '风险', items: cautionList.value.length ? cautionList.value : ['—'] },
  ]
  const cellWidth = 120
  const startX = 30
  const startY = 40
  const lineHeight = 14
  const maxLines = 3
  const cells = columns.map((column, index) => {
    const x = startX + index * cellWidth
    const lines = column.items.slice(0, maxLines).map(item => item.replace(/\s+/g, ' '))
    const lineText = lines.map((line, idx) => `
      <tspan x="${x + 10}" dy="${idx === 0 ? 0 : lineHeight}">${line}</tspan>
    `).join('')
    return `
      <rect x="${x}" y="${startY}" width="${cellWidth - 10}" height="80" fill="#e0e7ff" stroke="#c7d2fe"/>
      <text x="${x + 10}" y="${startY - 10}" font-size="11" fill="#1f2937">${column.title}</text>
      <text x="${x + 10}" y="${startY + 20}" font-size="11" fill="#1f2937">${lineText}</text>
    `
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      ${cells}
    </svg>
  `.trim()
})

const recommendedPeople = computed(() => {
  const list = product.value.suitableFor?.length
    ? product.value.suitableFor.map(getDiseaseLabel)
    : []
  if (!list.length) {
    list.push(product.value.deviceType === 'NIV_HOME' ? '慢阻肺/呼吸衰竭人群' : '睡眠打鼾/OSA 用户')
  }
  return list
})

const scenarioList = computed(() => {
  return product.value.scenarioTags?.length ? product.value.scenarioTags : ['家庭通气', '长期依从性管理']
})

const cautionList = computed(() => {
  const items = []
  if (product.value.asv) items.push('涉及 ASV，需医生评估与严格适应证')
  if (product.value.overclaimRisk === '高') items.push('存在虚标风险，建议核验铭牌与软件版本')
  if (product.value.refurbRisk === '高') items.push('翻新风险高，建议选择正规渠道')
  return items
})

const modeExperience = computed(() => {
  const tags = product.value.modeTags || []
  const comfort = tags.includes('A-Flex') || tags.includes('C-Flex')
    ? '支持呼气减压/舒适算法'
    : '常规呼气减压需配合设置'
  return {
    trigger: tags.includes('ST') ? '触发可调，适合不同呼吸力度' : '自动触发为主',
    cycle: tags.includes('ST') ? '支持时间控制切换' : '自动切换为主',
    leak: '具备基础漏气补偿，需配合面罩',
    comfort,
    humidification: product.value.humidifier ? '湿化可调，结合加温管减少结露' : '需外置湿化或升级组件',
  }
})

const dataProfile = computed(() => {
  const medium = product.value.connectivity?.length ? product.value.connectivity.join(' / ') : 'SD/本地数据'
  const software = product.value.connectivity?.includes('云') ? '厂商云平台/APP' : 'SD 卡分析软件'
  return {
    medium,
    software,
    exports: 'AHI、漏气、压力曲线、使用时长、事件分类',
    cautions: product.value.dataSignature ? '不同版本目录结构可能差异' : '不同版本/地区固件差异需注意',
  }
})

const accessoryProfile = computed(() => {
  return {
    maskInterface: '22mm 标准接口为主（按型号确认）',
    heatedTube: product.value.heatedTube || '—',
    power: product.value.power?.length ? product.value.power.join(' / ') : 'AC 供电为主',
    consumables: '面罩垫、滤棉、水箱、管路',
  }
})

const priceProfile = computed(() => {
  const band = getPriceBand(product.value.price)
  const priceText = band === '待补充' ? '价格区间：待补充' : `价格区间：${band}`
  const pitfalls = product.value.refurbRisk === '高'
    ? '翻新风险高，建议选择官方/授权渠道'
    : '注意版本/配件/保修差异'
  return {
    ecom: priceText,
    offline: priceText,
    used: band === '待补充' ? '二手价格需核查成色与配件' : `二手参考：${band}`,
    channels: product.value.channels?.length ? product.value.channels.join(' / ') : '电商/线下',
    pitfalls,
  }
})

const faqList = [
  '适合新手吗？',
  '噪音大吗？',
  '漏气怎么办？',
  '水箱好清洗吗？',
  '数据怎么导出？',
  '有哪些同款换壳？',
]

const comparePlatform = () => {
  const ids = [product.value.id, ...samePlatformModels.value.map(item => item.id)].slice(0, 4)
  if (ids.length < 2) return
  router.push({ path: '/compare', query: { ids: ids.join(',') } })
}

const goToPlatform = () => {
  if (!product.value.platformId) return
  router.push(`/platform/${product.value.platformId}`)
}

const updateProduct = () => {
  const productId = parseInt(route.params.id as string)
  isLoading.value = true
  fetchProductById(productId).then((result) => {
    if (result) {
      product.value = result
    }
    isLoading.value = false
  })
}

watch(() => route.params.id, updateProduct, { immediate: true })

const loadRelated = async () => {
  const [products, diseases, tutorials, brands] = await Promise.all([
    fetchProducts(),
    fetchDiseases(),
    fetchTutorials(),
    fetchBrands(),
  ])
  allProducts.value = products
  allBrands.value = brands
  const related = getRelatedForProduct(product.value, {
    products,
    diseases,
    tutorials,
    reviews: [],
    brands,
  })
  relatedProducts.value = related.products
  relatedDiseases.value = related.diseases
  relatedTutorials.value = related.tutorials
}

watch(() => product.value.id, () => {
  if (product.value.id) {
    loadRelated()
  }
})

const isInCompare = computed(() => compareList.value.includes(product.value.id))

const infoLabel = computed(() => {
  const completeness = product.value.dataCompleteness || 0
  if (completeness >= 85) return '资料等级 A'
  if (completeness >= 70) return '资料等级 B'
  return '资料等级 C'
})

const audienceLabel = computed(() => {
  if (product.value.type.includes('双水平')) return '中重度或复杂病例'
  if (product.value.tag === '便携') return '差旅用户'
  if (product.value.price >= 12000) return '高端需求'
  return '大众家用'
})

const professionalSummary = computed(() => {
  const device = product.value.deviceType === 'PAP_SLEEP'
    ? '睡眠PAP'
    : product.value.deviceType === 'NIV_HOME'
      ? '家用NIV'
      : product.value.deviceType === 'PAP_TRAVEL'
        ? '便携PAP'
        : product.value.type
  const modes = product.value.modeTags?.length ? product.value.modeTags.join(' / ') : '常规通气模式'
  const epap = formatRange(product.value.epapMin, product.value.epapMax, ' cmH2O')
  const ipap = formatRange(product.value.ipapMin, product.value.ipapMax, ' cmH2O')
  const humidifier = product.value.humidifier ? `湿化器${product.value.humidifier}` : '湿化配置待确认'
  const connectivity = product.value.connectivity?.length ? `数据连接 ${product.value.connectivity.join(' / ')}` : '数据连接待确认'
  const pressureNote = epap || ipap ? `压力范围 EPAP ${epap || '—'} / IPAP ${ipap || '—'}` : '压力范围待补充'
  return `${device} 定位，支持 ${modes}。${pressureNote}；${humidifier}；${connectivity}。`
})

const sellingCards = computed(() => {
  const cards = []
  const deviceLabel = product.value.deviceType === 'PAP_SLEEP'
    ? '睡眠PAP'
    : product.value.deviceType === 'NIV_HOME'
      ? '家用NIV'
      : product.value.deviceType === 'PAP_TRAVEL'
        ? '便携PAP'
        : product.value.type
  cards.push({
    title: '定位与人群',
    description: `设备定位：${deviceLabel}；适用场景以${product.value.type || '睡眠/通气'}为主。`,
  })
  const scenarios = product.value.scenarioTags?.length ? product.value.scenarioTags.join(' / ') : '家庭/临床通用'
  cards.push({
    title: '应用场景',
    description: `重点覆盖：${scenarios}。`,
  })
  const comfort = [
    product.value.humidifier ? `湿化：${product.value.humidifier}` : '湿化待补充',
    product.value.heatedTube ? `加温管路：${product.value.heatedTube}` : '加温管路待补充',
    product.value.noiseDb ? `噪音：${product.value.noiseDb}` : '噪音待补充',
  ].join('；')
  cards.push({
    title: '舒适度与静音',
    description: comfort,
  })
  const dataNote = product.value.connectivity?.length
    ? `数据连接：${product.value.connectivity.join(' / ')}`
    : '数据连接待补充'
  cards.push({
    title: '随访与数据',
    description: dataNote,
  })
  return cards
})

const plainSummary = computed(() => {
  const tags = product.value.scenarioTags?.length ? product.value.scenarioTags.slice(0, 3).join('、') : '日常使用'
  const comfort = product.value.humidifier ? '带湿化更舒适' : '舒适性依赖面罩与设置'
  return `适合 ${tags} 场景，重点是佩戴舒适与参数匹配；${comfort}，长期使用更稳定。`
})

const evidenceNotes = computed(() => {
  const notes = ['资料基于公开参数与常见使用场景整理。']
  if (product.value.type.includes('双水平')) {
    notes.push('强调通气支持与参数匹配，需结合临床评估。')
  } else {
    notes.push('更适合常见场景，重点关注依从性与舒适度。')
  }
  if (product.value.specs?.['噪音水平']) {
    notes.push(`噪音指标：${product.value.specs['噪音水平']}。`)
  }
  if (product.value.specs?.['压力范围']) {
    notes.push(`压力范围：${product.value.specs['压力范围']}。`)
  }
  return notes
})

const evidenceGuidelines = computed(() => {
  return [
    '资料等级 A：来源充足，参数与场景描述完整。',
    '资料等级 B：信息较全，关键参数可能仍有缺口。',
    '资料等级 C：以目录级信息为主，需进一步核验。',
  ]
})

const longformContent = computed(() => {
  const device = product.value.deviceType === 'PAP_SLEEP'
    ? '睡眠PAP'
    : product.value.deviceType === 'NIV_HOME'
      ? '家用NIV'
      : product.value.deviceType === 'PAP_TRAVEL'
        ? '便携PAP'
        : product.value.type
  const diseaseLabels = (product.value.suitableFor || []).map(getDiseaseLabel)
  const diseaseLine = diseaseLabels.length ? diseaseLabels.join('、') : '未标注'
  const scenarioLine = product.value.scenarioTags?.length ? product.value.scenarioTags.join(' / ') : '日常通气'
  const specsTable = [
    '| 维度 | 参数 |',
    '| --- | --- |',
    ...keySpecs.value.map(item => `| ${item.label} | ${item.value || '—'} |`),
  ].join('\\n')
  const indications = (product.value.clinicalIndications?.length
    ? product.value.clinicalIndications
    : recommendedPeople.value.length
      ? recommendedPeople.value
      : ['需要睡眠呼吸支持的人群']
  ).map(item => `- ${item}`)
  const cautions = cautionList.value.length
    ? cautionList.value.map(item => `- ${item}`)
    : ['- 需在专业指导下调整关键参数']
  const contraindications = (product.value.contraindications?.length
    ? product.value.contraindications
    : product.value.asv
      ? ['涉及 ASV 等高风险模式，需严格适应证与随访。']
      : []
  ).map(item => `- ${item}`)
  const monitoringFocus = [
    '- 监测 AHI/漏气/使用时长趋势，关注连续变化。',
    '- 如出现夜间憋醒或低氧，建议复核压力范围与面罩密封。',
  ]
  const followupPlan = [
    '- 适应期：前 1-2 周以舒适度与面罩贴合为主。',
    '- 稳定期：结合数据与症状每 2-4 周微调。',
  ]
  const monitoringNotes = (product.value.monitoringNotes?.length
    ? product.value.monitoringNotes
    : monitoringFocus.map(item => item.replace(/^- /, ''))
  ).map(item => `- ${item}`)
  const followupNotes = (product.value.followupNotes?.length
    ? product.value.followupNotes
    : followupPlan.map(item => item.replace(/^- /, ''))
  ).map(item => `- ${item}`)
  const evidenceSummaries = (product.value.evidenceSummaries?.length
    ? product.value.evidenceSummaries
    : [
      '当前条目以公开参数与常见使用建议整理，尚未引入型号级临床结论。',
      '建议结合随访数据与医嘱进行个体化调整。',
    ]
  ).map(item => `- ${item}`)
  const evidenceLevel = infoLabel.value.replace('资料等级 ', '')
  const sourceLines: string[] = []
  if (product.value.evidenceSources?.length) {
    sourceLines.push(
      ...product.value.evidenceSources.map(source =>
        `- ${source.title}（${source.org}${source.date ? `，${source.date}` : ''}${source.url ? `）：${source.url}` : '）'}`
      )
    )
  }
  if (product.value.specs?.['官方页面']) {
    sourceLines.push(`- 官方页面：${product.value.specs['官方页面']}`)
  }
  if (product.value.sourcePaths?.length) {
    sourceLines.push(...product.value.sourcePaths.map(path => `- 内部资料路径：${path}`))
  }
  if (!sourceLines.length) {
    sourceLines.push('- 暂无可公开引用来源，建议补充官方页面或说明书。')
  }
  const modeSummary = visibleModeTags.value.length ? visibleModeTags.value.join(' / ') : '基础模式'
  const scenarios = product.value.scenarioTags?.length ? product.value.scenarioTags.slice(0, 3).join(' / ') : '日常通气'
  const dataNote = product.value.sourceTypes?.length
    ? `资料来源类型：${product.value.sourceTypes.join(' / ')}。`
    : '资料来源类型：公开参数与目录信息为主。'
  const missingFields: string[] = []
  if (!product.value.epapMin && !product.value.epapMax && !product.value.ipapMin && !product.value.ipapMax) {
    missingFields.push('压力范围')
  }
  if (!product.value.humidifier) missingFields.push('湿化配置')
  if (!product.value.heatedTube) missingFields.push('加热管')
  if (!product.value.noiseDb) missingFields.push('噪音水平')
  if (!product.value.weightKg) missingFields.push('重量')
  if (!product.value.connectivity?.length) missingFields.push('数据连接方式')
  return [
    '## 产品定位与适用场景',
    `${product.value.name} 定位为${device}，以 ${modeSummary} 为主，重点覆盖 ${scenarios} 场景。适用人群以 ${audienceLabel.value} 为主。`,
    `适用疾病：${diseaseLine}；使用场景：${scenarioLine}。`,
    '',
    '## 适用人群',
    ...indications,
    '',
    '## 适应证与禁忌/慎用提示',
    '- 本节为通用提示，需结合临床评估与医嘱。',
    '- 参数调整与模式切换需在专业指导下进行。',
    ...cautions,
    ...(contraindications.length ? contraindications : ['- 未收录明确禁忌证，需结合患者基础疾病评估。']),
    '',
    '## 资料等级与可靠性',
    `资料等级：${evidenceLevel}。`,
    dataNote,
    '',
    '## 证据摘要',
    ...evidenceSummaries,
    '',
    '## 核心参数摘要',
    specsTable,
    ...(missingFields.length ? ['', '## 信息缺口提示', `- 仍需补充：${missingFields.join('、')}。`] : []),
    '',
    '## 临床与使用要点',
    '- 选型优先级：模式匹配 > 压力范围 > 舒适配置。',
    '- 面罩适配与湿化设置决定依从性。',
    '',
    '## 监测指标与随访建议',
    ...monitoringNotes,
    ...followupNotes,
    '',
    '## 资料与参考',
    ...sourceLines,
    '',
    '## 版本与合规提示',
    '- 不同批次或地区版本可能存在参数差异，请以铭牌与官方资料为准。',
    '',
    '## 风险与合规提示',
    '- 二手/翻新渠道需关注版本差异与耗材安全。',
    '- 本页面为资料整理，不替代临床诊断与个体化处方。',
  ].join('\\n')
})

const authorityReferences = computed(() => {
  if (product.value.specs?.['官方页面']) {
    return ['官方页面', '公开产品资料']
  }
  if (product.value.type.includes('双水平')) {
    return ['双水平通气常规资料', '公开参数对比']
  }
  return ['公开参数资料', '常见使用建议']
})

const authoritySummaries = computed(() => {
  if (product.value.type.includes('双水平')) {
    return [
      '关注 IPAP/EPAP 配置与同步性设置。',
      '漏气控制与面罩匹配是关键体验因素。',
    ]
  }
  return [
    '适合以依从性与舒适度为核心的日常使用场景。',
    '建议结合随访数据进行参数优化。',
  ]
})


const getDiseaseLabel = (disease: string) => {
  const labels: Record<string, string> = {
    sleep_apnea: '睡眠呼吸暂停',
    copd: '慢性阻塞性肺疾病',
    neuromuscular: '神经肌肉疾病',
    heart_failure: '心力衰竭',
    ohs: '肥胖低通气',
    csa: '中枢性睡眠呼吸暂停',
    uars: '上气道阻力综合征',
  }
  return labels[disease] || disease
}

const handleBuy = () => {
  ElMessage.info('购买功能开发中...')
}

const addToCompare = () => {
  if (isInCompare.value) {
    compareList.value = compareList.value.filter(id => id !== product.value.id)
    ElMessage.success('已从对比中移除')
  } else {
    if (compareList.value.length >= 4) {
      ElMessage.warning('最多可同时对比4个产品')
      return
    }
    compareList.value.push(product.value.id)
    ElMessage.success('已添加到对比')
  }
  saveToStorage('compare-ids', compareList.value)
}

const goToDisease = (id: number) => {
  if (!id) return
  router.push(`/disease/${id}`)
}

const goToTutorial = (id: number) => {
  if (!id) return
  router.push(`/tutorial/${id}`)
}

const goToProduct = (id: number) => {
  if (!id) return
  router.push(`/product/${id}`)
}

const goToBrand = () => {
  if (!brandEntry.value) return
  router.push(`/brand/${brandEntry.value.id}`)
}
</script>

<style scoped>
.product-detail-page {
  padding: 20px;
}

.detail-container {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 30px;
  margin-top: 20px;
}

.left-section {
  position: sticky;
  top: 100px;
}

.product-image {
  width: 100%;
  aspect-ratio: 1;
  background: #f5f7fa;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 20px;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-weight: 600;
  background: linear-gradient(135deg, #e5e7eb 0%, #f3f4f6 100%);
}

.basic-info {
  margin-bottom: 20px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #303133;
}

.value {
  color: #606266;
}

.price {
  font-size: 24px;
  color: #f56c6c;
  font-weight: bold;
}

.price-note {
  margin: 6px 0 14px;
  color: #909399;
  font-size: 13px;
}

.count {
  margin-left: 10px;
  color: #909399;
}

.buy-btn {
  width: 100%;
  margin-top: 20px;
  height: 40px;
}

.right-section h1 {
  font-size: 28px;
  margin-bottom: 10px;
  color: #303133;
}

.description {
  color: #606266;
  line-height: 1.6;
  margin-bottom: 20px;
}

.one-liner {
  margin: -10px 0 16px;
  color: #475569;
  font-size: 14px;
}

.model-block {
  margin-bottom: 20px;
}

.key-specs-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px 20px;
}

.key-spec-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
}

.key-spec-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.key-spec-value {
  font-size: 14px;
  color: #1f2937;
}

.block-row {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 16px 24px;
}

.block-row h4 {
  margin: 6px 0;
  font-size: 14px;
}

.block-row p {
  margin: 0 0 8px;
  color: #475569;
}

.block-caution {
  margin-top: 12px;
  background: #fff7ed;
  border-radius: 8px;
  padding: 10px 12px;
}

.block-caution ul {
  padding-left: 18px;
  color: #9a3412;
}

.knowledge-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 12px 0 20px;
}

.dual-summary {
  margin: 16px 0 24px;
}

.page-header {
  margin-bottom: 16px;
}

.page-header.handbook {
  padding: 24px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-label {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 6px;
}

.page-header h1 {
  font-size: 28px;
  margin-bottom: 6px;
  color: #1f2937;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
}

.diagram-frame {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  overflow-x: auto;
}

@media (max-width: 900px) {
  .header-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

.summary-card {
  min-height: 120px;
}

.summary-card.plain {
  background: #f8fafc;
}

.evidence-card {
  margin: 16px 0 24px;
}

.evidence-card ul {
  padding-left: 18px;
  color: #475569;
}

.suitable-diseases {
  margin-bottom: 30px;
}

.suitable-diseases h3 {
  margin-bottom: 10px;
  font-size: 16px;
}

.suitable-diseases .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.data-profile {
  margin-bottom: 30px;
}

.profile-row {
  display: grid;
  gap: 10px;
}

.profile-note {
  font-size: 12px;
  color: #64748b;
}

.profile-tags {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.scenario-section,
.mode-section {
  margin-bottom: 30px;
}

.alias-section {
  margin-bottom: 30px;
}

.alias-section .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.platform-siblings {
  margin-bottom: 30px;
}

.platform-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.structured-section {
  margin-bottom: 30px;
}

.structured-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px 20px;
}

.structured-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
}

.structured-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.structured-value {
  font-size: 14px;
  color: #1f2937;
}

.channel-section {
  margin-bottom: 30px;
}

.longform-card {
  margin-bottom: 30px;
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

.channel-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px 20px;
}

.channel-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
}

.channel-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.channel-value {
  font-size: 14px;
  color: #1f2937;
}

.platform-section {
  margin-bottom: 30px;
}

.platform-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(180px, 1fr));
  gap: 12px 20px;
}

.platform-item {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px 12px;
}

.platform-label {
  font-size: 12px;
  color: #64748b;
  display: block;
  margin-bottom: 4px;
}

.platform-value {
  font-size: 14px;
  color: #1f2937;
}

.scenario-section .el-tag,
.mode-section .el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.highlights-section {
  margin-bottom: 30px;
}

.highlights-section h3 {
  margin-bottom: 15px;
  font-size: 16px;
}

.selling-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  margin-top: 10px;
}

.selling-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fafb;
}

.selling-title {
  font-weight: 600;
  margin-bottom: 6px;
  color: #111827;
}

.selling-desc {
  color: #4b5563;
  font-size: 13px;
  line-height: 1.6;
}

.evidence-list {
  padding-left: 18px;
  color: #475569;
}

.evidence-sources {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.evidence-summary {
  margin-top: 12px;
}

.evidence-summary ul {
  padding-left: 18px;
  color: #475569;
}

.source-paths {
  margin-top: 12px;
  color: #606266;
}

.source-paths ul {
  padding-left: 18px;
}

.highlight-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: #f5f7fa;
  border-radius: 4px;
  color: #303133;
}

.highlight-item .highlight-icon {
  color: #67c23a;
  font-size: 18px;
}

.detail-tabs {
  margin-bottom: 30px;
}

.specs-table {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.spec-row {
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #eee;
  background: #f5f7fa;
  border-radius: 4px;
}

.spec-label {
  font-weight: 600;
  color: #303133;
}

.spec-value {
  color: #606266;
}

.advantages-list,
.disadvantages-list {
  list-style: none;
  padding: 0;
}

.advantages-list li,
.disadvantages-list li {
  display: flex;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.advantages-list .advantage-icon {
  color: #67c23a;
}

.disadvantages-list .disadvantage-icon {
  color: #f56c6c;
}

.reviews-section {
  padding: 20px 0;
}

.review-item {
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 20px;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 10px;
}

.author {
  font-weight: 600;
}

.date {
  color: #909399;
  font-size: 12px;
}

.review-item h4 {
  margin: 10px 0;
}

.review-item p {
  color: #606266;
  line-height: 1.6;
}

.review-footer {
  margin-top: 10px;
}

.write-review-btn {
  width: 100%;
}

.compare-section {
  margin-top: 20px;
}

.related-section {
  margin-top: 32px;
}

.gallery-section {
  margin-top: 32px;
}

.gallery-item {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e4e7ed;
  background: #fff;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-block {
  margin-top: 16px;
}

.related-card {
  cursor: pointer;
  min-height: 160px;
}

.related-desc {
  color: #606266;
  font-size: 13px;
  margin: 8px 0;
}

@media (max-width: 1024px) {
  .detail-container {
    grid-template-columns: 1fr;
  }

  .left-section {
    position: relative;
    top: 0;
  }

  .specs-table {
    grid-template-columns: 1fr;
  }
}
</style>
