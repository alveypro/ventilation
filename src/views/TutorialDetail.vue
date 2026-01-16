<template>
  <div class="tutorial-detail-page">
    <el-skeleton v-if="isLoading" :rows="8" />
    <template v-else>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ name: 'Tutorials' }">使用教程</el-breadcrumb-item>
      <el-breadcrumb-item>{{ tutorial.title }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="tutorial-header">
      <h1>{{ tutorial.title }}</h1>
      <div class="tutorial-meta">
        <el-tag>{{ tutorial.difficulty }}</el-tag>
        <span class="duration">⏱️ {{ tutorial.duration }}</span>
        <span class="views">👁️ {{ tutorial.views }} 次浏览</span>
        <el-rate :model-value="tutorial.rating || 0" disabled size="small"></el-rate>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：教程内容 -->
      <el-col :xs="24" :md="18">
        <el-card>
          <div class="tutorial-content" v-html="renderMarkdown(tutorial.content)"></div>

          <div v-if="tutorial.images?.length" class="tutorial-images">
            <h3>相关图片</h3>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" v-for="(img, idx) in tutorial.images" :key="idx">
                <img :src="img" :alt="tutorial.title" class="tutorial-img" />
              </el-col>
            </el-row>
          </div>

          <!-- 反馈 -->
          <div class="tutorial-feedback">
            <h3>这篇教程有帮助吗？</h3>
            <el-button type="primary" @click="handleHelpful">👍 有帮助</el-button>
            <el-button @click="handleNotHelpful">👎 没帮助</el-button>
          </div>
        </el-card>

        <!-- 相关教程 -->
        <div class="related-tutorials" v-if="relatedTutorials.length">
          <h3>相关教程</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" v-for="t in relatedTutorials" :key="t.id">
              <el-card shadow="hover" class="related-card" @click="goToTutorial(t.id)">
                <h4>{{ t.title }}</h4>
                <div class="meta">
                  <el-tag size="small">{{ t.difficulty }}</el-tag>
                  <span class="duration">{{ t.duration }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="related-block" v-if="relatedProducts.length">
          <h3>推荐产品</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" v-for="item in relatedProducts" :key="item.id">
              <el-card shadow="hover" class="related-card" @click="goToProduct(item.id)">
                <h4>{{ item.name }}</h4>
                <div class="meta">
                  <el-tag size="small">{{ item.type }}</el-tag>
                  <span class="duration">{{ formatPriceRange(item.price) }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <div class="related-block" v-if="relatedDiseases.length">
          <h3>关联疾病</h3>
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" v-for="item in relatedDiseases" :key="item.id">
              <el-card shadow="hover" class="related-card" @click="goToDisease(item.id)">
                <h4>{{ item.name }}</h4>
                <div class="meta">
                  <el-tag size="small">{{ item.severity }}</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>
      </el-col>

      <!-- 右侧：侧边栏 -->
      <el-col :xs="24" :md="6">
        <el-card class="sidebar-card">
          <template #header>
            <div class="card-header">
              <span>教程信息</span>
            </div>
          </template>

          <div class="sidebar-item">
            <span class="label">难度等级</span>
            <el-tag>{{ tutorial.difficulty }}</el-tag>
          </div>

          <div class="sidebar-item">
            <span class="label">学习时长</span>
            <span class="value">{{ tutorial.duration }}</span>
          </div>

          <div class="sidebar-item">
            <span class="label">浏览次数</span>
            <span class="value">{{ tutorial.views }}</span>
          </div>

          <div class="sidebar-item">
            <span class="label">用户评分</span>
            <el-rate :model-value="tutorial.rating || 0" disabled size="small"></el-rate>
          </div>

          <div class="sidebar-item" v-if="tutorial.sourcePath">
            <span class="label">来源资料</span>
            <span class="value">{{ tutorial.sourcePath }}</span>
          </div>

          <el-button type="primary" size="large" class="download-btn">
            📥 下载教程
          </el-button>

          <div class="sidebar-block" v-if="professionalTips.length">
            <h4>专业提示</h4>
            <ul>
              <li v-for="tip in professionalTips" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <div class="sidebar-block warning" v-if="safetyWarnings.length">
            <h4>安全提示</h4>
            <ul>
              <li v-for="tip in safetyWarnings" :key="tip">{{ tip }}</li>
            </ul>
          </div>

          <div class="sidebar-block" v-if="sourceItems.length">
            <h4>参考资料</h4>
            <ul>
              <li v-for="source in sourceItems" :key="`${source.title}-${source.org}`">
                <a v-if="source.url" :href="source.url" target="_blank" rel="noopener">
                  {{ source.title }}
                </a>
                <span v-else>{{ source.title }}</span>
                <span class="source-meta"> · {{ source.org }} · {{ source.date || '—' }}</span>
              </li>
            </ul>
          </div>

          <div class="sidebar-block" v-if="authoritySummaries.length">
            <h4>摘要要点</h4>
            <ul>
              <li v-for="summary in authoritySummaries" :key="summary">{{ summary }}</li>
            </ul>
          </div>
        </el-card>

        <el-card class="sidebar-card" style="margin-top: 20px;">
          <template #header>
            <div class="card-header">
              <span>常见问题</span>
            </div>
          </template>

          <div class="faq-item">
            <h4>Q: 这个教程适合初学者吗？</h4>
            <p>A: 根据难度等级，{{ tutorial.difficulty === '基础' ? '非常适合' : '建议有基础使用经验的用户' }}。</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { fetchTutorialById, fetchTutorials, fetchProducts, fetchDiseases, fetchReviews } from '@/services/dataService'
import { getRelatedForTutorial } from '@/utils/knowledge'
import { formatPriceRange } from '@/utils/helpers'
import type { ContentSource, Tutorial, Product, Disease } from '@/types'
import { renderMarkdown } from '@/utils/markdown'

const route = useRoute()
const router = useRouter()
const tutorial = ref<Tutorial>({
  id: 0,
  title: '',
  category: '',
  difficulty: '',
  content: '',
})
const allTutorials = ref<Tutorial[]>([])
const isLoading = ref(true)
const relatedProducts = ref<Product[]>([])
const relatedDiseases = ref<Disease[]>([])

const updateTutorial = () => {
  const tutorialId = parseInt(route.params.id as string)
  isLoading.value = true
  fetchTutorialById(tutorialId).then((result) => {
    if (result) {
      tutorial.value = result
    }
    isLoading.value = false
  })
}

watch(() => route.params.id, updateTutorial, { immediate: true })

onMounted(async () => {
  allTutorials.value = await fetchTutorials()
})

const loadRelated = async () => {
  const [products, diseases, reviews] = await Promise.all([
    fetchProducts(),
    fetchDiseases(),
    fetchReviews(),
  ])
  const related = getRelatedForTutorial(tutorial.value, {
    products,
    diseases,
    tutorials: allTutorials.value,
    reviews,
    brands: [],
  })
  relatedProducts.value = related.products
  relatedDiseases.value = related.diseases
}

watch(() => tutorial.value.id, () => {
  if (tutorial.value.id) {
    loadRelated()
  }
})

const relatedTutorials = computed(() => {
  return allTutorials.value
    .filter(item => item.category === tutorial.value.category && item.id !== tutorial.value.id)
    .slice(0, 2)
})

const professionalTips = computed(() => {
  const text = `${tutorial.value.title} ${tutorial.value.content}`.toLowerCase()
  const tips = ['遵循医生处方参数，不建议自行大幅调压。']
  if (text.includes('清洁') || text.includes('维护')) {
    tips.push('清洁频率决定依从性与感染风险。')
  }
  if (text.includes('压力') || text.includes('cpap')) {
    tips.push('压力调整建议循序渐进，优先改善舒适度。')
  }
  return tips
})

const safetyWarnings = computed(() => {
  const text = `${tutorial.value.title} ${tutorial.value.content}`.toLowerCase()
  const warnings: string[] = []
  if (text.includes('酒精') || text.includes('安眠药')) {
    warnings.push('避免饮酒或自行使用安眠药以免加重呼吸抑制。')
  }
  if (text.includes('清洁')) {
    warnings.push('不要用高温或刺激性清洁剂清洗面罩。')
  }
  return warnings
})

const sourceItems = computed<ContentSource[]>(() => {
  return tutorial.value.sources || []
})

const authoritySummaries = computed(() => {
  const text = `${tutorial.value.title} ${tutorial.value.content}`.toLowerCase()
  if (text.includes('清洁')) {
    return ['定期清洁可降低感染风险并延长设备寿命。']
  }
  if (text.includes('压力') || text.includes('cpap')) {
    return ['压力调整应循序渐进并遵循医嘱。']
  }
  return ['坚持使用与正确设置是效果的关键。']
})


const handleHelpful = () => {
  ElMessage.success('感谢您的反馈！')
}

const handleNotHelpful = () => {
  ElMessage.info('我们会改进内容')
}

const goToTutorial = (id: number) => {
  router.push(`/tutorial/${id}`)
}

const goToProduct = (id: number) => {
  router.push(`/product/${id}`)
}

const goToDisease = (id: number) => {
  router.push(`/disease/${id}`)
}
</script>

<style scoped>
.tutorial-detail-page {
  padding: 20px;
}

.tutorial-header {
  margin-bottom: 30px;
}

.tutorial-header h1 {
  font-size: 32px;
  margin-bottom: 15px;
  color: #303133;
}

.tutorial-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  color: #909399;
}

.duration,
.views {
  font-size: 14px;
}

.tutorial-content {
  line-height: 1.8;
  color: #606266;
}

.tutorial-content h3 {
  font-size: 20px;
  margin-top: 20px;
  margin-bottom: 12px;
  color: #303133;
  border-left: 4px solid #409eff;
  padding-left: 10px;
}

.tutorial-content h4 {
  font-size: 16px;
  margin-top: 15px;
  margin-bottom: 10px;
  color: #303133;
}

.tutorial-content ul {
  margin: 10px 0;
  padding-left: 20px;
}

.tutorial-content li {
  margin: 8px 0;
}

.tutorial-content strong {
  color: #303133;
  font-weight: bold;
}

.tutorial-content table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0;
  font-size: 13px;
}

.tutorial-content th,
.tutorial-content td {
  border: 1px solid #e5e7eb;
  padding: 8px 10px;
  text-align: left;
}

.tutorial-content th {
  background: #f8fafc;
  color: #1f2937;
}

.tutorial-images {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.tutorial-images h3 {
  margin-bottom: 15px;
}

.tutorial-img {
  width: 100%;
  border-radius: 4px;
  margin-bottom: 15px;
}

.tutorial-feedback {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.tutorial-feedback h3 {
  margin-bottom: 15px;
}

.tutorial-feedback .el-button {
  margin-right: 10px;
}

.related-tutorials {
  margin-top: 40px;
}

.related-tutorials h3 {
  margin-bottom: 20px;
  font-size: 20px;
  color: #303133;
}

.related-card {
  cursor: pointer;
  transition: all 0.3s;
}

.related-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15) !important;
}

.related-card h4 {
  margin-bottom: 10px;
  color: #303133;
}

.related-block {
  margin-top: 32px;
}

.related-card .meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  color: #909399;
}

.sidebar-card {
  position: sticky;
  top: 100px;
}

.card-header {
  font-weight: bold;
}

.sidebar-item {
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-item:last-of-type {
  border-bottom: none;
}

.label {
  font-weight: 600;
  color: #303133;
}

.value {
  color: #606266;
}

.download-btn {
  width: 100%;
  margin-top: 15px;
}

.sidebar-block {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #eee;
  color: #475569;
}

.sidebar-block h4 {
  margin-bottom: 10px;
  color: #303133;
}

.sidebar-block ul {
  padding-left: 18px;
}

.sidebar-block a {
  color: #1e5aa6;
  text-decoration: none;
}

.sidebar-block a:hover {
  text-decoration: underline;
}

.source-meta {
  color: #6b7280;
  font-size: 12px;
}

.sidebar-block.warning {
  color: #b45309;
}

.faq-item {
  padding: 10px 0;
}

.faq-item h4 {
  margin-bottom: 8px;
  color: #303133;
}

.faq-item p {
  color: #606266;
  margin: 0;
}

@media (max-width: 1024px) {
  .tutorial-header h1 {
    font-size: 24px;
  }

  .sidebar-card {
    position: relative;
    top: 0;
  }
}
</style>
