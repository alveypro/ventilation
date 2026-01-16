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
          <a href="#clinical-zones">专业分区</a>
          <a v-for="zone in zoneGroups" :key="zone.key" :href="`#zone-${zone.key}`">
            {{ zone.label }}
          </a>
          <a href="#library">条目库</a>
        </div>
      </aside>

      <main class="guide-content">
        <section id="clinical-zones" class="guide-section">
          <div class="section-header">
            <h2>专业分区</h2>
          </div>

          <div v-for="zone in zoneGroups" :key="zone.key" :id="`zone-${zone.key}`" class="zone-block">
            <div class="zone-header">
              <h3>{{ zone.label }}</h3>
              <span class="tag soft">条目 {{ zone.items.length }}</span>
            </div>
            <div class="guide-list">
              <article v-for="item in zone.items" :key="item.id" class="guide-item clickable" @click="goToItem(item.id)">
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

const zoneOrder = [
  { key: 'critical', label: '急性/重症' },
  { key: 'sleep', label: '睡眠医学' },
  { key: 'chronic', label: '慢病管理' },
  { key: 'therapy', label: '通气治疗' },
  { key: 'equipment', label: '设备管理' },
  { key: 'followup', label: '随访与沟通' },
  { key: 'labs', label: '基础检验' },
  { key: 'infection', label: '感染与安全' },
  { key: 'periop', label: '围术期管理' },
  { key: 'evidence', label: '科研与指南' },
  { key: 'other', label: '其他' },
]

const zoneMap: Record<string, string[]> = {
  critical: ['急性护理', '重症通气'],
  sleep: ['睡眠医学', '睡眠诊断'],
  chronic: ['慢病管理', '呼吸治疗', '呼吸康复'],
  therapy: ['通气治疗'],
  equipment: ['设备管理'],
  followup: ['随访管理', '临床沟通'],
  labs: ['基础检验'],
  infection: ['感染防控', '安全与风险'],
  periop: ['围术期管理'],
  evidence: ['科研与证据', '学术与指南', '患者教育'],
}

const zoneGroups = computed(() => {
  const zoneItems: Record<string, any[]> = Object.fromEntries(zoneOrder.map(zone => [zone.key, []]))
  const other: any[] = []
  for (const item of clinicalHandbookData) {
    const category = item.category || ''
    const zoneKey = Object.keys(zoneMap).find(key => zoneMap[key].includes(category))
    if (zoneKey) {
      zoneItems[zoneKey].push(item)
    } else {
      other.push(item)
    }
  }
  if (other.length) zoneItems.other = other
  return zoneOrder
    .filter(zone => zoneItems[zone.key]?.length)
    .map(zone => ({ ...zone, items: zoneItems[zone.key] }))
})

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

.related-block {
  margin-top: 16px;
}

.zone-block {
  margin-top: 18px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
}

.zone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
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
