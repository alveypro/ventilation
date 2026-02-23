<template>
  <div class="products-page">
    <div class="page-header handbook">
      <p class="header-label">机型库</p>
      <h1>机型库</h1>
      <p>机型参数筛选与对比。</p>
    </div>
    <ContentMeta
      title="页面定位与使用边界"
      summary="此页用于初筛与对比，不替代医生诊断与参数处方。优先用“场景筛选 + 指标解读 + 决策流程”缩小范围。"
      :items="productPageMetaItems"
      source="机型库结构化数据 + 爬虫快照 + 平台规则"
      updated-at="2026-02-22"
      action-text="先做智能评估"
      action-to="/selector"
    />

    <section class="decision-flow">
      <h2>5步决策流</h2>
      <p class="section-note">先判断适应证和风险，再看预算与品牌，减少“只看价格”的误选。</p>
      <div class="flow-grid">
        <el-card v-for="(item, index) in decisionFlowCards" :key="item.title" shadow="hover" class="flow-card">
          <span class="flow-index">0{{ index + 1 }}</span>
          <h4>{{ item.title }}</h4>
          <p>{{ item.detail }}</p>
        </el-card>
      </div>
    </section>


    <section class="scenario-filter">
      <h2>场景化快速筛选</h2>
      <p class="section-note">先选场景，再看参数。点击即可应用筛选条件。</p>
      <div class="scenario-chip-grid">
        <el-button
          v-for="item in scenarioFilters"
          :key="item.key"
          :type="scenarioSelected === item.key ? 'primary' : 'default'"
          plain
          @click="applyScenarioFilter(item)"
        >
          {{ item.label }}
        </el-button>
        <el-button v-if="scenarioSelected" text type="primary" @click="clearScenarioFilter">清除场景筛选</el-button>
      </div>
    </section>

    <section class="metric-explain">
      <h2>关键指标解读</h2>
      <div class="metric-grid">
        <el-card v-for="item in indicatorCards" :key="item.title" shadow="hover" class="metric-explain-card">
          <div class="metric-icon">{{ item.icon }}</div>
          <div>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
            <el-button text type="primary" @click="goTo(item.path)">查看说明 →</el-button>
          </div>
        </el-card>
      </div>
      <div class="chart-grid">
        <el-card shadow="hover" class="chart-card">
          <h4>核心指标可视化</h4>
          <div class="segmented-chart" v-for="item in indicatorChart" :key="item.label">
            <div class="chart-row-header">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-note">{{ item.note }}</span>
            </div>
            <div class="segment-track">
              <div
                v-for="segment in item.segments"
                :key="segment.label"
                class="segment"
                :class="segment.tone"
                :style="{ width: segment.width + '%' }"
              >
                <span class="segment-label">{{ segment.label }}</span>
              </div>
              <div
                v-for="tick in item.ticks"
                :key="tick.label"
                class="threshold"
                :style="{ left: tick.position + '%' }"
              >
                <span class="threshold-label">{{ tick.label }}</span>
              </div>
            </div>
          </div>
        </el-card>
        <el-card shadow="hover" class="chart-card">
          <h4>参数标准速览</h4>
          <div class="segmented-chart" v-for="item in parameterStandards" :key="item.label">
            <div class="chart-row-header">
              <span class="bar-label">{{ item.label }}</span>
              <span class="bar-note">{{ item.note }}</span>
            </div>
            <div class="segment-track">
              <div
                v-for="segment in item.segments"
                :key="segment.label"
                class="segment"
                :class="segment.tone"
                :style="{ width: segment.width + '%' }"
              >
                <span class="segment-label">{{ segment.label }}</span>
              </div>
              <div
                v-for="tick in item.ticks"
                :key="tick.label"
                class="threshold"
                :style="{ left: tick.position + '%' }"
              >
                <span class="threshold-label">{{ tick.label }}</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </section>
    <el-card class="filters">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.brand" placeholder="选择品牌" clearable>
            <el-option v-for="brand in brandOptions" :key="brand" :label="brand" :value="brand" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.type" placeholder="选择类型" clearable>
            <el-option v-for="type in typeOptions" :key="type" :label="type" :value="type" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.deviceType" placeholder="设备类型" clearable>
            <el-option label="睡眠PAP" value="PAP_SLEEP" />
            <el-option label="家用NIV" value="NIV_HOME" />
            <el-option label="便携/旅行" value="PAP_TRAVEL" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.series" placeholder="系列/平台" clearable>
            <el-option v-for="series in seriesOptions" :key="series" :label="series" :value="series" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" class="filter-row">
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.sort" placeholder="排序方式">
            <el-option label="智能优先" value="smart" />
            <el-option label="评分最高" value="rating" />
            <el-option label="评价最多" value="reviews" />
            <el-option label="资料完整度" value="completeness" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.completenessMin" placeholder="完整度筛选">
            <el-option label="不限" :value="0" />
            <el-option label="≥60%" :value="60" />
            <el-option label="≥75%" :value="75" />
            <el-option label="≥85%" :value="85" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.status" placeholder="上市状态" clearable>
            <el-option label="在售" value="在售" />
            <el-option label="停产" value="停产" />
            <el-option label="不明" value="不明" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-select v-model="draftFilters.modeTag" placeholder="通气模式" clearable>
            <el-option v-for="mode in modeOptions" :key="mode" :label="mode" :value="mode" />
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="12" :md="6">
          <el-input v-model="draftFilters.search" placeholder="搜索产品名称/品牌..." clearable />
        </el-col>
      </el-row>
      <div class="filter-actions">
        <span class="result-count">共找到 {{ displayedProducts.length }} 个产品</span>
        <div class="filter-right">
          <el-checkbox v-model="draftFilters.sourceOnly">只看资料提炼</el-checkbox>
          <el-checkbox v-model="draftFilters.officialImage">只看官方图</el-checkbox>
          <el-checkbox v-model="draftFilters.officialPage">只看官方页</el-checkbox>
          <el-tag v-if="isDirty" type="warning" size="small">预览中</el-tag>
          <el-button size="small" type="primary" :disabled="!isDirty" @click="applyFilters">确认筛选</el-button>
          <el-button size="small" :disabled="!isDirty" @click="cancelPreview">取消预览</el-button>
          <el-button size="small" @click="resetFilters">重置筛选</el-button>
        </div>
      </div>
    </el-card>

    <el-card v-if="appliedSummary.length" class="applied-summary">
      <div class="summary-header">
        <span>已应用筛选</span>
        <el-button size="small" text @click="resetFilters">清空</el-button>
      </div>
      <div class="summary-tags">
        <el-tag v-for="item in appliedSummary" :key="item" size="small" type="info">{{ item }}</el-tag>
      </div>
    </el-card>

    <section class="guide-section">
      <h2>选购与评估提示</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="tip in buyingTips" :key="tip.title">
          <el-card shadow="hover" class="tip-card">
            <div class="tip-icon">{{ tip.icon }}</div>
            <div>
              <h4>{{ tip.title }}</h4>
              <p>{{ tip.description }}</p>
              <ul>
                <li v-for="item in tip.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="guide-section">
      <h2>关键参数解读</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="metric-card">
            <h4>核心指标</h4>
            <ul>
              <li v-for="item in keyMetrics" :key="item.label">
                <strong>{{ item.label }}</strong>：{{ item.detail }}
              </li>
            </ul>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="metric-card">
            <h4>选机决策顺序</h4>
            <ol>
              <li v-for="item in decisionSteps" :key="item">{{ item }}</li>
            </ol>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <section class="guide-section crawler-section">
      <div class="section-header">
        <h2>爬虫呼吸机数据库</h2>
        <el-tag size="small" type="success">自动读取 /data/respirators</el-tag>
      </div>
      <ContentMeta
        title="抓取数据说明"
        summary="抓取结果用于价格和型号发现，最终决策请以官方参数页、说明书和临床建议为准。"
        :items="crawlerMetaItems"
        :updated-at="marketGeneratedAt || '未检测到更新时间'"
      />
      <p class="crawler-hint">当前展示国产与进口机型快照，可作为选机初筛参考。</p>
      <el-alert
        v-if="crawlerError"
        type="warning"
        :closable="false"
        show-icon
        :title="crawlerError"
      />
      <el-row v-if="crawlerLoading" :gutter="20">
        <el-col :xs="24" :md="12"><el-skeleton :rows="6" /></el-col>
        <el-col :xs="24" :md="12"><el-skeleton :rows="6" /></el-col>
      </el-row>
      <el-row v-else :gutter="20">
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="crawler-card">
            <template #header>
              <div class="crawler-head">
                <span>国产机型</span>
                <el-tag size="small">{{ domesticDevices.length }} 条</el-tag>
              </div>
            </template>
            <el-empty v-if="!domesticDevices.length" description="暂无数据" />
            <el-table v-else :data="domesticDevices.slice(0, 8)" size="small" stripe>
              <el-table-column prop="brand" label="品牌" min-width="90" />
              <el-table-column prop="model" label="型号" min-width="150" />
              <el-table-column prop="pressureRange" label="压力范围" min-width="110" />
              <el-table-column prop="price" label="价格" min-width="100" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :xs="24" :md="12">
          <el-card shadow="hover" class="crawler-card">
            <template #header>
              <div class="crawler-head">
                <span>进口机型</span>
                <el-tag size="small" type="warning">{{ importedDevices.length }} 条</el-tag>
              </div>
            </template>
            <el-empty v-if="!importedDevices.length" description="暂无数据" />
            <el-table v-else :data="importedDevices.slice(0, 8)" size="small" stripe>
              <el-table-column prop="brand" label="品牌" min-width="90" />
              <el-table-column prop="model" label="型号" min-width="150" />
              <el-table-column prop="pressureRange" label="压力范围" min-width="110" />
              <el-table-column prop="price" label="价格" min-width="100" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <el-card v-if="parameterNotes.length" class="parameter-card">
        <template #header>
          <strong>教学参数说明</strong>
        </template>
        <ul>
          <li v-for="item in parameterNotes" :key="item.name">
            <strong>{{ item.name }}</strong>：{{ item.detail }}
          </li>
        </ul>
      </el-card>
      <el-card class="parameter-card">
        <template #header>
          <div class="crawler-head">
            <strong>市场实时抓取（淘宝/天猫）</strong>
            <el-tag v-if="marketGeneratedAt" size="small" type="info">更新时间 {{ marketGeneratedAt }}</el-tag>
          </div>
        </template>
        <el-empty v-if="!marketPlatforms.length" description="暂无市场抓取结果" />
        <div v-else>
          <el-tabs v-model="activeMarketPlatform" class="market-tabs">
            <el-tab-pane
              v-for="item in marketPlatforms"
              :key="item.platform"
              :label="`${item.platform} (${item.count})`"
              :name="item.platform"
            />
          </el-tabs>
          <div v-if="activeMarketData" class="market-panel">
            <div class="market-meta">
              <el-tag :type="activeMarketData.status === 'ok' ? 'success' : 'warning'" size="small">
                状态：{{ activeMarketData.status }}
              </el-tag>
              <el-tag size="small">抓取条数：{{ activeMarketData.count }}</el-tag>
              <el-tag size="small" type="info">抓取页数：{{ activeMarketData.pages }}</el-tag>
            </div>
            <el-empty v-if="!marketPagedOffers.length" description="该平台暂无抓取结果" />
            <el-table v-else :data="marketPagedOffers" size="small" stripe>
              <el-table-column prop="title" label="商品" min-width="260" show-overflow-tooltip />
              <el-table-column prop="price" label="价格" min-width="110" />
            </el-table>
            <div class="market-pagination" v-if="marketTotal > marketPerPage">
              <el-pagination
                background
                v-model:current-page="marketPage"
                :page-size="marketPerPage"
                :total="marketTotal"
                layout="prev, pager, next, jumper"
              />
            </div>
          </div>
        </div>
      </el-card>
    </section>

    <section class="guide-section">
      <h2>选机避坑清单</h2>
      <div class="pitfall-grid">
        <el-card v-for="item in pitfallChecklist" :key="item.title" shadow="hover" class="pitfall-card">
          <h4>{{ item.title }}</h4>
          <p class="pitfall-risk">风险：{{ item.risk }}</p>
          <p class="pitfall-action">建议：{{ item.action }}</p>
        </el-card>
      </div>
    </section>

    <section class="guide-section">
      <h2>按使用阶段给建议</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :md="8" v-for="item in stageGuidance" :key="item.stage">
          <el-card shadow="hover" class="tip-card">
            <h4>{{ item.stage }}</h4>
            <p>{{ item.summary }}</p>
            <ul>
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
          </el-card>
        </el-col>
      </el-row>
    </section>

    <div class="source-section" v-if="showSourceSection && sourceProducts.length">
      <div class="section-header">
        <h2>资料提炼产品</h2>
        <el-button size="small" type="primary" plain @click="applySourceFilter">查看全部</el-button>
      </div>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in sourceProducts.slice(0, 8)" :key="product.id">
          <ProductCard
            :product="product"
            :show-compare="true"
            :compare-checked="compareIds.includes(product.id)"
            @click="goToProduct(product.id)"
            @detail="goToProduct(product.id)"
            @toggleCompare="onToggleCompare"
          />
        </el-col>
      </el-row>
    </div>

    <el-row v-if="isLoading" :gutter="20" class="products-grid">
      <el-col :xs="24" :sm="12" :md="6" v-for="i in 8" :key="i">
        <el-skeleton :rows="5" />
      </el-col>
    </el-row>

    <el-row v-else :gutter="20" class="products-grid">
        <el-col :xs="24" :sm="12" :md="6" v-for="product in pagedProducts" :key="product.id">
          <ProductCard
            :product="product"
            :show-compare="true"
            :compare-checked="compareIds.includes(product.id)"
            @click="goToProduct(product.id)"
            @detail="goToProduct(product.id)"
            @toggleCompare="onToggleCompare"
          />
        </el-col>
    </el-row>

    <el-empty v-if="!isLoading && displayedProducts.length === 0" description="没有匹配的产品" />
    <div class="compare-bar" v-if="compareIds.length">
        <span>已选 {{ compareIds.length }} 个用于对比</span>
      <el-button type="warning" size="small" @click="gotoCompare">前往对比</el-button>
      <el-button size="small" @click="clearCompare">清除</el-button>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <el-pagination
        background
        v-model:current-page="currentPage"
        :page-size="perPage"
        :total="displayedProducts.length"
        layout="prev, pager, next, jumper"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/ProductCard.vue'
