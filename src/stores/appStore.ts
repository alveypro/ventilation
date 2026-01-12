import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  // 数据
  const products = ref<any[]>([])
  const diseases = ref<any[]>([])
  const reviews = ref<any[]>([])
  const tutorials = ref<any[]>([])
  const faqs = ref<any[]>([])
  const brands = ref<any[]>([])

  // UI 状态
  const showProductDialog = ref(false)
  const showReviewDialog = ref(false)
  const showDiseaseDialog = ref(false)
  const showCompareDialog = ref(false)
  
  // 当前数据
  const currentProduct = ref<any>(null)
  const currentReview = ref<any>(null)
  const currentDisease = ref<any>(null)
  const compareList = ref<any[]>([])

  // 初始化数据
  const initData = async () => {
    // 从 API 获取数据
    // 临时使用本地数据
    console.log('初始化数据')
  }

  return {
    products,
    diseases,
    reviews,
    tutorials,
    faqs,
    brands,
    showProductDialog,
    showReviewDialog,
    showDiseaseDialog,
    showCompareDialog,
    currentProduct,
    currentReview,
    currentDisease,
    compareList,
    initData
  }
})
