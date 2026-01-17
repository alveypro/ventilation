<template>
  <div class="brand-detail-page">
    <el-skeleton v-if="isLoading" :rows="8" />
    <template v-else>
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ name: 'Brands' }">品牌库</el-breadcrumb-item>
        <el-breadcrumb-item>{{ brand.name }}</el-breadcrumb-item>
      </el-breadcrumb>

      <div class="page-header handbook">
        <p class="header-label">品牌档案</p>
        <h1>{{ brand.name }}</h1>
        <p>{{ brand.description }}</p>
      </div>

      <div class="brand-header">
        <div class="brand-logo">
          <img v-if="brand.logo" :src="brand.logo" :alt="brand.name" />
          <div v-else class="logo-placeholder">{{ brand.name }}</div>
        </div>
        <div class="brand-info">
          <h2>{{ brand.name }}</h2>
          <div class="meta">
            <span>国家：{{ brand.country }}</span>
            <span>成立：{{ brand.founded || '-' }}</span>
            <span>产品数：{{ brand.productCount || '-' }}</span>
            <span>市占率：{{ brand.marketShare || '-' }}</span>
          </div>
        </div>
      </div>

      <el-card shadow="hover" class="brand-profile">
        <h3>品牌定位与故事</h3>
        <p class="positioning">{{ brand.positioning || '定位信息待补充。' }}</p>
        <p class="story">{{ brand.story || '品牌故事待补充。' }}</p>
        <div class="profile-grid">
          <div>
            <h4>优势与专长</h4>
            <ul>
              <li v-for="item in brand.strengths || []" :key="item">{{ item }}</li>
              <li v-if="!(brand.strengths && brand.strengths.length)">—</li>
            </ul>
          </div>
          <div>
            <h4>重点方向</h4>
            <div class="tag-row">
              <el-tag v-for="item in brand.focusAreas || []" :key="item" size="small" type="info">{{ item }}</el-tag>
              <span v-if="!(brand.focusAreas && brand.focusAreas.length)" class="placeholder">—</span>
            </div>
            <h4>渠道与风险提示</h4>
            <ul>
              <li v-for="item in brand.cautions || []" :key="item">{{ item }}</li>
              <li v-if="!(brand.cautions && brand.cautions.length)">—</li>
            </ul>
          </div>
        </div>
        <div class="profile-links" v-if="brand.website">
          <span>官网：</span>
          <a :href="brand.website" target="_blank" rel="noopener">{{ brand.website }}</a>
        </div>
      </el-card>

      <el-card shadow="hover" class="brand-portrait">
        <h3>品牌画像</h3>
        <div class="portrait-grid">
          <div v-for="item in brandPortraitCards" :key="item.title" class="portrait-card">
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="brand-compare" v-if="competitorCards.length">
        <h3>竞品对比</h3>
        <div class="compare-grid">
          <div v-for="card in competitorCards" :key="card.name" class="compare-card">
            <h4>{{ brand.name }} vs {{ card.name }}</h4>
            <p class="compare-focus">对比维度：{{ card.focus }}</p>
            <ul>
              <li>{{ card.difference }}</li>
              <li v-if="card.caution">{{ card.caution }}</li>
            </ul>
          </div>
        </div>
      </el-card>

      <el-card shadow="hover" class="brand-longform">
        <div class="report-header">
          <div>
            <p class="report-label">品牌报告</p>
            <h3>品牌长文</h3>
            <p class="report-subtitle">定位、平台、机型与合规要点的摘要整理</p>
          </div>
          <div class="report-tags">
            <el-tag v-for="item in brand.focusAreas || []" :key="item" size="small" type="info">{{ item }}</el-tag>
          </div>
        </div>
        <div class="report-grid">
          <section class="report-block">
            <h4>平台家族与技术方向</h4>
            <p class="inline-meta">代表平台：{{ familyLine }}</p>
            <div class="tag-row">
              <el-tag v-for="item in brand.technologyFocus || []" :key="item" type="success" size="small">{{ item }}</el-tag>
              <span v-if="!(brand.technologyFocus && brand.technologyFocus.length)" class="placeholder">—</span>
            </div>
          </section>
          <section class="report-block">
            <h4>热门机型摘要</h4>
            <table class="report-table">
              <thead>
                <tr>
                  <th>机型</th>
                  <th>要点</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in modelHighlights" :key="item">
                  <td>{{ item.split('：')[0] }}</td>
                  <td>{{ item.split('：').slice(1).join('：') || '参数与版本信息需结合官方资料确认' }}</td>
                </tr>
                <tr v-if="modelHighlights.length === 0">
                  <td colspan="2">暂无公开机型摘要。</td>
                </tr>
              </tbody>
            </table>
          </section>
          <section class="report-block report-warning">
            <h4>渠道与合规提示</h4>
            <ul>
              <li v-for="item in complianceNotes" :key="item">{{ item }}</li>
              <li v-if="complianceNotes.length === 0">暂无渠道/合规提示。</li>
            </ul>
          </section>
          <section class="report-block">
            <h4>适用人群</h4>
            <ul>
              <li>睡眠呼吸障碍与慢病通气支持需求人群。</li>
              <li>临床机构与家庭管理团队。</li>
            </ul>
          </section>
          <section class="report-block report-sources">
            <h4>资料来源</h4>
            <div class="source-bar">
              <template v-if="brand.sources && brand.sources.length">
                <span v-for="source in brand.sources" :key="`${source.title}-${source.org}`" class="source-chip">
                  <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">{{ source.title }}</a>
                  <span v-else>{{ source.title }}</span>
                  <span class="source-meta"> · {{ source.org }} · {{ source.date || '—' }}</span>
                </span>
              </template>
              <span v-else class="source-empty">暂无来源补充。</span>
            </div>
          </section>
        </div>
      </el-card>

      <div class="brand-visuals">
        <el-card shadow="hover" class="visual-card">
          <h3>平台家族图谱</h3>
          <div class="diagram-frame" v-html="platformMapSvg"></div>
        </el-card>
        <el-card shadow="hover" class="visual-card">
          <h3>技术路线图</h3>
          <div class="diagram-frame" v-html="techRoadmapSvg"></div>
        </el-card>
      </div>

      <el-card shadow="hover" class="brand-resources" v-if="officialResourceLinks.length || officialImageSamples.length">
        <h3>官方资料与图集</h3>
        <div class="resource-links" v-if="officialResourceLinks.length">
          <el-tag v-for="link in officialResourceLinks" :key="link.url" type="info" size="small">
            <a :href="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
          </el-tag>
        </div>
        <div class="resource-images" v-if="officialImageSamples.length">
          <div class="resource-image" v-for="img in officialImageSamples" :key="img">
            <img :src="img" alt="官方图示" />
          </div>
        </div>
      </el-card>

      <div class="brand-products">
        <h2>该品牌热门产品</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" v-for="product in brandProducts" :key="product.id">
            <ProductCard :product="product" @detail="goToProduct(product.id)" />
          </el-col>
        </el-row>
        <el-empty v-if="brandProducts.length === 0" description="暂无该品牌产品" />
      </div>

      <div class="brand-milestones">
        <h2>品牌里程碑</h2>
        <el-timeline>
          <el-timeline-item
            v-for="milestone in brandMilestones"
            :key="milestone.year"
            :timestamp="milestone.year"
            placement="top"
          >
            <el-card>
              <h4>{{ milestone.title }}</h4>
              <p class="description">{{ milestone.description }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>

      <div class="brand-matrix">
        <h2>旗舰机型矩阵</h2>
        <el-table :data="productMatrix" stripe style="width: 100%">
          <el-table-column prop="segment" label="定位" min-width="140" />
          <el-table-column prop="model" label="代表机型" min-width="200" />
          <el-table-column prop="focus" label="核心优势" min-width="240" />
          <el-table-column prop="ideal" label="适合人群" min-width="200" />
        </el-table>
      </div>

      <div class="brand-matrix" v-if="competitorMatrix.length">
        <h2>竞品矩阵表</h2>
        <el-table :data="competitorMatrix" stripe style="width: 100%">
          <el-table-column prop="competitor" label="竞品品牌" min-width="160" />
          <el-table-column prop="focus" label="对比维度" min-width="200" />
          <el-table-column prop="brandEdge" label="本品牌优势" min-width="240" />
          <el-table-column prop="competitorEdge" label="竞品优势" min-width="240" />
        </el-table>
      </div>

      <div class="brand-tech">
        <h2>核心技术关键词</h2>
        <div class="tag-row">
          <el-tag v-for="item in brand.technologyFocus || []" :key="item" type="success" size="small">{{ item }}</el-tag>
          <span v-if="!(brand.technologyFocus && brand.technologyFocus.length)" class="placeholder">—</span>
        </div>
      </div>


      <div class="brand-scores">
        <h2>品牌概况</h2>
        <el-row :gutter="20">
          <el-col :xs="24" :sm="12" :md="6" v-for="score in brandScores" :key="score.label">
            <el-card class="score-card">
              <div class="score-label">{{ score.label }}</div>
              <div class="score-value">{{ score.value }}</div>
              <p class="score-desc">{{ score.description }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import { fetchBrandById, fetchProducts } from '@/services/dataService'
import { formatPriceRange } from '@/utils/helpers'
import type { Brand, Product } from '@/types'

const route = useRoute()
const router = useRouter()
const brand = ref<Brand>({
  id: 0,
  name: '',
  country: '',
  description: '',
})
const products = ref<Product[]>([])
const isLoading = ref(true)

const brandProducts = computed(() => {
  if (!brand.value.name) return []
  return products.value.filter(product => product.brand === brand.value.name)
})

const topBrandProducts = computed(() => {
  return brandProducts.value
    .slice()
    .sort((a, b) => (b.dataCompleteness || b.rating || 0) - (a.dataCompleteness || a.rating || 0))
    .slice(0, 6)
})

const officialResourceLinks = computed(() => {
  const links = brandProducts.value
    .map(product => product.specs?.['官方页面'])
    .filter((url): url is string => Boolean(url))
  const unique = Array.from(new Set(links))
  return unique.slice(0, 6).map((url, idx) => ({
    url,
    label: `官方页面 ${idx + 1}`,
  }))
})

const officialImageSamples = computed(() => {
  const images = brandProducts.value
    .map(product => product.image)
    .filter((url): url is string => Boolean(url && url.startsWith('http')))
  return Array.from(new Set(images)).slice(0, 6)
})

const brandMilestones = computed(() => {
  if (brand.value.milestones?.length) return brand.value.milestones
  const base = brand.value.founded ? `${brand.value.founded}` : '创立'
  return [
    {
      year: base,
      title: '品牌创立与技术积累',
      description: '建立核心研发体系，布局呼吸治疗领域。'
    },
    {
      year: '2010+',
      title: '智能化升级',
      description: '引入自动调压与数据追踪，提升临床管理能力。'
    },
    {
      year: '2020+',
      title: '云端生态成熟',
      description: '实现远程随访、依从性管理与智能推荐闭环。'
    }
  ]
})

const brandPortraitCards = computed(() => {
  const focus = brand.value.focusAreas?.length ? brand.value.focusAreas.join(' / ') : '睡眠 / 通气'
  const scenarios = brandProducts.value.length
    ? uniqueList(brandProducts.value.flatMap(item => item.scenarioTags || [])).slice(0, 6).join(' / ')
    : '家用 / 临床'
  const channels = brandProducts.value.length
    ? uniqueList(brandProducts.value.flatMap(item => item.channels || [])).slice(0, 5).join(' / ')
    : '线下 / 电商'
  const risks = brand.value.cautions?.length ? brand.value.cautions.join('；') : '需核对版本与渠道差异'
  return [
    { title: '核心定位', description: brand.value.positioning || '面向睡眠与通气场景的设备品牌。' },
    { title: '重点场景', description: `覆盖场景：${scenarios}` },
    { title: '优势方向', description: `重点方向：${focus}` },
    { title: '渠道与风险', description: `渠道：${channels}；风险提示：${risks}` },
  ]
})

const competitorCards = computed(() => {
  const map: Record<string, { name: string; focus: string; difference: string; caution?: string }[]> = {
    '瑞思迈': [
      { name: '飞利浦伟康', focus: '数据随访 vs 渠道覆盖', difference: '更强调算法与随访生态，竞品渠道覆盖更广。', caution: '注意不同地区版本与渠道差异。' },
      { name: '费雪派克', focus: '舒适度体验', difference: '本品牌算法与数据闭环更突出，竞品舒适体验口碑强。' },
    ],
    '飞利浦伟康': [
      { name: '瑞思迈', focus: '算法与随访', difference: '渠道覆盖与产品线更广，竞品算法与数据闭环更强。' },
      { name: '瑞迈特', focus: '价格与渠道', difference: '定位更偏中高端与多场景，竞品性价比优势明显。' },
    ],
    '瑞迈特': [
      { name: '鱼跃', focus: '渠道与性价比', difference: '本品牌平台化机型迭代快，竞品渠道覆盖更广。' },
      { name: '飞利浦伟康', focus: '品牌与产品线', difference: '本品牌性价比更高，竞品覆盖更广。' },
    ],
    '鱼跃': [
      { name: '瑞迈特', focus: '平台与型号', difference: '本品牌渠道覆盖更广，竞品平台化与型号规划更集中。' },
      { name: 'React Health', focus: '渠道与体验', difference: '本品牌渠道优势明显，竞品强调家用体验与易用性。' },
    ],
    '律维施泰因': [
      { name: '瑞思迈', focus: '舒适度 vs 数据生态', difference: '强调稳定与舒适体验，竞品数据生态更成熟。' },
      { name: '瑞迈特', focus: '价格与渠道', difference: '定位偏中高端，竞品性价比更高。' },
    ],
    '博毅雅': [
      { name: '飞利浦伟康', focus: 'NIV 场景覆盖', difference: '本品牌聚焦家用NIV，竞品覆盖家用与院内。' },
      { name: '瑞思迈', focus: '便携与长期支持', difference: '本品牌强调家用通气，竞品便携与生态更成熟。' },
    ],
    '费雪派克': [
      { name: '瑞思迈', focus: '舒适度与算法', difference: '舒适度优势更明显，竞品算法与数据闭环更强。' },
      { name: '飞利浦伟康', focus: '家用体验', difference: '本品牌强调舒适体验，竞品产品线覆盖更广。' },
    ],
    'Transcend': [
      { name: '瑞思迈', focus: '便携体验', difference: '主打轻量化与旅行场景，竞品生态与配件更完整。' },
    ],
    'HDM': [
      { name: '瑞思迈', focus: '旅行便携', difference: '便携机型轻量化优势明显，竞品生态支持更丰富。' },
    ],
    'React Health': [
      { name: '瑞迈特', focus: '家用性价比', difference: '强调易用体验与家用场景，竞品渠道覆盖更广。' },
    ],
    '迈柯唯': [
      { name: '德尔格', focus: '院内通气平台', difference: '系统化方案能力突出，竞品安全稳定口碑强。' },
      { name: '哈美顿', focus: '智能化策略', difference: '强调系统协同，竞品智能化策略更强。' },
    ],
    '德尔格': [
      { name: '迈柯唯', focus: '系统化与流程', difference: '安全稳定口碑突出，竞品系统协同更完整。' },
    ],
    '迈瑞': [
      { name: '迈柯唯', focus: '院内通气平台', difference: '本品牌本地化服务强，竞品高端平台更成熟。' },
      { name: '德尔格', focus: '稳定性与支持', difference: '本品牌性价比突出，竞品稳定与国际支持更强。' },
    ],
  }
  return map[brand.value.name] || []
})

const competitorMatrix = computed(() => {
  return competitorCards.value.map(card => ({
    competitor: card.name,
    focus: card.focus,
    brandEdge: card.difference,
    competitorEdge: card.caution || '对比优势需结合场景评估',
  }))
})

const productMatrix = computed(() => {
  const top = brandProducts.value.slice(0, 3)
  return [
    {
      segment: '入门家用',
      model: top[0]?.name || '—',
      focus: '易用性、性价比',
      ideal: '初次使用者'
    },
    {
      segment: '进阶自动',
      model: top[1]?.name || '—',
      focus: '智能调压、舒适度',
      ideal: '中度OSA患者'
    },
    {
      segment: '医疗级',
      model: top[2]?.name || '—',
      focus: '高阶通气、临床监测',
      ideal: '复杂病例/医疗机构'
    }
  ]
})

const brandScores = computed(() => {
  const ratings = brandProducts.value.map(item => item.rating).filter(value => value > 0)
  const avgRating = ratings.length
    ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1)
    : '—'
  const completeness = brandProducts.value.map(item => item.dataCompleteness || 0)
  const avgCompleteness = completeness.length
    ? Math.round(completeness.reduce((sum, value) => sum + value, 0) / completeness.length)
    : 0
  return [
    {
      label: '用户评分均值',
      value: avgRating === '—' ? '—' : `${avgRating} / 5`,
      description: '基于该品牌机型评分均值'
    },
    {
      label: '资料完整度',
      value: avgCompleteness ? `${avgCompleteness}%` : '—',
      description: '公开参数与来源覆盖度'
    },
    {
      label: '机型覆盖',
      value: `${brandProducts.value.length} 款`,
      description: '当前收录的机型数量'
    },
    {
      label: '官方链接',
      value: `${officialResourceLinks.value.length} 条`,
      description: '已收录的官方资料链接'
    }
  ]
})

const platformFamilies = computed(() => {
  const families = brandProducts.value
    .map(item => item.platformFamily)
    .filter(Boolean) as string[]
  return Array.from(new Set(families)).slice(0, 4)
})

const normalizeText = (value: string) => value.trim().toLowerCase()

const uniqueList = (items: string[]) => {
  const seen = new Set<string>()
  return items.filter(item => {
    const key = normalizeText(item)
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

const buildProductHighlight = (product: Product) => {
  const details: string[] = []
  if (product.type) details.push(product.type)
  if (product.modeTags?.length) details.push(`模式 ${product.modeTags.slice(0, 3).join('/')}`)
  if (product.deviceType) {
    const label = product.deviceType === 'PAP_SLEEP'
      ? '睡眠PAP'
      : product.deviceType === 'NIV_HOME'
        ? '家用NIV'
        : '便携PAP'
    details.push(label)
  }
  if (product.price > 0) details.push(formatPriceRange(product.price))
  return `${product.name}：${details.join(' · ') || '参数与版本信息需结合官方资料确认'}`
}

const familyLine = computed(() => {
  const families = uniqueList(platformFamilies.value)
  if (families.length) return families.join(' / ')
  if (brand.value.focusAreas?.length) return brand.value.focusAreas.join(' / ')
  return '睡眠平台 / NIV平台 / 便携平台'
})

const modelHighlights = computed(() => {
  return uniqueList(topBrandProducts.value.map(buildProductHighlight)).slice(0, 4)
})

const complianceNotes = computed(() => {
  return uniqueList([
    brand.value.description || '',
    ...(brand.value.cautions || []),
    '涉及二手/翻新时需核查配件与耗材安全。',
  ].filter(Boolean))
})

const platformMapSvg = computed(() => {
  const families = platformFamilies.value.length ? platformFamilies.value : ['睡眠平台', 'NIV平台', '便携平台']
  const nodes = families.map((name, index) => {
    const x = 60 + index * 110
    return `
      <rect x="${x}" y="50" width="90" height="40" fill="#dbeafe" stroke="#93c5fd"/>
      <text x="${x + 6}" y="74" font-size="11" fill="#1f2937">${name}</text>
    `
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      ${nodes}
    </svg>
  `.trim()
})

const techRoadmapSvg = computed(() => {
  const steps = [
    '基础通气',
    '自动调压',
    '数据随访',
    '智能算法'
  ]
  const nodes = steps.map((name, index) => {
    const x = 40 + index * 90
    return `
      <rect x="${x}" y="60" width="70" height="30" fill="#bfdbfe" stroke="#93c5fd"/>
      <text x="${x + 8}" y="80" font-size="11" fill="#1f2937">${name}</text>
    `
  }).join('')
  const arrows = steps.slice(0, -1).map((_, index) => {
    const x = 110 + index * 90
    return `<line x1="${x}" y1="75" x2="${x + 20}" y2="75" stroke="#94a3b8"/>`
  }).join('')
  return `
    <svg viewBox="0 0 420 140" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="380" height="100" fill="#f8fafc" stroke="#e5e7eb"/>
      ${nodes}
      ${arrows}
    </svg>
  `.trim()
})

const loadData = async () => {
  isLoading.value = true
  const brandId = parseInt(route.params.id as string)
  const [brandRes, productsRes] = await Promise.all([
    fetchBrandById(brandId),
    fetchProducts(),
  ])
  if (brandRes) {
    brand.value = brandRes
  }
  products.value = productsRes
  isLoading.value = false
}

watch(() => route.params.id, loadData, { immediate: true })

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

</script>

<style scoped>
.brand-detail-page {
  padding: 20px 0;
}

.brand-header {
  display: flex;
  gap: 20px;
  margin: 20px 0 30px;
  align-items: center;
  flex-wrap: wrap;
}

.brand-profile {
  margin-bottom: 24px;
}

.brand-portrait,
.brand-compare {
  margin-bottom: 24px;
}

.brand-profile h3 {
  margin-bottom: 12px;
}

.brand-profile .positioning {
  color: #1f2937;
  font-weight: 600;
  margin-bottom: 8px;
}

.brand-profile .story {
  color: #475569;
  margin-bottom: 14px;
}

.profile-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.profile-grid h4 {
  margin-bottom: 8px;
  color: #303133;
}

.profile-grid ul {
  padding-left: 18px;
  color: #475569;
}

.tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 10px;
}

.placeholder {
  color: #9ca3af;
}

.profile-links {
  margin-top: 12px;
  font-size: 13px;
  color: #475569;
}

.profile-links a {
  color: #1e5aa6;
  text-decoration: none;
}

.profile-links a:hover {
  text-decoration: underline;
}

.portrait-grid,
.compare-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
}

.portrait-card,
.compare-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f9fafb;
}

.portrait-card h4,
.compare-card h4 {
  margin-bottom: 6px;
}

.portrait-card p,
.compare-card p {
  color: #475569;
  line-height: 1.6;
  margin: 0 0 6px;
}

.compare-focus {
  font-size: 12px;
  color: #6b7280;
}

.compare-card ul {
  padding-left: 18px;
  color: #475569;
  margin: 6px 0 0;
}

.brand-visuals {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  margin-bottom: 24px;
}

.brand-resources {
  margin-bottom: 24px;
}

.resource-links {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 14px;
}

.resource-links a {
  color: #1e5aa6;
  text-decoration: none;
}

.resource-links a:hover {
  text-decoration: underline;
}

.resource-images {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
}

.resource-image {
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
}

.resource-image img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.visual-card h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.diagram-frame {
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  padding: 12px;
  overflow-x: auto;
}

.page-header {
  margin: 16px 0 24px;
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
  font-size: 28px;
  margin-bottom: 6px;
  color: #1f2937;
}

.page-header p {
  font-size: 14px;
  color: #6b7280;
}

.brand-logo {
  width: 160px;
  height: 100px;
  background: #f5f7fa;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-logo img {
  max-width: 100%;
  max-height: 100%;
}

.logo-placeholder {
  font-weight: 600;
  color: #909399;
}

.brand-info h2 {
  margin: 0 0 10px;
  color: #303133;
}

.brand-info .description {
  color: #606266;
  margin-bottom: 10px;
}

.brand-info .meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  color: #909399;
  font-size: 13px;
}

.brand-longform {
  margin: 20px 0 30px;
}

.report-header {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: flex-start;
  margin-bottom: 16px;
}

.report-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  color: #64748b;
  margin-bottom: 4px;
}

.report-subtitle {
  color: #6b7280;
  font-size: 13px;
  margin: 4px 0 0;
}

.report-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: flex-end;
}

.report-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(260px, 1fr));
  gap: 14px;
}

.report-block {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 12px 14px;
  background: #f8fafc;
}

.report-block h4 {
  margin-bottom: 8px;
  color: #1f2937;
  font-size: 15px;
}

.report-block p {
  color: #475569;
  margin-bottom: 6px;
  line-height: 1.6;
}

.report-block ul {
  padding-left: 18px;
  color: #475569;
}

.report-block li {
  margin-bottom: 6px;
}

.report-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.report-table th,
.report-table td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
  vertical-align: top;
}

.report-table th {
  background: #f1f5f9;
  color: #1f2937;
}

.report-warning {
  border-color: #fed7aa;
  background: #fff7ed;
}

.report-sources {
  grid-column: span 2;
  background: #f9fafb;
}

.inline-meta {
  font-size: 12px;
  color: #6b7280;
}

.source-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.source-chip {
  font-size: 12px;
  color: #475569;
  background: #eef2ff;
  border: 1px solid #c7d2fe;
  border-radius: 999px;
  padding: 4px 10px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.source-chip a {
  color: #1e5aa6;
  text-decoration: none;
}

.source-chip a:hover {
  text-decoration: underline;
}

@media (max-width: 960px) {
  .report-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .report-grid {
    grid-template-columns: 1fr;
  }

  .report-sources {
    grid-column: auto;
  }
}

.brand-products h2 {
  font-size: 20px;
  margin-bottom: 20px;
  color: #303133;
}

.brand-milestones,
.brand-matrix,
.brand-scores,
.brand-tech,
.brand-sources {
  margin-top: 40px;
}

.score-card {
  text-align: center;
}

.score-label {
  font-size: 14px;
  color: #606266;
  margin-bottom: 8px;
}

.score-value {
  margin-top: 6px;
  font-size: 20px;
  font-weight: 600;
  color: #1e5aa6;
}

.score-desc {
  margin-top: 8px;
  font-size: 12px;
  color: #909399;
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
</style>