import ContentMeta from '@/components/ContentMeta.vue'
import { fetchProducts } from '@/services/dataService'
import { loadFromStorage, saveToStorage } from '@/utils/storage'
import type { Product } from '@/types'

const router = useRouter()
const products = ref<Product[]>([])
const isLoading = ref(true)
type CrawlerDevice = {
  brand: string
  model: string
  price: string
  pressureRange: string
  features: string[]
}
type ParameterNote = {
  name: string
  detail: string
}
type MarketOffer = {
  title: string
  price: string
}
type MarketPlatform = {
  platform: string
  status: string
  count: number
  pages: number
  offers: MarketOffer[]
}
const crawlerLoading = ref(false)
const crawlerError = ref('')
const domesticDevices = ref<CrawlerDevice[]>([])
const importedDevices = ref<CrawlerDevice[]>([])
const parameterNotes = ref<ParameterNote[]>([])
const marketPlatforms = ref<MarketPlatform[]>([])
const marketGeneratedAt = ref('')
const activeMarketPlatform = ref('')
const marketPage = ref(1)
const marketPerPage = 10
const createDefaultFilters = () => ({
  brand: '',
  type: '',
  deviceType: '',
  series: '',
  modeTag: '',
  search: '',
  sort: 'smart',
  completenessMin: 0,
  status: '',
  sourceOnly: false,
  officialImage: false,
  officialPage: false,
})
const draftFilters = reactive(createDefaultFilters())
const appliedFilters = ref(createDefaultFilters())
const compareIds = ref<number[]>(loadFromStorage('compare-ids', []))
const currentPage = ref(1)
const perPage = ref(8)
const scenarioSelected = ref('')

onMounted(async () => {
  const [allProducts] = await Promise.all([
    fetchProducts(),
    loadCrawlerData(),
  ])
  products.value = allProducts
  isLoading.value = false
})

const asString = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const asStringArray = (value: unknown) => {
  if (!Array.isArray(value)) return []
  return value.map(item => (typeof item === 'string' ? item.trim() : '')).filter(Boolean)
}


type ProductFilters = ReturnType<typeof createDefaultFilters>

const scenarioFilters = [
  { key: 'osa_entry', label: 'OSA 入门/轻中度', filters: { deviceType: 'PAP_SLEEP', modeTag: 'CPAP', search: '' } },
  { key: 'osa_auto', label: '自动调压 APAP', filters: { deviceType: 'PAP_SLEEP', modeTag: 'APAP', search: '' } },
  { key: 'copd_niv', label: 'COPD / 家用NIV', filters: { deviceType: 'NIV_HOME', modeTag: '', search: '' } },
  { key: 'travel', label: '旅行便携', filters: { deviceType: 'PAP_TRAVEL', modeTag: '', search: 'mini' } },
]

const productPageMetaItems = [
  '先用场景筛选锁定设备类型，再看模式与压力范围。',
  'AHI、漏气、使用时长是连续观察指标，不看单点数据。',
  '若存在持续低氧或并发高风险，请先做专业评估。',
]

const decisionFlowCards = [
  { title: '识别疾病与风险', detail: '先确认 OSA / 通气不足 / 合并症，排除高危自调参数。' },
  { title: '选择设备路径', detail: 'PAP_SLEEP / NIV_HOME / PAP_TRAVEL 三类先分流。' },
  { title: '核对关键参数', detail: '模式、压力、漏气控制、数据能力必须满足场景。' },
  { title: '验证舒适依从', detail: '面罩、湿化、噪音会直接影响长期使用时长。' },
  { title: '评估长期成本', detail: '总成本 = 主机 + 耗材 + 售后 + 随访支持。' },
]

const crawlerMetaItems = [
  '抓取价格可能有延迟或活动波动，仅作区间参考。',
  '同型号不同渠道配置可能不同，需二次核验。',
  '建议在本页筛选后进入详情页核对参数来源。',
]

const indicatorCards = [
  { icon: '📉', title: 'AHI 指标', description: '核心目标通常是 AHI < 5/h 或较基线下降 ≥ 50%。', path: '/patient' },
  { icon: '🫧', title: '漏气控制', description: '漏气过大会影响算法判读与疗效。', path: '/user-knowledge' },
  { icon: '⏱️', title: '使用时长', description: '建议 ≥ 4 小时/晚，趋势比单晚重要。', path: '/patient' },
  { icon: '🩸', title: '低氧负荷', description: '关注 T90 与最低血氧，持续低氧需复诊。', path: '/clinical' },
]

const percent = (value: number, max: number) => Math.min(100, Math.max(0, (value / max) * 100))

const indicatorChart = [
  {
    label: 'AHI (次/小时)',
    note: '阈值线：5 / 15 / 30',
    segments: [
      { label: '0-5 正常', width: percent(5, 40), tone: 'tone-good' },
      { label: '5-15 轻度', width: percent(10, 40), tone: 'tone-mild' },
      { label: '15-30 中度', width: percent(15, 40), tone: 'tone-warn' },
      { label: '30+ 重度', width: percent(10, 40), tone: 'tone-risk' },
    ],
    ticks: [
      { label: '5', position: percent(5, 40) },
      { label: '15', position: percent(15, 40) },
      { label: '30', position: percent(30, 40) },
    ],
  },
  {
    label: '漏气 (L/min)',
    note: '阈值线：24 / 40',
    segments: [
      { label: '0-24 目标', width: percent(24, 60), tone: 'tone-good' },
      { label: '24-40 注意', width: percent(16, 60), tone: 'tone-warn' },
      { label: '40+ 高漏气', width: percent(20, 60), tone: 'tone-risk' },
    ],
    ticks: [
      { label: '24', position: percent(24, 60) },
      { label: '40', position: percent(40, 60) },
    ],
  },
  {
    label: '使用时长 (小时/晚)',
    note: '阈值线：2 / 4 / 6',
    segments: [
      { label: '0-2 不足', width: percent(2, 8), tone: 'tone-risk' },
      { label: '2-4 过渡', width: percent(2, 8), tone: 'tone-warn' },
      { label: '4-6 目标', width: percent(2, 8), tone: 'tone-good' },
      { label: '6-8 稳定', width: percent(2, 8), tone: 'tone-mild' },
    ],
    ticks: [
      { label: '2', position: percent(2, 8) },
      { label: '4', position: percent(4, 8) },
      { label: '6', position: percent(6, 8) },
    ],
  },
  {
    label: '最低血氧 (SpO₂%)',
    note: '阈值线：88 / 90 / 95',
    segments: [
      { label: '0-88 风险', width: percent(88, 100), tone: 'tone-risk' },
      { label: '88-90 边缘', width: percent(2, 100), tone: 'tone-warn' },
      { label: '90-95 可接受', width: percent(5, 100), tone: 'tone-mild' },
      { label: '95-100 理想', width: percent(5, 100), tone: 'tone-good' },
    ],
    ticks: [
      { label: '88', position: percent(88, 100) },
      { label: '90', position: percent(90, 100) },
      { label: '95', position: percent(95, 100) },
    ],
  },
]

const parameterStandards = [
  {
    label: '压力范围 (cmH₂O)',
    note: '阈值线：4 / 12 / 20',
    segments: [
      { label: '0-4 起始', width: percent(4, 25), tone: 'tone-neutral' },
      { label: '4-12 常用', width: percent(8, 25), tone: 'tone-mild' },
      { label: '12-20 中高压', width: percent(8, 25), tone: 'tone-warn' },
      { label: '20-25 高压', width: percent(5, 25), tone: 'tone-risk' },
    ],
    ticks: [
      { label: '4', position: percent(4, 25) },
      { label: '12', position: percent(12, 25) },
      { label: '20', position: percent(20, 25) },
    ],
  },
  {
    label: '湿化等级',
    note: '阈值线：2 / 4 / 6',
    segments: [
      { label: '0-2 低', width: percent(2, 8), tone: 'tone-neutral' },
      { label: '2-4 中', width: percent(2, 8), tone: 'tone-mild' },
      { label: '4-6 高', width: percent(2, 8), tone: 'tone-warn' },
      { label: '6-8 强', width: percent(2, 8), tone: 'tone-accent' },
    ],
    ticks: [
      { label: '2', position: percent(2, 8) },
      { label: '4', position: percent(4, 8) },
      { label: '6', position: percent(6, 8) },
    ],
  },
  {
    label: '噪音 (dB)',
    note: '阈值线：25 / 30 / 35',
    segments: [
      { label: '0-25 安静', width: percent(25, 40), tone: 'tone-good' },
      { label: '25-30 可接受', width: percent(5, 40), tone: 'tone-mild' },
      { label: '30-35 偏高', width: percent(5, 40), tone: 'tone-warn' },
      { label: '35-40 偏吵', width: percent(5, 40), tone: 'tone-risk' },
    ],
    ticks: [
      { label: '25', position: percent(25, 40) },
      { label: '30', position: percent(30, 40) },
      { label: '35', position: percent(35, 40) },
    ],
  },
  {
    label: '便携重量 (kg)',
    note: '阈值线：0.5 / 1.0 / 1.5',
    segments: [
      { label: '0-0.5 轻', width: percent(0.5, 2), tone: 'tone-good' },
      { label: '0.5-1.0 便携', width: percent(0.5, 2), tone: 'tone-mild' },
      { label: '1.0-1.5 中等', width: percent(0.5, 2), tone: 'tone-warn' },
      { label: '1.5-2.0 偏重', width: percent(0.5, 2), tone: 'tone-risk' },
    ],
    ticks: [
      { label: '0.5', position: percent(0.5, 2) },
      { label: '1.0', position: percent(1.0, 2) },
      { label: '1.5', position: percent(1.5, 2) },
    ],
  },
]
const normalizeDevice = (item: any): CrawlerDevice => {
  return {
    brand: asString(item?.brand) || '未知品牌',
    model: asString(item?.model) || '未知型号',
    price: asString(item?.price) || '-',
    pressureRange: asString(item?.pressure_range) || asString(item?.pressureRange) || '-',
    features: asStringArray(item?.features),
  }
}

const normalizeParameters = (raw: any): ParameterNote[] => {
  if (Array.isArray(raw)) {
    return raw.map((item: any) => ({
      name: asString(item?.name) || asString(item?.label) || '参数',
      detail: asString(item?.detail) || asString(item?.description) || asString(item?.range) || '-',
    }))
  }
  if (raw && typeof raw === 'object') {
    return Object.entries(raw).map(([name, value]) => ({
      name,
      detail: typeof value === 'string' ? value : JSON.stringify(value),
    }))
  }
  return []
}

const activeMarketData = computed(() => {
  if (!marketPlatforms.value.length) return null
  const found = marketPlatforms.value.find(item => item.platform === activeMarketPlatform.value)
  return found || marketPlatforms.value[0]
})

const marketTotal = computed(() => activeMarketData.value?.offers.length || 0)

const marketPagedOffers = computed(() => {
  const all = activeMarketData.value?.offers || []
  const start = (marketPage.value - 1) * marketPerPage
  return all.slice(start, start + marketPerPage)
})

const loadCrawlerData = async () => {
  crawlerLoading.value = true
  crawlerError.value = ''
  try {
    const dataBases = [
      'https://api.airivo.cn/data/respirators',
      '/data/respirators',
    ]
    let payload: { domestic: any; imported: any; params: any; market: any } | null = null
    for (const base of dataBases) {
      try {
        const ts = Date.now()
        const [domesticRes, importedRes, paramsRes, marketRes] = await Promise.all([
          fetch(`${base}/domestic.json?t=${ts}`, { cache: 'no-store' }),
          fetch(`${base}/imported.json?t=${ts}`, { cache: 'no-store' }),
          fetch(`${base}/parameters.json?t=${ts}`, { cache: 'no-store' }),
          fetch(`${base}/free_market_prices.json?t=${ts}`, { cache: 'no-store' }).catch(() => null),
        ])
        if (!domesticRes.ok || !importedRes.ok || !paramsRes.ok) continue
        payload = {
          domestic: await domesticRes.json(),
          imported: await importedRes.json(),
          params: await paramsRes.json(),
          market: marketRes && marketRes.ok ? await marketRes.json() : null,
        }
        break
      } catch {
        continue
      }
    }
    if (!payload) throw new Error('crawler data files not found')
    domesticDevices.value = Array.isArray(payload.domestic) ? payload.domestic.map(normalizeDevice) : []
    importedDevices.value = Array.isArray(payload.imported) ? payload.imported.map(normalizeDevice) : []
    parameterNotes.value = normalizeParameters(payload.params).slice(0, 12)
    const marketRaw = payload.market?.platforms && typeof payload.market.platforms === 'object'
      ? payload.market.platforms
      : {}
    marketPlatforms.value = Object.entries(marketRaw).map(([platform, detail]: [string, any]) => {
      const rawOffers = Array.isArray(detail?.offers) ? detail.offers : []
      return {
        platform,
        status: asString(detail?.status) || 'unknown',
        count: rawOffers.length,
        pages: Number(detail?.pages_crawled || 0),
        offers: rawOffers.map((offer: any) => ({
          title: asString(offer?.title) || '未知商品',
          price: Array.isArray(offer?.prices) && offer.prices.length ? asString(offer.prices[0]) : '-',
        })),
      }
    })
    if (!marketPlatforms.value.find(item => item.platform === activeMarketPlatform.value)) {
      activeMarketPlatform.value = marketPlatforms.value[0]?.platform || ''
      marketPage.value = 1
    }
    marketGeneratedAt.value = asString(payload.market?.generated_at)
  } catch (error) {
    crawlerError.value = '爬虫数据库尚未同步到站点，当前先展示内置机型库。'
  } finally {
    crawlerLoading.value = false
  }
}

const buyingTips = ref([
  {
    icon: '🧭',
    title: '先看适应证与场景',
    description: '不同人群优先看“适应证 + 低氧负荷”。',
    items: ['OSA 优先 CPAP/APAP', '通气不足优先 NIV', '出行场景关注便携性'],
  },
  {
    icon: '😴',
    title: '舒适度决定依从性',
    description: '面罩、湿化与噪音往往比价格更影响长期使用。',
    items: ['先选面罩再调参数', '湿化不足易鼻干', '噪音影响睡眠质量'],
  },
  {
    icon: '📈',
    title: '看长期成本',
    description: '耗材更换与售后支持决定总成本。',
    items: ['滤网/管路/面罩周期', '配件可获得性', '售后与随访能力'],
  },
])

const keyMetrics = ref([
  { label: '压力范围', detail: '覆盖阻塞与通气需求，范围过小会限制疗效。' },
  { label: '模式', detail: 'CPAP/APAP/BiPAP 适应证不同，需结合症状与评估。' },
  { label: '漏气控制', detail: '漏气过大会影响算法判读与疗效。' },
  { label: '数据能力', detail: '云端/SD 数据便于随访与复评。' },
])

const decisionSteps = ref([
  '确定疾病类型与严重度',
  '确认是否需要自动调压或双水平',
  '评估面罩与舒适配置',
  '确认数据能力与售后',
  '结合预算与长期成本',
])

const pitfallChecklist = ref([
  {
    title: '只看价格，不看模式和数据能力',
    risk: '短期省钱但长期可能疗效不足，复评成本更高。',
    action: '先确定模式需求，再比较长期维护成本。',
  },
  {
    title: '忽略面罩兼容与漏气控制',
    risk: '依从性下降，夜间频繁觉醒，疗效波动。',
    action: '优先验证面罩匹配，再做压力微调。',
  },
  {
    title: '参数范围卡得太死',
    risk: '场景变化时无法覆盖需求，导致治疗不足。',
    action: '结合评估结果预留合理压力区间。',
  },
  {
    title: '只看首购成本，忽略售后能力',
    risk: '耗材和维护不稳定，后续使用体验断层。',
    action: '将配件可得性和服务响应纳入决策。',
  },
])

const stageGuidance = ref([
  {
    stage: '第1-2周：适应期',
    summary: '重点是“戴得住”，不要急于追求参数激进优化。',
    points: ['优先处理压痕和漏气', '湿化按体感逐步调', '记录入睡与醒后状态'],
  },
  {
    stage: '第3-8周：稳定期',
    summary: '开始看数据趋势，关注症状改善与睡眠质量。',
    points: ['每周复盘关键指标', '识别高漏气时段', '结合白天状态评估疗效'],
  },
  {
    stage: '2个月后：优化期',
    summary: '围绕长期依从和并发风险做周期性复评。',
    points: ['复核模式与压力策略', '关注体重/病情变化', '建立长期耗材更换节奏'],
  },
])

const brandOptions = computed(() => {
  return Array.from(
    new Set(
      products.value
        .map(product => (product.brand || '').trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const typeOptions = computed(() => {
  return Array.from(
    new Set(
      products.value
        .map(product => (product.type || '').trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const seriesOptions = computed(() => {
  return Array.from(
    new Set(
      products.value
        .map(product => (product.series || '').trim())
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const modeOptions = computed(() => {
  const modes = products.value.flatMap(product => product.modeTags || [])
  return Array.from(new Set(modes)).sort((a, b) => a.localeCompare(b, 'zh-Hans-CN'))
})

const filterWith = (filters: ProductFilters) => {
  const keyword = filters.search.trim().toLowerCase()
  const tokens = keyword.split(/[\s,，。；;、/\\|]+/).filter(Boolean)
  let result = products.value.filter(product => {
    const matchesBrand = filters.brand ? product.brand === filters.brand : true
    const matchesType = filters.type ? product.type === filters.type : true
    const matchesDeviceType = filters.deviceType ? product.deviceType === filters.deviceType : true
    const matchesSeries = filters.series ? product.series === filters.series : true
    const matchesMode = filters.modeTag ? product.modeTags?.includes(filters.modeTag) : true
    const matchesStatus = filters.status ? product.status === filters.status : true
    const matchesSource = filters.sourceOnly
      ? Boolean(product.sourcePaths?.length) || product.tag === '资料'
      : true
    const matchesOfficialImage = filters.officialImage
      ? Boolean(product.image && product.image.startsWith('http'))
      : true
    const matchesOfficialPage = filters.officialPage
      ? Boolean(product.specs && product.specs['官方页面'])
      : true
    const matchesCompleteness = filters.completenessMin
      ? (product.dataCompleteness || 0) >= filters.completenessMin
      : true
    const searchTarget = [
      product.name,
      product.brand,
      product.series,
      product.platformFamily,
      (product.modeTags || []).join(' '),
      (product.aliasNames || []).join(' '),
      Object.values(product.specs || {}).join(' '),
    ].filter(Boolean).join(' ')
    const searchText = searchTarget.toLowerCase()
    const matchesSearch = tokens.length
      ? tokens.every(token => searchText.includes(token))
      : true
    return matchesBrand
      && matchesType
      && matchesDeviceType
      && matchesSeries
      && matchesMode
      && matchesStatus
      && matchesSearch
      && matchesSource
      && matchesOfficialImage
      && matchesOfficialPage
      && matchesCompleteness
  })

  const rankScore = (item: Product) => {
    let score = item.dataCompleteness || 0
    if (item.image && item.image.startsWith('http')) score += 20
    if (item.specs?.['官方页面']) score += 10
    if (item.epapMin || item.epapMax || item.ipapMax) score += 2
    return score
  }

  switch (filters.sort) {
    case 'smart':
      if (tokens.length) {
        const scoreSearch = (item: Product) => {
          const text = [
            item.name,
            item.brand,
            item.series,
            item.platformFamily,
            (item.modeTags || []).join(' '),
            (item.aliasNames || []).join(' '),
            Object.values(item.specs || {}).join(' '),
          ].filter(Boolean).join(' ').toLowerCase()
          return tokens.reduce((score, token) => (text.includes(token) ? score + 1 : score), 0)
        }
        result = result.slice().sort((a, b) => {
          const diff = scoreSearch(b) - scoreSearch(a)
          return diff !== 0 ? diff : rankScore(b) - rankScore(a)
        })
      } else {
        result = result.slice().sort((a, b) => rankScore(b) - rankScore(a))
      }
      break
    case 'rating':
      result = result.slice().sort((a, b) => b.rating - a.rating)
      break
    case 'reviews':
      result = result.slice().sort((a, b) => b.reviewCount - a.reviewCount)
      break
    case 'completeness':
      result = result.slice().sort((a, b) => (b.dataCompleteness || 0) - (a.dataCompleteness || 0))
      break
    default:
      result = result.slice().sort((a, b) => {
        const aOfficial = a.image && a.image.startsWith('http') ? 1 : 0
        const bOfficial = b.image && b.image.startsWith('http') ? 1 : 0
        if (aOfficial !== bOfficial) return bOfficial - aOfficial
        const aPage = a.specs?.['官方页面'] ? 1 : 0
        const bPage = b.specs?.['官方页面'] ? 1 : 0
        if (aPage !== bPage) return bPage - aPage
        const completenessDelta = (b.dataCompleteness || 0) - (a.dataCompleteness || 0)
        if (completenessDelta !== 0) return completenessDelta
        if (a.tag && !b.tag) return -1
        if (!a.tag && b.tag) return 1
        return b.rating - a.rating
      })
      break
  }

  return result
}

const filteredProducts = computed(() => filterWith(draftFilters))
const appliedProducts = computed(() => filterWith(appliedFilters.value))
const isDirty = computed(() => JSON.stringify(draftFilters) !== JSON.stringify(appliedFilters.value))
const displayedProducts = computed(() => (isDirty.value ? filteredProducts.value : appliedProducts.value))
const isDefaultApplied = computed(() => JSON.stringify(appliedFilters.value) === JSON.stringify(createDefaultFilters()))
const showSourceSection = computed(() => isDefaultApplied.value && !isDirty.value && !draftFilters.search.trim())

const appliedSummary = computed(() => {
  const items: string[] = []
  if (appliedFilters.value.brand) items.push(`品牌 ${appliedFilters.value.brand}`)
  if (appliedFilters.value.series) items.push(`系列 ${appliedFilters.value.series}`)
  if (appliedFilters.value.deviceType) {
    const label = appliedFilters.value.deviceType === 'PAP_SLEEP'
      ? '睡眠PAP'
      : appliedFilters.value.deviceType === 'NIV_HOME'
        ? '家用NIV'
        : '便携/旅行'
    items.push(`设备类型 ${label}`)
  }
  if (appliedFilters.value.modeTag) items.push(`模式 ${appliedFilters.value.modeTag}`)
  if (appliedFilters.value.status) items.push(`状态 ${appliedFilters.value.status}`)
  if (appliedFilters.value.completenessMin) items.push(`完整度 ≥${appliedFilters.value.completenessMin}%`)
  if (appliedFilters.value.officialImage) items.push('仅官方图')
  if (appliedFilters.value.officialPage) items.push('仅官方页')
  if (appliedFilters.value.sourceOnly) items.push('资料提炼')
  if (appliedFilters.value.search) items.push(`关键词 ${appliedFilters.value.search}`)
  return items
})

const sourceProducts = computed(() => {
  return products.value.filter(product => Boolean(product.sourcePaths?.length) || product.tag === '资料')
})

const totalPages = computed(() => Math.max(1, Math.ceil(displayedProducts.value.length / perPage.value)))

const pagedProducts = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return displayedProducts.value.slice(start, start + perPage.value)
})

const onToggleCompare = (id: number, checked: boolean) => {
  if (checked) {
    if (compareIds.value.length >= 4 && !compareIds.value.includes(id)) {
      ElMessage.warning('最多同时对比 4 个机型')
      return
    }
    if (!compareIds.value.includes(id)) compareIds.value.push(id)
  } else {
    compareIds.value = compareIds.value.filter(i => i !== id)
  }
}

const gotoCompare = () => {
  if (compareIds.value.length < 2) return
  // navigate to compare page and pre-select via query
  const q = compareIds.value.join(',')
  router.push({ path: '/compare', query: { ids: q } })
}

const clearCompare = () => { compareIds.value = [] }

watch(compareIds, () => {
  saveToStorage('compare-ids', compareIds.value)
}, { deep: true })

watch(activeMarketPlatform, () => {
  marketPage.value = 1
})

watch(displayedProducts, (list) => {
  if (!list.length) {
    currentPage.value = 1
    return
  }
  if (currentPage.value > totalPages.value) {
    currentPage.value = totalPages.value
  }
})

watch(products, (list) => {
  const validIds = new Set(list.map(item => item.id))
  compareIds.value = compareIds.value.filter(id => validIds.has(id))
})

const resetFilters = () => {
  Object.assign(draftFilters, createDefaultFilters())
  appliedFilters.value = createDefaultFilters()
  currentPage.value = 1
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const goTo = (path: string) => {
  router.push(path)
}

const applyScenarioFilter = (item: { key: string; filters: Record<string, unknown> }) => {
  scenarioSelected.value = item.key
  Object.assign(draftFilters, createDefaultFilters(), item.filters)
  appliedFilters.value = { ...draftFilters }
  currentPage.value = 1
}

const clearScenarioFilter = () => {
  scenarioSelected.value = ''
  Object.assign(draftFilters, createDefaultFilters())
  appliedFilters.value = createDefaultFilters()
  currentPage.value = 1
}

const applySourceFilter = () => {
  draftFilters.sourceOnly = true
  appliedFilters.value = { ...draftFilters }
  currentPage.value = 1
}

const applyFilters = () => {
  appliedFilters.value = { ...draftFilters }
  currentPage.value = 1
}

const cancelPreview = () => {
  Object.assign(draftFilters, appliedFilters.value)
}
</script>

<style scoped>
.products-page {
  padding: 20px 0;
}

.page-header {
  margin-bottom: 30px;
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

.decision-flow {
  margin: 18px 0 24px;
}

.decision-flow h2,
.scenario-filter h2,
.metric-explain h2,
.guide-section h2 {
  font-size: 24px;
  color: #0f172a;
}

.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 10px;
}

.flow-card {
  position: relative;
  border: 1px solid #e2e8f0;
}

.flow-card h4 {
  margin: 8px 0 6px;
  color: #1e293b;
}

.flow-card p {
  margin: 0;
  color: #64748b;
  line-height: 1.6;
  font-size: 13px;
}

.flow-index {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  color: #1d4ed8;
}

.filters {
  margin-bottom: 30px;
}

.filter-row {
  margin-top: 12px;
}

.applied-summary {
  margin: 12px 0 20px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  color: #64748b;
  font-size: 13px;
}

.summary-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.filter-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  color: #909399;
}

.filter-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-section {
  margin-bottom: 30px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.result-count {
  font-size: 13px;
}

.products-grid {
  margin-top: 30px;
}

.guide-section {
  margin: 24px 0;
}

.crawler-section {
  margin-top: 30px;
}

.crawler-hint {
  margin: 0 0 12px;
  color: #6b7280;
  font-size: 13px;
}

.crawler-card {
  margin-top: 10px;
}

.crawler-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.parameter-card {
  margin-top: 14px;
}

.market-tabs {
  margin-bottom: 12px;
}

.market-panel {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 12px;
}

.market-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.market-pagination {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
}

.parameter-card ul {
  margin: 0;
  padding-left: 18px;
  color: #4b5563;
  line-height: 1.6;
}

.tip-card,
.metric-card {
  height: 100%;
}

.pitfall-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
}

.pitfall-card {
  height: 100%;
  border: 1px solid #fde68a;
  background: linear-gradient(180deg, #fffdfa 0%, #fffbeb 100%);
}

.pitfall-risk {
  margin: 8px 0 6px;
  color: #b45309;
}

.pitfall-action {
  color: #374151;
}

.tip-card ul,
.metric-card ul,
.metric-card ol {
  margin: 10px 0 0;
  padding-left: 18px;
  color: #4b5563;
  line-height: 1.6;
}

.tip-icon {
  font-size: 24px;
  margin-bottom: 10px;
}

@media (max-width: 768px) {
  .filter-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .filter-right {
    flex-wrap: wrap;
    gap: 8px;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .filters {
    margin-bottom: 20px;
  }

  .products-grid {
    margin-top: 20px;
  }

  .pitfall-grid {
    grid-template-columns: 1fr;
  }
}

.scenario-filter {
  margin: 20px 0;
}

.scenario-chip-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.metric-explain {
  margin: 20px 0 30px;
}

.metric-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-top: 12px;
}

.metric-explain-card {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.metric-explain-card .metric-icon {
  font-size: 22px;
}


.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.chart-card h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
}

.segmented-chart {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chart-row-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.bar-label {
  font-size: 12px;
  font-weight: 600;
  color: #475569;
}

.bar-note {
  font-size: 12px;
  color: #94a3b8;
}

.segment-track {
  position: relative;
  display: flex;
  height: 28px;
  border-radius: 999px;
  background: #e2e8f0;
  overflow: hidden;
}

.segment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  padding: 0 6px;
  white-space: nowrap;
}

.segment-label {
  opacity: 0.9;
}

.threshold {
  position: absolute;
  top: -6px;
  bottom: -6px;
  width: 2px;
  background: #1f2937;
}

.threshold-label {
  position: absolute;
  top: -18px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #475569;
}

.tone-good {
  background: #d1fae5;
  color: #065f46;
}

.tone-mild {
  background: #e0f2fe;
  color: #0369a1;
}

.tone-warn {
  background: #fde68a;
  color: #92400e;
}

.tone-risk {
  background: #fecaca;
  color: #991b1b;
}

.tone-neutral {
  background: #e2e8f0;
  color: #475569;
}

.tone-accent {
  background: #c7d2fe;
  color: #3730a3;
}

.bar-threshold {
  position: absolute;
  top: -4px;
  bottom: -4px;
  width: 2px;
  background: #f97316;
  box-shadow: 0 0 0 2px rgba(251, 146, 60, 0.2);
}

</style>
